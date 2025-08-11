// Configuración de entorno para desarrollo local
export const ENV_CONFIG = {
  development: {
    API_URL: 'http://localhost:4000/api',
    NODE_ENV: 'development'
  },
  production: {
    API_URL: 'https://barberia-back.vercel.app/api',
    NODE_ENV: 'production'
  }
};

// Detectar entorno actual
export const getCurrentEnv = () => {
  return process.env.NODE_ENV === 'production' ? 'production' : 'development';
};

// Obtener configuración actual
export const getConfig = () => {
  const env = getCurrentEnv();
  return ENV_CONFIG[env];
};

export default getConfig();