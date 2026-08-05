import { create } from 'zustand'

interface User {
  userId: string
  fullName: string
  mobile: string
  role: string
  token: string
  refreshToken: string
}

interface Subscription {
  planName: string
  planType: number
  status: number
  endDate: string
  features: {
    hasReports: boolean
    hasApi: boolean
    maxBuildings: number
    maxUnitsPerBuilding: number
  }
}

interface AuthStore {
  user: User | null
  subscription: Subscription | null
  isAuthenticated: boolean
  isPro: boolean
  login: (user: User) => void
  logout: () => void
  setSubscription: (sub: Subscription) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user')!)
    : null,
  subscription: localStorage.getItem('subscription')
    ? JSON.parse(localStorage.getItem('subscription')!)
    : null,
  isAuthenticated: !!localStorage.getItem('token'),
  isPro: localStorage.getItem('subscription')
    ? JSON.parse(localStorage.getItem('subscription')!).planType > 1
    : false,

  login: (user) => {
    localStorage.setItem('token', user.token)
    localStorage.setItem('user', JSON.stringify(user))
    set({ user, isAuthenticated: true })
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('subscription')
    set({ user: null, subscription: null, isAuthenticated: false, isPro: false })
  },

  setSubscription: (sub) => {
    localStorage.setItem('subscription', JSON.stringify(sub))
    set({ subscription: sub, isPro: sub.planType > 1 })
  },
}))