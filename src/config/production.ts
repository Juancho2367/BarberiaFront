// Configuración específica para producción en Vercel
export const productionConfig = {
  // URL base para producción
  baseUrl: 'https://barberia-front.vercel.app',
  
  // API URL para producción
  apiUrl: 'https://barberia-back.vercel.app/api',
  
  // Configuración de caché
  cacheConfig: {
    maxAge: 31536000, // 1 año
    immutable: true,
  },
  
  // Configuración de seguridad
  security: {
    csp: {
      'default-src': ["'self'"],
      'script-src': ["'self'", "'unsafe-inline'"],
      'style-src': ["'self'", "'unsafe-inline'"],
      'img-src': ["'self'", "data:", "https:"],
      'connect-src': ["'self'", "https://barberia-back.vercel.app"],
    },
  },
  
  // Configuración de analytics (si se implementa en el futuro)
  analytics: {
    enabled: false,
    trackingId: '',
  },
};

export default productionConfig; 