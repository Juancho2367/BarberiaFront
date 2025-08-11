import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import UserManagement from './pages/UserManagement';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen" style={{ backgroundColor: 'var(--color-fondo-oscuro)', fontFamily: 'var(--fuente-cuerpo)' }}>
        <ErrorBoundary>
          <Navbar />
        </ErrorBoundary>
        <main>
          <Routes>
            <Route path="/" element={
              <ErrorBoundary>
                <Home />
              </ErrorBoundary>
            } />
            <Route path="/login" element={
              <ErrorBoundary>
                <Login />
              </ErrorBoundary>
            } />
            <Route path="/register" element={
              <ErrorBoundary>
                <Register />
              </ErrorBoundary>
            } />
            <Route 
              path="/dashboard" 
              element={
                <ErrorBoundary>
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                </ErrorBoundary>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ErrorBoundary>
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                </ErrorBoundary>
              } 
            />
            <Route 
              path="/user-management" 
              element={
                <ErrorBoundary>
                  <PrivateRoute>
                    <UserManagement />
                  </PrivateRoute>
                </ErrorBoundary>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App; 