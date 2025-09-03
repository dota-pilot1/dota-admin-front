"use client";

import React, { useState, useEffect } from 'react';
import { Users, MessageSquare, Activity, Send, X, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { useDeveloperActivity, useRealTimeChat, useRealTime } from '@/shared/providers/RealTimeProvider';
import { useSimplePresence } from '@/shared/hooks/useSimplePresence';

type SidebarMode = 'activity' | 'chat';

export function RealTimeSidebar() {
    const [mode, setMode] = useState<SidebarMode>('activity');
    const [isMinimized, setIsMinimized] = useState(false);
    const [chatMessage, setChatMessage] = useState('');
    
    // 실시간 연결 상태
    const { isConnected, connectionStatus } = useRealTime();
    
    // 개발자 활동 추적
    const { activities, activeSessions, reportActivity } = useDeveloperActivity();
    
    // Presence (온라인 개발자) - 간단 버전으로 테스트
    const authToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : undefined;
    const presence = useSimplePresence(authToken || undefined);

    // 실시간 채팅 (전체 채팅방)
    const { 
        messages: chatMessages, 
        typingUsers, 
        sendMessage: sendChatMessage, 
        setTyping 
    } = useRealTimeChat('general');

    // 페이지 방문 시 활동 보고 (컴포넌트 마운트 시 한 번만)
    useEffect(() => {
        reportActivity({
            action: 'page_visit',
            page: '/challenge',
            details: { mode: 'sidebar_view' }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // 빈 의존성 배열로 마운트 시에만 실행

    // 채팅 타이핑 인디케이터
    useEffect(() => {
        if (chatMessage.length > 0) {
            setTyping(true);
            const timer = setTimeout(() => setTyping(false), 1000);
            return () => clearTimeout(timer);
        } else {
            setTyping(false);
        }
    }, [chatMessage, setTyping]);

    const handleSendMessage = () => {
        if (!chatMessage.trim()) return;
        sendChatMessage(chatMessage);
        setChatMessage('');
        setTyping(false);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'online': return 'bg-green-500';
            case 'busy': return 'bg-yellow-500';
            case 'away': return 'bg-gray-400';
            case 'normal': return 'bg-green-500';
            case 'warning': return 'bg-yellow-500';
            case 'critical': return 'bg-red-500';
            default: return 'bg-gray-400';
        }
    };

    const formatTimestamp = (timestamp: string) => {
        return new Date(timestamp).toLocaleTimeString('ko-KR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    if (isMinimized) {
        return (
            <div className="fixed top-20 right-4 z-40">
                <Button
                    onClick={() => setIsMinimized(false)}
                    size="sm"
                    className={`h-12 w-12 rounded-full shadow-lg relative ${
                        isConnected 
                            ? 'bg-blue-600 hover:bg-blue-700' 
                            : 'bg-gray-500 hover:bg-gray-600'
                    }`}
                >
                    <Activity className="h-5 w-5" />
                    {/* 연결 상태 인디케이터 */}
                    <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                        isConnected ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                </Button>
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm h-fit max-h-[calc(100vh-200px)] flex flex-col">
            {/* 간단한 헤더 */}
            <div className="p-3 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="text-xs font-medium text-gray-700">
                            {mode === 'activity' ? '개발자 현황' : '팀 채팅'}
                        </span>
                    </div>
                    <div className="flex space-x-1">
                        <button
                            onClick={() => setMode('activity')}
                            className={`p-1.5 rounded-md ${mode === 'activity' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <Users className="h-3 w-3" />
                        </button>
                        <button
                            onClick={() => setMode('chat')}
                            className={`p-1.5 rounded-md ${mode === 'chat' ? 'bg-purple-100 text-purple-600' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <MessageSquare className="h-3 w-3" />
                        </button>
                    </div>
                </div>
            </div>

            {/* 컨텐츠 영역 */}
            <div className="flex-1 overflow-y-auto">
                {mode === 'activity' && (
                    <div className="p-4 space-y-3">
                        <div className="flex items-center justify-between text-xs font-medium text-gray-500 uppercase tracking-wide">
                            <span>접속 중 ({presence.online.length}명)</span>
                            <span className={presence.connected ? 'text-green-600' : 'text-red-500'}>
                                {presence.connected ? 'LIVE' : 'OFF'}
                            </span>
                        </div>
                        
                        {/* 활성 세션 */}
                        <div className="space-y-2">
                            {presence.online.length > 0 ? presence.online.map((userId, index) => (
                                <div key={userId} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="relative">
                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                            <span className="text-white text-xs font-medium">
                                                {userId.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white`}></div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium text-gray-900 truncate">
                                            {userId}
                                        </div>
                                        <div className="text-xs text-gray-500 truncate">
                                            실시간 접속
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-8 text-gray-500">
                                    <Users className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                                    <p className="text-sm">활성 세션이 없습니다</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {mode === 'chat' && (
                    <div className="flex flex-col h-full max-h-[400px]">
                        {/* 채팅 메시지 */}
                        <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                            {chatMessages.map((message, index) => (
                                <div key={message.id || `message-${message.timestamp}-${index}`} className="flex justify-start">
                                    <div className="max-w-[85%]">
                                        <div className="bg-blue-50 p-3 rounded-lg">
                                            <div className="text-xs font-medium text-blue-800 mb-1">
                                                {message.username}
                                            </div>
                                            <div className="text-sm text-gray-900">
                                                {message.message}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {formatTimestamp(message.timestamp)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            {/* 타이핑 인디케이터 */}
                            {typingUsers.length > 0 && (
                                <div className="text-xs text-gray-500 italic p-2">
                                    {typingUsers.join(', ')}님이 입력 중...
                                </div>
                            )}
                        </div>

                        {/* 채팅 입력 */}
                        <div className="p-4 border-t border-gray-200 bg-gray-50">
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    value={chatMessage}
                                    onChange={(e) => setChatMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder={isConnected ? "메시지 입력..." : "연결 중..."}
                                    disabled={!isConnected}
                                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
                                />
                                <Button
                                    onClick={handleSendMessage}
                                    size="sm"
                                    className="px-3 py-2"
                                    disabled={!isConnected || !chatMessage.trim()}
                                >
                                    <Send className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
