import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="admin-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex">
            <Link to="/" className="flex items-center" onClick={closeMenu}>
              <span className="text-lg sm:text-xl font-bold" 
                    style={{ color: 'var(--color-acento-dorado)', fontFamily: 'var(--fuente-titulos)' }}>
                Barbería
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center nav-links">
            {user ? (
              <>
                <Link to="/dashboard" 
                      className="text-gray-600 hover:text-gray-900 px-3 py-2"
                      style={{ color: 'var(--color-texto-secundario)' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-texto-principal)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-texto-secundario)'}>
                  Dashboard
                </Link>
                {user.role === 'admin' && (
                  <Link to="/user-management" 
                        className="text-gray-600 hover:text-gray-900 px-3 py-2"
                        style={{ color: 'var(--color-texto-secundario)' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-texto-principal)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-texto-secundario)'}>
                    Gestión Usuarios
                  </Link>
                )}
                <Link to="/profile" 
                      className="text-gray-600 hover:text-gray-900 px-3 py-2"
                      style={{ color: 'var(--color-texto-secundario)' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-texto-principal)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-texto-secundario)'}>
                  Perfil
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn-danger ml-4"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link to="/login" 
                      className="text-gray-600 hover:text-gray-900 px-3 py-2"
                      style={{ color: 'var(--color-texto-secundario)' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-texto-principal)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-texto-secundario)'}>
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary ml-4"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-300 hover:text-white p-2"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-800 border-t border-gray-600 mt-4 rounded-b-lg">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md"
                    onClick={closeMenu}
                  >
                    Dashboard
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      to="/user-management"
                      className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md"
                      onClick={closeMenu}
                    >
                      Gestión Usuarios
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md"
                    onClick={closeMenu}
                  >
                    Perfil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-red-400 hover:text-red-300 hover:bg-gray-700 rounded-md"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md"
                    onClick={closeMenu}
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md"
                    onClick={closeMenu}
                  >
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 