import React, { useState, useEffect } from 'react';
import { 
  Menu, Search, User, BookOpen, Heart, Plus, X, Filter, Star, 
  DollarSign, Award 
} from 'lucide-react';

// Dados mockados para exemplo
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
        "Especialização em TCC",
        "Formação em EMDR",
        "Mindfulness"
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
      graduacao: "Medicina - USP",
      posGraduacao: "Residência em Cardiologia - InCor",
      cursos: [
        "Especialização em Ecocardiografia",
        "Fellowship em Cardiopatias",
        "Certificação em Arritmias"
      ]
    },
    atuacao: ["Hipertensão", "Check-up", "Arritmias"],
    valor: 400,
    pontuacao: 4.9,
    referencias: 234,
    planos: ["Particular", "Amil", "Sul América"],
    registro: "CRM 54321-SP",
    atendimentoEmergencia: true
  }
];

// Componente do Modal de Cadastro
const CadastroModal = ({ onClose }) => {
  const [step, setStep] = useState(1);

  // Estado que armazena os dados do formulário
  const [formData, setFormData] = useState({
    // Informações Básicas
    tipo: '',
    nome: '',
    foto: null,
    registro: '',
    especializacao: '',

    // Formação
    formacao: {
      graduacao: '',
      posGraduacao: '',
      cursos: ['']
    },

    // Atuação
    atuacao: [''],
    valor: '',
    planos: ['Particular'],

    // Atendimento
    atendimentoOnline: false,
    atendimentoEmergencia: false,
    atendeDomicilio: false
  });

  // Função para lidar com upload de foto (mantida do primeiro código)
  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          foto: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Controle dos passos
  const steps = [
    { number: 1, title: 'Informações Básicas' },
    { number: 2, title: 'Formação' },
    { number: 3, title: 'Atuação' },
    { number: 4, title: 'Atendimento' }
  ];

  const nextStep = () => setStep((prev) => Math.min(prev + 1, steps.length));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  // Renderização dos formulários de cada step
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Informações Básicas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Upload de Foto */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Foto do Profissional
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    {formData.foto ? (
                      <div className="flex flex-col items-center">
                        <img
                          src={formData.foto}
                          alt="Preview"
                          className="h-24 w-24 object-cover rounded-full"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, foto: null }))
                          }
                          className="mt-2 text-sm text-red-600 hover:text-red-700"
                        >
                          Remover foto
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Plus className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="text-gray-600">Clique para fazer upload</p>
                      </div>
                    )}
                    <input
                      type="file"
                      className="hidden"
                      onChange={handlePhotoUpload}
                      accept="image/*"
                    />
                  </div>
                </div>
              </div>

              {/* Categoria */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria
                </label>
                <select
                  value={formData.tipo}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, tipo: e.target.value }))
                  }
                  className="w-full rounded-lg border border-gray-300 p-2.5"
                >
                  <option value="">Selecione...</option>
                  <option value="Médico">Médico</option>
                  <option value="Psicólogo">Psicólogo</option>
                  <option value="Terapeuta">Terapeuta</option>
                </select>
              </div>

              {/* Nome Completo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, nome: e.target.value }))
                  }
                  className="w-full rounded-lg border border-gray-300 p-2.5"
                />
              </div>

              {/* Registro Profissional */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Registro Profissional
                </label>
                <input
                  type="text"
                  value={formData.registro}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, registro: e.target.value }))
                  }
                  className="w-full rounded-lg border border-gray-300 p-2.5"
                />
              </div>

              {/* Especialização */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Especialização
                </label>
                <input
                  type="text"
                  value={formData.especializacao}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      especializacao: e.target.value
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 p-2.5"
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Formação</h3>
            <div className="space-y-4">
              {/* Graduação */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Graduação
                </label>
                <input
                  type="text"
                  value={formData.formacao.graduacao}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      formacao: {
                        ...prev.formacao,
                        graduacao: e.target.value
                      }
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 p-2.5"
                  placeholder="Ex: Psicologia - USP"
                />
              </div>

              {/* Pós-Graduação */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pós-Graduação
                </label>
                <input
                  type="text"
                  value={formData.formacao.posGraduacao}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      formacao: {
                        ...prev.formacao,
                        posGraduacao: e.target.value
                      }
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 p-2.5"
                  placeholder="Ex: Mestrado em Psicologia Clínica"
                />
              </div>

              {/* Cursos */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Cursos e Especializações
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        formacao: {
                          ...prev.formacao,
                          cursos: [...prev.formacao.cursos, '']
                        }
                      }));
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    + Adicionar Curso
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.formacao.cursos.map((curso, index) => (
                    <input
                      key={index}
                      type="text"
                      value={curso}
                      onChange={(e) => {
                        const updatedCursos = [...formData.formacao.cursos];
                        updatedCursos[index] = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          formacao: {
                            ...prev.formacao,
                            cursos: updatedCursos
                          }
                        }));
                      }}
                      className="w-full rounded-lg border border-gray-300 p-2.5"
                      placeholder="Nome do curso"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Atuação</h3>
            <div className="space-y-4">
              {/* Áreas de Atuação */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Áreas de Atuação
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        atuacao: [...prev.atuacao, '']
                      }));
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    + Adicionar Área
                  </button>
                </div>
                {formData.atuacao.map((area, index) => (
                  <input
                    key={index}
                    type="text"
                    value={area}
                    onChange={(e) => {
                      const updatedAreas = [...formData.atuacao];
                      updatedAreas[index] = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        atuacao: updatedAreas
                      }));
                    }}
                    className="w-full rounded-lg border border-gray-300 p-2.5 mb-2"
                    placeholder="Ex: Ansiedade"
                  />
                ))}
              </div>

              {/* Valor da consulta */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor da Consulta
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    R$
                  </span>
                  <input
                    type="number"
                    value={formData.valor}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, valor: e.target.value }))
                    }
                    className="w-full rounded-lg border border-gray-300 p-2.5 pl-8"
                  />
                </div>
              </div>

              {/* Convênios */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Convênios
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        planos: [...prev.planos, '']
                      }));
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    + Adicionar Convênio
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.planos.map((plano, index) => (
                    <input
                      key={index}
                      type="text"
                      value={plano}
                      onChange={(e) => {
                        const updatedPlanos = [...formData.planos];
                        updatedPlanos[index] = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          planos: updatedPlanos
                        }));
                      }}
                      className="w-full rounded-lg border border-gray-300 p-2.5"
                      placeholder="Ex: Particular, Unimed, etc."
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Atendimento</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.atendimentoOnline}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      atendimentoOnline: e.target.checked
                    }))
                  }
                  className="h-4 w-4 text-blue-600 rounded border-gray-300"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Atendimento Online
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.atendimentoEmergencia}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      atendimentoEmergencia: e.target.checked
                    }))
                  }
                  className="h-4 w-4 text-blue-600 rounded border-gray-300"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Atendimento de Emergência
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.atendeDomicilio}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      atendeDomicilio: e.target.checked
                    }))
                  }
                  className="h-4 w-4 text-blue-600 rounded border-gray-300"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Atendimento Domiciliar
                </label>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Cabeçalho do Modal */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Cadastrar Profissional</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              <X size={24} className="text-gray-500" />
            </button>
          </div>

          {/* Barra de Progresso */}
          <div className="mt-6 flex justify-between">
            {steps.map((s) => (
              <div key={s.number} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= s.number
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {s.number}
                </div>
                <span className="mt-2 text-xs text-gray-600">{s.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Conteúdo do formulário */}
        <div className="p-6">{renderStepContent()}</div>

        {/* Rodapé do Modal (botões) */}
        <div className="p-6 border-t border-gray-200 flex justify-between">
          <button
            onClick={prevStep}
            className={`px-4 py-2 text-gray-600 rounded-lg border border-gray-300 hover:bg-gray-50 ${
              step === 1 ? 'invisible' : ''
            }`}
          >
            Voltar
          </button>
          <button
            onClick={step === steps.length ? onClose : nextStep}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {step === steps.length ? 'Concluir' : 'Próximo'}
          </button>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [menuAberto, setMenuAberto] = useState(false);
  const [mostrarCadastro, setMostrarCadastro] = useState(false);

  // ------------------------------------------------------------
  // ESTADO E LÓGICA DE FILTROS (adaptado do seu segundo código)
  // ------------------------------------------------------------
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [profissionaisFiltrados, setProfissionaisFiltrados] = useState(profissionaisSaude);

  // Estado local que controla todos os filtros
  const [filtros, setFiltros] = useState({
    busca: '',
    categoria: [],       // (antes chamava "tipo" no primeiro código)
    atuacao: [],
    convenios: [],
    notaMinima: '',
    valorMin: '',
    valorMax: '',
    tiposAtendimento: []
  });

  // Arrays com todas as opções únicas para os selects/checkboxes
  const todasCategorias = ['Médico', 'Psicólogo', 'Terapeuta'];
  const todasAtuacoes = Array.from(new Set(profissionaisSaude.flatMap(p => p.atuacao)));
  const todosConvenios = Array.from(new Set(profissionaisSaude.flatMap(p => p.planos)));
  const todosTiposAtendimento = [
    { id: 'atendimentoOnline', label: 'Atendimento Online' },
    { id: 'atendimentoEmergencia', label: 'Atendimento de Emergência' },
    { id: 'atendeDomicilio', label: 'Atendimento Domiciliar' }
  ];

  // useEffect que atualiza a lista de profissionaisFiltrados toda vez que "filtros" muda
  useEffect(() => {
    const filtrarProfissionais = () => {
      let resultado = profissionaisSaude;

      // 1) Filtro por texto (busca geral)
      if (filtros.busca) {
        const termoBusca = filtros.busca.toLowerCase();
        resultado = resultado.filter(p =>
          p.nome.toLowerCase().includes(termoBusca) ||
          p.especializacao.toLowerCase().includes(termoBusca) ||
          p.atuacao.some(area => area.toLowerCase().includes(termoBusca))
        );
      }

      // 2) Filtro por categoria (tipo)
      if (filtros.categoria.length > 0) {
        resultado = resultado.filter(p => filtros.categoria.includes(p.tipo));
      }

      // 3) Filtro por área de atuação
      if (filtros.atuacao.length > 0) {
        resultado = resultado.filter(p =>
          filtros.atuacao.some(area => p.atuacao.includes(area))
        );
      }

      // 4) Filtro por convênios
      if (filtros.convenios.length > 0) {
        resultado = resultado.filter(p =>
          filtros.convenios.some(conv => p.planos.includes(conv))
        );
      }

      // 5) Filtro por nota mínima
      if (filtros.notaMinima) {
        resultado = resultado.filter(p => p.pontuacao >= Number(filtros.notaMinima));
      }

      // 6) Filtro por faixa de valor
      if (filtros.valorMin) {
        resultado = resultado.filter(p => p.valor >= Number(filtros.valorMin));
      }
      if (filtros.valorMax) {
        resultado = resultado.filter(p => p.valor <= Number(filtros.valorMax));
      }

      // 7) Filtro por tipos de atendimento (checkboxes)
      if (filtros.tiposAtendimento.length > 0) {
        // Ex: [ 'atendimentoOnline', 'atendeDomicilio' ]
        resultado = resultado.filter(p =>
          filtros.tiposAtendimento.every(tipo => p[tipo])
        );
      }

      setProfissionaisFiltrados(resultado);
    };

    filtrarProfissionais();
  }, [filtros]);

  // Função para limpar todos os filtros
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

  // ------------------------------------------------------------
  // (FIM) ESTADO E LÓGICA DE FILTROS
  // ------------------------------------------------------------

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <nav className="bg-white shadow-md">
        <div className="max-w-full px-4">
          <div className="flex justify-between h-16">
            {/* Botão de menu + Logo */}
            <div className="flex items-center">
              <button
                onClick={() => setMenuAberto(true)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 md:hidden"
              >
                <Menu size={24} />
              </button>
              <div className="ml-4 font-bold text-xl">Admin Dashboard</div>
            </div>
            {/* Barra de busca + ícones do lado direito */}
            <div className="flex items-center space-x-6 pr-4">
              {/* Busca */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={filtros.busca}
                  onChange={(e) =>
                    setFiltros(prev => ({ ...prev, busca: e.target.value }))
                  }
                  className="w-64 px-4 py-2 pl-10 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
              </div>
              {/* Ícones */}
              <button className="p-2 rounded-full hover:bg-gray-100 relative">
                <BookOpen size={22} className="text-gray-600" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                  3
                </span>
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Heart size={22} className="text-gray-600" />
              </button>
              <div className="h-6 w-px bg-gray-200"></div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <User size={24} className="text-blue-600" />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-700">Admin</p>
                  <p className="text-gray-500">admin@exemplo.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Conteúdo principal com flex-1 */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`fixed md:relative w-64 h-screen bg-white top-0 left-0 transform transition-all duration-300 ease-in-out ${
            menuAberto ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          } z-30`}
        >
          <div className="flex flex-col h-full">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <img
                src="/api/placeholder/120/40"
                alt="Logo"
                className="mx-auto md:mx-0"
              />
              <button
                onClick={() => setMenuAberto(false)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <X size={24} className="text-gray-500" />
              </button>
            </div>
            <nav className="flex-1 p-4">
              <div className="mb-4">
                <div className="px-4 py-2 text-sm font-medium text-gray-600">
                  Área da Saúde
                </div>
                {/* Exemplo: se quiser filtrar só clicando aqui */}
                <a
                  href="#"
                  onClick={() =>
                    setFiltros(prev => ({
                      ...prev,
                      categoria: prev.categoria.includes('Médico')
                        ? prev.categoria // se já tiver "Médico", não mexe
                        : [...prev.categoria, 'Médico']
                    }))
                  }
                  className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
                >
                  Médicos
                </a>
                <a
                  href="#"
                  onClick={() =>
                    setFiltros(prev => ({
                      ...prev,
                      categoria: prev.categoria.includes('Psicólogo')
                        ? prev.categoria
                        : [...prev.categoria, 'Psicólogo']
                    }))
                  }
                  className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
                >
                  Psicólogos
                </a>
                <a
                  href="#"
                  onClick={() =>
                    setFiltros(prev => ({
                      ...prev,
                      categoria: prev.categoria.includes('Terapeuta')
                        ? prev.categoria
                        : [...prev.categoria, 'Terapeuta']
                    }))
                  }
                  className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
                >
                  Terapeutas
                </a>
              </div>
              <div className="mt-6">
                {/* Botão que abre o modal de cadastro */}
                <button
                  onClick={() => setMostrarCadastro(true)}
                  className="w-full px-4 py-2 flex items-center gap-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Plus size={20} />
                  Cadastrar Profissional
                </button>
              </div>
            </nav>
          </div>
        </aside>

        {/* Overlay para fechar menu em mobile */}
        {menuAberto && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
            onClick={() => setMenuAberto(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Profissionais da Saúde</h1>
            <div className="flex items-center gap-4">
              {/* Botão para abrir/fechar o painel de filtros avançados */}
              <button
                onClick={() => setMostrarFiltros(!mostrarFiltros)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Filter size={20} />
                Filtros
              </button>
            </div>
          </div>

          {/* Painel de Filtros Avançados (igual ao segundo código) */}
          {mostrarFiltros && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Filtro por Categoria Profissional */}
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
                    className="w-full rounded-md border border-gray-300 p-2"
                  >
                    {todasCategorias.map(cat => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Filtro por Área de Atuação */}
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
                    className="w-full rounded-md border border-gray-300 p-2"
                  >
                    {todasAtuacoes.map(area => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Filtro por Convênios */}
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
                    className="w-full rounded-md border border-gray-300 p-2"
                  >
                    {todosConvenios.map(conv => (
                      <option key={conv} value={conv}>
                        {conv}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Filtro por Valor (mínimo / máximo) */}
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
                      className="w-1/2 rounded-md border border-gray-300 p-2"
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
                      className="w-1/2 rounded-md border border-gray-300 p-2"
                    />
                  </div>
                </div>

                {/* Filtro por Nota Mínima */}
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
                    className="w-full rounded-md border border-gray-300 p-2"
                  >
                    <option value="">Todas</option>
                    <option value="4.5">4.5+</option>
                    <option value="4.0">4.0+</option>
                    <option value="3.5">3.5+</option>
                  </select>
                </div>

                {/* Filtro por Tipo de Atendimento (checkboxes) */}
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

              {/* Botões de Ação (Limpar / Aplicar) */}
              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={limparFiltros}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg border border-gray-300"
                >
                  Limpar Filtros
                </button>
                <button
                  onClick={() => setMostrarFiltros(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Aplicar Filtros
                </button>
              </div>
            </div>
          )}

          {/* Grid de Profissionais Filtrados */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profissionaisFiltrados.map((profissional) => (
              <div
                key={profissional.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
              >
                {/* Card Header */}
                <div className="flex items-start">
                  <img
                    src={profissional.foto}
                    alt={profissional.nome}
                    className="w-32 h-32 rounded-full object-cover"
                  />
                  <div className="ml-4">
                    <span className="text-sm text-blue-600 font-medium">
                      {profissional.tipo}
                    </span>
                    <h2 className="text-xl font-semibold">{profissional.nome}</h2>
                    <p className="text-gray-600">{profissional.especializacao}</p>
                    <p className="text-sm text-gray-500 mt-1">{profissional.registro}</p>
                  </div>
                </div>

                {/* Formação */}
                <div className="mt-4">
                  <div className="flex items-center mb-2">
                    <BookOpen className="text-blue-600 mr-2" size={20} />
                    <span className="font-medium">Formação</span>
                  </div>
                  <div className="ml-8 space-y-1">
                    <p className="text-sm text-gray-600">
                      {profissional.formacao.graduacao}
                    </p>
                    <p className="text-sm text-gray-600">
                      {profissional.formacao.posGraduacao}
                    </p>
                  </div>
                </div>

                {/* Cursos e Certificações */}
              <div className="mt-4">
                <div className="flex items-center mb-2">
                  <Award className="text-blue-600 mr-2" size={20} />
                  <span className="font-medium">Cursos e Certificações</span>
                </div>
                <div className="ml-8">
                  <ul className="list-disc list-inside space-y-1">
                    {profissional.formacao.cursos.map((curso, index) => (
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
                    <Award className="text-blue-600 mr-2" size={20} />
                    <span className="font-medium">Áreas de Atuação:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profissional.atuacao.map((area, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Convênios (se quiser mostrar) */}
                <div className="mt-4">
                  <div className="flex items-center mb-2">
                    <DollarSign className="text-blue-600 mr-2" size={20} />
                    <span className="font-medium">Convênios:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profissional.planos.map((plano, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                      >
                        {plano}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Avaliação e Valor */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <Star className="text-yellow-400 mr-1" size={20} />
                    <span className="font-medium">{profissional.pontuacao}</span>
                    <span className="text-gray-500 ml-1">
                      ({profissional.referencias} avaliações)
                    </span>
                  </div>
                  <div className="text-xl font-bold text-green-600">
                    R$ {profissional.valor},00
                  </div>
                </div>

                {/* Exemplo de botão "Ver Detalhes" */}
                <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Ver Detalhes
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white shadow-md mt-auto py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center items-center">
            <p className="text-gray-600 text-sm">
              Desenvolvido por{' '}
              <span className="font-semibold">Simões Tecnologia da Informação</span>
            </p>
          </div>
        </div>
      </footer>

      {/* Modal de Cadastro (exemplo, se quiser manter) */}
      {mostrarCadastro && <CadastroModal onClose={() => setMostrarCadastro(false)} />}
    </div>
  );
};

export default Dashboard;

