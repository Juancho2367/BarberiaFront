import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-fondo-oscuro)' }}>
      {/* Hero Section */}
      <div className="welcome-section">
        <div className="max-w-4xl mx-auto">
          <main className="px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl" style={{ fontFamily: 'var(--fuente-titulos)' }}>
                <span className="block xl:inline">Bienvenido a</span>{' '}
                <span className="block xl:inline" style={{ color: 'var(--color-acento-dorado)' }}>Barbería</span>
              </h1>
              <p className="mt-3 text-sm sm:text-base sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl px-4" 
                 style={{ color: 'var(--color-texto-secundario)', fontFamily: 'var(--fuente-cuerpo)' }}>
                Tu destino para un corte de cabello y afeitado profesional. Reserva tu cita hoy y experimenta la mejor atención.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center space-y-3 sm:space-y-0">
                {user ? (
                  <div className="rounded-md shadow w-full sm:w-auto">
                    <Link
                      to="/dashboard"
                      className="btn btn-primary w-full flex items-center justify-center py-3 sm:py-4 text-base sm:text-lg px-6 sm:px-10"
                    >
                      Ir al Dashboard
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="rounded-md shadow w-full sm:w-auto">
                      <Link
                        to="/login"
                        className="btn btn-primary w-full flex items-center justify-center py-3 sm:py-4 text-base sm:text-lg px-6 sm:px-10"
                      >
                        Iniciar Sesión
                      </Link>
                    </div>
                    <div className="w-full sm:w-auto">
                      <Link
                        to="/register"
                        className="btn btn-secondary w-full flex items-center justify-center py-3 sm:py-4 text-base sm:text-lg px-6 sm:px-10"
                      >
                        Registrarse
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-8 sm:py-12" style={{ backgroundColor: 'var(--color-card-bg)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-sm sm:text-base font-semibold tracking-wide uppercase" 
                style={{ color: 'var(--color-acento-dorado)', fontFamily: 'var(--fuente-titulos)' }}>
              Servicios
            </h2>
            <p className="mt-2 text-2xl sm:text-3xl leading-8 font-extrabold tracking-tight sm:text-4xl"
               style={{ color: 'var(--color-texto-principal)', fontFamily: 'var(--fuente-titulos)' }}>
              Nuestros Servicios
            </p>
            <p className="mt-4 max-w-2xl text-lg sm:text-xl lg:mx-auto px-4"
               style={{ color: 'var(--color-texto-secundario)', fontFamily: 'var(--fuente-cuerpo)' }}>
              Ofrecemos una amplia gama de servicios para cuidar tu apariencia.
            </p>
          </div>

          <div className="mt-8 sm:mt-10">
            <div className="space-y-8 sm:space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {/* Corte de Cabello */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-md text-black"
                     style={{ backgroundColor: 'var(--color-acento-dorado)' }}>
                  <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </div>
                <div className="ml-12 sm:ml-16">
                  <h3 className="text-base sm:text-lg leading-6 font-medium" style={{ color: 'var(--color-texto-principal)' }}>
                    Corte de Cabello
                  </h3>
                  <p className="mt-2 text-sm sm:text-base" style={{ color: 'var(--color-texto-secundario)' }}>
                    Cortes modernos y clásicos adaptados a tu estilo personal.
                  </p>
                </div>
              </div>

              {/* Afeitado */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-md text-black"
                     style={{ backgroundColor: 'var(--color-acento-dorado)' }}>
                  <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <div className="ml-12 sm:ml-16">
                  <h3 className="text-base sm:text-lg leading-6 font-medium" style={{ color: 'var(--color-texto-principal)' }}>
                    Afeitado
                  </h3>
                  <p className="mt-2 text-sm sm:text-base" style={{ color: 'var(--color-texto-secundario)' }}>
                    Afeitado tradicional con toallas calientes y productos premium.
                  </p>
                </div>
              </div>

              {/* Tratamientos */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-md text-black"
                     style={{ backgroundColor: 'var(--color-acento-dorado)' }}>
                  <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div className="ml-12 sm:ml-16">
                  <h3 className="text-base sm:text-lg leading-6 font-medium" style={{ color: 'var(--color-texto-principal)' }}>
                    Tratamientos
                  </h3>
                  <p className="mt-2 text-sm sm:text-base" style={{ color: 'var(--color-texto-secundario)' }}>
                    Tratamientos capilares y faciales para el cuidado de tu piel.
                  </p>
                </div>
              </div>

              {/* Coloración */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-md text-black"
                     style={{ backgroundColor: 'var(--color-acento-dorado)' }}>
                  <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <div className="ml-12 sm:ml-16">
                  <h3 className="text-base sm:text-lg leading-6 font-medium" style={{ color: 'var(--color-texto-principal)' }}>
                    Coloración
                  </h3>
                  <p className="mt-2 text-sm sm:text-base" style={{ color: 'var(--color-texto-secundario)' }}>
                    Servicios de coloración profesional para un look renovado.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div style={{ backgroundColor: 'var(--color-acento-dorado)' }}>
        <div className="max-w-2xl mx-auto text-center py-12 sm:py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold sm:text-4xl"
              style={{ color: 'var(--color-fondo-oscuro)', fontFamily: 'var(--fuente-titulos)' }}>
            <span className="block">¿Listo para tu próxima cita?</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg leading-6 px-4"
             style={{ color: 'var(--color-fondo-oscuro)', fontFamily: 'var(--fuente-cuerpo)' }}>
            Reserva tu cita ahora y experimenta la mejor atención en barbería.
          </p>
          <Link
            to={user ? '/dashboard' : '/register'}
            className="mt-6 sm:mt-8 w-full inline-flex items-center justify-center px-5 py-3 border-2 text-base font-medium rounded-md sm:w-auto transition-all duration-300"
            style={{ 
              backgroundColor: 'var(--color-fondo-oscuro)', 
              color: 'var(--color-acento-dorado)',
              borderColor: 'var(--color-fondo-oscuro)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--color-fondo-oscuro)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-fondo-oscuro)';
              e.currentTarget.style.color = 'var(--color-acento-dorado)';
            }}
          >
            {user ? 'Ir al Dashboard' : 'Registrarse'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home; 