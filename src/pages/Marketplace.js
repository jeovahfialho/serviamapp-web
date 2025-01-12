import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Filter, User, BookOpen, Trophy,
  DollarSign, Award, Star, Phone, LayoutDashboard,
  ChevronDown, ChevronUp, Users , CheckCircle, Medal
} from 'lucide-react';
import ServianLogoText from '../components/ServianLogoText';
import SideComponents from '../components/SideComponents';

const MarketplacePage = () => {
  const navigate = useNavigate();
  const [profissionais, setProfissionais] = useState([]);
  const [profissionaisFiltrados, setProfissionaisFiltrados] = useState([]);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [busca, setBusca] = useState('');
  const [selectedProfContact, setSelectedProfContact] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});

  // Estado dos filtros
  const [filtros, setFiltros] = useState({
    categoria: [],
    atuacao: [],
    convenios: [],
    notaMinima: '',
    valorMin: '',
    valorMax: '',
    tiposAtendimento: [],
    faixaEtaria: [], // novo
    sexo: '', // novo
    estado: '', // novo
    cidade: '' // novo
  });

  // Arrays para os selects
  const [todasCategorias, setTodasCategorias] = useState([]);
  const [todasAtuacoes, setTodasAtuacoes] = useState([]);
  const [todosConvenios, setTodosConvenios] = useState([]);
  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);

  // Tipos de atendimento constantes
  const todosTiposAtendimento = [
    { id: 'atendimentoonline', label: 'Atendimento Online' },
    { id: 'atendimentoemergencia', label: 'Atendimento de Emergência' },
    { id: 'atendimentopresencial', label: 'Atendimento Presencial' }
  ];

  // Adicione as faixas etárias disponíveis
