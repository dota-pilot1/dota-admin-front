import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
    isLoggedIn: boolean;
    user: string | null;          // 기존 (예: 이메일)
    id: number | null;        // ★ 추가: 백엔드 authorId 용
    isHydrated: boolean;
    login: (user: string, id?: number) => void;  // ★ id 옵션 추가
    logout: () => void;
    setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            isLoggedIn: false,
            user: null,
            id: null,
            isHydrated: false,
            login: (user: string, id?: number) => {
                set({ isLoggedIn: true, user, id: id ?? null });
            },
            logout: () => {
                set({ isLoggedIn: false, user: null, id: null });
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
