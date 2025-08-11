import React from 'react';
import { Dialog } from '@headlessui/react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import api from '../config/api';
import { AppointmentModalProps } from '../types';



interface AppointmentForm {
  time: string;
  service: string;
  barber: string;
  notes?: string;
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  onAppointmentCreated,
}) => {
  const [formData, setFormData] = React.useState<AppointmentForm>({
    time: '',
    service: '',
    barber: '',
    notes: '',
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

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

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
              await api.post('/appointments', {
        date: format(selectedDate, 'yyyy-MM-dd'),
        ...formData,
      });
      onAppointmentCreated();
      onClose();
    } catch (err) {
      setError('Error al crear la cita. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-10 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen">
        <div className="fixed inset-0 bg-black opacity-30" />

        <div className="relative card rounded-lg max-w-md w-full mx-4 p-6">
          <Dialog.Title className="text-lg font-medium mb-4" style={{ color: 'var(--color-texto-principal)', fontFamily: 'var(--fuente-titulos)' }}>
            Nueva Cita - {format(selectedDate, "PPP", { locale: es })}
          </Dialog.Title>

          {error && (
            <div className="mb-4 bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="time" className="label">
                Hora
              </label>
              <select
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="input mt-1"
              >
                <option value="">Seleccione una hora</option>
                {timeSlots.map(time => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="service" className="label">
                Servicio
              </label>
              <select
                id="service"
                name="service"
                value={formData.service}
                onChange={handleChange}
                required
                className="input mt-1"
              >
                <option value="">Seleccione un servicio</option>
                {services.map(service => (
                  <option key={service.id} value={service.id}>
                    {service.name} - ${service.price} ({service.duration} min)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="barber" className="label">
                Barbero
              </label>
              <select
                id="barber"
                name="barber"
                value={formData.barber}
                onChange={handleChange}
                required
                className="input mt-1"
              >
                <option value="">Seleccione un barbero</option>
                {barbers.map(barber => (
                  <option key={barber.id} value={barber.id}>
                    {barber.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="notes" className="label">
                Notas (opcional)
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="input mt-1"
                style={{ resize: 'vertical' }}
              />
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary disabled:opacity-50"
              >
                {loading ? 'Creando...' : 'Crear Cita'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
};

export default AppointmentModal; 