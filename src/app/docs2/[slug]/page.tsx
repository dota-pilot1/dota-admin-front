"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Separator } from "@/shared/ui/separator";
import { 
    FileText, 
    Eye, 
    Calendar, 
    User, 
    Tag, 
    ArrowLeft, 
    Star,
    Clock,
    Edit,
    Share2,
    Bookmark,
    ChevronRight
} from "lucide-react";
import Link from "next/link";

interface Document {
    id: number;
    title: string;
    slug: string;
    content: string;
    description: string;
    category: string;
    status: string;
    viewCount: number;
    isFeatured: boolean;
    displayOrder: number;
    icon: string;
    tags: string;
    createdAt: string;
    updatedAt: string;
    createdBy?: {
        username: string;
    };
    updatedBy?: {
        username: string;
    };
}

export default function DocumentDetailPage() {
    const params = useParams();
    const slug = params?.slug as string;
    const [document, setDocument] = useState<Document | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [relatedDocs, setRelatedDocs] = useState<Document[]>([]);

    useEffect(() => {
        if (slug) {
            loadDocument();
            loadRelatedDocuments();
        }
    }, [slug]);

    const loadDocument = async () => {
        try {
            setLoading(true);
            // 실제 API 호출로 대체 예정: /api/documents/public/${slug}
            
            // Mock data
            const mockDocument: Document = {
                id: 1,
                title: "권한 관리 프로세스",
                slug: "authorization-process",
                content: `# 권한 관리 프로세스

백엔드 권한 관리 시스템의 전체 프로세스를 단계별로 설명합니다.

## 1. 데이터베이스 구조

현재 시스템은 **User → Role → Authority** 3단계 구조로 설계되어 있습니다.

### 핵심 테이블
- **users**: 사용자 정보
- **roles**: 역할 정보  
- **authorities**: 권한 정보

### 매핑 테이블
- **role_authorities**: 역할-권한 매핑
- **user_authorities**: 사용자 개별 권한

## 2. 권한 검증 프로세스

### 1단계: JWT 토큰 파싱 및 사용자 인증
- HTTP 요청에서 Authorization: Bearer <token> 헤더 추출
- JWT 토큰 유효성 및 만료 시간 검증
- 토큰에서 사용자 이메일 추출
- 이메일로 데이터베이스에서 사용자 정보 조회

### 2단계: 사용자 권한 정보 수집
- Role 권한 추가: "ROLE_" + user.getRole().getName() 형태로 Spring Security에 등록
- Authority 권한 수집: 사용자 ID로 모든 권한 조회
  - Role을 통한 간접 권한: role_authorities 테이블 조회
  - 직접 부여된 권한: user_authorities 테이블 조회
- SecurityContext 설정: 수집된 권한들을 Spring Security Context에 저장

### 3단계: API 엔드포인트 권한 검증
Spring Security의 @PreAuthorize 애너테이션을 사용하여 권한을 검증합니다.

\`\`\`java
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<List<UserDto>> getUsers() {
    // ADMIN 롤을 가진 사용자만 접근 가능
}

@PreAuthorize("hasAuthority('USER_CREATE')")
public ResponseEntity<UserDto> createUser(@RequestBody CreateUserDto dto) {
    // USER_CREATE 권한이 있는 사용자만 접근 가능
}
\`\`\`

### 4단계: 권한 검증 결과 처리
- 권한이 있는 경우: API 호출이 성공적으로 처리
- 권한이 없는 경우: 403 Forbidden 응답과 함께 CustomAccessDeniedHandler가 작동

## 3. 관련 파일 및 클래스

### 인증/인가 관련
- \`config/SecurityConfig.java\` - Spring Security 설정
- \`config/JwtAuthenticationFilter.java\` - JWT 토큰 처리
- \`config/CustomAccessDeniedHandler.java\` - 권한 없음 처리

### 엔티티 및 서비스  
- \`entity/UserEntity.java\` - 사용자 엔티티
- \`entity/RoleEntity.java\` - 역할 엔티티
- \`entity/AuthorityEntity.java\` - 권한 엔티티
- \`application/UserService.java\` - 사용자 서비스

## 권한 관리 핵심 포인트

1. JWT 토큰에서 사용자 식별
2. 데이터베이스에서 Role과 Authority 조회  
3. Spring Security Context 설정
4. @PreAuthorize로 API별 권한 검증

이 프로세스를 통해 세밀한 권한 제어와 보안이 보장됩니다.`,
                description: "백엔드 권한 관리 시스템의 전체 프로세스를 단계별로 설명",
                category: "권한",
                status: "PUBLISHED",
                viewCount: 152,
                isFeatured: true,
                displayOrder: 1,
                icon: "🔐",
                tags: "권한,인증,Spring Security,JWT",
                createdAt: "2024-01-15T10:30:00",
                updatedAt: "2024-01-16T14:20:00",
                createdBy: { username: "admin" },
                updatedBy: { username: "admin" }
            };

            setDocument(mockDocument);
            setError(null);
        } catch (err) {
            setError("문서를 불러오는 중 오류가 발생했습니다.");
            console.error("문서 로딩 실패:", err);
        } finally {
            setLoading(false);
        }
    };

    const loadRelatedDocuments = async () => {
        try {
            // 실제 API 호출로 대체 예정
            const mockRelatedDocs: Document[] = [
                {
                    id: 2,
                    title: "권한 / 롤 시스템",
                    slug: "auth-system",
                    content: "",
                    description: "현재 Role 기반 구조와 초기화 & 등록 정책 설명",
                    category: "권한",
                    status: "PUBLISHED",
                    viewCount: 89,
                    isFeatured: false,
                    displayOrder: 2,
                    icon: "🛡️",
                    tags: "Role,권한,Bootstrap",
                    createdAt: "2024-01-14T15:20:00",
                    updatedAt: "2024-01-14T15:20:00"
                }
            ];
            setRelatedDocs(mockRelatedDocs);
        } catch (err) {
            console.error("관련 문서 로딩 실패:", err);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getTagsArray = (tags: string) => {
        return tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    };

    const renderMarkdown = (content: string) => {
        // 실제로는 마크다운 라이브러리 사용 (react-markdown 등)
        // 여기서는 간단한 변환만 수행
        return (
            <div className="prose prose-lg max-w-none">
                <div dangerouslySetInnerHTML={{ 
                    __html: content
                        .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mb-4 mt-8">$1</h1>')
                        .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-semibold mb-3 mt-6">$1</h2>')
                        .replace(/^### (.*$)/gm, '<h3 class="text-xl font-medium mb-2 mt-4">$1</h3>')
                        .replace(/^\*\* (.*$)/gm, '<p class="font-semibold mb-2">$1</p>')
                        .replace(/^- (.*$)/gm, '<li class="ml-4">$1</li>')
                        .replace(/```java([\s\S]*?)```/g, '<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto my-4"><code>$1</code></pre>')
                        .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm">$1</code>')
                        .replace(/\n\n/g, '</p><p class="mb-4">')
                        .replace(/^(?!<[h|l|p|c])(.*$)/gm, '<p class="mb-4">$1</p>')
                }} />
            </div>
        );
    };

    if (loading) {
        return (
            <main className="max-w-4xl mx-auto p-6">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="max-w-4xl mx-auto p-6">
                <Card>
                    <CardContent className="text-center py-12">
                        <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h2 className="text-xl font-semibold mb-2">오류 발생</h2>
                        <p className="text-muted-foreground mb-4">{error}</p>
                        <Link href="/docs2">
                            <Button variant="outline">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                문서 목록으로 돌아가기
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </main>
        );
    }

    if (!document) {
        return (
            <main className="max-w-4xl mx-auto p-6">
                <Card>
                    <CardContent className="text-center py-12">
                        <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h2 className="text-xl font-semibold mb-2">문서를 찾을 수 없습니다</h2>
                        <p className="text-muted-foreground mb-4">요청하신 문서가 존재하지 않거나 삭제되었습니다.</p>
                        <Link href="/docs2">
                            <Button variant="outline">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                문서 목록으로 돌아가기
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </main>
        );
    }

    return (
        <main className="max-w-6xl mx-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Main Content */}
                <article className="lg:col-span-3">
                    {/* Breadcrumb */}
                    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
                        <Link href="/docs2" className="hover:text-foreground">문서</Link>
                        <ChevronRight className="h-4 w-4" />
                        <Link href={`/docs2?category=${document.category}`} className="hover:text-foreground">
                            {document.category}
                        </Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="text-foreground">{document.title}</span>
                    </nav>

                    {/* Document Header */}
                    <header className="mb-8">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="text-4xl">{document.icon}</div>
                                <div>
                                    <h1 className="text-3xl font-bold">{document.title}</h1>
                                    <p className="text-muted-foreground mt-2">{document.description}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm">
                                    <Edit className="h-4 w-4 mr-1" />
                                    편집
                                </Button>
                                <Button variant="outline" size="sm">
                                    <Share2 className="h-4 w-4 mr-1" />
                                    공유
                                </Button>
                                <Button variant="outline" size="sm">
                                    <Bookmark className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Meta Information */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                작성일: {formatDate(document.createdAt)}
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                수정일: {formatDate(document.updatedAt)}
                            </div>
                            <div className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                작성자: {document.createdBy?.username || "Unknown"}
                            </div>
                            <div className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                조회수: {document.viewCount}회
                            </div>
                        </div>

                        {/* Tags and Category */}
                        <div className="flex flex-wrap items-center gap-2 mt-4">
                            <Badge variant="default">{document.category}</Badge>
                            {document.isFeatured && (
                                <Badge variant="outline">
                                    <Star className="h-3 w-3 mr-1 text-yellow-500" />
                                    추천
                                </Badge>
                            )}
                            {getTagsArray(document.tags).map(tag => (
                                <Badge key={tag} variant="outline">
                                    <Tag className="h-3 w-3 mr-1" />
                                    {tag}
                                </Badge>
                            ))}
                        </div>

                        <Separator className="mt-6" />
                    </header>

                    {/* Document Content */}
                    <div className="mb-8">
                        {renderMarkdown(document.content)}
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between items-center pt-6 border-t">
                        <Link href="/docs2">
                            <Button variant="outline">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                목록으로 돌아가기
                            </Button>
                        </Link>
                        <div className="text-sm text-muted-foreground">
                            마지막 업데이트: {formatDate(document.updatedAt)}
                        </div>
                    </div>
                </article>

                {/* Sidebar */}
                <aside className="lg:col-span-1">
                    <div className="sticky top-6 space-y-6">
                        {/* Table of Contents */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">목차</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="text-sm space-y-1">
                                    <a href="#" className="block hover:text-primary">1. 데이터베이스 구조</a>
                                    <a href="#" className="block hover:text-primary ml-2">- 핵심 테이블</a>
                                    <a href="#" className="block hover:text-primary ml-2">- 매핑 테이블</a>
                                    <a href="#" className="block hover:text-primary">2. 권한 검증 프로세스</a>
                                    <a href="#" className="block hover:text-primary ml-2">- 1단계: JWT 토큰 파싱</a>
                                    <a href="#" className="block hover:text-primary ml-2">- 2단계: 권한 정보 수집</a>
                                    <a href="#" className="block hover:text-primary ml-2">- 3단계: API 권한 검증</a>
                                    <a href="#" className="block hover:text-primary ml-2">- 4단계: 결과 처리</a>
                                    <a href="#" className="block hover:text-primary">3. 관련 파일 및 클래스</a>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Related Documents */}
                        {relatedDocs.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">관련 문서</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {relatedDocs.map((relatedDoc) => (
                                        <Link key={relatedDoc.id} href={`/docs2/${relatedDoc.slug}`}>
                                            <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span>{relatedDoc.icon}</span>
                                                    <span className="font-medium text-sm">{relatedDoc.title}</span>
                                                </div>
                                                <p className="text-xs text-muted-foreground">{relatedDoc.description}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </aside>
            </div>
        </main>
    );
}