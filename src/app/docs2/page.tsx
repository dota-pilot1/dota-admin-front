"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Separator } from "@/shared/ui/separator";
import { 
    FileText, 
    Search, 
    Star, 
    TrendingUp, 
    Bookmark, 
    Plus,
    Filter,
    Grid,
    List,
    Eye,
    Calendar,
    User,
    Tag
} from "lucide-react";
import Link from "next/link";

interface Document {
    id: number;
    title: string;
    slug: string;
    description: string;
    category: string;
    status: string;
    viewCount: number;
    isFeatured: boolean;
    displayOrder: number;
    icon: string;
    tags: string;
    createdAt: string;
    createdBy?: {
        username: string;
    };
}

export default function Docs2Page() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [featuredDocs, setFeaturedDocs] = useState<Document[]>([]);
    const [popularDocs, setPopularDocs] = useState<Document[]>([]);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDocuments();
        loadCategories();
        loadFeaturedDocuments();
        loadPopularDocuments();
    }, []);

    const loadDocuments = async () => {
        try {
            // 실제 API 호출로 대체 예정
            const mockDocuments: Document[] = [
                {
                    id: 1,
                    title: "권한 관리 프로세스",
                    slug: "authorization-process",
                    description: "백엔드 권한 관리 시스템의 전체 프로세스를 단계별로 설명",
                    category: "권한",
                    status: "PUBLISHED",
                    viewCount: 152,
                    isFeatured: true,
                    displayOrder: 1,
                    icon: "🔐",
                    tags: "권한,인증,Spring Security,JWT",
                    createdAt: "2024-01-15T10:30:00",
                    createdBy: { username: "admin" }
                },
                {
                    id: 2,
                    title: "챌린지 포상 프로세스",
                    slug: "challenge-process",
                    description: "handlePay 함수 중심의 전체 챌린지 포상 워크플로우",
                    category: "비즈니스",
                    status: "PUBLISHED",
                    viewCount: 89,
                    isFeatured: true,
                    displayOrder: 2,
                    icon: "🎯",
                    tags: "챌린지,워크플로우,handlePay",
                    createdAt: "2024-01-14T15:20:00",
                    createdBy: { username: "admin" }
                },
                {
                    id: 3,
                    title: "API 레퍼런스",
                    slug: "api-reference",
                    description: "백엔드 API 엔드포인트 및 스키마 문서",
                    category: "API",
                    status: "PUBLISHED",
                    viewCount: 234,
                    isFeatured: false,
                    displayOrder: 3,
                    icon: "📡",
                    tags: "API,백엔드,스키마",
                    createdAt: "2024-01-13T09:15:00",
                    createdBy: { username: "dev" }
                }
            ];
            setDocuments(mockDocuments);
        } catch (error) {
            console.error("문서 로딩 실패:", error);
        } finally {
            setLoading(false);
        }
    };

    const loadCategories = async () => {
        try {
            // 실제 API 호출로 대체 예정
            setCategories(["권한", "비즈니스", "API", "가이드", "설정"]);
        } catch (error) {
            console.error("카테고리 로딩 실패:", error);
        }
    };

    const loadFeaturedDocuments = async () => {
        try {
            // 실제 API 호출로 대체 예정
            setFeaturedDocs(documents.filter(doc => doc.isFeatured));
        } catch (error) {
            console.error("추천 문서 로딩 실패:", error);
        }
    };

    const loadPopularDocuments = async () => {
        try {
            // 실제 API 호출로 대체 예정
            setPopularDocs([...documents].sort((a, b) => b.viewCount - a.viewCount).slice(0, 5));
        } catch (error) {
            console.error("인기 문서 로딩 실패:", error);
        }
    };

    const filteredDocuments = documents.filter(doc => {
        const matchesSearch = doc.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                            doc.description.toLowerCase().includes(searchKeyword.toLowerCase());
        const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ko-KR');
    };

    const getTagsArray = (tags: string) => {
        return tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    };

    if (loading) {
        return (
            <main className="max-w-7xl mx-auto p-6">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-48 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="max-w-7xl mx-auto p-6 space-y-8">
            {/* Header */}
            <header className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <FileText className="h-8 w-8 text-primary" />
                            문서 관리 시스템
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            데이터베이스 기반 동적 문서 관리 및 검색
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                            <Plus className="h-4 w-4 mr-1" />
                            문서 추가
                        </Button>
                        <div className="flex items-center border rounded-lg">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-2 ${viewMode === "grid" ? "bg-primary text-white" : ""}`}
                            >
                                <Grid className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-2 ${viewMode === "list" ? "bg-primary text-white" : ""}`}
                            >
                                <List className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                            placeholder="문서 제목이나 내용을 검색하세요..."
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="border border-input bg-background px-3 py-2 text-sm rounded-md"
                        >
                            <option value="all">모든 카테고리</option>
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-600">{documents.length}</div>
                        <div className="text-sm text-blue-600">전체 문서</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-600">{featuredDocs.length}</div>
                        <div className="text-sm text-green-600">추천 문서</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-purple-600">{categories.length}</div>
                        <div className="text-sm text-purple-600">카테고리</div>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-orange-600">
                            {documents.reduce((sum, doc) => sum + doc.viewCount, 0)}
                        </div>
                        <div className="text-sm text-orange-600">총 조회수</div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar */}
                <aside className="lg:col-span-1 space-y-6">
                    {/* Featured Documents */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Star className="h-4 w-4 text-yellow-500" />
                                추천 문서
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {featuredDocs.slice(0, 3).map((doc) => (
                                <Link key={doc.id} href={`/docs2/${doc.slug}`}>
                                    <div className="p-2 hover:bg-gray-50 rounded cursor-pointer">
                                        <div className="font-medium text-sm">{doc.title}</div>
                                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Eye className="h-3 w-3" />
                                            {doc.viewCount}회
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Popular Documents */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-green-500" />
                                인기 문서
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {popularDocs.slice(0, 5).map((doc, index) => (
                                <Link key={doc.id} href={`/docs2/${doc.slug}`}>
                                    <div className="p-2 hover:bg-gray-50 rounded cursor-pointer">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-primary">#{index + 1}</span>
                                            <div className="flex-1">
                                                <div className="font-medium text-sm">{doc.title}</div>
                                                <div className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Eye className="h-3 w-3" />
                                                    {doc.viewCount}회
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </CardContent>
                    </Card>
                </aside>

                {/* Main Content */}
                <div className="lg:col-span-3">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">
                            문서 목록 ({filteredDocuments.length}개)
                        </h2>
                    </div>

                    {filteredDocuments.length === 0 ? (
                        <Card>
                            <CardContent className="text-center py-12">
                                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                <p className="text-muted-foreground">검색 결과가 없습니다.</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className={viewMode === "grid" 
                            ? "grid grid-cols-1 md:grid-cols-2 gap-6" 
                            : "space-y-4"
                        }>
                            {filteredDocuments.map((doc) => (
                                <Card key={doc.id} className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="text-2xl">{doc.icon}</div>
                                                <div>
                                                    <CardTitle className="text-lg">{doc.title}</CardTitle>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Badge variant="secondary" className="text-xs">
                                                            {doc.category}
                                                        </Badge>
                                                        {doc.isFeatured && (
                                                            <Badge variant="outline" className="text-xs">
                                                                <Star className="h-3 w-3 mr-1 text-yellow-500" />
                                                                추천
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                <Eye className="h-4 w-4" />
                                                {doc.viewCount}
                                            </div>
                                        </div>
                                        <CardDescription className="mt-2">
                                            {doc.description}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            <div className="flex flex-wrap gap-1">
                                                {getTagsArray(doc.tags).map(tag => (
                                                    <Badge key={tag} variant="outline" className="text-xs">
                                                        <Tag className="h-3 w-3 mr-1" />
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                            
                                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {formatDate(doc.createdAt)}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <User className="h-3 w-3" />
                                                    {doc.createdBy?.username || "Unknown"}
                                                </div>
                                            </div>

                                            <Link href={`/docs2/${doc.slug}`}>
                                                <Button className="w-full" variant="outline">
                                                    <FileText className="h-4 w-4 mr-2" />
                                                    문서 보기
                                                </Button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}