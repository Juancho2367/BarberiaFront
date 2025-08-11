import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, User, Check, X, Calendar } from 'lucide-react';
import { format, startOfWeek, addDays, addWeeks, subWeeks, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import api from '../config/api';

interface WeeklyDayData {
  date: string;
  availableSlots: string[];
  reservedSlots: string[];
}

interface WeeklyData {
  [date: string]: WeeklyDayData;
}

const AdminCalendar: React.FC = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [weeklyData, setWeeklyData] = useState<WeeklyData>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<string>('');
  const [barbers, setBarbers] = useState<any[]>([]);
  
  // Nuevas variables para responsividad
  const [screenSize, setScreenSize] = useState('desktop');
  const [selectedDay, setSelectedDay] = useState(0);
  const [dateFilter, setDateFilter] = useState('all');

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00'
  ];

  // Detectar tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 480) setScreenSize('mobile');
      else if (width < 768) setScreenSize('tablet');
      else if (width < 1024) setScreenSize('laptop');
      else setScreenSize('desktop');
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchBarbers();
  }, []);

  useEffect(() => {
    if (selectedBarber) {
      fetchWeeklyData();
    }
  }, [currentWeek, selectedBarber]);

  const fetchBarbers = async () => {
    try {
      const response = await api.get('/users/barbers');
      setBarbers(response.data.barbers);
      
      // Seleccionar el primer barbero por defecto
      if (response.data.barbers.length > 0) {
        setSelectedBarber(response.data.barbers[0]._id);
      }
    } catch (err: any) {
      console.error('Error fetching barbers:', err);
      setError(err.response?.data?.message || 'Error al cargar los barberos');
    }
  };

  const fetchWeeklyData = async () => {
    if (!selectedBarber) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const startDate = startOfWeek(currentWeek, { weekStartsOn: 1 });
      const endDate = addDays(startDate, 6);
      
      const response = await api.get('/barber-availability/weekly-availability', {
        params: {
          barberId: selectedBarber,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        }
      });
      
      setWeeklyData(response.data);
    } catch (err: any) {
      console.error('Error fetching weekly data:', err);
      setError(err.response?.data?.message || 'Error al cargar la disponibilidad');
    } finally {
      setLoading(false);
    }
  };

  const isSlotAvailable = (date: string, time: string) => {
    const dayData = weeklyData[date];
    return dayData?.availableSlots.includes(time) && !dayData?.reservedSlots.includes(time);
  };

  const isSlotReserved = (date: string, time: string) => {
    const dayData = weeklyData[date];
    return dayData?.reservedSlots.includes(time);
  };

  const getSlotClassName = (date: string, time: string) => {
    const baseClass = 'time-slot-item';
    
    if (isSlotReserved(date, time)) {
      return `${baseClass} reserved`;
    }
    
    if (isSlotAvailable(date, time)) {
      return `${baseClass} available`;
    }
    
    return `${baseClass} unavailable`;
  };

  const nextWeek = () => setCurrentWeek(addWeeks(currentWeek, 1));
  const prevWeek = () => setCurrentWeek(subWeeks(currentWeek, 1));

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = addDays(startOfWeek(currentWeek, { weekStartsOn: 1 }), i);
    return {
      date: format(day, 'yyyy-MM-dd'),
      dayName: format(day, 'EEEE', { locale: es }),
      shortDayName: format(day, 'EEE', { locale: es }),
      dayNumber: format(day, 'd')
    };
  });

  const availableCount = Object.values(weeklyData).reduce((total, day) => 
    total + day.availableSlots.length, 0
  );
  const reservedCount = Object.values(weeklyData).reduce((total, day) => 
    total + day.reservedSlots.length, 0
  );

  // Generar fechas para el selector
  const generateDateOptions = () => {
    const dates = [];
    const today = new Date();
    
    // Generar 30 días hacia adelante
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const dayName = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][date.getDay()];
      
      // Solo incluir días laborales (Lunes a Viernes)
      if (date.getDay() >= 1 && date.getDay() <= 5) {
        dates.push({
          value: `${dayName}-${date.getDate()}`,
          label: `${dayName} ${date.getDate()}/${date.getMonth() + 1}`,
          dayName: dayName,
          date: date.getDate(),
          fullDate: date
        });
      }
    }
    return dates;
  };

  const dateOptions = generateDateOptions();

  // Filtrar días según el filtro de fecha
  const getFilteredDays = () => {
    if (dateFilter === 'all') {
      return weekDays;
    }
    
    const selectedDateOption = dateOptions.find(d => d.value === dateFilter);
    if (selectedDateOption) {
      return weekDays.filter(day => day.dayName === selectedDateOption.dayName);
    }
    
    return weekDays;
  };

  const filteredDays = getFilteredDays();

  // Contar slots disponibles para el filtro
  const getAvailableSlotsCount = () => {
    if (dateFilter === 'all') {
      return filteredDays.reduce((total, day) => 
        total + timeSlots.filter(time => 
          isSlotAvailable(day.date, time) && !isSlotReserved(day.date, time)
        ).length, 0
      );
    } else {
      const selectedDateOption = dateOptions.find(d => d.value === dateFilter);
      if (selectedDateOption) {
        return timeSlots.filter(time => 
          isSlotAvailable(selectedDateOption.fullDate.toISOString().split('T')[0], time) && 
          !isSlotReserved(selectedDateOption.fullDate.toISOString().split('T')[0], time)
        ).length;
      }
    }
    return 0;
  };

  // Componente para vista móvil individual de día
  const MobileDayView = ({ day, index }: { day: any; index: number }) => (
    <div className="mobile-day-view">
      <div className="mobile-day-header">
        <div className="mobile-day-info">
          <span className="mobile-day-name">{day.shortDayName}</span>
          <span className="mobile-day-number">{day.dayNumber}</span>
        </div>
        <div className="mobile-day-stats">
          <span className="available-count">
            {timeSlots.filter(time => isSlotAvailable(day.date, time) && !isSlotReserved(day.date, time)).length} disponibles
          </span>
        </div>
      </div>
      
      <div className="mobile-time-grid">
        {timeSlots.map(time => {
          const available = isSlotAvailable(day.date, time);
          const reserved = isSlotReserved(day.date, time);
          
          return (
            <div 
              key={`${day.date}-${time}`}
              className={getSlotClassName(day.date, time)}
            >
              <span className="time-text">{time}</span>
              <div className="slot-status">
                {reserved && <User size={14} />}
                {!available && !reserved && <X size={12} />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  if (loading && Object.keys(weeklyData).length === 0) {
    return (
      <div className="responsive-calendar">
        <div className="calendar-container">
          <div className="header-section">
            <div className="main-title">
              <div className="title-content">
                <Clock size={32} />
                Vista Administrativa - Cargando...
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="responsive-calendar">
      <div className="calendar-container">
        <div className="header-section">
          <div className="main-title">
            <div className="title-content">
              <Clock size={screenSize === 'mobile' ? 24 : 32} />
              {screenSize === 'mobile' ? 'Admin' : 'Vista Administrativa - Calendario'}
            </div>
          </div>

          <div className="barber-selector">
            <label htmlFor="admin-barber-select" className="block text-sm font-medium text-gray-300 mb-2">Seleccionar Barbero:</label>
            <select
              id="admin-barber-select"
              value={selectedBarber}
              onChange={(e) => setSelectedBarber(e.target.value)}
              className="w-full sm:w-auto input"
            >
              {barbers.map(barber => (
                <option key={barber._id} value={barber._id}>
                  {barber.name}
                </option>
              ))}
            </select>
          </div>

          <div className="calendar-header">
            <button 
              className="nav-button" 
              onClick={prevWeek}
              disabled={loading}
            >
              <ChevronLeft size={18} />
            </button>
            <div className="month-year">
              {screenSize === 'mobile' 
                ? `${format(startOfWeek(currentWeek, { weekStartsOn: 1 }), 'dd', { locale: es })}-${format(addDays(startOfWeek(currentWeek, { weekStartsOn: 1 }), 6), 'dd MMM', { locale: es })}` 
                : `${format(startOfWeek(currentWeek, { weekStartsOn: 1 }), 'dd MMM', { locale: es })} - ${format(addDays(startOfWeek(currentWeek, { weekStartsOn: 1 }), 6), 'dd MMM yyyy', { locale: es })}`
              }
            </div>
            <button 
              className="nav-button" 
              onClick={nextWeek}
              disabled={loading}
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="date-filter-section">
            <div className="filter-header">
              <div className="filter-title">
                <Calendar size={18} />
                Filtrar por Fecha
              </div>
              <div className="filter-stats">
                <span className="available-count-number">{getAvailableSlotsCount()}</span> slots disponibles
              </div>
            </div>
            
            <div className="date-filter-controls">
              <select 
                className="filter-select"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="all">Todas las fechas disponibles</option>
                {dateOptions.map(date => (
                  <option key={date.value} value={date.value}>
                    {date.label}
                  </option>
                ))}
              </select>
              
              {dateFilter !== 'all' && (
                <>
                  <div className="filter-active-indicator">
                    <Check size={12} />
                    Filtro activo
                  </div>
                  <button 
                    className="clear-filter-btn"
                    onClick={() => setDateFilter('all')}
                  >
                    <X size={14} />
                    Limpiar
                  </button>
                </>
              )}
            </div>
          </div>

          {screenSize === 'mobile' && (
            <>
              <div className="mobile-day-selector">
                {filteredDays.map((day, index) => (
                  <button
                    key={day.date}
                    className={`mobile-day-btn ${selectedDay === index ? 'active' : ''}`}
                    onClick={() => setSelectedDay(index)}
                  >
                    <div>{day.shortDayName}</div>
                    <div>{day.dayNumber}</div>
                  </button>
                ))}
              </div>
              {filteredDays.length > 0 && (
                <MobileDayView day={filteredDays[selectedDay] || filteredDays[0]} index={selectedDay} />
              )}
            </>
          )}

          {/* Vista Desktop, Tablet y Laptop */}
          {screenSize !== 'mobile' && (
            <div className="desktop-week-view">
              {filteredDays.map((day) => (
                <div key={day.date} className="week-day">
                  <div className="week-day-header">
                    <div className="week-day-name">{screenSize === 'tablet' ? day.dayName : day.shortDayName}</div>
                    <div className="week-day-number">{day.dayNumber}</div>
                  </div>
                  
                  <div className="time-slots-list">
                    {timeSlots.map(time => (
                      <div
                        key={`${day.date}-${time}`}
                        className={getSlotClassName(day.date, time)}
                        title={`${day.dayName} ${day.dayNumber} - ${time}`}
                      >
                        <span className="time-text">{time}</span>
                        <div className="slot-status">
                          {isSlotReserved(day.date, time) && <User size={16} />}
                          {!isSlotAvailable(day.date, time) && !isSlotReserved(day.date, time) && <X size={16} />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Mensaje cuando no hay días que mostrar */}
          {filteredDays.length === 0 && (
            <div style={{
              background: 'var(--color-fondo-admin)',
              padding: '40px 20px',
              borderRadius: '12px',
              textAlign: 'center',
              border: '1px solid var(--color-borde-sutil)',
              marginTop: '20px',
              width: '100%',
              boxSizing: 'border-box'
            }}>
              <Calendar size={48} style={{ color: 'var(--color-texto-secundario)', marginBottom: '16px' }} />
              <div style={{ color: 'var(--color-texto-secundario)', fontSize: '16px' }}>
                No hay horarios disponibles para la fecha seleccionada
              </div>
            </div>
          )}
        </div>

        <div className="calendar-legend">
          <div className="legend-grid">
            <div className="legend-item">
              <div 
                className="legend-color" 
                style={{ 
                  background: 'linear-gradient(135deg, var(--color-fondo-admin) 0%, rgba(218, 165, 32, 0.3) 100%)',
                  borderColor: 'var(--color-acento-dorado)'
                }}
              ></div>
              Libre
            </div>
            <div className="legend-item">
              <div 
                className="legend-color" 
                style={{ 
                  background: 'var(--color-texto-secundario)',
                }}
              ></div>
              Reservado
            </div>
            <div className="legend-item">
              <div 
                className="legend-color" 
                style={{ 
                  background: 'var(--color-fondo-admin)',
                  opacity: 0.4
                }}
              ></div>
              No Disponible
            </div>
          </div>
        </div>

        <div className="calendar-stats">
          <div className="stat-card">
            <div className="stat-number">{availableCount}</div>
            <div className="stat-label">Slots Disponibles</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{reservedCount}</div>
            <div className="stat-label">Citas Reservadas</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{timeSlots.length * 7}</div>
            <div className="stat-label">Total de Slots</div>
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCalendar;
