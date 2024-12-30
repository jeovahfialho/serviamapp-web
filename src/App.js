import React, { useState } from 'react';
import { Menu, Search, User, BookOpen, List, Filter, X, Star, DollarSign, Award } from 'lucide-react';

const profissionaisSaude = [
  {
    id: 1,
    tipo: "Psicólogo",
    nome: "Dra. Maria Silva",
    foto: "/api/placeholder/150/150",
    especializacao: "Psicologia Clínica",
    formacao: {
      graduacao: "Psicologia - USP",
      posGraduacao: "Mestrado em Psicologia Clínica - UNIFESP",
      cursos: [
        "Especialização em Terapia Cognitivo-Comportamental",
        "Formação em EMDR",
        "Certificação em Mindfulness"
      ]
    },
    atuacao: ["Ansiedade", "Depressão", "Terapia Familiar"],
    valor: 200,
    pontuacao: 4.8,
    referencias: 126,
    planos: ["Particular", "Unimed", "Bradesco Saúde"],
    registro: "CRP 01/12345",
    atendimentoOnline: true
  },
  {
    id: 2,
    tipo: "Médico",
    nome: "Dr. Carlos Mendes",
    foto: "/api/placeholder/150/150",
    especializacao: "Cardiologia",
    formacao: {
      graduacao: "Medicina - UNIFESP",
      posGraduacao: "Residência em Cardiologia - InCor",
      cursos: [
        "Fellowship em Cardiopatias Congênitas - Harvard",
        "Especialização em Ecocardiografia",
        "Certificação em Arritmias Cardíacas"
      ]
    },
    atuacao: ["Hipertensão", "Check-up Cardíaco", "Arritmia"],
    valor: 400,
    pontuacao: 4.9,
    referencias: 234,
    planos: ["Particular", "Amil", "Bradesco Saúde"],
    registro: "CRM 54321-SP",
    atendimentoEmergencia: true
  },
  {
    id: 3,
    tipo: "Terapeuta",
    nome: "João Santos",
    foto: "/api/placeholder/150/150",
    especializacao: "Terapia Holística",
    formacao: {
      graduacao: "Naturologia - UNISUL",
      posGraduacao: "Especialização em Medicina Tradicional Chinesa",
      cursos: [
        "Certificação Internacional em Acupuntura",
        "Formação em Reiki - Nível Mestre",
        "Especialização em Terapias Integrativas"
      ]
    },
    atuacao: ["Acupuntura", "Reiki", "Meditação"],
    valor: 150,
    pontuacao: 4.7,
    referencias: 98,
    planos: ["Particular"],
    registro: "CRTH 789123",
    atendimentoOnline: true,
    atendeDomicilio: true
  }
];

const Dashboard = () => {
  const [menuAberto, setMenuAberto] = useState(false);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [profissionaisFiltrados] = useState(profissionaisSaude);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setMenuAberto(!menuAberto)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900"
              >
                <Menu size={24} />
              </button>
              <div className="ml-4 font-bold text-xl">Admin Dashboard</div>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Search size={22} className="text-gray-600" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <User size={22} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 transform ${
          menuAberto ? 'translate-x-0' : '-translate-x-full'
        } w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}>
          <div className="p-4">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Área da Saúde</h2>
              <div className="mt-2 space-y-1">
                <a href="#" className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Médicos</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Psicólogos</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Terapeutas</a>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Profissionais da Saúde</h1>
            <button 
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Filter size={20} />
              Filtros
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profissionaisFiltrados.map((profissional) => (
              <div key={profissional.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start gap-4">
                  <img
                    src={profissional.foto}
                    alt={profissional.nome}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  <div>
                    <span className="text-sm text-blue-600 font-medium">{profissional.tipo}</span>
                    <h2 className="text-xl font-semibold">{profissional.nome}</h2>
                    <p className="text-gray-600">{profissional.especializacao}</p>
                    <p className="text-sm text-gray-500">{profissional.registro}</p>
                  </div>
                </div>

                {/* Formação */}
                <div className="mt-4">
                  <div className="flex items-center mb-2">
                    <BookOpen className="text-blue-600 mr-2" size={20} />
                    <span className="font-medium">Formação Acadêmica</span>
                  </div>
                  <div className="ml-8 space-y-1">
                    <p className="text-sm text-gray-600">{profissional.formacao.graduacao}</p>
                    <p className="text-sm text-gray-600">{profissional.formacao.posGraduacao}</p>
                  </div>
                </div>

                {/* Cursos */}
                <div className="mt-4">
                  <div className="flex items-center mb-2">
                    <Award className="text-blue-600 mr-2" size={20} />
                    <span className="font-medium">Cursos e Certificações</span>
                  </div>
                  <div className="ml-8">
                    <ul className="list-disc list-inside space-y-1">
                      {profissional.formacao.cursos.map((curso, index) => (
                        <li key={index} className="text-sm text-gray-600">{curso}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Áreas de Atuação */}
                <div className="mt-4">
                  <div className="flex items-center mb-2">
                    <List className="text-blue-600 mr-2" size={20} />
                    <span className="font-medium">Áreas de Atuação</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profissional.atuacao.map((area, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Convênios */}
                <div className="mt-4">
                  <div className="flex items-center mb-2">
                    <DollarSign className="text-blue-600 mr-2" size={20} />
                    <span className="font-medium">Convênios</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profissional.planos.map((plano, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                        {plano}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="text-yellow-400" size={20} />
                    <span className="font-medium">{profissional.pontuacao}</span>
                    <span className="text-gray-500">({profissional.referencias} avaliações)</span>
                  </div>
                  <div className="text-xl font-bold text-green-600">
                    R$ {profissional.valor},00
                  </div>
                </div>

                <div className="mt-4">
                  {profissional.atendimentoOnline && (
                    <div className="text-sm text-green-600">✓ Atendimento Online</div>
                  )}
                  {profissional.atendimentoEmergencia && (
                    <div className="text-sm text-red-600">✓ Atendimento de Emergência</div>
                  )}
                  {profissional.atendeDomicilio && (
                    <div className="text-sm text-green-600">✓ Atendimento Domiciliar</div>
                  )}
                </div>

                <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Ver Detalhes
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;