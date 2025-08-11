import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState<RegisterForm>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string>('');
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>('');

  const validatePassword = (password: string): string => {
    if (password.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return 'La contraseña debe contener al menos una letra minúscula';
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'La contraseña debe contener al menos una letra mayúscula';
    }
    if (!/(?=.*\d)/.test(password)) {
      return 'La contraseña debe contener al menos un número';
    }
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validación en tiempo real
    if (name === 'password') {
      const error = validatePassword(value);
      setPasswordError(error);
      
      // Validar confirmación de contraseña si ya hay valor
      if (formData.confirmPassword) {
        setConfirmPasswordError(
          value !== formData.confirmPassword ? 'Las contraseñas no coinciden' : ''
        );
      }
    }

    if (name === 'confirmPassword') {
      setConfirmPasswordError(
        value !== formData.password ? 'Las contraseñas no coinciden' : ''
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validar contraseña antes de enviar
    const passwordValidationError = validatePassword(formData.password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setConfirmPasswordError('Las contraseñas no coinciden');
      return;
    }

    // Limpiar errores de validación
    setPasswordError('');
    setConfirmPasswordError('');

    setLoading(true);

    try {
      await register(formData.name, formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen admin-panel flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-2xl sm:text-3xl font-extrabold"
            style={{ color: 'var(--color-texto-principal)', fontFamily: 'var(--fuente-titulos)' }}>
          Crear una cuenta
        </h2>
      </div>

      <div className="mt-6 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card py-6 sm:py-8 px-4 sm:px-10">
          {error && (
            <div className="mb-4 bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}

          <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="label">
                Nombre completo
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="input"
                  placeholder="Tu nombre completo"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="label">
                Correo electrónico
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="input"
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="label">
                Contraseña
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`input ${
                    passwordError 
                      ? 'border-red-500 focus:border-red-500' 
                      : ''
                  }`}
                  placeholder="Tu contraseña"
                />
                {passwordError && (
                  <p className="mt-1 text-sm text-red-600">{passwordError}</p>
                )}
                {formData.password && !passwordError && (
                  <div className="mt-1">
                    <div className="flex space-x-1">
                      <div className={`h-1 flex-1 rounded ${
                        formData.password.length >= 6 ? 'bg-green-500' : 'bg-gray-300'
                      }`}></div>
                      <div className={`h-1 flex-1 rounded ${
                        /(?=.*[a-z])/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'
                      }`}></div>
                      <div className={`h-1 flex-1 rounded ${
                        /(?=.*[A-Z])/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'
                      }`}></div>
                      <div className={`h-1 flex-1 rounded ${
                        /(?=.*\d)/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'
                      }`}></div>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      La contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula y un número
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="label">
                Confirmar contraseña
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`input ${
                    confirmPasswordError 
                      ? 'border-red-500 focus:border-red-500' 
                      : ''
                  }`}
                  placeholder="Confirma tu contraseña"
                />
                {confirmPasswordError && (
                  <p className="mt-1 text-sm text-red-600">{confirmPasswordError}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full flex justify-center disabled:opacity-50"
              >
                {loading ? 'Registrando...' : 'Registrarse'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="relative flex justify-center text-sm">
                <span className="px-2 text-center" 
                      style={{ backgroundColor: 'var(--color-card-bg)', color: 'var(--color-texto-secundario)' }}>
                  ¿Ya tienes una cuenta?{' '}
                  <Link to="/login" 
                        className="font-medium"
                        style={{ color: 'var(--color-acento-dorado)' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-acento-dorado-hover)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-acento-dorado)'}>
                    Inicia sesión
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 