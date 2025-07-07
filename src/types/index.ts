export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'client' | 'barber' | 'admin';
  phone?: string;
  address?: string;
}

export interface Appointment {
  _id: string;
  date: string;
  time: string;
  service: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  user: string;
  barber?: string;
}

export interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
}

export interface Barber {
  _id: string;
  name: string;
  email: string;
  specialties: string[];
  schedule: {
    day: string;
    start: string;
    end: string;
  }[];
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
} 