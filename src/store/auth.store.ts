import { User } from "@/interfaces/user.interface";
import { create } from "zustand";

interface AuthState {
  user: User | null;
  admin: User | null;
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  actions: AuthActions;
}

interface AuthActions {
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  logout: () => void;
  setAdmin: (user: User) => void;
  setAdminToken: (token: string) => void;
  adminLogout: () => void;
}

// Separate actions
const createAuthActions = (set: any): AuthActions => ({
  setUser: (user) =>
    set(() => ({
      user,
      isAuthenticated: true,
      isAuthenticating: false,
    })),

  logout: () => {
    set(() => {
      localStorage.removeItem("token"); // Clear token from localStorage on logout
      return {
        user: null,
        isAuthenticated: false,
        isAuthenticating: false,
      };
    });
  },

  setToken: (token: string) => {
    localStorage.setItem("token", token); // Store token in localStorage
  },
  setAdmin: (user) =>
    set(() => ({
      user,
      isAuthenticated: true,
      isAuthenticating: false,
    })),

  adminLogout: () => {
    set(() => {
      localStorage.removeItem("token"); // Clear token from localStorage on logout
      return {
        user: null,
        isAuthenticated: false,
        isAuthenticating: false,
      };
    });
  },

  setAdminToken: (token: string) => {
    localStorage.setItem("token", token); // Store token in localStorage
  },
});

// Zustand store with externalized actions
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  admin: null,
  isAuthenticated: false,
  isAuthenticating: false,
  actions: createAuthActions(set),
}));

// Custom hook to get only actions
export const useAuthActions = () => useAuthStore((state) => state.actions);
