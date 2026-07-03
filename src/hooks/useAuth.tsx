import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { User } from '../types'

const ROLE_MAP: Record<string, User['role']> = { '1': 'Admin', '2': 'Seller', '3': 'Customer' }

function parseJwt(token: string): Partial<User> {
  try {
    const p = JSON.parse(atob(token.split('.')[1]))
    return {
      id: Number(p.sub ?? p.nameid),
      phoneNumber: p.phone ?? p.phone_number ?? p.unique_name ?? '',
      fullName: p.name ?? '',
      role: ROLE_MAP[String(p.role_id)] ?? p.role ?? 'Customer',
    }
  } catch { return {} }
}

interface AuthCtx {
  user: User | null
  login: (accessToken: string, refreshToken: string) => void
  logout: () => void
}

const Ctx = createContext<AuthCtx>(null!)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const t = localStorage.getItem('access_token')
    return t ? (parseJwt(t) as User) : null
  })

  const login = useCallback((accessToken: string, refreshToken: string) => {
    localStorage.setItem('access_token', accessToken)
    localStorage.setItem('refresh_token', refreshToken)
    setUser(parseJwt(accessToken) as User)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    setUser(null)
  }, [])

  return <Ctx.Provider value={{ user, login, logout }}>{children}</Ctx.Provider>
}

export const useAuth = () => useContext(Ctx)
