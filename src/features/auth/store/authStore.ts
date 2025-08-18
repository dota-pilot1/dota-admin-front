import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
    isLoggedIn: boolean;
    user: string | null;
    isHydrated: boolean;
    login: (user: string) => void;
    logout: () => void;
    setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            isLoggedIn: false,
            user: null,
            isHydrated: false,
            login: (user: string) => {
                set({ isLoggedIn: true, user });
            },
            logout: () => {
                set({ isLoggedIn: false, user: null });
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
