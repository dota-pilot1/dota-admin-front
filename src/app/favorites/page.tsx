'use client';

import React, { useState } from 'react';
import { Star, ExternalLink, Plus, Trash2, Edit2 } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';

interface Favorite {
  id: number;
  title: string;
  url: string;
  description: string;
  category?: string;
  addedAt: string;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([
    {
      id: 1,
      title: "UI 샘플 1000개 만들기",
      url: "https://interactive-ui-level1-sxj6.vercel.app/",
      description: "인터랙티브 UI 챌린지 사이트 - 다양한 UI/UX 실습 프로젝트",
      category: "개발",
      addedAt: "2025-09-01"
    },
    // 추가 즐겨찾기 예시
  ]);

  const handleOpenSite = (url: string, title: string) => {
    console.log(`Opening: ${title} - ${url}`);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const categories = Array.from(new Set(favorites.map(f => f.category).filter(Boolean)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50">
      <div className="container mx-auto px-6 py-10">
        {/* 헤더 섹션 */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-yellow-100 rounded-full mb-4">
            <Star className="h-7 w-7 text-yellow-600 fill-current" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            즐겨찾기
          </h1>
          <p className="text-base text-gray-600 max-w-xl mx-auto">
            자주 방문하는 사이트들을 한 곳에서 관리하고 빠르게 접근하세요
          </p>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-800">전체 즐겨찾기</p>
                  <p className="text-xl font-bold text-yellow-900 mt-1">{favorites.length}</p>
                </div>
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-800">카테고리</p>
                  <p className="text-xl font-bold text-blue-900 mt-1">{categories.length}</p>
                </div>
                <div className="h-6 w-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">#</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-800">이번 달 추가</p>
                  <p className="text-xl font-bold text-green-900 mt-1">
                    {favorites.filter(f => f.addedAt.startsWith('2025-09')).length}
                  </p>
                </div>
                <Plus className="h-6 w-6 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 즐겨찾기 목록 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-semibold text-gray-900">내 즐겨찾기</h2>
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-sm">
              <Plus className="h-4 w-4 mr-1" />
              새 즐겨찾기 추가
            </Button>
          </div>

          {/* 카테고리별 필터 */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              <Badge variant="outline" className="cursor-pointer hover:bg-gray-100 text-xs">
                전체
              </Badge>
              {categories.map(category => (
                <Badge 
                  key={category} 
                  variant="outline" 
                  className="cursor-pointer hover:bg-gray-100 text-xs"
                >
                  {category}
                </Badge>
              ))}
            </div>
          )}

          {/* 즐겨찾기 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites.map((favorite, index) => (
              <Card 
                key={favorite.id}
                className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-yellow-300 cursor-pointer"
                onClick={() => handleOpenSite(favorite.url, favorite.title)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        #{index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base group-hover:text-yellow-600 transition-colors truncate">
                          {favorite.title}
                        </CardTitle>
                        {favorite.category && (
                          <Badge variant="secondary" className="mt-1 text-xs">
                            {favorite.category}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-yellow-600 transition-colors flex-shrink-0" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {favorite.description}
                  </CardDescription>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="truncate text-blue-600">{favorite.url}</span>
                    <span className="flex-shrink-0 ml-2">{favorite.addedAt}</span>
                  </div>

                  {/* 호버시 액션 버튼 */}
                  <div className="flex gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 text-xs h-7"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenSite(favorite.url, favorite.title);
                      }}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      열기
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="text-xs h-7"
                      onClick={(e) => {
                        e.stopPropagation();
                        // 편집 기능 (추후 구현)
                      }}
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="text-red-600 hover:text-red-700 text-xs h-7"
                      onClick={(e) => {
                        e.stopPropagation();
                        // 삭제 기능 (추후 구현)
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 빈 상태 */}
          {favorites.length === 0 && (
            <div className="text-center py-12">
              <Star className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                아직 즐겨찾기가 없습니다
              </h3>
              <p className="text-gray-600 mb-5 max-w-md mx-auto">
                자주 방문하는 사이트를 추가해서 빠르게 접근해보세요
              </p>
              <Button className="bg-yellow-500 hover:bg-yellow-600">
                <Plus className="h-4 w-4 mr-2" />
                첫 번째 즐겨찾기 추가하기
              </Button>
            </div>
          )}
        </div>

        {/* 추천 사이트 섹션 */}
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-purple-900 text-lg">
              <Star className="h-5 w-5" />
              추천 사이트
            </CardTitle>
            <CardDescription className="text-sm">
              개발자들이 자주 사용하는 유용한 사이트들
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { name: "GitHub", url: "https://github.com", desc: "코드 저장소" },
                { name: "Stack Overflow", url: "https://stackoverflow.com", desc: "개발 Q&A" },
                { name: "MDN Web Docs", url: "https://developer.mozilla.org", desc: "웹 개발 문서" },
              ].map(site => (
                <div 
                  key={site.name}
                  className="p-3 bg-white rounded-lg border border-purple-200 hover:border-purple-300 cursor-pointer transition-colors"
                  onClick={() => handleOpenSite(site.url, site.name)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{site.name}</p>
                      <p className="text-xs text-gray-600">{site.desc}</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-purple-600" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
