import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Appointment {
  _id: string;
  service: string;
  date: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  client: {
    name: string;
    email: string;
  };
  barber: {
    name: string;
    email: string;
  };
  notes?: string;
}

interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/users/profile');
        setProfile(response.data);
      } catch (err) {
        setError('Error al cargar el perfil');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
              const response = await api.get('/appointments/my-appointments');
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('Error al cargar las citas');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
              await api.put('/users/profile', profile);
      setSuccess('Perfil actualizado correctamente');
    } catch (err) {
      setError('Error al actualizar el perfil');
      console.error(err);
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      await api.delete(`/appointments/${appointmentId}`);
      fetchAppointments();
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      setError('Error al cancelar la cita');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen admin-panel py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-semibold" style={{ color: 'var(--color-texto-principal)' }}>Cargando...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen admin-panel">
      <div className="dashboard-content">
        <div className="text-center px-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl" style={{ fontFamily: 'var(--fuente-titulos)', color: 'var(--color-texto-principal)' }}>
            Mi Perfil
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-lg sm:text-xl px-4" 
             style={{ color: 'var(--color-texto-secundario)', fontFamily: 'var(--fuente-cuerpo)' }}>
            Actualiza tu información personal
          </p>
        </div>

        {error && (
          <div className="mt-4 mx-4 sm:mx-0 bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 mx-4 sm:mx-0 bg-green-900 border border-green-700 text-green-100 px-4 py-3 rounded">
            {success}
          </div>
        )}

        <div className="mt-8 sm:mt-12 px-4 sm:px-0">
          <div className="card">
            <div className="px-4 py-5 sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div>
                  <label htmlFor="name" className="label">
                    Nombre completo
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={profile.name}
                      onChange={handleChange}
                      required
                      className="input"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="label">
                    Correo electrónico
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={profile.email}
                      onChange={handleChange}
                      required
                      className="input"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="label">
                    Teléfono
                  </label>
                  <div className="mt-1">
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      value={profile.phone}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="address" className="label">
                    Dirección
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="address"
                      id="address"
                      value={profile.address}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="btn btn-primary w-full flex justify-center"
                  >
                    Actualizar Perfil
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="card mt-6 mx-4 sm:mx-0">
          <h2 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: 'var(--color-texto-principal)', fontFamily: 'var(--fuente-titulos)' }}>Perfil de Usuario</h2>
          {user && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium" style={{ color: 'var(--color-texto-secundario)' }}>Nombre</h3>
                <p className="mt-1" style={{ color: 'var(--color-texto-principal)' }}>{user.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium" style={{ color: 'var(--color-texto-secundario)' }}>Email</h3>
                <p className="mt-1" style={{ color: 'var(--color-texto-principal)' }}>{user.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium" style={{ color: 'var(--color-texto-secundario)' }}>Rol</h3>
                <p className="mt-1 capitalize" style={{ color: 'var(--color-texto-principal)' }}>{user.role}</p>
              </div>
            </div>
          )}
        </div>

        {/* Appointments Section */}
        <div className="card mx-4 sm:mx-0">
          <h2 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: 'var(--color-texto-principal)', fontFamily: 'var(--fuente-titulos)' }}>Mis Citas</h2>
          {error && (
            <div className="bg-red-900 border-l-4 border-red-700 p-4 mb-4">
              <p style={{ color: 'var(--color-texto-principal)' }}>{error}</p>
            </div>
          )}
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment._id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-3 sm:space-y-0">
                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-medium" style={{ color: 'var(--color-texto-principal)' }}>
                      {appointment.service}
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--color-texto-secundario)' }}>
                      {format(new Date(appointment.date), "PPP 'a las' HH:mm", { locale: es })}
                    </p>
                    <p className="text-sm" style={{ color: 'var(--color-texto-secundario)' }}>
                      Duración: {appointment.duration} minutos
                    </p>
                    <p className="text-sm" style={{ color: 'var(--color-texto-secundario)' }}>
                      {user?.role === 'client' ? 'Barbero' : 'Cliente'}:{' '}
                      {user?.role === 'client'
                        ? appointment.barber.name
                        : appointment.client.name}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full text-center ${
                        appointment.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : appointment.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : appointment.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {appointment.status === 'confirmed' && 'Confirmada'}
                      {appointment.status === 'pending' && 'Pendiente'}
                      {appointment.status === 'cancelled' && 'Cancelada'}
                      {appointment.status === 'completed' && 'Completada'}
                    </span>
                    {appointment.status === 'pending' && (
                      <button
                        onClick={() => handleCancelAppointment(appointment._id)}
                        className="btn-danger text-sm w-full sm:w-auto"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {appointments.length === 0 && (
              <p className="text-center py-4" style={{ color: 'var(--color-texto-secundario)' }}>
                No tienes citas programadas
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 