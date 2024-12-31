import React, { useState, useEffect } from 'react';
import { 
  Menu, Search, User, BookOpen, Heart, Plus, X, Filter, Star, 
  DollarSign, Award 
} from 'lucide-react';

import { NhostClient } from '@nhost/nhost-js';

// Configuração do cliente Nhost
const nhost = new NhostClient({
  subdomain: 'serviam-app', // seu subdomínio
  region: 'sa-east-1'       // sua região
});

const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://serviamapp-server.vercel.app/api'
  : 'http://localhost:3001/api';

// Componente do Modal de Cadastro
const CadastroModal = ({ onClose }) => {
  const [step, setStep] = useState(1);

  // Estado que armazena os dados do formulário
  const [formData, setFormData] = useState({
    tipo: '',
    nome: '',
    foto: null,
    registro: '',
    telefone: '',        // Novo campo
    especializacao: [''],
    graduacao: [''],
    pos_graduacao: [''],
    cursos: [''],
    atuacao: [''],
    valor: '',
    planos: ['Particular'],
    atendimentoOnline: false,
    atendimentoEmergencia: false,
    atendimentopresencial: false
  });

  // Função para lidar com upload de foto (mantida do primeiro código)
  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        console.log('Iniciando upload...'); // para debug
        
        // Upload para o Nhost Storage
        const { error, fileMetadata } = await nhost.storage.upload({
          file,
          bucketId: 'default'
        });
  
        if (error) {
          throw error;
        }
  
        // Pegar a URL pública do arquivo
        const fileUrl = nhost.storage.getPublicUrl({
          fileId: fileMetadata.id
        });
  
        console.log('URL da imagem:', fileUrl); // para debug
  
        setFormData(prev => ({
          ...prev,
          foto: fileUrl
        }));
  
      } catch (error) {
        console.error('Erro no upload da foto:', error);
        alert('Erro ao fazer upload da imagem: ' + error.message);
      }
    }
  };

  // Função de submit - ADICIONE AQUI
  const handleSubmit = async () => {
    try {
      // Remover campos vazios dos arrays
      const dataToSend = {
        tipo: formData.tipo,
        nome: formData.nome,
        foto: formData.foto,
        registro: formData.registro,
        telefone: formData.telefone,
        especializacao: formData.especializacao.filter(item => item.trim() !== ''),
        graduacao: formData.graduacao.filter(item => item.trim() !== ''),
        pos_graduacao: formData.pos_graduacao.filter(item => item.trim() !== ''),
        cursos: formData.cursos.filter(item => item.trim() !== ''),
        atuacao: formData.atuacao.filter(item => item.trim() !== ''),
        valor: formData.valor,
        planos: formData.planos.filter(item => item.trim() !== ''),
        atendimentoonline: formData.atendimentoOnline,
        atendimentoemergencia: formData.atendimentoEmergencia,
        atendimentopresencial: formData.atendimentopresencial
      };
  
      console.log('Dados a serem enviados:', dataToSend); // Para debug
  
      const response = await fetch('https://serviamapp-server.vercel.app/api/profissionais', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log('Resposta do servidor:', result); // Para debug
        onClose();
        window.location.reload();
      } else {
        const error = await response.json();
        console.error('Erro ao cadastrar:', error);
        alert('Erro ao cadastrar profissional: ' + (error.message || 'Erro desconhecido'));
      }
    } catch (error) {
      console.error('Erro ao enviar dados:', error);
      alert('Erro ao cadastrar profissional: ' + error.message);
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
                      <label className="cursor-pointer flex flex-col items-center">
                        <Plus className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="text-gray-600">Clique para fazer upload</p>
                        <input
                          type="file"
                          className="hidden"
                          onChange={handlePhotoUpload}
                          accept="image/*"
                        />
                      </label>
                    )}
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

              {/* Telefone - NOVO CAMPO */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone
                </label>
                <input
                  type="tel"
                  value={formData.telefone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, telefone: e.target.value }))
                  }
                  placeholder="(11) 99999-9999"
                  className="w-full rounded-lg border border-gray-300 p-2.5"
                />
              </div>

              {/* Especialização - agora múltipla */}
              <div className="col-span-2">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Especializações
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        especializacao: [...prev.especializacao, '']
                      }));
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    + Adicionar Especialização
                  </button>
                </div>
                {formData.especializacao.map((esp, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={esp}
                      onChange={(e) => {
                        const updatedEsp = [...formData.especializacao];
                        updatedEsp[index] = e.target.value;
                        setFormData(prev => ({
                          ...prev,
                          especializacao: updatedEsp
                        }));
                      }}
                      className="w-full rounded-lg border border-gray-300 p-2.5"
                      placeholder="Ex: Cardiologia"
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          const updatedEsp = formData.especializacao.filter((_, i) => i !== index);
                          setFormData(prev => ({
                            ...prev,
                            especializacao: updatedEsp
                          }));
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                ))}
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
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Graduação
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        graduacao: [...prev.graduacao, '']
                      }));
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    + Adicionar Graduação
                  </button>
                </div>
                {formData.graduacao.map((grad, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={grad}
                      onChange={(e) => {
                        const updatedGrad = [...formData.graduacao];
                        updatedGrad[index] = e.target.value;
                        setFormData(prev => ({
                          ...prev,
                          graduacao: updatedGrad
                        }));
                      }}
                      className="w-full rounded-lg border border-gray-300 p-2.5"
                      placeholder="Ex: Medicina - USP"
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          const updatedGrad = formData.graduacao.filter((_, i) => i !== index);
                          setFormData(prev => ({
                            ...prev,
                            graduacao: updatedGrad
                          }));
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Pós-Graduação */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Pós-Graduação
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        pos_graduacao: [...prev.pos_graduacao, '']
                      }));
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    + Adicionar Pós-Graduação
                  </button>
                </div>
                {formData.pos_graduacao.map((pos, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={pos}
                      onChange={(e) => {
                        const updatedPos = [...formData.pos_graduacao];
                        updatedPos[index] = e.target.value;
                        setFormData(prev => ({
                          ...prev,
                          pos_graduacao: updatedPos
                        }));
                      }}
                      className="w-full rounded-lg border border-gray-300 p-2.5"
                      placeholder="Ex: Mestrado em Cardiologia"
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          const updatedPos = formData.pos_graduacao.filter((_, i) => i !== index);
                          setFormData(prev => ({
                            ...prev,
                            pos_graduacao: updatedPos
                          }));
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                ))}
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
                        cursos: [...prev.cursos, '']
                      }));
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    + Adicionar Curso
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.cursos.map((curso, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={curso}
                        onChange={(e) => {
                          const updatedCursos = [...formData.cursos];
                          updatedCursos[index] = e.target.value;
                          setFormData((prev) => ({
                            ...prev,
                            cursos: updatedCursos
                          }));
                        }}
                        className="w-full rounded-lg border border-gray-300 p-2.5"
                        placeholder="Nome do curso"
                      />
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            const updatedCursos = formData.cursos.filter((_, i) => i !== index);
                            setFormData(prev => ({
                              ...prev,
                              cursos: updatedCursos
                            }));
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X size={20} />
                        </button>
                      )}
                    </div>
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
                  checked={formData.atendimentoPresencial}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      atendimentoPresencial: e.target.checked
                    }))
                  }
                  className="h-4 w-4 text-blue-600 rounded border-gray-300"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Atendimento Presencial
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
    // No componente CadastroModal, ajuste a div principal
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto"> {/* Reduzido de 3xl para 2xl e 90vh para 80vh */}
        {/* Cabeçalho do Modal */}
        <div className="p-4 border-b border-gray-200"> {/* Reduzido padding de 6 para 4 */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Cadastrar Profissional</h2> {/* Reduzido de 2xl para xl */}
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full"> {/* Reduzido padding */}
              <X size={20} className="text-gray-500" /> {/* Reduzido tamanho do ícone */}
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
            onClick={step === steps.length ? handleSubmit : nextStep}
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
  const [profissionaisFiltrados, setProfissionaisFiltrados] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  const [mostrarFiltros, setMostrarFiltros] = useState(false); // Este estava faltando

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
  const todasCategorias = Array.from(new Set(profissionais.map(p => p.tipo)));
  const todasAtuacoes = Array.from(new Set(profissionais.flatMap(p => p.atuacao)));
  const todosConvenios = Array.from(new Set(profissionais.flatMap(p => p.planos)));
  const todosTiposAtendimento = [
    { id: 'atendimentoOnline', label: 'Atendimento Online' },
    { id: 'atendimentoEmergencia', label: 'Atendimento de Emergência' },
    { id: 'atendeDomicilio', label: 'Atendimento Presencial' }
  ];


  // Efeito para carregar dados da API
  useEffect(() => {
    const fetchProfissionais = async () => {
      try {
        const response = await fetch('https://serviamapp-server.vercel.app/api/profissionais');
        const data = await response.json();
        console.log('Dados da API:', data); // Adicione este log
        setProfissionais(data);
        setProfissionaisFiltrados(data);
      } catch (error) {
        console.error('Erro ao buscar profissionais:', error);
      }
    };

    fetchProfissionais();
  }, []);

  // useEffect que atualiza a lista de profissionaisFiltrados toda vez que "filtros" muda
  useEffect(() => {
    const filtrarProfissionais = () => {
      let resultado = profissionais;

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
                  <p className="text-gray-600">
                    {Array.isArray(profissional.especializacao) 
                      ? profissional.especializacao.join(', ') 
                      : profissional.especializacao}
                  </p>
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
                  {profissional.graduacao?.map((grad, index) => (
                    <p key={index} className="text-sm text-gray-600">{grad}</p>
                  ))}
                  {profissional.pos_graduacao?.map((pos, index) => (
                    <p key={index} className="text-sm text-gray-600">{pos}</p>
                  ))}
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
                    {profissional.cursos?.map((curso, index) => (
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
                  {profissional.atuacao?.map((area, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            
              {/* Convênios */}
              <div className="mt-4">
                <div className="flex items-center mb-2">
                  <DollarSign className="text-blue-600 mr-2" size={20} />
                  <span className="font-medium">Convênios:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profissional.planos?.map((plano, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                    >
                      {plano}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tipos de Atendimento - NOVO */}
              <div className="mt-4">
                <div className="flex items-center mb-2">
                  <User className="text-blue-600 mr-2" size={20} />
                  <span className="font-medium">Tipos de Atendimento:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profissional.atendimentoonline && (
                    <span className="px-2 py-1 bg-green-50 text-green-600 rounded-full text-sm">
                      Online
                    </span>
                  )}
                  {profissional.atendimentopresencial && (
                    <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                      Presencial
                    </span>
                  )}
                  {profissional.atendimentoemergencia && (
                    <span className="px-2 py-1 bg-red-50 text-red-600 rounded-full text-sm">
                      Emergência
                    </span>
                  )}
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
                  R$ {Number(profissional.valor).toFixed(2)}
                </div>
              </div>
            
              {/* Botão "Ver Detalhes" */}
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

