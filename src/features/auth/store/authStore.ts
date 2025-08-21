import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
    isLoggedIn: boolean;
    user: string | null;          // 기존 (예: 이메일)
    userId: number | null;        // ★ 추가: 백엔드 authorId 용
    isHydrated: boolean;
    login: (user: string, userId?: number) => void;  // ★ userId 옵션 추가
    logout: () => void;
    setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            isLoggedIn: false,
            user: null,
            userId: null,
            isHydrated: false,
            login: (user: string, userId?: number) => {
                set({ isLoggedIn: true, user, userId: userId ?? null });
            },
            logout: () => {
                set({ isLoggedIn: false, user: null, userId: null });
            },
            setHydrated: () => {
                set({ isHydrated: true });
            },
        }),
        {
            name: "auth-storage", // localStorage key
            onRehydrateStorage: () => (state) => {
                state?.setHydrated();
            },
        }
    )
);
