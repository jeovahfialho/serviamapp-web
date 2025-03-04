import React, { useState, useEffect } from 'react';
import { ArrowUpDown, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox
} from '@mui/material';

const TabelaProfissionais = ({ 
  profissionais, 
  selectedRows, 
  setSelectedRows, 
  expandedRows, 
  toggleRow,
  getStatusColor, 
  getStatusText,
  ActionMenu,
  updateStatus,
  toggleVerificado,
  fetchProfissionais
}) => {
  const [ordenacao, setOrdenacao] = useState({ campo: null, direcao: 'asc' });
  const [dadosOrdenados, setDadosOrdenados] = useState([]);

  // Estados para paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina, setItensPorPagina] = useState(10);

  const [filtros, setFiltros] = useState({
    status: '',
    dataInicio: '',
    dataFim: ''
  });

  // Opções de itens por página
  const opcoesItensPorPagina = [5, 10, 20, 50, 100];

  useEffect(() => {
    // Primeiro filtra por campos obrigatórios
    let dadosFiltrados = profissionais?.filter(prof => 
      prof.nome?.trim() && prof.cpf?.trim()
    ) || [];
  
    // Aplica filtros de status e data
    if (filtros.status) {
      dadosFiltrados = dadosFiltrados.filter(prof => 
        prof.status === filtros.status
      );
    }
  
    if (filtros.dataInicio) {
      dadosFiltrados = dadosFiltrados.filter(prof => {
        const dataCriacao = new Date(prof.created_at);
        const dataInicio = new Date(filtros.dataInicio);
        return dataCriacao >= dataInicio;
      });
    }
  
    if (filtros.dataFim) {
      dadosFiltrados = dadosFiltrados.filter(prof => {
        const dataCriacao = new Date(prof.created_at);
        const dataFim = new Date(filtros.dataFim);
        dataFim.setHours(23, 59, 59); // Inclui todo o último dia
        return dataCriacao <= dataFim;
      });
    }
  
    // Aplica ordenação se houver um campo de ordenação definido
    if (ordenacao.campo) {
      dadosFiltrados.sort((a, b) => {
        let valorA = a[ordenacao.campo];
        let valorB = b[ordenacao.campo];
        
        // Tratamento especial para arrays
        if (Array.isArray(valorA)) {
          valorA = valorA.join(', ');
        }
        if (Array.isArray(valorB)) {
          valorB = valorB.join(', ');
        }
        
        // Tratamento para valores booleanos
        if (typeof valorA === 'boolean') {
          return ordenacao.direcao === 'asc' ? 
            (valorA === valorB ? 0 : valorA ? -1 : 1) : 
            (valorA === valorB ? 0 : valorA ? 1 : -1);
        }
        
        // Tratamento para valores nulos
        if (valorA === null) return 1;
        if (valorB === null) return -1;
        
        if (typeof valorA === 'string') {
          valorA = valorA.toLowerCase();
          valorB = valorB.toLowerCase();
        }
        
        if (ordenacao.direcao === 'asc') {
          return valorA > valorB ? 1 : -1;
        } else {
          return valorA < valorB ? 1 : -1;
        }
      });
    }
  
    setDadosOrdenados(dadosFiltrados);
    
    // Reseta para primeira página quando filtros mudam
    setPaginaAtual(1);
  }, [profissionais, filtros, ordenacao]);
  

  // Calcula dados paginados
  const indiceInicial = (paginaAtual - 1) * itensPorPagina;
  const indiceFinal = indiceInicial + itensPorPagina;
  const dadosPaginados = dadosOrdenados.slice(indiceInicial, indiceFinal);

  // Calcula total de páginas
  const totalPaginas = Math.ceil(dadosOrdenados.length / itensPorPagina);

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
    fetchProfissionais(); // Atualiza a lista após a ação
  };

  const ordenarDados = (campo) => {
    const novaDirecao = 
      ordenacao.campo === campo && ordenacao.direcao === 'asc' ? 'desc' : 'asc';
    
    setOrdenacao({ campo, direcao: novaDirecao });
  };

  const HeaderCell = ({ campo, texto }) => (
    <th 
      scope="col" 
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer group"
      onClick={() => ordenarDados(campo)}
    >
      <div className="flex items-center gap-2">
        {texto}
        <ArrowUpDown 
          className={`h-4 w-4 transition-colors ${
            ordenacao.campo === campo ? 'text-blue-600' : 'text-gray-400'
          }`}
        />
      </div>
    </th>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
      <h3 className="text-lg font-semibold mb-4">Lista de Profissionais</h3>

      {/* Seção de Filtros Melhorada */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200 shadow-sm">
        <div className="flex items-center space-x-4">
          {/* Filtro de Status */}
          <div className="relative flex-grow">
            <select
              value={filtros.status}
              onChange={(e) => setFiltros(prev => ({ ...prev, status: e.target.value }))}
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                         appearance-none bg-white"
            >
              <option value="">Todos os Status</option>
              <option value="pending">Pendente</option>
              <option value="approved">Aprovado</option>
              <option value="rejected">Rejeitado</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Contêiner de Datas */}
          <div className="flex items-center space-x-2 flex-grow">
            <div className="relative flex-grow">
              <input
                type="date"
                value={filtros.dataInicio}
                onChange={(e) => setFiltros(prev => ({ ...prev, dataInicio: e.target.value }))}
                className="w-full pl-8 pr-2 py-2 border border-gray-300 rounded-md text-sm text-gray-700 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Data Inicial"
              />
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            <span className="text-gray-500 font-medium">até</span>

            <div className="relative flex-grow">
              <input
                type="date"
                value={filtros.dataFim}
                onChange={(e) => setFiltros(prev => ({ ...prev, dataFim: e.target.value }))}
                className="w-full pl-8 pr-2 py-2 border border-gray-300 rounded-md text-sm text-gray-700 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Data Final"
              />
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Botão Limpar */}
          <button
            onClick={() => setFiltros({ status: '', dataInicio: '', dataFim: '' })}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 
                       transition-colors duration-200 flex items-center space-x-2 
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            <span>Limpar</span>
          </button>
        </div>
      </div>

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
              <HeaderCell campo="nome" texto="Nome" />
              <HeaderCell campo="tipo" texto="Categoria" />
              <HeaderCell campo="instagram" texto="Instagram" />
              <HeaderCell campo="atuacao" texto="Áreas de Atuação" />
              <HeaderCell campo="verificado" texto="Verificado" />
              <HeaderCell campo="status" texto="Status" />
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {dadosPaginados.map((prof) => (
              <React.Fragment key={prof.id}>
                <tr className="hover:bg-gray-50 cursor-pointer">
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
                    <td colSpan="7" className="px-6 py-4">
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

      {/* Seção de Paginação */}
      <div className="flex items-center justify-between mt-4 px-4">
        {/* Seletor de Itens por Página */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">Mostrar</span>
          <select
            value={itensPorPagina}
            onChange={(e) => {
              setItensPorPagina(Number(e.target.value));
              setPaginaAtual(1); // Reseta para primeira página
            }}
            className="rounded-md border border-gray-300 text-sm py-1 px-2"
          >
            {opcoesItensPorPagina.map((opcao) => (
              <option key={opcao} value={opcao}>
                {opcao}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-700">por página</span>
        </div>

        {/* Controles de Navegação */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">
            Página {paginaAtual} de {totalPaginas}
          </span>
          <button
            onClick={() => setPaginaAtual(prev => Math.max(1, prev - 1))}
            disabled={paginaAtual === 1}
            className="p-2 rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => setPaginaAtual(prev => Math.min(totalPaginas, prev + 1))}
            disabled={paginaAtual === totalPaginas}
            className="p-2 rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

    </div>
  );
};

export default TabelaProfissionais;