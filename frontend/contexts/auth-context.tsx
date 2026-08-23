import { toast } from "@/components/ui/sonner";
import api from "@/lib/api";
import { getCurrentUserAction, loginAction } from "@/src/actions/auth";
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
  const [loading, setLoading] = useState(true);
  const isAuthenticated = !!user;

  const router = useRouter();

  async function login(email: string, password: string): Promise<void> {
    const response = await loginAction(email, password);

    if (!response.ok || !response.user) {
      toast("error", response.error);
      return;
    }

    setUser(response.user);
    api.defaults.headers.common["Authorization"] = `Bearer ${response.token}`;

    router.push("/orders");
  }

  function logout(): void {
    setUser(null);
    api.defaults.headers.common["Authorization"] = ""
    router.push("/login");
  }

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await getCurrentUserAction();

        if (!response.ok) {
          router.push("/login");
          return;
        }

        setUser(response.body);
        api.defaults.headers.common["Authorization"] = `Bearer ${response.token}`;
      } catch {
        router.push("/login");
      } finally {
        setLoading(false)
      }
    }

    loadUser();
  }, []);

  if (loading) return null

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