import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-gray-800">Barbería</span>
            </Link>
          </div>

          <div className="flex items-center">
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 px-3 py-2">
                  Dashboard
                </Link>
                <Link to="/profile" className="text-gray-600 hover:text-gray-900 px-3 py-2">
                  Perfil
                </Link>
                <button
                  onClick={handleLogout}
                  className="ml-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-gray-900 px-3 py-2">
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="ml-4 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 