"use client";

import { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/ui/select";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { TestTube2, User } from "lucide-react";

interface TestAccount {
    email: string;
    name: string;
    role: string;
}

const TEST_ACCOUNTS: TestAccount[] = [
    {
        email: "terecal@daum.net",
        name: "관리자",
        role: "ADMIN"
    },
    {
        email: "test1@daum.net", 
        name: "테스트 사용자 1",
        role: "USER"
    },
    {
        email: "test2@daum.net",
        name: "테스트 사용자 2", 
        role: "USER"
    }
];

interface TestAccountSelectorProps {
    onAccountSelect: (email: string, password: string) => void;
    className?: string;
}

export default function TestAccountSelector({ onAccountSelect, className }: TestAccountSelectorProps) {
    const [selectedAccount, setSelectedAccount] = useState<string>("");

    const handleQuickLogin = () => {
        if (selectedAccount) {
            onAccountSelect(selectedAccount, "123456");
        }
    };

    const selectedAccountInfo = TEST_ACCOUNTS.find(acc => acc.email === selectedAccount);

    return (
        <div className={`space-y-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800 ${className}`}>
            <div className="flex items-center gap-2 mb-2">
                <TestTube2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                    테스트 계정 빠른 로그인
                </span>
                <Badge variant="outline" className="text-xs border-blue-300 text-blue-700 dark:border-blue-600 dark:text-blue-300">
                    개발용
                </Badge>
            </div>
            
            <div className="space-y-2">
                <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                    <SelectTrigger className="bg-white dark:bg-slate-800 border-blue-200 dark:border-blue-700">
                        <SelectValue placeholder="테스트 계정을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                        {TEST_ACCOUNTS.map((account) => (
                            <SelectItem key={account.email} value={account.email}>
                                <div className="flex items-center gap-3 py-1">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <div className="flex flex-col">
                                        <span className="font-medium">{account.name}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-muted-foreground">{account.email}</span>
                                            <Badge 
                                                variant={account.role === 'ADMIN' ? 'default' : 'secondary'}
                                                className="text-xs"
                                            >
                                                {account.role}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {selectedAccountInfo && (
                    <div className="text-xs text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 p-2 rounded">
                        <strong>{selectedAccountInfo.name}</strong> • {selectedAccountInfo.email} • 비밀번호: 123456
                    </div>
                )}

                <Button 
                    onClick={handleQuickLogin}
                    disabled={!selectedAccount}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    size="sm"
                >
                    <TestTube2 className="h-4 w-4 mr-2" />
                    빠른 로그인
                </Button>
            </div>
        </div>
    );
}
