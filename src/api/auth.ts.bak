import api from './axios'

export const authApi = {
  login: (mobile: string, password: string) =>
    api.post('/Auth/login', { mobile, password }),

  register: (data: any) =>
    api.post('/Auth/register', data),

  sendOtp: (mobile: string) =>
    api.post('/Auth/otp/send', { mobile }),

  verifyOtp: (mobile: string, code: string) =>
    api.post('/Auth/otp/verify', { mobile, code }),

  refreshToken: (refreshToken: string) =>
    api.post('/Auth/token/refresh', { refreshToken }),
}
