
import { User, UserRole, AuthResponse } from '../types';

// Constants to simulate DB collection names
const DB_USERS_KEY = 'secure_dash_db_users';
const DB_SESSION_KEY = 'secure_dash_session';

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper: Seed DB if empty
const seedDatabase = () => {
  const existing = localStorage.getItem(DB_USERS_KEY);
  if (!existing) {
    const adminUser: User & { passwordHash: string } = {
      id: 'admin-123',
      username: 'admin',
      displayName: 'Admin Manager',
      email: 'admin@example.com',
      role: UserRole.ADMIN,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      passwordHash: btoa('admin123'), // Simple mock hashing
      avatar: 'https://picsum.photos/200',
      coins: 9999,
      status: 'active'
    };
    const regularUser: User & { passwordHash: string } = {
      id: 'user-456',
      username: 'johndoe',
      displayName: 'John Doe',
      email: 'user@example.com',
      role: UserRole.USER,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      passwordHash: btoa('user123'),
      avatar: 'https://picsum.photos/201',
      coins: 100,
      status: 'active'
    };
    localStorage.setItem(DB_USERS_KEY, JSON.stringify([adminUser, regularUser]));
  }
};

// Initialize DB
seedDatabase();

// --- Auth Services (Simulating Node/Express Routes) ---

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  await delay(800); // Simulate server latency

  const usersRaw = localStorage.getItem(DB_USERS_KEY) || '[]';
  const users = JSON.parse(usersRaw);
  
  // Simulate MongoDB findOne
  const user = users.find((u: any) => u.email === email);
  
  // Simulate bcrypt.compare
  if (!user || user.passwordHash !== btoa(password)) {
    throw new Error('Invalid email or password');
  }

  // Simulate JWT generation
  const token = `fake-jwt-token-${Math.random().toString(36).substring(7)}`;
  const userData: User = {
    id: user.id,
    username: user.username,
    displayName: user.displayName || user.username,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    lastLogin: new Date().toISOString(),
    avatar: user.avatar,
    coins: user.coins || 0,
    status: user.status || 'active'
  };

  localStorage.setItem(DB_SESSION_KEY, JSON.stringify(userData));
  return { user: userData, token };
};

export const register = async (username: string, email: string, password: string, role: UserRole = UserRole.USER): Promise<AuthResponse> => {
  await delay(1000);

  const usersRaw = localStorage.getItem(DB_USERS_KEY) || '[]';
  const users = JSON.parse(usersRaw);

  if (users.find((u: any) => u.email === email)) {
    throw new Error('User already exists');
  }

  const newUser = {
    id: `user-${Date.now()}`,
    username,
    displayName: username,
    email,
    role,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    passwordHash: btoa(password), // Mock Bcrypt
    avatar: `https://picsum.photos/200?random=${Date.now()}`,
    coins: 100,
    status: 'active' as const
  };

  users.push(newUser);
  localStorage.setItem(DB_USERS_KEY, JSON.stringify(users));

  const userData: User = {
    id: newUser.id,
    username: newUser.username,
    displayName: newUser.displayName,
    email: newUser.email,
    role: newUser.role,
    createdAt: newUser.createdAt,
    lastLogin: newUser.lastLogin,
    avatar: newUser.avatar,
    coins: newUser.coins,
    status: newUser.status
  };

  // Auto login after register
  const token = `fake-jwt-token-${Date.now()}`;
  localStorage.setItem(DB_SESSION_KEY, JSON.stringify(userData));

  return { user: userData, token };
};

export const logout = async () => {
  await delay(300);
  localStorage.removeItem(DB_SESSION_KEY);
};

export const getCurrentUser = (): User | null => {
  const session = localStorage.getItem(DB_SESSION_KEY);
  return session ? JSON.parse(session) : null;
};

// --- Data Services (Simulating Protected Admin Routes) ---

export const getAllUsers = async (): Promise<User[]> => {
  await delay(600);
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.role !== UserRole.ADMIN) {
    throw new Error('Unauthorized: Admin access required');
  }

  const usersRaw = localStorage.getItem(DB_USERS_KEY) || '[]';
  const users = JSON.parse(usersRaw);
  // Return without password hash
  return users.map((u: any) => {
    const { passwordHash, ...safeUser } = u;
    return safeUser;
  });
};

export const deleteUser = async (userId: string): Promise<void> => {
  await delay(500);
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.role !== UserRole.ADMIN) {
    throw new Error('Unauthorized');
  }
  
  const usersRaw = localStorage.getItem(DB_USERS_KEY) || '[]';
  let users = JSON.parse(usersRaw);
  users = users.filter((u: any) => u.id !== userId);
  localStorage.setItem(DB_USERS_KEY, JSON.stringify(users));
};
