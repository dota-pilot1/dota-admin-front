import fs from 'fs';
import path from 'path';
import React from 'react';

export const dynamic = 'force-static';

function basicMarkdownToHtml(md: string): string {
  // 매우 단순한 변환 (필요시 추후 라이브러리 도입)
  return md
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/`([^`]+)`/gim, '<code>$1</code>')
    .replace(/\n\n/gim, '<br/><br/>' );
}

function getMarkdownContent() {
  const docPath = path.join(process.cwd(), 'docs', 'feature-roadmap-manual.md');
  try {
    const file = fs.readFileSync(docPath, 'utf-8');
    // front-matter 제거 (--- 블록) 간단 처리
    const content = file.replace(/^---[\s\S]*?---/, '').trim();
    return basicMarkdownToHtml(content);
  } catch (e) {
    return '<h1>로드맵 문서를 찾을 수 없습니다.</h1>';
  }
}

export default function FeatureRoadmapPage() {
  const html = getMarkdownContent();
  return (
    <div className="prose dark:prose-invert max-w-none px-6 py-10">
      <h1>기능 로드맵 & 매뉴얼</h1>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
