// Tipos centralizados para toda la aplicación

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'client' | 'barber' | 'admin';
}

export interface Appointment {
  _id: string;
  client: User;
  barber: User;
  date: string;
  time: string;
  service: string;
  duration: number;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}



export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: string;
  appointments: Appointment[];
}

// Tipos para props de componentes
export interface PrivateRouteProps {
  children: React.ReactNode;
}

export interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  onAppointmentCreated: () => void;
}

// Tipos para contexto de autenticación
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
} 