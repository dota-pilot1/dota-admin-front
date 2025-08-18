import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

export default function DashboardPage() {
    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">대시보드</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>환영합니다</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">업무/기술 공유를 시작해 보세요.</p>
                </CardContent>
            </Card>
        </div>
    );
}
