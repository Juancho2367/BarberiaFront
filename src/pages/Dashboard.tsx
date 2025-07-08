import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';

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
      await api.delete(`/appointments/${appointmentId}`);
      setAppointments(appointments.filter(apt => apt._id !== appointmentId));
    } catch (err) {
      setError('Error al cancelar la cita');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900">Cargando...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Bienvenido, {user?.name}
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Aquí puedes gestionar tus citas
          </p>
        </div>

        {error && (
          <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="mt-12">
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Seleccionar Fecha</h3>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {appointments.length === 0 ? (
                <li className="px-6 py-4 text-center text-gray-500">
                  No tienes citas programadas
                </li>
              ) : (
                appointments.map((appointment) => (
                  <li key={appointment._id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(appointment.date).toLocaleDateString()} - {appointment.time}
                        </p>
                        <p className="text-sm text-gray-500">{appointment.service}</p>
                        <p className="text-sm text-gray-500">
                          Estado: {appointment.status}
                        </p>
                      </div>
                      {appointment.status === 'pending' && (
                        <button
                          onClick={() => handleCancelAppointment(appointment._id)}
                          className="ml-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                        >
                          Cancelar
                        </button>
                      )}
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 