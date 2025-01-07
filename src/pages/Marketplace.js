import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Filter, User, BookOpen, Heart, 
  DollarSign, Award, Star, Phone
} from 'lucide-react';
import ServianLogoText from '../components/ServianLogoText';

const MarketplacePage = () => {
  const navigate = useNavigate();
  const [profissionais, setProfissionais] = useState([]);
  const [profissionaisFiltrados, setProfissionaisFiltrados] = useState([]);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [busca, setBusca] = useState('');

  // Estado dos filtros
  const [filtros, setFiltros] = useState({
    categoria: [],
    atuacao: [],
    convenios: [],
    notaMinima: '',
    valorMin: '',
    valorMax: '',
    tiposAtendimento: []
  });

  // Arrays para os selects
  const [todasCategorias, setTodasCategorias] = useState([]);
  const [todasAtuacoes, setTodasAtuacoes] = useState([]);
  const [todosConvenios, setTodosConvenios] = useState([]);

  // Tipos de atendimento constantes
  const todosTiposAtendimento = [
    { id: 'atendimentoOnline', label: 'Atendimento Online' },
    { id: 'atendimentoEmergencia', label: 'Atendimento de Emergência' },
    { id: 'atendimentoPresencial', label: 'Atendimento Presencial' }
  ];

  // Filtrar dados
  // Este é o novo useEffect que aplica os filtros
    useEffect(() => {
    let resultado = profissionais;
  
    // Filtro por texto (busca geral)
    if (busca) {
      const termoBusca = busca.toLowerCase();
      resultado = resultado.filter(p =>
        p.nome.toLowerCase().includes(termoBusca) ||
        p.tipo.toLowerCase().includes(termoBusca) ||
        p.atuacao.some(area => area.toLowerCase().includes(termoBusca))
      );
    }
  
    // Filtro por categoria (tipo)
    if (filtros.categoria.length > 0) {
      resultado = resultado.filter(p => filtros.categoria.includes(p.tipo));
    }
  
    // Filtro por área de atuação
    if (filtros.atuacao.length > 0) {
      resultado = resultado.filter(p =>
        filtros.atuacao.some(area => p.atuacao.includes(area))
      );
    }
  
    // Filtro por convênios
    if (filtros.convenios.length > 0) {
      resultado = resultado.filter(p =>
        filtros.convenios.some(conv => p.planos.includes(conv))
      );
    }
  
    // Filtro por nota mínima
    if (filtros.notaMinima) {
      resultado = resultado.filter(p => p.pontuacao >= Number(filtros.notaMinima));
    }
  
    // Filtro por faixa de valor
    if (filtros.valorMin) {
      resultado = resultado.filter(p => p.valor >= Number(filtros.valorMin));
    }
    if (filtros.valorMax) {
      resultado = resultado.filter(p => p.valor <= Number(filtros.valorMax));
    }
  
    // Filtro por tipos de atendimento
    if (filtros.tiposAtendimento.length > 0) {
      resultado = resultado.filter(p =>
        filtros.tiposAtendimento.every(tipo => p[tipo])
      );
    }
  
    setProfissionaisFiltrados(resultado);
  }, [profissionais, filtros, busca]); // dependências do useEffect
  
  // Carregar dados
  useEffect(() => {
    const fetchProfissionais = async () => {
      try {
        const response = await fetch('https://serviamapp-server.vercel.app/api/profissionais');
        const data = await response.json();
        setProfissionais(data);
        setProfissionaisFiltrados(data);
        
        // Preencher arrays de opções únicas
        setTodasCategorias(Array.from(new Set(data.map(p => p.tipo))));
        setTodasAtuacoes(Array.from(new Set(data.flatMap(p => p.atuacao))));
        setTodosConvenios(Array.from(new Set(data.flatMap(p => p.planos))));
      } catch (error) {
        console.error('Erro ao buscar profissionais:', error);
      }
    };

    fetchProfissionais();
  }, []);

  // Função para limpar filtros
  const limparFiltros = () => {
    setFiltros({
      busca: '',
      categoria: [],
      atuacao: [],
      convenios: [],
      notaMinima: '',
      valorMin: '',
      valorMax: '',
      tiposAtendimento: []
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-[#273440] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <ServianLogoText />
            
            {/* Área de busca */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar profissionais, especialidades..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                />
              </div>
            </div>

            {/* Ações */}
            <div className="flex items-center gap-4">
            <button
                onClick={() => setMostrarFiltros(!mostrarFiltros)}
                className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/10 rounded-lg"
            >
                <Filter className="h-5 w-5" />
                <span>Filtros</span>
            </button>
              <button 
                onClick={() => navigate('/login')}
                className="text-white hover:text-gray-200 transition-colors"
                >
                <User className="h-6 w-6" />
                </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="xl:col-span-2">
            {/* Banner/Hero Section */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-8 mb-8 text-white">
              <h1 className="text-3xl font-bold mb-4">
                Encontre os Melhores Profissionais
              </h1>
              <p className="text-lg opacity-90">
                Conectamos você aos melhores especialistas em saúde e bem-estar
              </p>
            </div>

            {/* Painel de Filtros Avançados */}
    {mostrarFiltros && (
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Categoria Profissional */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria Profissional
            </label>
            <select
              multiple
              value={filtros.categoria}
              onChange={(e) =>
                setFiltros(prev => ({
                  ...prev,
                  categoria: Array.from(
                    e.target.selectedOptions,
                    option => option.value
                  )
                }))
              }
              className="w-full rounded-lg border border-gray-300 p-2.5"
            >
              {todasCategorias.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Área de Atuação */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Área de Atuação
            </label>
            <select
              multiple
              value={filtros.atuacao}
              onChange={(e) =>
                setFiltros(prev => ({
                  ...prev,
                  atuacao: Array.from(
                    e.target.selectedOptions,
                    option => option.value
                  )
                }))
              }
              className="w-full rounded-lg border border-gray-300 p-2.5"
            >
              {todasAtuacoes.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>

          {/* Convênios */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Convênios
            </label>
            <select
              multiple
              value={filtros.convenios}
              onChange={(e) =>
                setFiltros(prev => ({
                  ...prev,
                  convenios: Array.from(
                    e.target.selectedOptions,
                    option => option.value
                  )
                }))
              }
              className="w-full rounded-lg border border-gray-300 p-2.5"
            >
              {todosConvenios.map(conv => (
                <option key={conv} value={conv}>{conv}</option>
              ))}
            </select>
          </div>

          {/* Filtro por Valor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Faixa de Valor (R$)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Mín"
                value={filtros.valorMin}
                onChange={(e) =>
                  setFiltros(prev => ({
                    ...prev,
                    valorMin: e.target.value
                  }))
                }
                className="w-1/2 rounded-lg border border-gray-300 p-2.5"
              />
              <input
                type="number"
                placeholder="Máx"
                value={filtros.valorMax}
                onChange={(e) =>
                  setFiltros(prev => ({
                    ...prev,
                    valorMax: e.target.value
                  }))
                }
                className="w-1/2 rounded-lg border border-gray-300 p-2.5"
              />
            </div>
          </div>

          {/* Avaliação Mínima */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Avaliação Mínima
            </label>
            <select
              value={filtros.notaMinima}
              onChange={(e) =>
                setFiltros(prev => ({
                  ...prev,
                  notaMinima: e.target.value
                }))
              }
              className="w-full rounded-lg border border-gray-300 p-2.5"
            >
              <option value="">Todas</option>
              <option value="4.5">4.5+</option>
              <option value="4.0">4.0+</option>
              <option value="3.5">3.5+</option>
            </select>
          </div>

          {/* Tipo de Atendimento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Atendimento
            </label>
            <div className="space-y-2">
              {todosTiposAtendimento.map(tipo => (
                <label key={tipo.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filtros.tiposAtendimento.includes(tipo.id)}
                    onChange={(e) => {
                      const novosTipos = e.target.checked
                        ? [...filtros.tiposAtendimento, tipo.id]
                        : filtros.tiposAtendimento.filter(t => t !== tipo.id);
                      setFiltros(prev => ({
                        ...prev,
                        tiposAtendimento: novosTipos
                      }));
                    }}
                    className="rounded border-gray-300 text-blue-600 mr-2"
                  />
                  {tipo.label}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={limparFiltros}
            className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg border border-gray-300"
          >
            Limpar Filtros
          </button>
          <button
            onClick={() => setMostrarFiltros(false)}
            className="px-4 py-2 bg-[#273440] text-white rounded-lg hover:bg-[#1e2832]"
          >
            Aplicar Filtros
          </button>
        </div>
      </div>
    )}
    
            {/* Profissionais Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profissionaisFiltrados.map((prof) => (
                <div key={prof.id} className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex space-x-4">
                    {prof.foto ? (
                    <img
                        src={prof.foto}
                        alt={prof.nome}
                        className="h-20 w-20 rounded-full object-cover border-2 border-gray-100"
                    />
                    ) : (
                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                        <User className="h-8 w-8 text-blue-600" />
                    </div>
                    )}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                        <span className="text-blue-600 text-sm font-medium">
                        {prof.tipo}
                        </span>
                          <button className="text-gray-400 hover:text-red-500 transition-colors">
                            <Heart className="h-5 w-5" />
                          </button>
                        </div>
                        <h3 className="font-semibold text-gray-900">{prof.nome}</h3>
                        <p className="text-sm text-gray-600">{prof.registro}</p>
                        {/* Adicionando especialização abaixo do nome */}
                        <p className="text-sm text-gray-600 mt-1">
                        {Array.isArray(prof.especializacao) 
                            ? prof.especializacao.join(', ') 
                            : prof.especializacao}
                        </p>
                      </div>
                    </div>

                    {/* Formação */}
                    <div className="mt-4">
                      <div className="flex items-center mb-2">
                        <BookOpen className="text-blue-600 mr-2 h-5 w-5" />
                        <span className="font-medium text-gray-700">Formação</span>
                      </div>
                      <div className="pl-7 space-y-1">
                        {prof.graduacao?.map((grad, index) => (
                          <p key={index} className="text-sm text-gray-600">{grad}</p>
                        ))}
                        {prof.pos_graduacao?.map((pos, index) => (
                          <p key={index} className="text-sm text-gray-600">{pos}</p>
                        ))}
                      </div>
                    </div>

                    {/* Cursos e Certificações */}
                    <div className="mt-4">
                      <div className="flex items-center mb-2">
                        <Award className="text-blue-600 mr-2 h-5 w-5" />
                        <span className="font-medium text-gray-700">Cursos e Certificações</span>
                      </div>
                      <div className="pl-7">
                        <ul className="list-disc list-inside space-y-1">
                          {prof.cursos?.map((curso, index) => (
                            <li key={index} className="text-sm text-gray-600">
                              {curso}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Áreas de Atuação */}
                    <div className="mt-4">
                      <div className="flex items-center mb-2">
                        <Award className="text-blue-600 mr-2 h-5 w-5" />
                        <span className="font-medium text-gray-700">Áreas de Atuação</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                      {prof.atuacao?.map((area, index) => (
                        <span
                            key={index}
                            className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                        >
                            {area}
                        </span>
                        ))}
                      </div>
                    </div>

                    {/* Convênios */}
                    <div className="mt-4">
                      <div className="flex items-center mb-2">
                        <DollarSign className="text-blue-600 mr-2 h-5 w-5" />
                        <span className="font-medium text-gray-700">Convênios</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {prof.planos?.map((plano, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                          >
                            {plano}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Formas de Atendimento - Adicionando o título */}
                    <div className="mt-4">
                    <div className="flex items-center mb-2">
                        <User className="text-blue-600 mr-2 h-5 w-5" />
                        <span className="font-medium text-gray-700">Formas de Atendimento</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {prof.atendimentoonline && (
                        <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                            Online
                        </span>
                        )}
                        {prof.atendimentopresencial && (
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                            Presencial
                        </span>
                        )}
                        {prof.atendimentoemergencia && (
                        <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm">
                            Emergência
                        </span>
                        )}
                    </div>
                    </div>
                    {/* Footer com avaliação e valor */}
                    <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex items-center">
                        <Star className="h-5 w-5 text-yellow-400" />
                        <span className="ml-1 font-medium">{prof.pontuacao}</span>
                        <span className="mx-1 text-gray-300">•</span>
                        <span className="text-gray-600">{prof.referencias} avaliações</span>
                      </div>
                      <div className="text-lg font-bold text-gray-900">
                        {Number(prof.valor) === 0 
                          ? "Valor a Consultar" 
                          : `R$ ${Number(prof.valor).toFixed(2)}`
                        }
                      </div>
                    </div>

                    {/* Botão de contato */}
                    <button className="mt-4 w-full flex items-center justify-center gap-2 bg-[#273440] text-white py-3 rounded-xl hover:bg-[#1e2832] transition-colors">
                      <Phone className="h-5 w-5" />
                      <span>Contatar Profissional</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

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

export default MarketplacePage;