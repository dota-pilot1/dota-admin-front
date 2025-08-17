import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.get("auth")?.value === "1";
  if (isLoggedIn) redirect("/dashboard");
  redirect("/login");
}
