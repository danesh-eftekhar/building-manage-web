import { create } from 'zustand'

interface User {
  userId: string
  fullName: string
  mobile: string
  role: string
  token: string
  refreshToken: string
}

interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  login: (user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user')!)
    : null,
  isAuthenticated: !!localStorage.getItem('token'),

  login: (user) => {
    localStorage.setItem('token', user.token)
    localStorage.setItem('user', JSON.stringify(user))
    set({ user, isAuthenticated: true })
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    set({ user: null, isAuthenticated: false })
  },
}))
