import { createContext, useContext, useState } from 'react'
import api from '../api/axiosConfig'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user')
    return savedUser ? JSON.parse(savedUser) : null
  })

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    const { token, email: userEmail, fullName } = response.data

    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify({ email: userEmail, fullName }))
    setUser({ email: userEmail, fullName })
  }

  const register = async (email, password, fullName) => {
    const response = await api.post('/auth/register', { email, password, fullName })
    const { token, email: userEmail, fullName: userFullName } = response.data

    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify({ email: userEmail, fullName: userFullName }))
    setUser({ email: userEmail, fullName: userFullName })
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}