// Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, User, Plus, LogOut, Calendar, Users, Clock, AlertCircle, ChevronUp, Activity } from 'lucide-react';
import ServianLogoText from '../components/ServianLogoText';
import ServianLogo from '../components/ServianLogo';
import CadastroModal from '../components/CadastroModal';
import { SpeedInsights } from "@vercel/speed-insights/react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mostrarCadastro, setMostrarCadastro] = useState(false);
  const [userData, setUserData] = useState({
    nome: 'Dr. Silva',
    email: '',
    cpf: '',
    status: 'pending',
    appointments: 12,
    patients: 45,
    waitingList: 3,
    completionRate: 30,
    stats: {
      income: 15000,
      appointmentsCompleted: 48,
      averageRating: 4.8,
      totalReviews: 42
    }
  });

  useEffect(() => {
    const loadUserData = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('https://serviamapp-server.vercel.app/api/me', {
          headers: { 
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) throw new Error('Erro ao carregar dados');
        
        const data = await response.json();
        setUserData(prevData => ({
          ...prevData,
          ...data,
          nome: data.nome || 'Profissional',
          email: data.email || '',
          cpf: data.cpf || ''
        }));
  
      } catch (error) {
        console.error('Erro:', error);
        navigate('/login');
      }
    };
  
    loadUserData();
  }, [navigate]);

  const getStatusColor = (status) => {
    const statusColors = {
      pending: 'bg-yellow-500',
      approved: 'bg-green-500',
      rejected: 'bg-red-500'
    };
    return statusColors[status] || 'bg-gray-500';
  };

  const getStatusText = (status) => {
    const statusText = {
      pending: 'Pendente',
      approved: 'Aprovado',
      rejected: 'Rejeitado'
    };
    return statusText[status] || 'Desconhecido';
  };

  const isProfileIncomplete = !userData.email || !userData.cpf;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 bg-[#273440] shadow-md z-40 h-16">
        <div className="max-w-full px-4 h-full">
          <div className="flex justify-between items-center h-full">
            <div className="flex items-center">
              <div className="hidden md:block">
                <ServianLogoText />
              </div>
              <div className="block md:hidden">
              <ServianLogo />
              </div>
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2"
              >
                <div className="w-10 h-10 rounded-full bg-[#3a4b5b] flex items-center justify-center">
                  <User size={20} className="text-white" />
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1">
                  <button 
                    onClick={() => navigate('/marketplace')}
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full"
                  >
                    <Users size={16} className="mr-2" />
                    Marketplace
                  </button>
                  <button 
                    onClick={() => {
                      localStorage.removeItem('token');
                      navigate('/login');
                    }}
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full"
                  >
                    <LogOut size={16} className="mr-2" />
                    Sair
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-16 px-4 md:px-8">
        {/* Profile Completion Alert */}
        {isProfileIncomplete && (
          <div className="bg-blue-50 p-4 rounded-lg mb-6 mt-6">
            <div className="flex">
              <AlertCircle className="text-blue-600 mr-2" />
              <div>
                <h3 className="text-blue-800 font-medium">Complete seu cadastro</h3>
                <p className="text-blue-700 text-sm mt-1">
                  Para garantir a segurança e confiabilidade da plataforma, complete seu cadastro com informações essenciais como CPF e email.
                </p>
                <button 
                  onClick={() => setMostrarCadastro(true)}
                  className="mt-2 text-blue-600 text-sm font-medium hover:text-blue-700"
                >
                  Completar cadastro →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Status Cards - Only show when profile is complete */}
        {!isProfileIncomplete && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Consultas Hoje</p>
                    <p className="text-2xl font-bold mt-1">{userData.appointments}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                    <Calendar className="text-blue-500" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <ChevronUp className="text-green-500 mr-1" size={16} />
                  <span className="text-green-500">+2.5%</span>
                  <span className="text-gray-500 ml-2">vs. última semana</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total de Pacientes</p>
                    <p className="text-2xl font-bold mt-1">{userData.patients}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
                    <Users className="text-purple-500" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <ChevronUp className="text-green-500 mr-1" size={16} />
                  <span className="text-green-500">+5.2%</span>
                  <span className="text-gray-500 ml-2">vs. último mês</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Lista de Espera</p>
                    <p className="text-2xl font-bold mt-1">{userData.waitingList}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center">
                    <Clock className="text-orange-500" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-gray-500">Pacientes aguardando</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Status do Cadastro</p>
                    <div className="flex items-center mt-1">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(userData.status)} mr-2`} />
                      <p className="font-medium">{getStatusText(userData.status)}</p>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                    <Activity className="text-green-500" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 rounded-full h-2"
                      style={{ width: `${userData.completionRate}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {userData.completionRate}% completo
                  </p>
                </div>
              </div>
            </div>

            {/* Statistics Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Income Stats */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Rendimentos</h3>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-gray-600">Total Mensal</p>
                  <p className="text-2xl font-bold">R$ {userData.stats.income.toLocaleString()}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-gray-600">Consultas Realizadas</p>
                  <p className="text-xl">{userData.stats.appointmentsCompleted}</p>
                </div>
              </div>

              {/* Reviews Stats */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Avaliações</h3>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-3xl font-bold">{userData.stats.averageRating}</p>
                    <p className="text-sm text-gray-500">média geral</p>
                  </div>
                  <div>
                    <p className="text-2xl font-semibold">{userData.stats.totalReviews}</p>
                    <p className="text-sm text-gray-500">avaliações</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-400 rounded-full h-2"
                    style={{ width: `${(userData.stats.averageRating / 5) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
              <h3 className="text-lg font-semibold mb-4">Atividades Recentes</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                      <Calendar className="text-blue-500 w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">Nova consulta agendada</p>
                      <p className="text-sm text-gray-500">Paciente: Maria Silva</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">Há 2 horas</span>
                </div>
                
                <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                      <Activity className="text-green-500 w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">Avaliação recebida</p>
                      <p className="text-sm text-gray-500">5 estrelas - João Santos</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">Há 5 horas</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {mostrarCadastro && <CadastroModal onClose={() => setMostrarCadastro(false)} />}
      <SpeedInsights />
    </div>
  );
};

export default Dashboard;