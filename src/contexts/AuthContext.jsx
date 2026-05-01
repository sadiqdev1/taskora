import { createContext, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Default user data
const defaultUser = {
  id: '1',
  name: 'Abubakar Ibrahim',
  email: 'abubakar@taskora.com',
  role: 'user',
  avatar: 'https://ui-avatars.com/api/?name=Abubakar+Ibrahim&background=3b82f6&color=fff',
  phone: '+234 123 456 7890',
  bio: 'Task enthusiast and reward hunter',
  createdAt: '2024-01-15T10:00:00Z',
  stats: {
    tasksCompleted: 45,
    totalEarned: 1250.50,
    activeTasks: 3,
  },
};

export const AuthProvider = ({ children }) => {
  const value = {
    isAuthenticated: true,
    user: defaultUser,
    token: localStorage.getItem('auth_token') || '',
    loading: false,
    login: () => Promise.resolve(),
    register: () => Promise.resolve(),
    logout: () => {},
    updateUser: (userData) => Promise.resolve({ data: { ...defaultUser, ...userData } }),
    checkAuth: () => Promise.resolve(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
