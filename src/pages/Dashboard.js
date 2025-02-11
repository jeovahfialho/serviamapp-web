// Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, ChevronDown, LogOut, Calendar, Users, Clock, AlertCircle, ChevronUp, Activity,
  CheckCircle, XCircle, Star, Shield, Video, Zap, GraduationCap, ChevronRight, Instagram 
} from 'lucide-react';
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
    nome: '',
    email: '',
    cpf: '',
    telefone: '',
    tipo: '',
    cidade: '',
    estado: '',
    bairro: '',
    status: 'pending',
    verificado: false,
    atendimentoonline: false,
    atendimentoemergencia: false,
    especializacao: [],
    pontuacao: 0,
    referencias: 0,
    reviews: []
  });

  const calculateProfileCompleteness = (userData) => {
    const requiredFields = [
      'cpf',
      'graduacao',
      'atuacao',
      'email',
      'telefone',
      'nome',
      'tipo',
      'cidade',
      'estado',
      'bairro'
    ];
    
    const optionalFields = [
      'pos_graduacao',
      'especializacao',
      'cursos',
      'instagram',
      'faixa_etaria',
      'planos'
    ];
  
    let completedRequired = 0;
    let completedOptional = 0;
  
    requiredFields.forEach(field => {
      if (userData[field]) completedRequired++;
    });
  
    optionalFields.forEach(field => {
      if (Array.isArray(userData[field]) ? userData[field].length > 0 : userData[field]) 
        completedOptional++;
    });
  
    const requiredWeight = 0.8;
    const optionalWeight = 0.2;
  
    const requiredScore = (completedRequired / requiredFields.length) * requiredWeight;
    const optionalScore = (completedOptional / optionalFields.length) * optionalWeight;
  
    return Math.round((requiredScore + optionalScore) * 100);
  };
  
  const isProfileComplete = (userData) => calculateProfileCompleteness(userData) === 87;

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

        console.log('Dados recebidos da API:', data); // Log para debug
        console.log('Reviews recebidas:', data.reviews); // Log específico para reviews

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

  useEffect(() => {
    const loadUserData = async () => {
      const token = localStorage.getItem('token');
      try {
        // Primeira chamada: dados do usuário via /api/me
        const userResponse = await fetch('https://serviamapp-server.vercel.app/api/me', {
          headers: { 
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!userResponse.ok) throw new Error('Erro ao carregar dados');
        const userData = await userResponse.json();
  
        // Segunda chamada: buscar dados completos do profissional incluindo reviews
        const profResponse = await fetch(`https://serviamapp-server.vercel.app/api/profissionais?id=${userData.id}`, {
          headers: { 
            'Authorization': `Bearer ${token}`
          }
        });
  
        if (profResponse.ok) {
          const profData = await profResponse.json();
          console.log('Dados completos do profissional:', profData);
  
          // Combina os dados do /api/me com os dados completos do profissional
          setUserData(prevData => ({
            ...prevData,
            ...userData,
            ...profData,
            reviews: profData.reviews || [] // Garante que reviews existe mesmo que vazio
          }));
        }
  
        // Verificar se é admin
        setIsAdmin(checkIsAdmin(userData.telefone));
  
      } catch (error) {
        console.error('Erro:', error);
        navigate('/login');
      }
    };
  
    loadUserData();
  }, [navigate]);

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
        {/* Profile Completion Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Completion */}
            {/* Status do Cadastro */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Status do Cadastro</h3>
              <div className="grid grid-cols-3 gap-x-6 gap-y-4">
                {/* Coluna 1 */}
                <div className="space-y-4">
                  {userData.nome ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle size={16} className="mr-2" />
                      <span className="text-sm">Nome</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-gray-400">
                      <XCircle size={16} className="mr-2" />
                      <span className="text-sm">Nome *</span>
                    </div>
                  )}
                  {userData.cpf ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle size={16} className="mr-2" />
                      <span className="text-sm">CPF</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-gray-400">
                      <XCircle size={16} className="mr-2" />
                      <span className="text-sm">CPF *</span>
                    </div>
                  )}
                  {userData.email ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle size={16} className="mr-2" />
                      <span className="text-sm">Email</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-gray-400">
                      <XCircle size={16} className="mr-2" />
                      <span className="text-sm">Email *</span>
                    </div>
                  )}
                  {userData.instagram ? (
                    <div className="flex items-center text-yellow-600">
                      <CheckCircle size={16} className="mr-2" />
                      <span className="text-sm">Instagram</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-gray-400">
                      <XCircle size={16} className="mr-2" />
                      <span className="text-sm">Instagram</span>
                    </div>
                  )}
                </div>

                {/* Coluna 2 */}
                <div className="space-y-4">
                  {userData.telefone ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle size={16} className="mr-2" />
                      <span className="text-sm">Telefone</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-gray-400">
                      <XCircle size={16} className="mr-2" />
                      <span className="text-sm">Telefone *</span>
                    </div>
                  )}
                  {userData.tipo ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle size={16} className="mr-2" />
                      <span className="text-sm">Tipo</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-gray-400">
                      <XCircle size={16} className="mr-2" />
                      <span className="text-sm">Tipo *</span>
                    </div>
                  )}
                  {userData.especializacao?.length > 0 ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle size={16} className="mr-2" />
                      <span className="text-sm">Especialização</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-gray-400">
                      <XCircle size={16} className="mr-2" />
                      <span className="text-sm">Especialização</span>
                    </div>
                  )}
                  {userData.pos_graduacao?.length > 0 ? (
                    <div className="flex items-center text-yellow-600">
                      <CheckCircle size={16} className="mr-2" />
                      <span className="text-sm">Pós-graduação</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-gray-400">
                      <XCircle size={16} className="mr-2" />
                      <span className="text-sm">Pós-graduação</span>
                    </div>
                  )}
                </div>

                {/* Coluna 3 */}
                <div className="space-y-4">
                  {userData.cidade ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle size={16} className="mr-2" />
                      <span className="text-sm">Cidade</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-gray-400">
                      <XCircle size={16} className="mr-2" />
                      <span className="text-sm">Cidade *</span>
                    </div>
                  )}
                  {userData.estado ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle size={16} className="mr-2" />
                      <span className="text-sm">Estado</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-gray-400">
                      <XCircle size={16} className="mr-2" />
                      <span className="text-sm">Estado *</span>
                    </div>
                  )}
                  {userData.bairro ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle size={16} className="mr-2" />
                      <span className="text-sm">Bairro</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-gray-400">
                      <XCircle size={16} className="mr-2" />
                      <span className="text-sm">Bairro *</span>
                    </div>
                  )}
                  {userData.cursos?.length > 0 ? (
                    <div className="flex items-center text-yellow-600">
                      <CheckCircle size={16} className="mr-2" />
                      <span className="text-sm">Cursos</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-gray-400">
                      <XCircle size={16} className="mr-2" />
                      <span className="text-sm">Cursos</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Barra de Progresso */}
              <div className="mt-6">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 rounded-full h-2 transition-all duration-500"
                    style={{ 
                      width: `${calculateProfileCompleteness(userData)}%` 
                    }}
                  />
                </div>
                <div className="flex justify-between mt-2">
                  <p className="text-sm text-gray-600">
                    {calculateProfileCompleteness(userData)}% concluído
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-600 mr-1"></div>
                      <span>Obrigatório</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-yellow-600 mr-1"></div>
                      <span>Opcional</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Destaques do Profissional */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Destaques do Profissional</h3>
              <div className="grid grid-cols-3 gap-x-6 gap-y-4">
                {/* Coluna 1 */}
                <div className="space-y-4">
                  {/* Verificação */}
                  <div className={`flex items-center ${userData.verificado ? 'text-blue-600' : 'text-gray-400'}`}>
                    <Shield size={18} className="mr-2" />
                    <span className="text-base">
                      {userData.verificado ? 'Profissional Verificado' : 'Aguardando Verificação'}
                    </span>
                  </div>

                  {/* Atendimento Online */}
                  <div className={`flex items-center ${userData.atendimentoonline ? 'text-purple-600' : 'text-gray-400'}`}>
                    <Video size={18} className="mr-2" />
                    <span className="text-base">
                      {userData.atendimentoonline ? 'Atendimento Online' : 'Sem Atendimento Online'}
                    </span>
                  </div>

                  {/* Atendimento Emergencial */}
                  <div className={`flex items-center ${userData.atendimentoemergencia ? 'text-red-600' : 'text-gray-400'}`}>
                    <Zap size={18} className="mr-2" />
                    <span className="text-base">
                      {userData.atendimentoemergencia ? 'Atendimento Emergencial' : 'Sem Atendimento Emergencial'}
                    </span>
                  </div>
                </div>

                {/* Coluna 2 */}
                <div className="space-y-4">
                  {/* Especializações */}
                  <div className={`flex items-center ${userData.especializacao?.length > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                    <GraduationCap size={18} className="mr-2" />
                    <span className="text-base">
                      {userData.especializacao?.length > 0 
                        ? `${userData.especializacao.length} Especializações` 
                        : 'Sem Especializações'}
                    </span>
                  </div>

                  {/* Pós-Graduação */}
                  <div className={`flex items-center ${userData.pos_graduacao?.length > 0 ? 'text-amber-600' : 'text-gray-400'}`}>
                    <GraduationCap size={18} className="mr-2" />
                    <span className="text-base">
                      {userData.pos_graduacao?.length > 0 
                        ? `${userData.pos_graduacao.length} Pós-Graduações` 
                        : 'Sem Pós-Graduação'}
                    </span>
                  </div>

                  {/* Avaliações */}
                  <div className={`flex items-center ${(userData.referencias || 0) >= 10 ? 'text-yellow-600' : 'text-gray-400'}`}>
                    <Star size={18} className="mr-2" />
                    <span className="text-base">
                      {(userData.referencias || 0) >= 10 
                        ? `${userData.referencias} Avaliações` 
                        : `${userData.referencias || 0}/10 Avaliações Necessárias`}
                    </span>
                  </div>
                </div>

                {/* Coluna 3 */}
                <div className="space-y-4">
                  {/* Instagram */}
                  <div className={`flex items-center ${userData.instagram ? 'text-pink-600' : 'text-gray-400'}`}>
                    <Instagram size={18} className="mr-2" />
                    <span className="text-base">
                      {userData.instagram 
                        ? `@${userData.instagram}` 
                        : 'Perfil do Instagram não informado'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {!isProfileComplete(userData) && (
            <div className="mt-6 pt-4 border-t">
              <button 
                onClick={() => setMostrarCadastro(true)}
                className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center"
              >
                Completar cadastro
                <ChevronRight size={16} className="ml-1" />
              </button>
            </div>
          )}
        </div>

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
                    <p className="text-sm text-gray-500">Avaliações Recebidas</p>
                    <p className="text-2xl font-bold mt-1">{userData.referencias || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                    <Star className="text-blue-500" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <Star className="text-yellow-400 mr-1" size={16} />
                  <span className="text-yellow-500">{userData.pontuacao || 0}</span>
                  <span className="text-gray-500 ml-2">média geral</span>
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
                      className="bg-green-500 rounded-full h-2 transition-all duration-500"
                      style={{ 
                        width: `${calculateProfileCompleteness(userData)}%` 
                      }}
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {calculateProfileCompleteness(userData)}% completo
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {mostrarCadastro && <CadastroModal onClose={() => setMostrarCadastro(false)} />}
      <SpeedInsights />

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
           <p className="text-center text-gray-500 text-sm">
             Desenvolvido por{' '}
             <a href="#" className="text-blue-600 hover:text-blue-500">
               Simões Tecnologia da Informação
             </a>
           </p>
         </div>
       </footer>

    </div>
  );
};

export default Dashboard;