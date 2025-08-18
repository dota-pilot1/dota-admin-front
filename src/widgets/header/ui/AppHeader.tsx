import { cookies } from "next/headers";
import { AppHeaderClient } from "./AppHeaderClient";

export default async function AppHeader() {
    const c = await cookies();
    const isAuthed = Boolean(c.get("auth")?.value);
    const username = c.get("user")?.value ?? "guest";
    return <AppHeaderClient isAuthed={isAuthed} username={username} />;
}