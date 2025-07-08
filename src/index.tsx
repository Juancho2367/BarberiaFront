import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import App from './App';
import './index.css';
import { validateAppState, validateCriticalResources } from './utils/resourceLoader';

const initializeApp = async () => {
  try {
    // Validar estado de la aplicación
    if (!validateAppState()) {
      throw new Error('App state validation failed');
    }

    // Validar recursos críticos en producción
    if (process.env.NODE_ENV === 'production') {
      const resourcesValid = await validateCriticalResources();
      if (!resourcesValid) {
        console.warn('Some critical resources failed to load');
      }
    }

    const root = ReactDOM.createRoot(
      document.getElementById('root') as HTMLElement
    );

    root.render(
      <React.StrictMode>
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Failed to initialize app:', error);
    document.body.innerHTML = `
      <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: Arial, sans-serif;">
        <div style="text-align: center;">
          <h1>Error al cargar la aplicación</h1>
          <p>Por favor, recarga la página o contacta al administrador.</p>
          <button onclick="window.location.reload()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">
            Recargar página
          </button>
        </div>
      </div>
    `;
  }
};

initializeApp(); 