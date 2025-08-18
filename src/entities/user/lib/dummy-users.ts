import { type User } from "@/entities/user/model/types";

const NAMES = [
  "홍길동",
  "김개발",
  "이코더",
  "박테스터",
  "최디자이너",
  "정관리자",
  "오퍼포먼스",
  "장백엔드",
  "유프론트",
  "문데브옵스",
];

export function generateUsers(count: number): User[] {
  const users: User[] = [];
  for (let i = 0; i < count; i++) {
    const name = NAMES[i % NAMES.length] + (i >= NAMES.length ? ` ${i + 1}` : "");
    users.push({
      id: `u${i + 1}`,
      name,
      email: `user${i + 1}@example.com`,
      role: i % 20 === 0 ? "admin" : "member",
      joinedAt: new Date(Date.now() - i * 1000 * 60 * 60 * 6).toISOString(),
      posts: (i * 7) % 53,
    });
  }
  return users;
}
