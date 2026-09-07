import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UserRole = "superadmin" | "admin" | "agent" | "vendor" | "client" | "employee";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  phoneNumber?: string;
  [key: string]: any;
}

interface AuthState {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  role: null,
  isAuthenticated: false,
  isLoading: true,
};

const saveRoleToStorage = (roleString: string) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem("rajseba_user_role", roleString);
  const date = new Date();
  date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000);
  const expires = "; expires=" + date.toUTCString();
  document.cookie = `rajseba_user_role=${roleString}${expires}; path=/; SameSite=Lax`;
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;

      const rawRole = typeof action.payload.role === 'object' && action.payload.role
        ? (action.payload.role as any).name
        : (action.payload.role || 'client');
      const roleString = typeof rawRole === 'string'
        ? rawRole.toLowerCase().replace(/\s+/g, '')
        : "client";

      state.role = roleString as UserRole;

      if (typeof window !== 'undefined') {
        // Persist user data and role for instant restore on page reload
        try {
          localStorage.setItem("rajseba_user", JSON.stringify(action.payload));
        } catch {}
        saveRoleToStorage(roleString);
      }
    },
    restoreUser: (state) => {
      // Called synchronously on client mount to rehydrate from localStorage
      if (typeof window === 'undefined') return;
      try {
        const stored = localStorage.getItem("rajseba_user");
        const token = localStorage.getItem("rajseba_access_token") || localStorage.getItem("token");
        if (stored && token) {
          const user = JSON.parse(stored) as User;
          state.user = user;
          state.isAuthenticated = true;
          const rawRole = typeof user.role === 'object' && user.role
            ? (user.role as any).name
            : (user.role || 'client');
          state.role = (typeof rawRole === 'string'
            ? rawRole.toLowerCase().replace(/\s+/g, '')
            : "client") as UserRole;
        }
      } catch {}
      state.isLoading = false;
    },
    setRole: (state, action: PayloadAction<UserRole>) => {
      state.role = action.payload;
      if (typeof window !== 'undefined') {
        saveRoleToStorage(action.payload);
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.role = null;
      state.isLoading = false;
      if (typeof window !== 'undefined') {
        localStorage.removeItem("rajseba_user");
        localStorage.removeItem("rajseba_user_role");
        localStorage.removeItem("token");
        localStorage.removeItem("rajseba_access_token");
        localStorage.removeItem("rajseba_refresh_token");
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        document.cookie = "rajseba_access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        document.cookie = "rajseba_refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        document.cookie = "rajseba_user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        window.location.href = "/";
      }
    },
  },
});

export const { setUser, restoreUser, setRole, setLoading, logout } = authSlice.actions;

export default authSlice.reducer;

export const getRoleName = (r: UserRole | null): string => {
  switch (r) {
    case "superadmin":
      return "Super Admin";
    case "agent":
      return "Agent";
    case "vendor":
      return "Vendor";
    case "client":
      return "Customer";
    case "employee":
      return "Employee";
    default:
      return "User";
  }
};
