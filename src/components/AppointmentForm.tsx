import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
}

interface Barber {
  id: string;
  name: string;
}

interface AppointmentFormProps {
  selectedDate: Date;
  onSuccess: () => void;
}

export default function AppointmentForm({ selectedDate, onSuccess }: AppointmentFormProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedBarber, setSelectedBarber] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<Date[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchServices();
    fetchBarbers();
  }, []);

  useEffect(() => {
    if (selectedBarber && selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedBarber, selectedDate]);

  const fetchServices = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/services');
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const fetchBarbers = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/barbers');
      setBarbers(response.data);
    } catch (error) {
      console.error('Error fetching barbers:', error);
    }
  };

  const fetchAvailableSlots = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/appointments/available-slots', {
        params: {
          barberId: selectedBarber,
          date: selectedDate.toISOString()
        }
      });
      setAvailableSlots(response.data);
    } catch (error) {
      console.error('Error fetching available slots:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !selectedBarber || !selectedSlot) {
      setError('Por favor complete todos los campos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await axios.post('http://localhost:4000/api/appointments', {
        service: selectedService,
        barberId: selectedBarber,
        date: selectedSlot,
        duration: services.find(s => s.id === selectedService)?.duration || 30
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      onSuccess();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al agendar la cita');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-lg shadow-lg">
      <div>
        <label className="block text-sm font-medium text-gray-700">Servicio</label>
        <select
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Seleccione un servicio</option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name} - ${service.price} ({service.duration} min)
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Barbero</label>
        <select
          value={selectedBarber}
          onChange={(e) => setSelectedBarber(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Seleccione un barbero</option>
          {barbers.map((barber) => (
            <option key={barber.id} value={barber.id}>
              {barber.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Horario Disponible</label>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {availableSlots.map((slot) => (
            <button
              key={slot.toISOString()}
              type="button"
              onClick={() => setSelectedSlot(slot)}
              className={`p-2 text-sm rounded-md ${
                selectedSlot?.getTime() === slot.getTime()
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {format(slot, 'HH:mm')}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {loading ? 'Agendando...' : 'Agendar Cita'}
      </button>
    </form>
  );
} 