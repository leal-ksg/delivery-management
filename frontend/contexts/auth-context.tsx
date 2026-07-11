import { getCurrentUser } from "@/src/domains/user/services/get-current-user";
import { loginRequest } from "@/src/domains/user/services/login-request";
import { UserDTO } from "@/src/domains/user/types";
import { useRouter } from "next/navigation";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextData {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  user: UserDTO | null;
  isAuthenticated: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserDTO | null>(null);
  const isAuthenticated = !!user;

  const router = useRouter();

  async function login(email: string, password: string): Promise<void> {
    const response = await loginRequest(email, password);

    if (!response.ok) return;

    const currentUser = response.body;
    setUser(currentUser);

    router.push("/orders");
  }

  function logout(): void {
    setUser(null);
  }

  useEffect(() => {
    async function loadUser() {
      const response = await getCurrentUser();

      if (!response.ok) {
        router.push("/login");
        return;
      }

      setUser(response.body);
    }

    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) throw new Error("useAuth must be used within a AuthProvider");

  return context;
};
