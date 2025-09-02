'use client';

import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';

// 타입 정의
interface ChatMessage {
    id: string;
    message: string;
    username: string;
    timestamp: string;
    type: 'message' | 'system';
}

interface SystemMetric {
    id: string;
    name: string;
    value: string;
    status: 'normal' | 'warning' | 'error';
    trend: 'stable' | 'up' | 'down';
}

interface SystemAlert {
    id: string;
    message: string;
    type: 'info' | 'warning' | 'error';
    timestamp: string;
}

interface Activity {
    id: string;
    username: string;
    action: string;
    file?: string;
    timestamp: string;
    status: 'active' | 'idle' | 'offline';
}

interface ActiveSession {
    id?: string;
    username: string;
    status: 'active' | 'idle';
    lastActivity: string;
    currentFile?: string;
    currentPage?: string;
}

interface RealTimeContextType {
    socket: WebSocket | null;
    isConnected: boolean;
    connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
    subscribe: (channel: string, callback: (data: any) => void) => void;
    unsubscribe: (channel: string) => void;
    publish: (channel: string, data: any) => void;
    sendMessage: (type: string, payload: any) => void;
    reportActivity: (activity: { action: string; page?: string; file?: string; details?: any }) => void;
}

const RealTimeContext = createContext<RealTimeContextType | undefined>(undefined);

export function RealTimeProvider({ children }: { children: React.ReactNode }) {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
    const subscriptionsRef = useRef<Map<string, Set<(data: any) => void>>>(new Map());
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const reconnectAttemptsRef = useRef(0);

    const connect = useCallback(() => {
        try {
            setConnectionStatus('connecting');
            
            // WebSocket 연결을 비활성화 (실제 백엔드만 사용)
            const USE_WEBSOCKET = false;
            
            if (!USE_WEBSOCKET) {
                setConnectionStatus('disconnected');
                setIsConnected(false);
                return;
            }

            const ws = new WebSocket('ws://localhost:8080/websocket');
            
            ws.addEventListener('open', () => {
                setIsConnected(true);
                setConnectionStatus('connected');
                reconnectAttemptsRef.current = 0;
                console.log('WebSocket 연결됨');
            });

            ws.addEventListener('close', () => {
                setIsConnected(false);
                setConnectionStatus('disconnected');
                setSocket(null);
                
                // 자동 재연결
                if (reconnectAttemptsRef.current < 5) {
                    reconnectAttemptsRef.current++;
                    reconnectTimeoutRef.current = setTimeout(() => {
                        connect();
                    }, 3000 * reconnectAttemptsRef.current);
                }
            });

            ws.addEventListener('error', (error) => {
                console.error('WebSocket 오류:', error);
                setConnectionStatus('error');
            });

            setSocket(ws);
        } catch (error) {
            console.error('WebSocket 연결 실패:', error);
            setConnectionStatus('error');
        }
    }, []);

    useEffect(() => {
        connect();

        return () => {
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (socket) {
                socket.close();
            }
        };
    }, [connect]);

    const subscribe = useCallback((channel: string, callback: (data: any) => void) => {
        const subscriptions = subscriptionsRef.current;
        
        if (!subscriptions.has(channel)) {
            subscriptions.set(channel, new Set());
        }
        
        subscriptions.get(channel)!.add(callback);

        // 서버에 구독 요청
        if (socket && isConnected) {
            socket.send(JSON.stringify({
                type: 'subscribe',
                payload: { channel }
            }));
        }
    }, [socket, isConnected]);

    const unsubscribe = useCallback((channel: string) => {
        const subscriptions = subscriptionsRef.current;
        subscriptions.delete(channel);

        // 서버에 구독 해제 요청
        if (socket && isConnected) {
            socket.send(JSON.stringify({
                type: 'unsubscribe',
                payload: { channel }
            }));
        }
    }, [socket, isConnected]);

    const publish = useCallback((channel: string, data: any) => {
        if (socket && isConnected) {
            socket.send(JSON.stringify({
                type: 'publish',
                payload: { channel, data }
            }));
        }
    }, [socket, isConnected]);

    const sendMessage = useCallback((type: string, payload: any) => {
        if (socket && isConnected) {
            socket.send(JSON.stringify({
                type,
                payload
            }));
        }
    }, [socket, isConnected]);

    const reportActivity = useCallback((activity: { action: string; page?: string; file?: string; details?: any }) => {
        const activityData = {
            id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            username: localStorage.getItem('username') || 'terecal',
            action: activity.action,
            file: activity.file,
            page: activity.page,
            timestamp: new Date().toISOString(),
            status: 'active' as const,
            details: activity.details
        };

        // WebSocket이 연결된 경우 서버로 전송
        if (socket && isConnected) {
            socket.send(JSON.stringify({
                type: 'activity_report',
                payload: activityData
            }));
        }

        // 로컬 상태 업데이트를 위해 publish도 호출
        publish('developer:activity', activityData);
    }, [socket, isConnected, publish]);

    const value: RealTimeContextType = {
        socket,
        isConnected,
        connectionStatus,
        subscribe,
        unsubscribe,
        publish,
        sendMessage,
        reportActivity
    };

    return (
        <RealTimeContext.Provider value={value}>
            {children}
        </RealTimeContext.Provider>
    );
}

