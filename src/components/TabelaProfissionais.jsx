import React, { useState, useEffect } from 'react';
import { ArrowUpDown, ChevronDown } from 'lucide-react';

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

  useEffect(() => {
    setDadosOrdenados(profissionais || []);
  }, [profissionais]);

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
    
    const dadosOrdenados = [...profissionais].sort((a, b) => {
      let valorA = a[campo];
      let valorB = b[campo];
      
      // Tratamento especial para arrays
      if (Array.isArray(valorA)) {
        valorA = valorA.join(', ');
      }
      if (Array.isArray(valorB)) {
        valorB = valorB.join(', ');
      }
      
      // Tratamento para valores booleanos
      if (typeof valorA === 'boolean') {
        return novaDirecao === 'asc' ? 
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
      
      if (novaDirecao === 'asc') {
        return valorA > valorB ? 1 : -1;
      } else {
        return valorA < valorB ? 1 : -1;
      }
    });

    setDadosOrdenados(dadosOrdenados);
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
            {dadosOrdenados.map((prof) => (
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
    </div>
  );
};

export default TabelaProfissionais;