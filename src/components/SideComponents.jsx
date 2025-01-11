import React, { useState } from 'react';
import { 
  Award, Star, Users, Medal, Quote, ArrowRight, Trophy, 
  Percent, Brain, ChevronRight, Tag, CircleDollarSign 
} from 'lucide-react';

const SideComponents = ({ profissionais = [], profissionaisFiltrados = [] }) => {
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});

  // Cálculo das estatísticas
  const calculaEstatisticas = React.useMemo(() => {
    const totalConsultas = profissionais.reduce((sum, prof) => sum + (prof.referencias || 0), 0);
    const satisfacaoMedia = profissionais.length ? 
      profissionais.reduce((sum, prof) => sum + (prof.pontuacao || 0), 0) / profissionais.length : 0;
    const profissionaisVerificados = profissionais.filter(prof => prof.pontuacao >= 4.5).length;
    const especialidadesUnicas = new Set(profissionais.flatMap(prof => prof.atuacao || [])).size;

    return {
      totalConsultas,
      satisfacaoMedia,
      profissionaisVerificados,
      especialidadesUnicas
    };
  }, [profissionais]);

  // Perguntas do Quiz
  const quizQuestions = [
    {
      question: "Qual sua principal preocupação?",
      options: ["Dores físicas", "Saúde mental", "Checkup geral", "Tratamento específico"]
    },
    {
      question: "Preferência de atendimento?",
      options: ["Presencial", "Online", "Ambos"]
    },
    {
      question: "Urgência do atendimento?",
      options: ["Urgente", "Esta semana", "Este mês", "Sem pressa"]
    }
  ];

  return (
    <div className="space-y-6">
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

      {/* Quiz de Saúde */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center">
          <Brain className="h-5 w-5 text-indigo-500 mr-2" />
          Encontre seu Especialista Ideal
        </h3>
        <div className="space-y-4">
          {quizStep < quizQuestions.length ? (
            <>
              <p className="text-gray-600 font-medium">
                {quizQuestions[quizStep].question}
              </p>
              <div className="space-y-2">
                {quizQuestions[quizStep].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setQuizAnswers({...quizAnswers, [quizStep]: option});
                      setQuizStep(quizStep + 1);
                    }}
                    className="w-full p-3 text-left rounded-lg hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 transition-colors"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center">
              <p className="text-green-600 font-medium mb-3">
                Encontramos o match perfeito!
              </p>
              <button 
                onClick={() => setQuizStep(0)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Ver Recomendação
              </button>
            </div>
          )}
          <div className="flex justify-between text-sm text-gray-500 mt-4">
            <span>Pergunta {quizStep + 1} de {quizQuestions.length}</span>
            {quizStep > 0 && (
              <button 
                onClick={() => setQuizStep(quizStep - 1)}
                className="text-indigo-600 hover:underline"
              >
                Voltar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Card de Conquistas da Plataforma */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center">
          <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
          Conquistas da Plataforma
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <div className="flex justify-center mb-2">
              <Users className="h-8 w-8 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-blue-700">
              {calculaEstatisticas.totalConsultas.toLocaleString()}
            </div>
            <div className="text-sm text-blue-600">
              Consultas Realizadas
            </div>
          </div>

          <div className="bg-green-50 rounded-xl p-4 text-center">
            <div className="flex justify-center mb-2">
              <Star className="h-8 w-8 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-green-700">
              {calculaEstatisticas.satisfacaoMedia.toFixed(1)}
            </div>
            <div className="text-sm text-green-600">
              Satisfação Média
            </div>
          </div>

          <div className="bg-purple-50 rounded-xl p-4 text-center">
            <div className="flex justify-center mb-2">
              <Medal className="h-8 w-8 text-purple-500" />
            </div>
            <div className="text-2xl font-bold text-purple-700">
              {calculaEstatisticas.profissionaisVerificados}
            </div>
            <div className="text-sm text-purple-600">
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
        <h3 className="font-semibold text-lg mb-4 flex items-center">
          <Quote className="h-5 w-5 text-indigo-500 mr-2" />
          Histórias de Sucesso
        </h3>
        <div className="space-y-4">
          {profissionais
            .filter(prof => prof.comentarios && prof.pontuacao >= 4.5)
            .slice(0, 3)
            .map((prof, index) => (
              <div 
                key={index} 
                className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 transition-transform hover:scale-102"
              >
                <div className="flex items-start gap-3">
                  {prof.foto ? (
                    <img 
                      src={prof.foto} 
                      alt={prof.nome}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                      <Users className="h-6 w-6 text-indigo-500" />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < Math.round(prof.pontuacao) 
                            ? 'text-yellow-400' 
                            : 'text-gray-300'}`} 
                          fill="currentColor"
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {prof.comentarios?.[0] || "Atendimento excelente!"}
                    </p>
                    <div className="mt-2 flex items-center text-xs text-indigo-600">
                      <span className="font-medium">Ver mais</span>
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SideComponents;