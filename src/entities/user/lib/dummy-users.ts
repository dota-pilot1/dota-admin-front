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
    const username = NAMES[i % NAMES.length] + (i >= NAMES.length ? ` ${i + 1}` : "");
    const id = i + 1; // Changed from userId to id
    const email = `user${id}@example.com`;
    const role = i % 20 === 0 ? "admin" : "member";
    const authorities = [role.toUpperCase()]; // Simple authorities based on role

    users.push({
      id, // Changed from userId to id
      username,
      email,
      role,
      authorities,
    });
  }
  return users;
}
