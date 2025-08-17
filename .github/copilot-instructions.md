- [x] Clarify Project Requirements
  - Next.js 기반, TypeScript, Tailwind, App Router, 업무/기술 공유 사이트

- [x] Scaffold the Project
  - npx create-next-app@latest . --ts --tailwind --eslint --app --src-dir --use-npm

- [x] Customize the Project
  - FSD 디렉토리 생성: src/shared/ui, shared/lib, shared/hooks, entities, features, widgets, processes
  - shadcn/ui 초기화 및 컴포넌트 경로를 src/shared/ui 로 설정
  - 글로벌 레이아웃에 Toaster(sonner) 연결
  - Mock 인증 추가: middleware 보호, /login 페이지, /api/auth/login & /api/auth/logout, /dashboard 보호 라우트

- [ ] Install Required Extensions
  - 특별한 확장 기능 필요 없음

- [ ] Compile the Project
  - 의존성 설치 및 빌드 완료 (shadcn/ui 컴포넌트 추가 후 빌드 확인)
  - 상태: 완료

- [ ] Create and Run Task
  - 필요 시 tasks.json 생성 예정

- [ ] Launch the Project
  - 개발 서버 실행 예정

- [ ] Ensure Documentation is Complete
  - README.md 및 copilot-instructions.md 최신화 예정
