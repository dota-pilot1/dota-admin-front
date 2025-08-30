import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { 
    BookOpen, 
    Code, 
    Database, 
    Cloud, 
    Brain, 
    Users, 
    TrendingUp,
    Plus,
    Star,
    MessageCircle,
    Eye,
    Calendar
} from "lucide-react";

export default function DashboardPage() {
    const techCategories = [
        { icon: <Code className="h-6 w-6" />, name: "Frontend", count: 12, color: "bg-blue-500" },
        { icon: <Database className="h-6 w-6" />, name: "Backend", count: 8, color: "bg-green-500" },
        { icon: <Cloud className="h-6 w-6" />, name: "DevOps", count: 5, color: "bg-purple-500" },
        { icon: <Brain className="h-6 w-6" />, name: "AI/ML", count: 7, color: "bg-orange-500" },
    ];

    const recentPosts = [
        { title: "React 18의 새로운 기능들", author: "김개발", category: "Frontend", views: 124, comments: 8, date: "2일 전" },
        { title: "Spring Boot 3.0 마이그레이션 가이드", author: "박백엔드", category: "Backend", views: 89, comments: 5, date: "3일 전" },
        { title: "Docker 컨테이너 최적화 팁", author: "이데브옵스", category: "DevOps", views: 156, comments: 12, date: "5일 전" },
    ];

    const trendingTopics = [
        "React", "Spring Boot", "TypeScript", "Docker", "Kubernetes", "Next.js", "PostgreSQL", "AWS"
    ];

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Tech Hub</h1>
                    <p className="text-muted-foreground mt-1">팀의 기술 지식을 공유하고 함께 성장해요</p>
                </div>
                <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    새 포스트 작성
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {techCategories.map((category) => (
                    <Card key={category.name} className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${category.color} text-white`}>
                                        {category.icon}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">{category.name}</p>
                                        <p className="text-2xl font-bold">{category.count}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Posts */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BookOpen className="h-5 w-5" />
                                최근 기술 포스트
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {recentPosts.map((post, index) => (
                                <div key={index} className="border-b pb-4 last:border-b-0 hover:bg-gray-50 p-3 rounded-lg transition-colors cursor-pointer">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-semibold hover:text-blue-600 transition-colors">
                                                {post.title}
                                            </h3>
                                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Users className="h-4 w-4" />
                                                    {post.author}
                                                </span>
                                                <Badge variant="outline">{post.category}</Badge>
                                                <span className="flex items-center gap-1">
                                                    <Eye className="h-4 w-4" />
                                                    {post.views}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <MessageCircle className="h-4 w-4" />
                                                    {post.comments}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-4 w-4" />
                                                    {post.date}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Trending Topics */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                인기 기술 키워드
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {trendingTopics.map((topic) => (
                                    <Badge 
                                        key={topic} 
                                        variant="secondary" 
                                        className="cursor-pointer hover:bg-blue-100 hover:text-blue-700"
                                    >
                                        {topic}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>빠른 액션</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button variant="outline" className="w-full justify-start">
                                <BookOpen className="h-4 w-4 mr-2" />
                                기술 문서 작성
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                                <Star className="h-4 w-4 mr-2" />
                                즐겨찾기 보기
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                                <Users className="h-4 w-4 mr-2" />
                                팀원 활동 보기
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
