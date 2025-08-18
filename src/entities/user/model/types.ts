export type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "member";
  joinedAt: string; // ISO date string
  posts: number;
};
