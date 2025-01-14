import React, {  } from 'react';
import { 
  Award, Star, Users, Quote, ArrowRight, Trophy, 
  Percent, Brain
} from 'lucide-react';
import { MdVerified } from 'react-icons/md';
import CompactSmartSearch from './CompactSmartSearch'; // Adicionar esta linha

const SideComponents = ({ profissionais = [], profissionaisFiltrados = [], setProfissionaisFiltrados, setSelectedProfReview  }) => {

  // Cálculo das estatísticas
  // Parte do cálculo das estatísticas no SideComponents
  const calculaEstatisticas = React.useMemo(() => {
    // Filtra profissionais que têm pontuação maior que 0 para não afetar a média
    const profissionaisComAvaliacao = profissionais.filter(prof => 
      prof.pontuacao && Number(prof.pontuacao) > 0
    );

    const satisfacaoMedia = profissionaisComAvaliacao.length 
      ? profissionaisComAvaliacao.reduce((sum, prof) => sum + Number(prof.pontuacao), 0) / profissionaisComAvaliacao.length 
      : 0;

    const totalConsultas = profissionais.reduce((sum, prof) => sum + (prof.referencias || 0), 0);
    const profissionaisVerificados = profissionais.filter(prof => prof.verificado).length;
    const especialidadesUnicas = new Set(profissionais.flatMap(prof => prof.atuacao || [])).size;

    return {
      totalConsultas,
      satisfacaoMedia: Number(satisfacaoMedia.toFixed(1)),
      profissionaisVerificados,
      especialidadesUnicas
    };
  }, [profissionais]);


  return (
    <div className="space-y-6">

      {/* Busca Inteligente */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center">
          <Brain className="h-5 w-5 text-indigo-500 mr-2" />
          Encontre seu Especialista
        </h3>
        <div className="space-y-4">
          <CompactSmartSearch 
            profissionais={profissionais}
            onSearch={(results) => setProfissionaisFiltrados(results)}
          />
        </div>
      </div>

      {/* Profissionais Destaque */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center">
          <Award className="h-5 w-5 text-yellow-500 mr-2" />
          Profissionais Destaque
        </h3>
        <div className="space-y-4">
          {profissionaisFiltrados
            .filter(prof => prof.pontuacao >= 4.8)
            .slice(0, 3)
            .map(prof => (
              <div key={prof.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                {prof.foto ? (
                  <img src={prof.foto} alt={prof.nome} className="h-12 w-12 rounded-full object-cover" />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-medium text-sm">{prof.nome}</p>
                  <p className="text-sm text-gray-500">{prof.tipo}</p>
                  <div className="flex items-center mt-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">{prof.pontuacao}</span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Card de Conquistas da Plataforma */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center">
            <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
            Conquistas da Plataforma
        </h3>
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-yellow-50 rounded-xl p-4 text-center">
            <div className="flex justify-center mb-2">
                <Users className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="text-2xl font-bold text-yellow-700">
                {profissionais.filter(prof => prof.status === 'approved').length}
            </div>
            <div className="text-sm text-yellow-600">
                Profissionais Cadastrados
            </div>
            </div>

            <div className="bg-green-50 rounded-xl p-4 text-center">
            <div className="flex justify-center mb-2">
                <Star className="h-8 w-8 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-green-700">
              {calculaEstatisticas.satisfacaoMedia}
            </div>
            <div className="text-sm text-green-600">
                Satisfação Média
            </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 text-center">
            <div className="flex justify-center mb-2">
                <MdVerified className="h-8 w-8 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-blue-700">
                {profissionais.filter(prof => prof.verificado).length}
            </div>
            <div className="text-sm text-blue-600">
                Profissionais Verificados
            </div>
            </div>

            <div className="bg-orange-50 rounded-xl p-4 text-center">
            <div className="flex justify-center mb-2">
                <Award className="h-8 w-8 text-orange-500" />
            </div>
            <div className="text-2xl font-bold text-orange-700">
                {calculaEstatisticas.especialidadesUnicas}
            </div>
            <div className="text-sm text-orange-600">
                Especialidades
            </div>
            </div>
        </div>
      </div>

      {/* Histórias de Sucesso */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="font-semibold text-lg mb-6 flex items-center">
          <Quote className="h-5 w-5 text-indigo-500 mr-2" />
          Histórias de Sucesso
        </h3>
        <div className="space-y-6">
          {profissionais
            .filter(prof => prof.referencias > 0 && prof.pontuacao >= 4.5)
            .slice(0, 3)
            .map((prof, index) => (
              <div 
                key={index} 
                className="relative bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 transition-all hover:shadow-lg flex flex-col"
              >
                {/* Avaliação */}
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${
                        i < Math.round(prof.pontuacao) 
                          ? 'text-yellow-400' 
                          : 'text-gray-300'
                      }`} 
                      fill="currentColor"
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-500">
                    {prof.pontuacao}
                  </span>
                </div>

                {/* Comentário */}
                <p className="text-md text-gray-700 mb-3 text-left">
                  {prof.comentarios?.[0] || "Atendimento excelente e muito profissional!"}
                </p>

                {/* Nome do avaliador */}
                <p className="text-sm text-gray-600 mb-4">
                  Avaliado por: <span className="font-medium">Cliente Anônimo</span>
                </p>

                {/* Informações do profissional */}
                <div className="flex items-start justify-between pt-2 border-t border-indigo-100">
                  <div className="flex items-center gap-3">
                    {prof.foto ? (
                      <img 
                        src={prof.foto} 
                        alt={prof.nome}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center border-2 border-white shadow">
                        <Users className="h-6 w-6 text-indigo-500" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900">
                        Dr. {prof.nome}
                      </p>
                      <p className="text-sm text-gray-600">
                        {prof.tipo}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Botão Ver mais */}
                <button
                  onClick={() => setSelectedProfReview?.(prof)}
                  className="mt-4 text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1 hover:gap-2 transition-all self-end"
                >
                  Ver mais
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ))}
        </div>
      </div>

      {/* Promoções Ativas */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center">
          <Percent className="h-5 w-5 text-green-500 mr-2" />
          Promoções Ativas
        </h3>
        <div className="space-y-3">
          {/* Primeira Consulta 
          <div className="group relative bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl cursor-pointer hover:shadow-md transition-all">
            <div className="absolute top-2 right-2">
              <Tag className="h-5 w-5 text-green-500" />
            </div>
            <h4 className="font-medium text-green-700">Primeira Consulta</h4>
            <p className="text-2xl font-bold text-green-600 mb-1">20% OFF</p>
            <p className="text-sm text-green-600">Consultar Profissional</p>
            <div className="mt-2 flex items-center text-xs text-green-600">
              <span>Ver detalhes</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </div>
          </div>

          <div className="group relative bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl cursor-pointer hover:shadow-md transition-all">
            <div className="absolute top-2 right-2">
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            <h4 className="font-medium text-blue-700">Pacote Família</h4>
            <p className="text-2xl font-bold text-blue-600 mb-1">30% OFF</p>
            <p className="text-sm text-blue-600">Para 3 ou mais pessoas</p>
            <div className="mt-2 flex items-center text-xs text-blue-600">
              <span>Ver detalhes</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </div>
          </div>

          <div className="group relative bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl cursor-pointer hover:shadow-md transition-all">
            <div className="absolute top-2 right-2">
              <CircleDollarSign className="h-5 w-5 text-purple-500" />
            </div>
            <h4 className="font-medium text-purple-700">Oferta Relâmpago</h4>
            <p className="text-lg font-bold text-purple-600 mb-1">Consulta + Retorno</p>
            <p className="text-sm text-purple-600">Válido apenas hoje!</p>
            <div className="mt-2 flex items-center text-xs text-purple-600">
              <span>Ver detalhes</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </div>
          </div>
          */}
        </div>
      </div>
    </div>
  );
};

export default SideComponents;