export function useRealTime() {
    const context = useContext(RealTimeContext);
    if (context === undefined) {
        throw new Error('useRealTime must be used within a RealTimeProvider');
    }
    return context;
}

// 개발자 활동 추적을 위한 커스텀 훅
export function useDeveloperActivity() {
    const { isConnected, socket, reportActivity } = useRealTime();
    const [activities, setActivities] = useState<Activity[]>([]);
    const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);

    useEffect(() => {
        if (!isConnected || !socket) {
            // WebSocket이 연결되지 않았을 때는 빈 상태 유지
            setActivities([]);
            setActiveSessions([]);
            return;
        }

        // WebSocket 메시지 처리
        const handleMessage = (event: MessageEvent) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'activity_update') {
                    setActivities(prev => [data.payload, ...prev.slice(0, 49)]);
                } else if (data.type === 'session_update') {
                    setActiveSessions(data.payload);
                }
            } catch (error) {
                console.error('WebSocket 메시지 파싱 오류:', error);
            }
        };

        socket.addEventListener('message', handleMessage);

        return () => {
            socket.removeEventListener('message', handleMessage);
        };
    }, [isConnected, socket]);

    return {
        activities,
        activeSessions,
        reportActivity
    };
}

// 실시간 채팅을 위한 커스텀 훅
export function useRealTimeChat(channelId: string) {
    const { subscribe, unsubscribe, publish, isConnected } = useRealTime();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [typingUsers, setTypingUsers] = useState<string[]>([]);

    useEffect(() => {
        // 실제 WebSocket 연결시에만 구독
        if (!isConnected) return;

        const handleMessage = (data: ChatMessage) => {
            setMessages(prev => [...prev, data]);
        };

        const handleTyping = (data: { username: string; isTyping: boolean }) => {
            setTypingUsers(prev => {
                if (data.isTyping) {
                    return [...prev.filter(u => u !== data.username), data.username];
                } else {
                    return prev.filter(u => u !== data.username);
                }
            });
        };

        subscribe(`chat:${channelId}:messages`, handleMessage);
        subscribe(`chat:${channelId}:typing`, handleTyping);

        return () => {
            unsubscribe(`chat:${channelId}:messages`);
            unsubscribe(`chat:${channelId}:typing`);
        };
    }, [channelId, subscribe, unsubscribe, isConnected]);

    const sendMessage = useCallback((message: string) => {
        if (message.trim() && isConnected) {
            const newMessage: ChatMessage = {
                id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                message: message.trim(),
                username: localStorage.getItem('username') || 'terecal',
                timestamp: new Date().toISOString(),
                type: 'message'
            };

            publish(`chat:${channelId}:messages`, newMessage);
        }
    }, [isConnected, publish, channelId]);

    const setTyping = useCallback((isTyping: boolean) => {
        if (isConnected) {
            publish(`chat:${channelId}:typing`, {
                username: localStorage.getItem('username') || 'terecal',
                isTyping
            });
        }
    }, [isConnected, publish, channelId]);

    return {
        messages,
        typingUsers,
        sendMessage,
        setTyping,
        isConnected
    };
}

// 시스템 모니터링을 위한 커스텀 훅
export function useSystemMonitoring() {
    const { subscribe, unsubscribe, isConnected } = useRealTime();
    const [metrics, setMetrics] = useState<SystemMetric[]>([]);
    const [alerts, setAlerts] = useState<SystemAlert[]>([]);

    useEffect(() => {
        if (!isConnected) {
            // WebSocket이 연결되지 않았을 때는 빈 상태 유지
            setMetrics([]);
            setAlerts([]);
            return;
        }

        // 실제 WebSocket 연결시 처리
        const handleMetricsUpdate = (data: SystemMetric[]) => {
            setMetrics(data);
        };

        const handleAlerts = (data: SystemAlert) => {
            setAlerts(prev => [data, ...prev.slice(0, 9)]); // 최근 10개만 유지
        };

        subscribe('system:metrics', handleMetricsUpdate);
        subscribe('system:alerts', handleAlerts);

        return () => {
            unsubscribe('system:metrics');
            unsubscribe('system:alerts');
        };
    }, [subscribe, unsubscribe, isConnected]);

    return {
        metrics,
        alerts
    };
}
