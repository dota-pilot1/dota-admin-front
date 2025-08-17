import { create } from "zustand";

interface AuthState {
    isLoggedIn: boolean;
    user: string | null;
    checkAuth: () => void;
    logout: () => void;
}

function getCookie(name: string): string | null {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
}

export const useAuthStore = create<AuthState>((set) => ({
    isLoggedIn: typeof document !== "undefined" ? !!getCookie("auth") : false,
    user: typeof document !== "undefined" ? getCookie("user") : null,
    checkAuth: () => {
        const auth = getCookie("auth");
        const user = getCookie("user");
        set({ isLoggedIn: !!auth, user });
    },
    logout: () => {
        // 쿠키 삭제는 서버에서 처리, 클라이언트에서는 상태만 초기화
        set({ isLoggedIn: false, user: null });
    },
}));
