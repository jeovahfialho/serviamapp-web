import React, { useState } from 'react';
import { Award, Star, Users, ChevronLeft, ChevronRight } from 'lucide-react';

const MelhoresAvaliados = ({ profissionaisFiltrados }) => {
  const [currentPage, setCurrentPage] = useState(0);
  
  const formatName = (fullName) => {
    const names = fullName.split(' ');
    if (names.length <= 2) return fullName;
    return `${names[0]} ${names[names.length - 1]}`;
  };

  const getFirstSpecialization = (especializacao) => {
    if (!especializacao) return '';
    if (Array.isArray(especializacao)) {
      return especializacao[0] || '';
    }
    return especializacao.split(',')[0] || '';
  };

  const shuffledProfissionais = [...profissionaisFiltrados]
    .filter(prof => prof.pontuacao >= 4.8)
    .sort(() => 0.5 - Math.random());

  const totalPages = Math.ceil(shuffledProfissionais.length / 4);
  const currentProfissionais = shuffledProfissionais.slice(currentPage * 4, (currentPage + 1) * 4);

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h3 className="font-semibold text-lg mb-4 flex items-center">
        <Award className="h-5 w-5 text-yellow-500 mr-2" />
        Melhores Avaliados
      </h3>

      {shuffledProfissionais.length === 0 ? (
        <div className="text-center py-8">
          <Star className="h-12 w-12 text-yellow-300 mx-auto mb-3" />
          <p className="text-gray-500 text-lg">Não há profissionais com alta avaliação para este filtro</p>
          <p className="text-gray-400 text-sm mt-1">
          Tente ajustar seus critérios de busca ou limpe o Filtro
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {currentProfissionais.map(prof => (
              <a
                key={prof.id}
                href={`/profissional/${prof.id}`}
                className="flex flex-col p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-3 mb-2">
                  {prof.foto ? (
                    <img
                      src={prof.foto}
                      alt={prof.nome}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                  )}
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">{prof.pontuacao}</span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {prof.referencias} {prof.referencias === 1 ? 'avaliação' : 'avaliações'}
                    </span>
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{formatName(prof.nome)}</p>
                  <p className="text-xs text-blue-600">{prof.tipo}</p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                    {getFirstSpecialization(prof.especializacao)}
                  </p>
                </div>
              </a>
            ))}
          </div>

          {/* Navigation - only show if there are pages */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-2">
              <button
                onClick={prevPage}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
                disabled={currentPage === 0}
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              
              <div className="flex gap-2">
                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index)}
                    className={`h-2 rounded-full transition-all ${
                      currentPage === index 
                        ? 'w-4 bg-blue-500' 
                        : 'w-2 bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              
              <button
                onClick={nextPage}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
                disabled={currentPage === totalPages - 1}
              >
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MelhoresAvaliados;