"use client";

import { useState, useEffect } from "react";
import { Users, Clock, Code, Monitor } from "lucide-react";

interface DeveloperSession {
    id: string;
    username: string;
    email: string;
    status: 'active' | 'idle' | 'away';
    lastActivity: string;
    currentPage: string;
    browser: string;
    ip: string;
    sessionStart: string;
}

export function DeveloperActivitySidebar() {
    const [developers, setDevelopers] = useState<DeveloperSession[]>([]);
    const [totalSessions, setTotalSessions] = useState(0);

    // 모의 데이터 생성
    useEffect(() => {
        const mockDevelopers: DeveloperSession[] = [
            {
                id: "1",
                username: "terecal",
                email: "terecal@example.com",
                status: "active",
                lastActivity: "방금 전",
                currentPage: "/challenge",
                browser: "Chrome 119",
                ip: "192.168.1.100",
                sessionStart: "2시간 전"
            },
            {
                id: "2", 
                username: "pilot1",
                email: "pilot1@example.com",
                status: "active",
                lastActivity: "2분 전",
                currentPage: "/admin",
                browser: "Safari 17",
                ip: "192.168.1.101",
                sessionStart: "30분 전"
            },
            {
                id: "3",
                username: "developer",
                email: "dev@example.com", 
                status: "idle",
                lastActivity: "15분 전",
                currentPage: "/members",
                browser: "Firefox 120",
                ip: "192.168.1.102",
                sessionStart: "1시간 전"
            }
        ];

        setDevelopers(mockDevelopers);
        setTotalSessions(mockDevelopers.length);

        // 실시간 업데이트 시뮬레이션
        const interval = setInterval(() => {
            setDevelopers(prev => prev.map(dev => ({
                ...dev,
                lastActivity: dev.status === 'active' ? '방금 전' : dev.lastActivity
            })));
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-500';
            case 'idle': return 'bg-yellow-500'; 
            case 'away': return 'bg-gray-400';
            default: return 'bg-gray-400';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'active': return '활성';
            case 'idle': return '대기';
            case 'away': return '자리비움';
            default: return '오프라인';
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 h-fit sticky top-4">
            <div className="flex items-center gap-2 mb-4">
                <Users className="h-4 w-4 text-blue-600" />
                <h3 className="text-sm font-medium text-gray-900">실시간 접속 현황</h3>
                <span className="ml-auto text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {totalSessions}명 접속
                </span>
            </div>

            <div className="space-y-3">
                {developers.map((dev) => (
                    <div key={dev.id} className="border border-gray-100 rounded p-3">
                        <div className="flex items-center gap-2 mb-2">
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(dev.status)}`} />
                            <span className="text-sm font-medium text-gray-900">{dev.username}</span>
                            <span className="text-xs text-gray-500 ml-auto">{getStatusText(dev.status)}</span>
                        </div>
                        
                        <div className="text-xs text-gray-600 space-y-1">
                            <div className="flex items-center gap-1">
                                <Monitor className="h-3 w-3" />
                                <span>{dev.currentPage}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{dev.lastActivity}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Code className="h-3 w-3" />
                                <span>{dev.browser}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 pt-3 border-t border-gray-200">
                <div className="text-xs text-gray-500 space-y-1">
                    <div>• 5초마다 자동 갱신</div>
                    <div>• WebSocket 연결 대기 중</div>
                    <div>• Redis Pub/Sub 준비됨</div>
                </div>
            </div>
        </div>
    );
}
