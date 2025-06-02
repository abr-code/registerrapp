import { useState, type FormEvent } from 'react';
import './LoginForm.css';

interface LoginFormProps {
    onSubmit: (email: string, password: string) => Promise<void>;
    onRegister?: (email: string, password: string) => Promise<void>;
    onError?: (message: string) => void;
}

export const LoginForm = ({ onSubmit, onRegister, onError }: LoginFormProps) => {    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({
        email: '',
        password: ''
    });

    const [isRegistering, setIsRegistering] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            setErrors(prev => ({ ...prev, email: 'El correo electrónico es requerido' }));
            return false;
        }
        if (!emailRegex.test(email)) {
            setErrors(prev => ({ ...prev, email: 'Por favor ingrese un correo electrónico válido' }));
            return false;
        }
        setErrors(prev => ({ ...prev, email: '' }));
        return true;
    };

    const validatePassword = (password: string): boolean => {
        if (!password) {
            setErrors(prev => ({ ...prev, password: 'La contraseña es requerida' }));
            return false;
        }
        if (password.length < 6) {
            setErrors(prev => ({ ...prev, password: 'La contraseña debe tener al menos 6 caracteres' }));
            return false;
        }
        setErrors(prev => ({ ...prev, password: '' }));
        return true;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        setErrors(prev => ({
            ...prev,
            [name]: ''
        }));
    };    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        const isEmailValid = validateEmail(formData.email);
        const isPasswordValid = validatePassword(formData.password);

        if (!isEmailValid || !isPasswordValid) {
            onError?.('Por favor corrija los errores antes de continuar');
            return;
        }

        try {
            setIsSubmitting(true);
            if (isRegistering && onRegister) {
                await onRegister(formData.email, formData.password);
            } else {
                await onSubmit(formData.email, formData.password);
            }
        } catch (error) {
            onError?.(error instanceof Error ? error.message : 
                isRegistering ? 'Error al registrar usuario' : 'Error al iniciar sesión');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2>Iniciar Sesión</h2>
                
                <div className="form-group">
                    <label htmlFor="email">Correo electrónico:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={errors.email ? 'error' : ''}
                        placeholder="ejemplo@correo.com"
                        disabled={isSubmitting}
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="password">Contraseña:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={errors.password ? 'error' : ''}
                        placeholder="••••••"
                        disabled={isSubmitting}
                    />
                    {errors.password && <span className="error-message">{errors.password}</span>}
                </div>            <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="login-button"
                >
                    {isSubmitting 
                        ? (isRegistering ? 'Registrando...' : 'Iniciando sesión...') 
                        : (isRegistering ? 'Registrarse' : 'Iniciar Sesión')}
                </button>

                <div className="form-footer">
                    <button 
                        type="button"
                        onClick={() => setIsRegistering(!isRegistering)}
                        className="toggle-auth-button"
                        disabled={isSubmitting}
                    >
                        {isRegistering 
                            ? '¿Ya tienes una cuenta? Inicia sesión' 
                            : '¿No tienes una cuenta? Regístrate'}
                    </button>
                </div>
            </form>
        </div>
    );
};
