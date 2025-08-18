import { cookies } from "next/headers";
import { FreeboardList, type Post } from "@/features/freeboard/ui/freeboard-list";
import { UserList } from "@/entities/user/ui/user-list";
import { type User } from "@/entities/user/model/types";

export const dynamic = "force-dynamic";

function getFakePosts(): Post[] {
  return [
    {
      id: "1",
      title: "첫 번째 글: 환영합니다 👋",
      author: "관리자",
      createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      comments: 3,
    },
    {
      id: "2",
      title: "프로젝트 아이디어 공유해요",
      author: "홍길동",
      createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      comments: 7,
    },
    {
      id: "3",
      title: "개발 팁 모음",
      author: "김개발",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      comments: 2,
    },
  ];
}

function getFakeUsers(): User[] {
  return [
    {
      id: "u1",
      name: "관리자",
      email: "admin@example.com",
      role: "admin",
      joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 120).toISOString(),
      posts: 42,
    },
    {
      id: "u2",
      name: "홍길동",
      email: "hong@example.com",
      role: "member",
      joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
      posts: 11,
    },
    {
      id: "u3",
      name: "김개발",
      email: "kim@example.com",
      role: "member",
      joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
      posts: 5,
    },
  ];
}

export default async function FreeboardPage() {
  // sample: check auth cookie for SSR personalization if needed
  const c = await cookies();
  const username = c.get("user")?.value ?? "게스트";

  const posts = getFakePosts();
  const users = getFakeUsers();

  return (
    <main className="container mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold">자유 게시판</h1>
      <p className="text-sm text-muted-foreground">안녕하세요, {username} 님</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <FreeboardList posts={posts} />
        </div>
        <div className="md:col-span-1">
          <UserList users={users} />
        </div>
      </div>
    </main>
  );
}
