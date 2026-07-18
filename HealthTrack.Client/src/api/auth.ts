import api from './axios';

export const login = async (email: string, password: string) => {
  const response = await api.post('/Auth/login', { email, password });
  return response.data;
};

export const register = async (
  fullName: string,
  email: string,
  password: string,
  role: string
) => {
  const response = await api.post('/Auth/register', {
    fullName,
    email,
    password,
    role,
  });
  return response.data;
};