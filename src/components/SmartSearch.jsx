import React, { useState, useMemo } from 'react';
import { Search, Sparkles, MapPin, Filter, Brain, X } from 'lucide-react';

const SmartSearch = ({ profissionais, onSearch }) => {
  const mentalHealthTerms = {
    'depressão': ['tristeza', 'humor', 'melancolia', 'desânimo', 'terapia'],
    'ansiedade': ['nervosismo', 'pânico', 'preocupação', 'angústia', 'medo'],
    'casamento': ['relacionamento', 'casal', 'família', 'conjugal', 'matrimonial'],
    'terapia': ['psicoterapia', 'aconselhamento', 'tratamento', 'acompanhamento'],
    'trauma': ['estresse', 'ptsd', 'abuso', 'violência'],
    'comportamento': ['conduta', 'hábitos', 'atitude', 'psychological'],
    'emocional': ['sentimentos', 'emoções', 'afeto', 'humor'],
    'stress': ['estresse', 'tensão', 'pressão', 'burnout']
  };

  const [searchText, setSearchText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isAdvancedSearch, setIsAdvancedSearch] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const analyzeText = async (text) => {
    setIsAnalyzing(true);
    setShowSuggestions(true);
   
    try {
      const response = await fetch('https://serviamapp-server.vercel.app/api/smart-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ prompt: text })
      });
   
      if (response.ok) {
        const data = await response.json();
        console.log('Search response:', data);
        
        if (data.professionals?.length > 0) {
          setSearchResults(data.professionals);
          onSearch(data.professionals);
        } else {
          fallbackSearch(text);
        }
      } else {
        fallbackSearch(text);
      }
    } catch (error) {
      console.error('Search failed:', error);
      fallbackSearch(text);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const fallbackSearch = (text) => {
    const expandedTerms = expandSearchTerms(text);
    const scoredResults = profissionais
      .map(prof => ({
        ...prof,
        matchScore: calculateRelevance(prof, expandedTerms)
      }))
      .filter(prof => prof.matchScore > 0);

    const sortedResults = scoredResults.sort((a, b) => b.matchScore - a.matchScore);
    setSearchResults(sortedResults);
    onSearch(sortedResults);
  };

  const expandSearchTerms = (searchText) => {
    const terms = searchText.toLowerCase().split(/\s+/);
    const expandedTerms = new Set(terms);
    
    terms.forEach(term => {
      Object.entries(mentalHealthTerms).forEach(([key, relatedTerms]) => {
        if (term.includes(key) || key.includes(term)) {
          relatedTerms.forEach(relatedTerm => expandedTerms.add(relatedTerm));
        }
      });
    });

    return Array.from(expandedTerms);
  };

  const calculateRelevance = (prof, searchTerms) => {
    let score = 0;
    const profInfo = [
      prof.tipo,
      ...(prof.atuacao || []),
      ...(prof.especializacao || []),
      ...(prof.descricao ? [prof.descricao] : []),
      ...(prof.cursos || []),
      ...(prof.pos_graduacao || [])
    ].map(item => item?.toLowerCase());

    searchTerms.forEach(term => {
      profInfo.forEach(info => {
        if (!info) return;
        if (info === term) score += 5;
        if (info.includes(term)) score += 3;
        if (term.includes(info)) score += 2;
        
        if (prof.tipo?.toLowerCase().includes('psico') || 
            prof.atuacao?.some(area => area.toLowerCase().includes('psico'))) {
          if (Object.keys(mentalHealthTerms).some(key => 
              term.includes(key) || info.includes(key))) {
            score += 3;
          }
        }
      });
    });

    score += (prof.pontuacao || 0) / 10;
    return score;
  };

  const relevantSuggestions = useMemo(() => {
    if (!searchText || !showSuggestions || !searchResults.length) return [];
    return searchResults.slice(0, 3);
  }, [searchResults, searchText, showSuggestions]);

  const handleClear = () => {
    setSearchText('');
    setShowSuggestions(false);
    onSearch(profissionais);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Encontre os Melhores Profissionais <Sparkles className="inline-block text-blue-600 ml-2" size={36} />
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Revolucionando a busca por profissionais de saúde com inteligência artificial. 
            Conectamos você aos especialistas perfeitos para suas necessidades únicas.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
          <div className="flex items-center border-b border-gray-200">
            <div className="flex-grow relative">
              <textarea
                placeholder="Descreva livremente o que procura. Ex: 'Preciso de ajuda para ansiedade e problemas de relacionamento'"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full p-4 pl-12 pr-10 text-gray-700 focus:outline-none text-lg resize-none h-24"
              />
              <Brain 
                className="absolute left-4 top-6 transform -translate-y-1/2 text-blue-400" 
                size={24} 
              />
              {searchText && (
                <button 
                  onClick={handleClear}
                  className="absolute right-4 top-6 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              )}
            </div>
            <button 
              onClick={() => setIsAdvancedSearch(!isAdvancedSearch)}
              className="px-4 border-l border-gray-200 hover:bg-gray-50 transition"
            >
              <Filter size={20} className="text-gray-500" />
            </button>
            <button 
              onClick={() => analyzeText(searchText)}
              disabled={isAnalyzing || !searchText}
              className={`bg-blue-600 text-white px-6 py-4 hover:bg-blue-700 transition flex items-center 
                ${(!searchText || isAnalyzing) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isAnalyzing ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  <span>Analisando...</span>
                </div>
              ) : (
                <>
                  <Sparkles className="mr-2" size={20} />
                  Busca Inteligente
                </>
              )}
            </button>
          </div>

          {isAdvancedSearch && (
            <div className="p-4 bg-gray-50 grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Localização
                </label>
                <div className="flex items-center bg-white border rounded-lg">
                  <MapPin size={20} className="ml-3 text-gray-400" />
                  <input 
                    type="text"
                    placeholder="Cidade ou região"
                    className="w-full p-2 pl-2 rounded-lg focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Atendimento
                </label>
                <select className="w-full p-2 border rounded-lg bg-white">
                  <option>Todos</option>
                  <option>Presencial</option>
                  <option>Online</option>
                  <option>Emergência</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filtros Avançados
                </label>
                <select className="w-full p-2 border rounded-lg bg-white">
                  <option>Mais Relevantes</option>
                  <option>Melhor Avaliados</option>
                  <option>Mais Próximos</option>
                  <option>Menor Preço</option>
                </select>
              </div>
            </div>
          )}

          {showSuggestions && relevantSuggestions.length > 0 && (
            <div className="p-4 bg-indigo-50">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="h-4 w-4 text-indigo-500" />
                <p className="text-sm text-indigo-600 font-medium">
                  Profissionais recomendados pela IA:
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {relevantSuggestions.map((prof) => {
                  const emoji = prof.tipo?.toLowerCase().includes('psico') ? '🧠' :
                              prof.tipo?.toLowerCase().includes('nutri') ? '🥗' :
                              prof.tipo?.toLowerCase().includes('fisio') ? '💪' :
                              prof.tipo?.toLowerCase().includes('pediatr') ? '👶' :
                              prof.tipo?.toLowerCase().includes('cardio') ? '❤️' :
                              prof.tipo?.toLowerCase().includes('neuro') ? '🔬' :
                              prof.tipo?.toLowerCase().includes('dent') ? '🦷' :
                              '⚕️';
                  return (
                    <a
                      key={`prof-${prof.id}`}
                      href={`/profissional/${prof.id}`}
                      className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col items-center text-center"
                    >
                      <div className="text-4xl mb-2">{emoji}</div>
                      <div className="font-semibold">{prof.nome}</div>
                      <div className="text-sm text-gray-500">{prof.tipo}</div>
                      {prof.pontuacao >= 4.8 && (
                        <div className="mt-2 text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                          Top profissional
                        </div>
                      )}
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500 flex items-center justify-center">
            <Sparkles className="mr-2 text-blue-600" size={16} />
            Busca potencializada por Inteligência Artificial
            <Sparkles className="ml-2 text-blue-600" size={16} />
          </p>
        </div>
      </div>
    </div>
  );
};

export default SmartSearch;