import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';
import WeeklyCalendar from '../components/WeeklyCalendar';
import AdminCalendar from '../components/AdminCalendar';

interface Appointment {
  _id: string;
  date: string;
  time: string;
  service: string;
  barber: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedBarber, setSelectedBarber] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00',
    '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const services = [
    { id: '1', name: 'Corte de Cabello', duration: 30, price: 20 },
    { id: '2', name: 'Barba', duration: 20, price: 15 },
    { id: '3', name: 'Corte + Barba', duration: 45, price: 30 },
  ];

  const barbers = [
    { id: '1', name: 'Juan Pérez' },
    { id: '2', name: 'María García' },
    { id: '3', name: 'Carlos López' },
  ];

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await api.get('/appointments');
        setAppointments(response.data);
      } catch (err) {
        setError('Error al cargar las citas');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
    // Aquí cargarías las citas para la fecha seleccionada
    fetchAppointmentsForDate(new Date(newDate));
  };

  const fetchAppointmentsForDate = async (selectedDate: Date) => {
    try {
              const response = await api.get('/appointments', {
        params: {
          date: format(selectedDate, 'yyyy-MM-dd'),
        },
      });
      setAppointments(response.data);
    } catch (error) {
      console.error('Error al cargar las citas:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
              const response = await api.post('/appointments', {
        date: selectedDate,
        time: selectedTime,
        service: selectedService,
        barber: selectedBarber,
      });
      setAppointments([...appointments, response.data]);
      // Limpiar el formulario
      setSelectedTime('');
      setSelectedService('');
      setSelectedBarber('');
    } catch (error) {
      console.error('Error al crear la cita:', error);
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      await api.delete(`/api/appointments/${appointmentId}`);
      setAppointments(appointments.filter(apt => apt._id !== appointmentId));
    } catch (err) {
      setError('Error al cancelar la cita');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen admin-panel py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-semibold" style={{ color: 'var(--color-texto-principal)' }}>
              Cargando...
            </h2>
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
            Bienvenido, {user?.name}
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-lg sm:text-xl px-4" 
             style={{ color: 'var(--color-texto-secundario)', fontFamily: 'var(--fuente-cuerpo)' }}>
            Aquí puedes gestionar tus citas
          </p>
        </div>

        {error && (
          <div className="mt-4 mx-4 sm:mx-0 bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="mt-8 sm:mt-12 px-4 sm:px-0">
          {/* Calendario según el rol del usuario */}
          {user?.role === 'admin' ? (
            <AdminCalendar />
          ) : (
            <WeeklyCalendar />
          )}

          {/* Lista de Citas (solo para usuarios no-admin) */}
          {user?.role !== 'admin' && (
            <div className="mt-8">
              <div className="card">
                <h3 className="card-title text-lg sm:text-xl">Tus Citas Programadas</h3>
                <div className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                  {appointments.length === 0 ? (
                    <div className="no-appointments-card px-4 sm:px-6 py-4 text-center">
                      <p className="text-sm sm:text-base">No tienes citas programadas</p>
                    </div>
                  ) : (
                    appointments.map((appointment) => (
                      <div key={appointment._id} className="px-4 sm:px-6 py-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                          <div className="flex-1">
                            <p className="text-sm font-medium" style={{ color: 'var(--color-texto-principal)' }}>
                              {new Date(appointment.date).toLocaleDateString()} - {appointment.time}
                            </p>
                            <p className="text-sm" style={{ color: 'var(--color-texto-secundario)' }}>
                              {appointment.service}
                            </p>
                            <p className="text-sm" style={{ color: 'var(--color-texto-secundario)' }}>
                              Estado: {appointment.status}
                            </p>
                          </div>
                          {appointment.status === 'pending' && (
                            <button
                              onClick={() => handleCancelAppointment(appointment._id)}
                              className="btn-danger w-full sm:w-auto sm:ml-4"
                            >
                              Cancelar
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 