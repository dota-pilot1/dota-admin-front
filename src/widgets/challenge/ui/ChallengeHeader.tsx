"use client";

export function ChallengeHeader() {
  return (
    <header className="flex items-center justify-between py-4 border-b">
      <h1 className="text-2xl font-bold">챌린지</h1>
      <div className="text-sm text-muted-foreground">테스트 환경 · 샘플 데이터</div>
    </header>
  );
}
