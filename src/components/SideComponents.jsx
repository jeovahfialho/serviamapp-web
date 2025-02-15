import React, { useEffect, useState } from 'react';
import { 
  Award, Star, Users, Quote, ArrowRight, Trophy, 
  Percent, Brain, Map
} from 'lucide-react';
import { MdVerified } from 'react-icons/md';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import ProfissionaisPorCategoria from './ProfissionaisPorCategoria';
import BrazilMap from './BrazilMap';
import _ from 'lodash';

const SideComponents = ({ profissionais = [], profissionaisFiltrados = [], setProfissionaisFiltrados, setSelectedProfReview }) => {

  const [loading, setLoading] = useState(true);
  
  // Cálculo das estatísticas
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
    const especialidadesUnicas = new Set(profissionais.flatMap(prof => prof.especializacao || [])).size;

    return {
      totalConsultas,
      satisfacaoMedia: Number(satisfacaoMedia.toFixed(1)),
      profissionaisVerificados,
      especialidadesUnicas
    };
  }, [profissionais]);

  const [reviews, setReviews] = useState([]);

  // Buscar reviews
  useEffect(() => {
    const fetchAllReviews = async () => {
      try {
        const profIds = profissionais
          .filter(prof => prof.referencias > 0)
          .map(prof => prof.id);
  
        const allReviews = [];
        for (const profId of profIds) {
          const response = await fetch(`https://serviamapp-server.vercel.app/api/reviews?profId=${profId}&status=approved`);
          const data = await response.json();
          allReviews.push(...data);
        }
  
        const shuffledReviews = _.shuffle(allReviews)
          .filter(review => review.comment && review.comment.length > 0)
          .slice(0, 3);
  
        setReviews(shuffledReviews);
      } catch (error) {
        console.error('Erro ao buscar reviews:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchAllReviews();
  }, [profissionais]);

  return (
    <div className="space-y-6">

      {/* Profissionais Verificados */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="font-semibold text-xl mb-6 flex items-center text-gray-800">
          <MdVerified className="h-6 w-6 text-blue-500 mr-2" />
          Profissionais Verificados
        </h3>
        <div className="space-y-6">
          {profissionaisFiltrados
            .filter(prof => prof.verificado === true)
            .slice(0, 3)
            .map(prof => (
              <a 
                key={prof.id}
                href={`/profissional/${prof.id}`}
                className="block p-4 hover:bg-gray-50 rounded-lg transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center mb-2">
                  {prof.foto ? (
                    <img src={prof.foto} alt={prof.nome} className="h-12 w-12 rounded-full object-cover mr-4" />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                      <Users className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                  <div>
                    {/* Tipo (Especialidade) */}
                    <p className="text-sm font-medium text-gray-600">{prof.tipo}</p>
                    
                    {/* Nome */}
                    <h4 className="font-semibold text-lg text-gray-800 flex items-center">
                      {prof.nome}
                      <MdVerified className="h-4 w-4 text-blue-500 ml-1" />
                    </h4>
                  </div>
                </div>
                
                {/* Especializações */}
                <p className="text-base text-gray-700 mb-3">
                  {prof.especializacao?.slice(0, 2).join(', ')}
                  {prof.especializacao?.length > 2 && ', ...'}
                </p>
                
                {/* Áreas de Atuação */}
                <div>
                  <p className="text-sm text-gray-500 mb-1">Áreas de Atuação:</p>
                  <div className="flex flex-wrap gap-2">
                    {prof.atuacao?.slice(0, 4).map((area, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 text-sm bg-blue-100 text-blue-700 rounded-full"
                      >
                        {area}
                      </span>
                    ))}
                    {prof.atuacao?.length > 4 && (
                      <span className="text-sm text-blue-600 font-medium">
                        +{prof.atuacao.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              </a>
            ))}
        </div>
      </div>
      
      {/* Profissionais Destaque */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center">
          <Award className="h-5 w-5 text-yellow-500 mr-2" />
          Melhores Avaliados
        </h3>
        <div className="space-y-4">
          {profissionaisFiltrados
            .filter(prof => prof.pontuacao >= 4.8)
            .slice(0, 3)
            .map(prof => (
              <a 
                key={prof.id}
                href={`/profissional/${prof.id}`}
                className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer block"
              >
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
              </a>
            ))}
        </div>
      </div>


      <ProfissionaisPorCategoria 
        profissionais={profissionais}
        setProfissionaisFiltrados={setProfissionaisFiltrados}
      />
      
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center">
          <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
          Conquistas da Plataforma
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {/* Profissionais */}
          <div className="bg-yellow-50 rounded-xl p-4 text-center">
            <div className="flex justify-center mb-2">
              <Users className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="text-2xl font-bold text-yellow-700">
              {profissionais.filter(prof => prof.status === 'approved').length}
            </div>
            <div className="text-sm text-yellow-600">
              Profissionais Ativos
            </div>
          </div>

          {/* Avaliações */}
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

          {/* Profissionais Verificados */}
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

          {/* Especialidades */}
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

          {/* Total Avaliações */}
          <div className="bg-purple-50 rounded-xl p-4 text-center">
            <div className="flex justify-center mb-2">
              <Star className="h-8 w-8 text-purple-500" />
            </div>
            <div className="text-2xl font-bold text-purple-700">
              {profissionais.reduce((acc, p) => acc + (p.referencias || 0), 0)}
            </div>
            <div className="text-sm text-purple-600">
              Total de Avaliações
            </div>
          </div>

          {/* Estados Atendidos */}
          <div className="bg-indigo-50 rounded-xl p-4 text-center">
            <div className="flex justify-center mb-2">
              <Map className="h-8 w-8 text-indigo-500" />
            </div>
            <div className="text-2xl font-bold text-indigo-700">
              {new Set(profissionais.map(p => p.estado).filter(Boolean)).size}
            </div>
            <div className="text-sm text-indigo-600">
              Estados Atendidos
            </div>
          </div>
        </div>
      </div>      {/* Card de Profissionais Avaliados */}

      {/* Mapa de Profissionais */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center">
          <Map className="h-5 w-5 text-blue-500 mr-2" />
          Presença Nacional
        </h3>
        <div className="space-y-4">
          <BrazilMap 
            estados={[...new Set(profissionais
              .filter(prof => prof.estado)
              .map(prof => prof.estado))]} 
          />
          <p className="text-sm text-gray-600 text-center mt-4">
            Estados com profissionais cadastrados
          </p>
        </div>
      </div>

      {/* Histórias de Sucesso */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="font-semibold text-lg mb-6 flex items-center">
          <Quote className="h-5 w-5 text-indigo-500 mr-2" />
          Histórias de Sucesso
        </h3>
        
        {loading ? (
          <div className="text-center text-gray-500 py-8">
            Carregando histórias de sucesso...
          </div>
        ) : reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => {
              const prof = profissionais.find(p => p.id === review.prof_id);
              if (!prof) return null;

              return (
                <div
                  key={review.id}
                  className="relative bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 transition-all hover:shadow-lg flex flex-col"
                >
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.round(review.rating)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                        fill="currentColor"
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-500">
                      {review.rating}
                    </span>
                  </div>

                  <p className="text-md text-gray-700 mb-3 text-left">
                    {review.comment}
                  </p>

                  <p className="text-sm text-gray-600 mb-4">
                    Avaliado por: <span className="font-medium">
                      {review.name || 'Cliente Anônimo'}
                    </span>
                    {review.date && (
                      <span className="text-gray-400"> • {new Date(review.date).toLocaleDateString('pt-BR')}</span>
                    )}
                  </p>

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
                          {prof.nome}
                        </p>
                        <p className="text-sm text-gray-600">
                          {prof.tipo}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedProfReview?.(prof)}
                    className="mt-4 text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1 hover:gap-2 transition-all self-end"
                  >
                    Ver mais
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            Nenhuma história encontrada no momento.
          </div>
        )}
      </div>

      {/* Promoções Ativas */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center">
          <Percent className="h-5 w-5 text-green-500 mr-2" />
          Promoções Ativas
        </h3>
        <div className="space-y-3">
          {/* Área para promoções futuras */}
        </div>
      </div>
    </div>
  );
};

export default SideComponents;