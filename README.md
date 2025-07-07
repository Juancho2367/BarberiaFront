# Barbería - Cliente

Este es el cliente web para el sistema de gestión de citas de barbería.

## Tecnologías utilizadas

- React
- TypeScript
- Tailwind CSS
- React Router
- Axios
- ESLint
- Prettier

## Requisitos previos

- Node.js >= 14.x
- npm >= 6.x

## Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/barberia.git
cd barberia/client
```

2. Instala las dependencias:
```bash
npm install
```

3. Copia el archivo de variables de entorno:
```bash
cp .env.example .env
```

4. Configura las variables de entorno en el archivo `.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_NAME=Barbería
REACT_APP_DESCRIPTION=Sistema de gestión de citas para barbería
```

## Desarrollo

Para iniciar el servidor de desarrollo:

```bash
npm start
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

## Comandos disponibles

- `npm start` - Inicia el servidor de desarrollo
- `npm run build` - Crea una versión optimizada para producción
- `npm test` - Ejecuta las pruebas
- `npm run lint` - Ejecuta el linter
- `npm run lint:fix` - Corrige automáticamente los errores del linter
- `npm run format` - Formatea el código con Prettier

## Estructura del proyecto

```
src/
  ├── components/     # Componentes reutilizables
  ├── pages/         # Páginas de la aplicación
  ├── context/       # Contextos de React
  ├── config/        # Configuración de la aplicación
  ├── types/         # Tipos de TypeScript
  ├── hooks/         # Custom hooks
  ├── services/      # Servicios de API
  ├── utils/         # Funciones utilitarias
  └── styles/        # Estilos globales
```

## Convenciones de código

- Utilizamos TypeScript para el tipado estático
- Seguimos las reglas de ESLint y Prettier
- Utilizamos componentes funcionales con hooks
- Implementamos el patrón de diseño de componentes presentacionales y contenedores
- Seguimos las mejores prácticas de React y TypeScript

## Contribución

1. Crea un fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Haz commit de tus cambios (`git commit -m 'Add some amazing feature'`)
4. Haz push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles. 