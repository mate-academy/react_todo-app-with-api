import { client } from '../utils/fetchClient';

export interface User {
  id: number;
  email: string;
  isActivated: boolean;
}

export interface AuthResponse {
  user: User;
  accessToken: string; // Ваш JWT токен
}

export const register = (email: string, password: string) => {
  return client.post<any>('/registration', { email, password });
};

export const login = (email: string, password: string) => {
  return client.post<AuthResponse>('/login', { email, password });
};

export const activate = (activationToken: string) => {
  return client.get<AuthResponse>(`/activate/${activationToken}`);
};

export const checkAuth = () => {
  return client.get<AuthResponse>('/users/me'); // Заголовок з токеном додасть fetchClient
};
