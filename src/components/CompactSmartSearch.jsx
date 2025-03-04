import React, { useState, useMemo } from 'react';
import { Search, Sparkles, MapPin, Filter, Brain, X } from 'lucide-react';
import _ from 'lodash';

const CompactSmartSearch = ({ 
  profissionais = [], 
  onSearch = () => {}, // Provide a default no-op function
  variant = 'default' 
}) => {
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
        body: JSON.stringify({ 
          prompt: text 
          // Não precisa mudar nada aqui, o backend já vai lidar com os motivos
        })
      });
   
      if (response.ok) {
        const data = await response.json();
        console.log('Search response:', data);
        
        if (data.professionals?.length > 0) {
          // Adicione esta linha para adicionar o motivo da recomendação
          const enhancedResults = data.professionals.map(prof => ({
            ...prof,
            matchReason: data.matchReasons?.[prof.id] || 'Profissional relevante para sua busca'
          }));
  
          setSearchResults(enhancedResults);
          onSearch(enhancedResults);
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
    if (!Array.isArray(profissionais) || profissionais.length === 0) {
      console.warn('No professionals data available for search');
      onSearch([]); // Ensure onSearch is called even with empty array
      return;
    }

    const expandedTerms = expandSearchTerms(text);
    const scoredResults = profissionais
      .map(prof => ({
        ...prof,
        matchScore: calculateRelevance(prof, expandedTerms)
      }))
      .filter(prof => prof.matchScore > 0);

    const sortedResults = _.orderBy(scoredResults, ['matchScore'], ['desc']);
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
    setSearchResults([]); // Adicionando esta linha para limpar os resultados
    setShowSuggestions(false);
    onSearch(profissionais);
  };

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Encontre o profissional de saúde ideal para você <Sparkles className="inline-block text-blue-600 ml-2" size={36} />
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Nossa plataforma reúne os melhores especialistas em saúde. <br/>
            Compartilhe sua necessidade e deixe nossa IA fazer o match perfeito.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
          <div className="relative w-full">
            <div className="flex items-stretch bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
              <div className="flex-grow relative">
                <textarea
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Descreva com suas palavras o que você procura."
                  className="w-full p-4 pr-10 text-gray-700 focus:outline-none text-base resize-none h-20 
                    placeholder-gray-400"
                />
                {searchText && (
                  <button
                    onClick={handleClear}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 
                      bg-gray-100 rounded-full p-1 transition-colors"
                  >
                    <X size={16} className="stroke-current" />
                  </button>
                )}
              </div>
              <div className="border-l border-gray-200 flex items-stretch">
                <button
                  onClick={() => analyzeText(searchText)}
                  disabled={isAnalyzing || !searchText}
                  className="px-6 bg-blue-600 text-white hover:bg-blue-700 transition-colors 
                    flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed
                    group"
                >
                  {isAnalyzing ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                      <span className="text-sm">Analisando...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Sparkles 
                        className="h-5 w-5 transform group-hover:rotate-6 transition-transform" 
                      />
                      <span className="text-sm font-medium">Busca Inteligente</span>
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>

          {showSuggestions && searchResults.length > 0 && (
            <div className="p-4 bg-indigo-50">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-indigo-500" />
                <p className="text-sm text-indigo-600 font-medium">
                  Profissionais recomendados pela IA:
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {searchResults.slice(0, 6).map((prof) => {

                  return (
                    <a
                      key={`prof-${prof.id}`}
                      href={`/profissional/${prof.id}`}
                      className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col items-center text-center"
                    >
                      <div className="w-24 h-24 mb-3">
                        <img 
                          src={prof.foto || `https://ui-avatars.com/api/?name=${encodeURIComponent(prof.nome)}&background=0D8ABC&color=fff`} 
                          alt={prof.nome}
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                      <div className="font-semibold">{prof.nome}</div>
                      <div className="text-sm text-gray-500">{prof.tipo}</div>
                      <div className="text-xs text-gray-600 mt-2 text-center">
                        {prof.matchReason}
                      </div>
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

export default CompactSmartSearch;