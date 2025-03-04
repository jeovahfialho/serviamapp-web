import React, { useEffect, useState } from 'react';
import { 
  Award, Star, Users, Quote, ArrowRight, Trophy, 
  Percent, Brain, Map
} from 'lucide-react';
import { MdVerified } from 'react-icons/md';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import ProfissionaisPorCategoria from './ProfissionaisPorCategoria';
import MelhoresAvaliados from './marketplace/MelhoresAvaliados';
import HistoriasSucesso from './marketplace/HistoriasSucesso';
import ConquistasDaPlataforma from './marketplace/ConquistasDaPlataforma';
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
          {profissionaisFiltrados.filter(prof => prof.verificado === true).length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-lg">Não há profissionais verificados para este filtro</p>
              <p className="text-gray-400 text-sm mt-1">Tente ajustar seus critérios de busca ou limpe o Filtro</p>
            </div>
          ) : (
            profissionaisFiltrados
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
            )))}
        </div>
      </div>
      
      {/* Profissionais Destaque */}
      <MelhoresAvaliados profissionaisFiltrados={profissionaisFiltrados} />


      <ProfissionaisPorCategoria 
        profissionais={profissionais}
        setProfissionaisFiltrados={setProfissionaisFiltrados}
      />
      
      <ConquistasDaPlataforma 
        profissionais={profissionais} 
        calculaEstatisticas={calculaEstatisticas} 
      />

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

      <HistoriasSucesso 
        reviews={reviews}
        profissionais={profissionais}
        loading={loading}
        setSelectedProfReview={setSelectedProfReview}
      />

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