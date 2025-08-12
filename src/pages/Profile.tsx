import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { User, Mail, Phone, MapPin, Edit3, Save, X, Calendar, Clock, Scissors, Check, Star } from 'lucide-react';
import './Profile.css';

interface Appointment {
  _id: string;
  date: string;
  time: string;
  service: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  client?: {
    name: string;
    email: string;
  };
  barber?: {
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
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [editData, setEditData] = useState<UserProfile>({
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
        setEditData(response.data);
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

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');

    try {
      await api.put('/users/profile', editData);
      setProfile({ ...editData });
      setSuccess('Perfil actualizado correctamente');
      setIsEditing(false);
      
      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Error al actualizar el perfil');
      console.error(err);
    }
  };

  const handleCancel = () => {
    setEditData({ ...profile });
    setIsEditing(false);
    setError('');
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      await api.delete(`/appointments/${appointmentId}`);
      fetchAppointments();
      setSuccess('Cita cancelada correctamente');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      setError('Error al cancelar la cita');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'var(--color-acento-dorado)';
      case 'completed': return '#4CAF50';
      case 'cancelled': return '#F44336';
      case 'pending': return '#FF9800';
      default: return 'var(--color-texto-secundario)';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmada';
      case 'completed': return 'Completada';
      case 'cancelled': return 'Cancelada';
      case 'pending': return 'Pendiente';
      default: return 'Pendiente';
    }
  };

  // Calcular estadísticas
  const totalAppointments = appointments.length;
  const upcomingAppointments = appointments.filter(apt => 
    apt.status === 'confirmed' || apt.status === 'pending'
  ).length;
  const completedAppointments = appointments.filter(apt => 
    apt.status === 'completed'
  ).length;

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Messages */}
      {error && (
        <div className={`message error`}>
          {error}
        </div>
      )}

      {success && (
        <div className={`message success`}>
          {success}
        </div>
      )}

      <div className="profile-layout">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="avatar-section">
            <div className="avatar">
              <User size={48} color="var(--color-fondo-oscuro)" />
            </div>
            <h1 className="user-name">{profile.name || 'Usuario'}</h1>
            <span className="user-role">{user?.role || 'Cliente'}</span>
          </div>

          <div className="profile-stats">
            <div className="stat-item">
              <div className="stat-number">{totalAppointments}</div>
              <div className="stat-label">Citas Totales</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{upcomingAppointments}</div>
              <div className="stat-label">Próximas</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{completedAppointments}</div>
              <div className="stat-label">Completadas</div>
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="profile-info">
          <div className="info-header">
            <h2 className="section-title">
              <User size={24} />
              Mi Perfil
            </h2>
            <div>
              {isEditing ? (
                <>
                  <button className="cancel-button" onClick={handleCancel}>
                    <X size={16} />
                    Cancelar
                  </button>
                  <button className="edit-button" onClick={handleSave}>
                    <Save size={16} />
                    Guardar
                  </button>
                </>
              ) : (
                <button className="edit-button" onClick={() => setIsEditing(true)}>
                  <Edit3 size={16} />
                  Editar Perfil
                </button>
              )}
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">
                <User size={16} />
                Nombre completo
              </label>
              {isEditing ? (
                <input
                  type="text"
                  className="form-input"
                  value={editData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ingresa tu nombre completo"
                />
              ) : (
                <div className="info-display">
                  <User size={16} color="var(--color-acento-dorado)" />
                  <span className="info-text">{profile.name || 'No especificado'}</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                <Mail size={16} />
                Correo electrónico
              </label>
              {isEditing ? (
                <input
                  type="email"
                  className="form-input"
                  value={editData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="correo@ejemplo.com"
                />
              ) : (
                <div className="info-display">
                  <Mail size={16} color="var(--color-acento-dorado)" />
                  <span className="info-text">{profile.email}</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                <Phone size={16} />
                Teléfono
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  className="form-input"
                  value={editData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+57 300 123 4567"
                />
              ) : (
                <div className="info-display">
                  <Phone size={16} color="var(--color-acento-dorado)" />
                  <span className={`${!profile.phone ? 'info-placeholder' : ''} info-text`}>
                    {profile.phone || 'No especificado'}
                  </span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                <MapPin size={16} />
                Dirección
              </label>
              {isEditing ? (
                <input
                  type="text"
                  className="form-input"
                  value={editData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Calle 123 #45-67, Ciudad"
                />
              ) : (
                <div className="info-display">
                  <MapPin size={16} color="var(--color-acento-dorado)" />
                  <span className={`${!profile.address ? 'info-placeholder' : ''} info-text`}>
                    {profile.address || 'No especificada'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Appointments Section */}
      <div className="appointments-section">
        <div className="appointments-header">
          <h2 className="section-title">
            <Calendar size={24} />
            Mis Citas
          </h2>
        </div>

        <div className="appointments-grid">
          {appointments.length > 0 ? (
            appointments.map(appointment => (
              <div 
                key={appointment._id} 
                className="appointment-card"
                style={{ 
                  '--status-color': getStatusColor(appointment.status)
                } as React.CSSProperties}
              >
                <div className="appointment-header">
                  <div className="appointment-date-time">
                    <div className="appointment-date">
                      {format(new Date(appointment.date), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
                    </div>
                    <div className="appointment-time">
                      <Clock size={14} />
                      {appointment.time}
                    </div>
                  </div>
                  <div 
                    className="appointment-status"
                    style={{ 
                      backgroundColor: getStatusColor(appointment.status) + '20',
                      color: getStatusColor(appointment.status),
                      border: `1px solid ${getStatusColor(appointment.status)}`
                    }}
                  >
                    {getStatusText(appointment.status)}
                  </div>
                </div>

                <div className="appointment-details">
                  <div className="detail-item">
                    <span className="detail-label">Servicio</span>
                    <span className="detail-value">
                      <Scissors size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                      {appointment.service}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">{user?.role === 'client' ? 'Barbero' : 'Cliente'}</span>
                    <span className="detail-value">
                      {user?.role === 'client' 
                        ? (typeof appointment.barber === 'string' ? appointment.barber : appointment.barber?.name || 'No especificado')
                        : (appointment.client?.name || 'No especificado')
                      }
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Hora</span>
                    <span className="detail-value">{appointment.time}</span>
                  </div>
                </div>

                {appointment.status === 'pending' && (
                  <div style={{ marginTop: '16px', textAlign: 'right' }}>
                    <button
                      onClick={() => handleCancelAppointment(appointment._id)}
                      className="cancel-appointment-btn"
                    >
                      Cancelar Cita
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '48px 24px',
              color: 'var(--color-texto-secundario)',
              fontSize: '18px'
            }}>
              No tienes citas programadas
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile; 