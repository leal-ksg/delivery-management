import { User } from "@/src/domains/user/types";
import { createContext, ReactNode, useContext, useState } from "react";

interface AuthContextData {
  login: (email: string, password: string) => Promise<Omit<User, "password"> | null>;
  logout: () => void
  user: User | null
  isAuthenticated: boolean
}

interface AuthProviderProps {
    children: ReactNode
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

const AuthProvider = ({children}: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null)

    function login(email: string, password: string): void {
        
    }

    function logout(): void {

    }

    return <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)

  if(!context) throw new Error("useAuth must be used within a AuthProvider")

  return context
}