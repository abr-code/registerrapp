interface LoginCredentials {
    email: string;
    password: string;
}

interface AuthResponse {
    success: boolean;
    message?: string;
}

// In a real application, this would be replaced with actual API calls
// and proper authentication mechanisms
class AuthService {
    private readonly MOCK_EMAIL = 'admin@example.com';
    private readonly MOCK_PASSWORD = 'admin123';

    async login({ email, password }: LoginCredentials): Promise<AuthResponse> {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));

        if (email === this.MOCK_EMAIL && password === this.MOCK_PASSWORD) {
            return {
                success: true
            };
        }

        return {
            success: false,
            message: 'Credenciales inválidas'
        };
    }

    async checkAuthStatus(): Promise<boolean> {
        const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        const userEmail = localStorage.getItem('userEmail');
        
        return isAuthenticated && userEmail === this.MOCK_EMAIL;
    }

    logout(): void {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userEmail');
    }
}

export const authService = new AuthService();