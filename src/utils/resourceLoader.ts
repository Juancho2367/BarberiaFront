// Utilidad para validar recursos críticos
export const validateCriticalResources = async (): Promise<boolean> => {
  const criticalResources = [
    '/manifest.json',
    '/favicon.ico',
    '/static/js/main.js',
    '/static/css/main.css'
  ];

  try {
    const checks = await Promise.allSettled(
      criticalResources.map(async (resource) => {
        const response = await fetch(resource, { method: 'HEAD' });
        if (!response.ok) {
          throw new Error(`Failed to load ${resource}: ${response.status}`);
        }
        return true;
      })
    );

    const failures = checks.filter(
      (check) => check.status === 'rejected'
    );

    if (failures.length > 0) {
      console.error('Critical resource loading failures:', failures);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error validating critical resources:', error);
    return false;
  }
};

// Función para verificar si la aplicación está en un estado válido
export const validateAppState = (): boolean => {
  try {
    // Verificar que las variables de entorno críticas estén disponibles
    const requiredEnvVars = [
      'REACT_APP_API_URL'
    ];

    const missingVars = requiredEnvVars.filter(
      (varName) => !process.env[varName]
    );

    if (missingVars.length > 0) {
      console.error('Missing environment variables:', missingVars);
      return false;
    }

    // Verificar que el DOM esté listo
    if (!document.getElementById('root')) {
      console.error('Root element not found');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error validating app state:', error);
    return false;
  }
}; 