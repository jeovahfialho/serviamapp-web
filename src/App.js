import React, { useEffect }  from 'react';
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

  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = `
      var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
      (function(){
      var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
      s1.async=true;
      s1.src='https://embed.tawk.to/67acfada3a842732607df3fe/1ijtr7puv';
      s1.charset='UTF-8';
      s1.setAttribute('crossorigin','*');
      s0.parentNode.insertBefore(s1,s0);
      })();
    `;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

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