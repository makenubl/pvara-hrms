import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Map backend roles to frontend roles/permissions
const ROLE_MAP = {
  admin: 'SUPER_ADMIN',
  hr: 'HR_MANAGER',
  manager: 'DEPARTMENT_MANAGER',
  employee: 'EMPLOYEE',
};

const PERMISSIONS_BY_ROLE = {
  SUPER_ADMIN: [
    'view_employees',
    'manage_employees',
    'approve_leave',
    'manage_payroll',
    'view_attendance',
    'manage_attendance',
    'view_performance',
    'manage_performance',
    'manage_recruitment',
    'view_analytics',
    'manage_settings',
    'view_compliance',
    'manage_compliance',
    'manage_learning',
  ],
  HR_MANAGER: [
    'view_employees',
    'manage_employees',
    'approve_leave',
    'manage_payroll',
    'view_attendance',
    'view_performance',
    'manage_recruitment',
    'view_analytics',
  ],
  DEPARTMENT_MANAGER: [
    'view_employees',
    'approve_leave',
    'view_attendance',
    'view_performance',
    'manage_recruitment',
  ],
  HR_EXECUTIVE: [
    'view_employees',
    'manage_employees',
    'approve_leave',
    'view_attendance',
    'view_performance',
    'manage_recruitment',
    'view_analytics',
    'manage_learning',
  ],
  FINANCE: ['view_employees', 'view_payroll', 'manage_payroll', 'view_analytics'],
  EMPLOYEE: ['view_own_profile', 'apply_leave', 'view_own_payslips', 'view_courses', 'enroll_courses'],
};

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      role: null,
      permissions: [],

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(`${API_URL}/auth/login`, { email, password });

          const { token, user: profile } = response.data;
          const mappedRole = ROLE_MAP[profile.role] || profile.role || 'EMPLOYEE';
          const permissions = PERMISSIONS_BY_ROLE[mappedRole] || PERMISSIONS_BY_ROLE.EMPLOYEE;

          const user = {
            id: profile._id,
            email: profile.email,
            name: `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || profile.name || 'User',
            role: mappedRole,
            department: profile.department || 'General',
            permissions,
          };

          set({
            user,
            token,
            role: mappedRole,
            permissions,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return user;
        } catch (err) {
          const message = err?.response?.data?.message || err?.message || 'Login failed';
          set({ error: message, isLoading: false, isAuthenticated: false, token: null, user: null });
          throw new Error(message);
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          role: null,
          permissions: [],
          error: null,
          isLoading: false,
          isAuthenticated: false,
        });
      },

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setRole: (role) => set({ role }),
      setPermissions: (permissions) => set({ permissions }),

      // Helper method to check if user has permission
      hasPermission: (permission) => {
        const state = useAuthStore.getState();
        return state.permissions?.includes(permission) || false;
      },

      // Helper method to check user role
      hasRole: (role) => {
        const state = useAuthStore.getState();
        if (typeof role === 'string') {
          return state.role === role;
        }
        return state.role && role.includes(state.role);
      },

    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        role: state.role,
        permissions: state.permissions,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
