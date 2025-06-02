import { 
    signInWithEmailAndPassword,
    signOut,
    createUserWithEmailAndPassword,
    onAuthStateChanged
} from 'firebase/auth';
import type { UserCredential, User } from 'firebase/auth';
import { auth } from '../config/firebase';

interface LoginCredentials {
    email: string;
    password: string;
}

class AuthService {
    async login({ email, password }: LoginCredentials): Promise<UserCredential> {
        try {
            return await signInWithEmailAndPassword(auth, email, password);
        } catch (error: any) {
            throw new Error(this.getErrorMessage(error.code));
        }
    }

    async register({ email, password }: LoginCredentials): Promise<UserCredential> {
        try {
            return await createUserWithEmailAndPassword(auth, email, password);
        } catch (error: any) {
            throw new Error(this.getErrorMessage(error.code));
        }
    }

    onAuthStateChange(callback: (user: User | null) => void): () => void {
        return onAuthStateChanged(auth, callback);
    }

    async logout(): Promise<void> {
        try {
            await signOut(auth);
        } catch (error: any) {
            throw new Error(this.getErrorMessage(error.code));
        }
    }

    private getErrorMessage(errorCode: string): string {
        switch (errorCode) {
            case 'auth/invalid-email':
                return 'El correo electrónico no es válido';
            case 'auth/user-disabled':
                return 'Esta cuenta ha sido deshabilitada';
            case 'auth/user-not-found':
                return 'No existe una cuenta con este correo electrónico';
            case 'auth/wrong-password':
                return 'Contraseña incorrecta';
            case 'auth/email-already-in-use':
                return 'Este correo electrónico ya está registrado';
            case 'auth/weak-password':
                return 'La contraseña debe tener al menos 6 caracteres';
            default:
                return 'Ocurrió un error durante la autenticación';
        }
    }
}

export const authService = new AuthService();