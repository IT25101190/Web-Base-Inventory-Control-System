import { apiClient } from './axiosClients';
import { User } from '../types';

export interface LoginResponse {
  token: string;
  user: User;
}

export const authApi = {
  login: async (username: string, password: string) => {
    const res = await apiClient.post<{ success: boolean; data: LoginResponse }>('/api/auth/login', {
      username,
      password,
    });
    return res.data.data;
  },

  refresh: async () => {
    const res = await apiClient.post<{ success: boolean; data: { token: string } }>('/api/auth/refresh');
    return res.data.data.token;
  },
};
