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
import { TestTube2 } from "lucide-react";

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
        <div className={`space-y-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-700 ${className}`}>
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="w-full">
                    <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                        <SelectTrigger className="h-9 text-sm bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 overflow-hidden w-full">
                            <SelectValue placeholder="테스트 계정 이메일을 선택하세요" />
                        </SelectTrigger>
                        <SelectContent>
                            {TEST_ACCOUNTS.map((account) => (
                                <SelectItem
                                    key={account.email}
                                    value={account.email}
                                    className={`text-sm ${selectedAccount === account.email ? 'border border-dotted border-primary bg-primary/10' : ''}`}
                                >
                                    {account.email}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

                {selectedAccountInfo && (
                    <div className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2 min-w-0">
                        <span className="font-medium">{selectedAccountInfo.name}</span>
                        <span className="text-slate-400">•</span>
                        <span className="truncate">{selectedAccountInfo.email}</span>
                        <span className="text-slate-400">•</span>
                        <Badge variant={selectedAccountInfo.role === 'ADMIN' ? 'default' : 'secondary'} className="text-[10px] px-1.5">
                            {selectedAccountInfo.role}
                        </Badge>
                        <span className="text-slate-400">•</span>
                        <span>비밀번호: 123456</span>
                    </div>
                )}

                <Button
                    onClick={handleQuickLogin}
                    disabled={!selectedAccount}
                    className="w-full h-9 text-sm bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                    size="sm"
                >
                    <TestTube2 className="h-4 w-4 mr-2" />
                    선택한 계정으로 로그인
                </Button>
        </div>
    );
}
