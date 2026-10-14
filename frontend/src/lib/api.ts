import axios from 'axios';

// Full API base, e.g. http://localhost:8000/api. Leave unset to run in offline demo mode.
export const API_URL: string = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') ?? '';
export const apiEnabled = API_URL !== '';

const TOKEN_KEY = 'akademi_api_token';

export const getToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setToken = (token: string | null) => {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // storage unavailable
  }
};

export const api = axios.create({
  baseURL: API_URL,
  headers: { Accept: 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export interface ApiUser {
  id: number;
  name: string;
  email: string;
  role: 'student' | 'tutor' | 'admin' | 'super_admin';
  avatar?: string | null;
}

const initialsOf = (name: string) => {
  const parts = name.trim().split(/\s+/);
  return (parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : name.slice(0, 2)).toUpperCase();
};

/** Map an API user to the profile shape the UI keeps in `akademi_auth_user`. */
export const toAuthProfile = (user: ApiUser) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  initials: initialsOf(user.name),
  title: user.role === 'tutor' ? 'Tutor' : user.role === 'student' ? 'Student' : 'Platform Administrator',
  avatar: user.avatar || '/images/hero-student.jpg',
});

export const apiErrorMessage = (err: unknown, fallback: string): string => {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { message?: string; errors?: Record<string, string[]> } | undefined;
    const first = data?.errors && Object.values(data.errors)[0]?.[0];
    return first || data?.message || (err.response ? fallback : 'Cannot reach the server. Please try again.');
  }
  return fallback;
};

export async function apiLogin(email: string, password: string) {
  const { data } = await api.post<{ user: ApiUser; token: string }>('/auth/login', { email, password });
  setToken(data.token);
  return toAuthProfile(data.user);
}

export async function apiRegister(input: { name: string; email: string; password: string; role: 'student' | 'tutor' }) {
  const { data } = await api.post<{ user: ApiUser; token: string }>('/auth/register', input);
  setToken(data.token);
  return toAuthProfile(data.user);
}
