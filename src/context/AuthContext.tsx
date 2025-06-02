import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authService } from '../services/authService';

interface AuthContextType {
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    user: { email: string } | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<{ email: string } | null>(null);

    useEffect(() => {
        // Check authentication status when component mounts
        const checkAuth = async () => {
            const isValid = await authService.checkAuthStatus();
            if (isValid) {
                const userEmail = localStorage.getItem('userEmail');
                setIsAuthenticated(true);
                setUser({ email: userEmail! });
            }
        };
        checkAuth();
    }, []);

    const login = async (email: string, password: string) => {
        const response = await authService.login({ email, password });
        if (response.success) {
            setIsAuthenticated(true);
            setUser({ email });
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userEmail', email);
        } else {
            throw new Error(response.message || 'Error al iniciar sesión');
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userEmail');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
            {children}
        </AuthContext.Provider>
    );
};
