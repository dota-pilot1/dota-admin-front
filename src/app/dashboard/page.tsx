import { cookies } from "next/headers";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

export default async function DashboardPage() {
    const cookieStore = await cookies();
    const user = cookieStore.get("user")?.value || "user@dota.co";

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">대시보드</h1>
                <form action="/api/auth/logout" method="post">
                    <Button type="submit" variant="secondary">로그아웃</Button>
                </form>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>환영합니다, {user}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">업무/기술 공유를 시작해 보세요.</p>
                </CardContent>
            </Card>
        </div>
    );
}
