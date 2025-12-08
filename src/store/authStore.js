import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define test accounts with permissions
const TEST_ACCOUNTS = {
  'admin@pvara.com': {
    name: 'Admin User',
    role: 'SUPER_ADMIN',
    department: 'Executive',
    permissions: [
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
  },
  'demo@pvara.com': {
    name: 'John Doe',
    role: 'HR_MANAGER',
    department: 'Human Resources',
    permissions: [
      'view_employees',
      'manage_employees',
      'approve_leave',
      'manage_payroll',
      'view_attendance',
      'view_performance',
      'manage_recruitment',
      'view_analytics',
    ],
  },
  'manager@pvara.com': {
    name: 'Manager User',
    role: 'DEPARTMENT_MANAGER',
    department: 'Engineering',
    permissions: [
      'view_employees',
      'approve_leave',
      'view_attendance',
      'view_performance',
      'manage_recruitment',
    ],
  },
  'hr@pvara.com': {
    name: 'HR Executive',
    role: 'HR_EXECUTIVE',
    department: 'Human Resources',
    permissions: [
      'view_employees',
      'manage_employees',
      'approve_leave',
      'view_attendance',
      'view_performance',
      'manage_recruitment',
      'view_analytics',
      'manage_learning',
    ],
  },
  'finance@pvara.com': {
    name: 'Finance User',
    role: 'FINANCE',
    department: 'Finance',
    permissions: [
      'view_employees',
      'view_payroll',
      'manage_payroll',
      'view_analytics',
    ],
  },
  'employee@pvara.com': {
    name: 'Employee User',
    role: 'EMPLOYEE',
    department: 'Technology',
    permissions: [
      'view_own_profile',
      'apply_leave',
      'view_own_payslips',
      'view_courses',
      'enroll_courses',
    ],
  },
};

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,
      role: null,
      permissions: [],

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          // Validate email format
          if (!email || !email.includes('@')) {
            throw new Error('Please enter a valid email address');
          }

          // Check if this is a known test account
          const accountInfo = TEST_ACCOUNTS[email.toLowerCase()];
          
          if (!accountInfo) {
            // For any other email, create a generic user
            const mockUser = {
              id: Math.random().toString(36).substr(2, 9),
              name: email.split('@')[0],
              email: email.toLowerCase(),
              role: 'EMPLOYEE',
              department: 'Technology',
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
              permissions: [
                'view_own_profile',
                'apply_leave',
                'view_own_payslips',
                'view_courses',
              ],
            };

            set({
              user: mockUser,
              token: `mock-jwt-token-${Date.now()}`,
              role: mockUser.role,
              permissions: mockUser.permissions,
              isLoading: false,
            });

            return { success: true, user: mockUser };
          }

          // Use test account info
          const mockUser = {
            id: email.toLowerCase().split('@')[0],
            name: accountInfo.name,
            email: email.toLowerCase(),
            role: accountInfo.role,
            department: accountInfo.department,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${accountInfo.name}`,
            permissions: accountInfo.permissions,
          };

          set({
            user: mockUser,
            token: `mock-jwt-token-${Date.now()}`,
            role: mockUser.role,
            permissions: mockUser.permissions,
            isLoading: false,
          });

          return { success: true, user: mockUser };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          role: null,
          permissions: [],
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

      // Helper to get test accounts list
      getTestAccounts: () => TEST_ACCOUNTS,
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        role: state.role,
        permissions: state.permissions,
      }),
    }
  )
);
