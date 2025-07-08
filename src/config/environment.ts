import productionConfig from './production';

// Configuración de entorno
export const config = {
  // API Configuration
  apiUrl: process.env.REACT_APP_API_URL || productionConfig.apiUrl,
  
  // Environment
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  
  // App Configuration
  appName: 'Barbería - Sistema de Citas',
  appVersion: '1.0.0',
  
  // Production specific config
  ...(process.env.NODE_ENV === 'production' && productionConfig)
};

// Validación de configuración
if (!config.apiUrl) {
  console.warn('REACT_APP_API_URL no está configurada, usando URL por defecto');
}

export default config; 