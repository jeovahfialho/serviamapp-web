import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Marketplace from './pages/Marketplace';
import SignUpPage from './pages/SignUpPage';
import ProfessionalPage from './pages/ProfessionalPage';
import ProtectedRoute from './components/ProtectedRoute';
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react"

const App = () => {
  return (
    <Router>
      <SpeedInsights />
      <Analytics />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/profissional/:id" element={<ProfessionalPage />} />
        <Route path="/" element={<Navigate to="/marketplace" replace />} />
      </Routes>
    </Router>
  );
};

export default App;