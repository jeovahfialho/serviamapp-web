// Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ChevronDown, LogOut, Calendar, Users, Clock, AlertCircle, ChevronUp, Activity } from 'lucide-react';
import ServianLogoText from '../components/ServianLogoText';
import ServianLogo from '../components/ServianLogo';
import CadastroModal from '../components/CadastroModal';
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react"

const Dashboard = () => {

  <Analytics />
  const navigate = useNavigate();

  const [selectedRows, setSelectedRows] = useState(new Set());
  const [isAdmin, setIsAdmin] = useState(false);
  const [profissionais, setProfissionais] = useState([]);
  const [expandedRows, setExpandedRows] = useState(new Set()); 
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

  // Função para verificar se é admin
  const checkIsAdmin = (userPhone) => {
    return userPhone === '61981733598';
  };

  const ActionMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
  
    const handleAction = async (action) => {
      const selectedIds = Array.from(selectedRows);
      if (selectedIds.length === 0) {
        alert('Selecione ao menos um profissional');
        return;
      }
  
      switch(action) {
        case 'aprovar':
          for (let id of selectedIds) {
            await updateStatus(id, 'approved');
          }
          break;
        case 'rejeitar':
          for (let id of selectedIds) {
            await updateStatus(id, 'rejected');
          }
          break;
        case 'verificar':
          for (let id of selectedIds) {
            await toggleVerificado(id, false);
          }
          break;
        case 'desverificar':
          for (let id of selectedIds) {
            await toggleVerificado(id, true);
          }
          break;
      }
  
      setSelectedRows(new Set()); // Limpa seleção após ação
      setIsOpen(false);
    };
  
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          disabled={selectedRows.size === 0}
          className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
            selectedRows.size === 0 
              ? 'bg-gray-100 text-gray-400' 
              : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
          }`}
        >
          <span>Ações ({selectedRows.size})</span>
          <ChevronDown size={16} />
        </button>
  
        {isOpen && (
          <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg z-50 w-48">
            <button
              onClick={() => handleAction('aprovar')}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm text-green-600"
            >
              Aprovar Selecionados
            </button>
            <button
              onClick={() => handleAction('rejeitar')}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm text-red-600"
            >
              Rejeitar Selecionados
            </button>
            <button
              onClick={() => handleAction('verificar')}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm text-blue-600"
            >
              Verificar Selecionados
            </button>
            <button
              onClick={() => handleAction('desverificar')}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm text-gray-600"
            >
              Remover Verificação
            </button>
          </div>
        )}
      </div>
    );
  };

  const updateStatus = async (id, newStatus) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('https://serviamapp-server.vercel.app/api/profissionais', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id,
          status: newStatus
        })
      });
  
      if (!response.ok) throw new Error('Erro ao atualizar status');
      
      // Recarrega a lista de profissionais
      fetchProfissionais();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar status');
    }
  };
  
  const toggleVerificado = async (id, currentStatus) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('https://serviamapp-server.vercel.app/api/profissionais', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id,
          verificado: !currentStatus
        })
      });
  
      if (!response.ok) throw new Error('Erro ao atualizar verificação');
      
      // Recarrega a lista de profissionais
      fetchProfissionais();
    } catch (error) {
      console.error('Erro ao atualizar verificação:', error);
      alert('Erro ao atualizar verificação');
    }
  };

  // Função para buscar profissionais
  const fetchProfissionais = async () => {
    if (!isAdmin) return;
    
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('https://serviamapp-server.vercel.app/api/profissionais?isAdmin=true', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Erro ao carregar profissionais');
      
      const data = await response.json();
      setProfissionais(data);
    } catch (error) {
      console.error('Erro ao carregar profissionais:', error);
    }
  };

  // Função para expandir/recolher uma linha
  const toggleRow = (id) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

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

        // Verificar se é admin
        setIsAdmin(checkIsAdmin(data.telefone));
  
      } catch (error) {
        console.error('Erro:', error);
        navigate('/login');
      }
    };
  
    loadUserData();
  }, [navigate]);

  // Segundo useEffect - novo, para carregar profissionais
  useEffect(() => {
    if (isAdmin) {
      fetchProfissionais();
    }
  }, [isAdmin]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'approved':
        return 'bg-green-500';
      case 'rejected':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'approved':
        return 'Aprovado';
      case 'rejected':
        return 'Rejeitado';
      default:
        return 'Desconhecido';
    }
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

        {/* Seção Admin */}
        {isAdmin && (
          <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
            <h3 className="text-lg font-semibold mb-4">Lista de Profissionais</h3>
            <ActionMenu />
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRows(new Set(profissionais.map(p => p.id)));
                          } else {
                            setSelectedRows(new Set());
                          }
                        }}
                        checked={selectedRows.size === profissionais.length && profissionais.length > 0}
                        className="rounded border-gray-300 text-blue-600"
                      />
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Nome
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Categoria
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Instagram
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Áreas de Atuação
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Verificado
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {profissionais.map((prof) => (
                    <React.Fragment key={prof.id}>
                      <tr 
                        className="hover:bg-gray-50 cursor-pointer"
                        
                      >
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedRows.has(prof.id)}
                            onChange={(e) => {
                              const newSelected = new Set(selectedRows);
                              if (e.target.checked) {
                                newSelected.add(prof.id);
                              } else {
                                newSelected.delete(prof.id);
                              }
                              setSelectedRows(newSelected);
                            }}
                            className="rounded border-gray-300 text-blue-600"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap" onClick={() => toggleRow(prof.id)}>
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900">{prof.nome}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {prof.tipo}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {prof.instagram}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {prof.atuacao?.map((area, idx) => (
                              <span 
                                key={idx}
                                className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                              >
                                {area}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            prof.verificado ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {prof.verificado ? 'Sim' : 'Não'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(prof.status)} text-white`}>
                            {getStatusText(prof.status)}
                          </span>
                        </td>
                      </tr>
                      {expandedRows.has(prof.id) && (
                        <tr className="bg-gray-50">
                          <td colSpan="6" className="px-6 py-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="font-medium">Dados Pessoais</p>
                                <p className="text-sm">Email: {prof.email}</p>
                                <p className="text-sm">Telefone: {prof.telefone}</p>
                                <p className="text-sm">CPF: {prof.cpf}</p>
                              </div>
                              <div>
                                <p className="font-medium">Localização</p>
                                <p className="text-sm">Cidade: {prof.cidade}</p>
                                <p className="text-sm">Estado: {prof.estado}</p>
                                <p className="text-sm">Bairro: {prof.bairro}</p>
                              </div>
                              <div>
                                <p className="font-medium">Formação</p>
                                <div className="text-sm">
                                  <p className="font-medium text-sm mt-1">Graduação:</p>
                                  {prof.graduacao?.map((grad, idx) => (
                                    <p key={idx}>{grad}</p>
                                  ))}
                                  <p className="font-medium text-sm mt-1">Pós-Graduação:</p>
                                  {prof.pos_graduacao?.map((pos, idx) => (
                                    <p key={idx}>{pos}</p>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <p className="font-medium">Especializações</p>
                                {prof.especializacao?.map((esp, idx) => (
                                  <p key={idx} className="text-sm">{esp}</p>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
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