const faixasEtariasDisponiveis = [
  "crianças",
  "adolescentes",
  "adultos",
  "idosos"
];

  // Add this helper function to toggle sections
  const toggleSection = (profId, section) => {
    setExpandedSections(prev => ({
      ...prev,
      [profId]: {
        ...prev[profId],
        [section]: !prev[profId]?.[section]
      }
    }));
  };

  // Create a reusable section component
  const CollapsibleSection = ({ prof, sectionKey, icon: Icon, title, children }) => {
    const isExpanded = expandedSections[prof.id]?.[sectionKey];
    
    return (
      <div className="mt-1">
        <button 
          onClick={() => toggleSection(prof.id, sectionKey)}
          className="w-full flex items-center justify-between hover:bg-gray-50 rounded-lg p-1 transition-colors"
        >
          <div className="flex items-center">
            <Icon className="text-blue-600 mr-1.5 h-5 w-5" />
            <span className="font-medium text-gray-700">{title}</span>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </button>
        
        {isExpanded && (
          <div className="mt-0.5 pl-6">
            {children}
          </div>
        )}
      </div>
    );
  };

  const formatarNome = (nome) => {
    // Define o tamanho máximo (baseado no exemplo "Gabriela Teixeira da Silva")
    const MAX_LENGTH = 25;
    
    if (nome.length <= MAX_LENGTH) return nome;
    
    // Divide o nome em partes
    const partes = nome.split(' ');
    
    // Se tiver só duas partes, abrevia a última
    if (partes.length === 2) {
      return `${partes[0]} ${partes[1].charAt(0)}.`;
    }
    
    // Se tiver mais partes, mantém primeiro e último nome, abrevia os do meio
    const primeiroNome = partes[0];
    const ultimoNome = partes[partes.length - 1];
    const meiosAbreviados = partes.slice(1, -1).map(nome => `${nome.charAt(0)}.`);
    
    const nomeFormatado = [primeiroNome, ...meiosAbreviados, ultimoNome].join(' ');
    
    // Se ainda estiver muito longo, remove o último nome e adiciona a inicial
    if (nomeFormatado.length > MAX_LENGTH) {
      return `${primeiroNome} ${meiosAbreviados.join(' ')}${ultimoNome.charAt(0)}.`;
    }
    
    return nomeFormatado;
  };

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

    // Filtro por faixa etária
    if (filtros.faixaEtaria.length > 0) {
      resultado = resultado.filter(p =>
        filtros.faixaEtaria.some(faixa => p.faixa_etaria?.includes(faixa))
      );
    }

    // Filtro por sexo
    if (filtros.sexo) {
      resultado = resultado.filter(p => p.sexo === filtros.sexo);
    }

    // Filtro por estado
    if (filtros.estado) {
      resultado = resultado.filter(p => p.estado === filtros.estado);
    }

    // Filtro por cidade
    if (filtros.cidade) {
      resultado = resultado.filter(p => p.cidade === filtros.cidade);
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
        
        // Preencher estados e cidades únicos
        setEstados(Array.from(new Set(data.map(p => p.estado).filter(Boolean))));
        setCidades(Array.from(new Set(data.map(p => p.cidade).filter(Boolean))));

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
      tiposAtendimento: [],
      faixaEtaria: [], // novo
      sexo: '', // novo
      estado: '', // novo
      cidade: '' // novo
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
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <LayoutDashboard className="h-6 w-6" />
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
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Grid Layout - Agora com 4 colunas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Coluna Principal com Cards dos Profissionais */}
          <div className="lg:col-span-2 xl:col-span-3">
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
                      Formas de Atendimento
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

                  {/* Filtro de Faixa Etária */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Faixa Etária
                    </label>
                    <select
                      multiple
                      value={filtros.faixaEtaria}
                      onChange={(e) =>
                        setFiltros(prev => ({
                          ...prev,
                          faixaEtaria: Array.from(
                            e.target.selectedOptions,
                            option => option.value
                          )
                        }))
                      }
                      className="w-full rounded-lg border border-gray-300 p-2.5"
                    >
                      {faixasEtariasDisponiveis.map(faixa => (
                        <option key={faixa} value={faixa}>{faixa}</option>
                      ))}
                    </select>
                  </div>

                  {/* Filtro de Sexo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sexo
                    </label>
                    <select
                      value={filtros.sexo}
                      onChange={(e) =>
                        setFiltros(prev => ({
                          ...prev,
                          sexo: e.target.value
                        }))
                      }
                      className="w-full rounded-lg border border-gray-300 p-2.5"
                    >
                      <option value="">Todos</option>
                      <option value="M">Masculino</option>
                      <option value="F">Feminino</option>
                    </select>
                  </div>

                  {/* Filtro de Estado */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado
                    </label>
                    <select
                      value={filtros.estado}
                      onChange={(e) => {
                        setFiltros(prev => ({
                          ...prev,
                          estado: e.target.value,
                          cidade: '' // Limpa a cidade quando muda o estado
                        }))
                      }}
                      className="w-full rounded-lg border border-gray-300 p-2.5"
                    >
                      <option value="">Todos</option>
                      {estados.map(estado => (
                        <option key={estado} value={estado}>{estado}</option>
                      ))}
                    </select>
                  </div>

                  {/* Filtro de Cidade */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cidade
                    </label>
                    <select
                      value={filtros.cidade}
                      onChange={(e) =>
                        setFiltros(prev => ({
                          ...prev,
                          cidade: e.target.value
                        }))
                      }
                      disabled={!filtros.estado}
                      className="w-full rounded-lg border border-gray-300 p-2.5"
                    >
                      <option value="">Todas</option>
                      {cidades
                        .filter(cidade => {
                          const prof = profissionais.find(p => p.cidade === cidade);
                          return prof && prof.estado === filtros.estado;
                        })
                        .map(cidade => (
                          <option key={cidade} value={cidade}>{cidade}</option>
                        ))}
                    </select>
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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {profissionaisFiltrados.map((prof) => (
                <div key={prof.id} className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow">
                  {prof.pontuacao >= 4.8 && (
                    <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs font-bold px-3 py-1 rounded-tl-2xl rounded-br-2xl absolute">
                      TOP PROFISSIONAL
                    </div>
                  )}
                  <div className="p-6">
                    {/* Keep the header section as is */}
                    <div className="flex space-x-4 h-36"> {/* Altura fixa definida */}
                      {prof.foto ? (
                        <img
                          src={prof.foto}
                          alt={prof.nome}
                          className="h-20 w-20 rounded-full object-cover border-2 border-gray-100 flex-shrink-0"
                        />
                      ) : (
                        <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0">
                          <User className="h-8 w-8 text-blue-600" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0"> {/* min-w-0 permite que o texto quebre corretamente */}
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-blue-600 text-sm font-medium truncate">
                            {prof.tipo}
                          </span>
                          <div className="flex items-center gap-0.5">
                            <Medal className="h-5 w-5 text-yellow-400" />
                            <CheckCircle className="h-4 w-4 text-blue-500" />
                          </div>
                        </div>
                        <h3 className="font-semibold text-gray-900 truncate">
                          {formatarNome(prof.nome)}
                        </h3>
                        <p className="text-sm text-gray-600 truncate">{prof.registro}</p>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-3"> {/* Limita a 2 linhas */}
                          {Array.isArray(prof.especializacao) 
                            ? prof.especializacao.join(', ') 
                            : prof.especializacao}
                        </p>
                      </div>
                    </div>

                    {/* Replace static sections with CollapsibleSection */}
                    <CollapsibleSection 
                      prof={prof}
                      sectionKey="formacao"
                      icon={BookOpen}
                      title="Formação"
                    >
                      <div className="space-y-1">
                        {prof.graduacao?.map((grad, index) => (
                          <p key={index} className="text-sm text-gray-600">{grad}</p>
                        ))}
                        {prof.pos_graduacao?.map((pos, index) => (
                          <p key={index} className="text-sm text-gray-600">{pos}</p>
                        ))}
                      </div>
                    </CollapsibleSection>

                    <CollapsibleSection 
                      prof={prof}
                      sectionKey="cursos"
                      icon={Award}
                      title="Cursos e Certificações"
                    >
                      <ul className="list-disc list-inside space-y-1">
                        {prof.cursos?.map((curso, index) => (
                          <li key={index} className="text-sm text-gray-600">
                            {curso}
                          </li>
                        ))}
                      </ul>
                    </CollapsibleSection>

                    <CollapsibleSection 
                      prof={prof}
                      sectionKey="atuacao"
                      icon={Award}
                      title="Áreas de Atuação"
                    >
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
                    </CollapsibleSection>

                    <CollapsibleSection 
                      prof={prof}
                      sectionKey="convenios"
                      icon={DollarSign}
                      title="Convênios"
                    >
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
                    </CollapsibleSection>

                    <CollapsibleSection 
                      prof={prof}
                      sectionKey="atendimento"
                      icon={User}
                      title="Formas de Atendimento"
                    >
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
                    </CollapsibleSection>

                    {/* Nova seção de Faixa Etária */}
                    <CollapsibleSection 
                      prof={prof}
                      sectionKey="faixaEtaria"
                      icon={Users}
                      title="Faixa Etária"
                    >
                      <div className="flex flex-wrap gap-2">
                        {prof.faixa_etaria?.map((faixa, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm"
                          >
                            {faixa}
                          </span>
                        ))}
                        {!prof.faixa_etaria || prof.faixa_etaria.length === 0 && (
                          <span className="text-sm text-gray-500">
                            Não especificado
                          </span>
                        )}
                      </div>
                    </CollapsibleSection>

                    {/* Keep the footer section as is */}
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

                    {/* Keep the contact button section as is */}
                    <div className="mt-4">
                      <button 
                        onClick={() => setSelectedProfContact(
                          selectedProfContact === prof.id ? null : prof.id
                        )}
                        className="w-full flex items-center justify-center gap-2 bg-[#273440] text-white py-3 rounded-xl hover:bg-[#1e2832] transition-colors"
                      >
                        <Phone className="h-5 w-5" />
                        <span>Contatar Profissional</span>
                      </button>
                      
                      {selectedProfContact === prof.id && (
                        <div className="mt-2 flex items-center justify-between bg-gray-100 p-3 rounded-lg">
                          {prof.telefone && (
                            <a 
                              href={`https://wa.me/${prof.telefone}?text=Olá, cheguei até você por meio da Plataforma Serviam.`} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="flex items-center gap-2 text-green-600"
                            >
                              <Phone className="h-5 w-5 text-green-500" />
                              {prof.telefone}
                            </a>
                          )}
                          {prof.email && (
                            <span className="text-gray-700">{prof.email}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Coluna Lateral Direita - Nova */}
          <div className="space-y-6">
            {/* Card de Profissionais em Destaque */}

              {/* Adicione o novo componente */}
              <SideComponents 
                profissionais={profissionais}
                profissionaisFiltrados={profissionaisFiltrados}
              />

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