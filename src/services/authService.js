import { mockUsers } from '../data/mockData';

// Simulate API delay
const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export const login = async (email, password) => {
  await delay();

  const user = mockUsers.find((u) => u.email === email);

  if (!user || password !== 'Password123') {
    throw new Error('Invalid credentials');
  }

  const token = `mock_token_${user.id}_${Date.now()}`;

  return {
    success: true,
    data: {
      token,
      user,
    },
  };
};

export const register = async (userData) => {
  await delay();

  // Check if email already exists
  const existingUser = mockUsers.find((u) => u.email === userData.email);
  if (existingUser) {
    throw new Error('Email already exists');
  }

  const newUser = {
    id: `user_${Date.now()}`,
    name: userData.name,
    email: userData.email,
    role: userData.role || 'user',
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=6366f1&color=fff`,
    createdAt: new Date().toISOString(),
    stats: {
      tasksCompleted: 0,
      totalEarned: 0,
      activeTasks: 0,
    },
  };

  mockUsers.push(newUser);

  const token = `mock_token_${newUser.id}_${Date.now()}`;

  return {
    success: true,
    data: {
      token,
      user: newUser,
    },
  };
};

export const forgotPassword = async (email) => {
  await delay();

  const user = mockUsers.find((u) => u.email === email);

  if (!user) {
    throw new Error('Email not found');
  }

  return {
    success: true,
    message: 'Password reset instructions sent to your email',
  };
};

export const updateProfile = async (userData) => {
  await delay();

  // In a real app, this would update the user in the database
  return {
    success: true,
    data: userData,
  };
};
