import React, { useState, useMemo } from 'react';
import { Brain, X } from 'lucide-react';
import _ from 'lodash';

const CompactSmartSearch = ({ profissionais, onSearch }) => {

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
  const [showSuggestions, setShowSuggestions] = useState(false);

  const analyzeText = async (text) => {
    setIsAnalyzing(true);
    setShowSuggestions(true);

    try {
      // First try DeepSeek API
      const response = await fetch('https://serviamapp-server.vercel.app/api/smart-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: text })
      });

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.professionals);
        onSearch(data.professionals);
      } else {
        // Fallback to local search if API fails
        fallbackSearch(text);
      }
    } catch (error) {
      console.error('ChatGPT search failed:', error);
      fallbackSearch(text);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Existing local search as fallback
  const fallbackSearch = (text) => {
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

  // Keep existing helper functions
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

  // Keep existing UI rendering code
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
    <div className="space-y-3">
      <div className="relative">
        <textarea
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Descreva o que você está procurando..."
          className="w-full p-3 pr-10 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none h-20 text-sm"
        />
        {searchText && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={() => analyzeText(searchText)}
          className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors flex items-center justify-center gap-2"
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
          ) : (
            <>
              <Brain className="h-4 w-4" />
              <span>Buscar</span>
            </>
          )}
        </button>
        
        {searchText && (
          <button
            onClick={handleClear}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            Limpar
          </button>
        )}
      </div>

      {showSuggestions && relevantSuggestions.length > 0 && (
        <div className="mt-3">
          <p className="text-sm text-gray-600 mb-2">Profissionais relacionados:</p>
          <div className="flex flex-col gap-2">
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
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = `/profissional/${prof.id}`;
                  }}
                  className="text-left px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2">
                    <span>{emoji}</span>
                    <div>
                      <div className="font-medium">{prof.nome}</div>
                      <div className="text-xs text-indigo-500">{prof.tipo}</div>
                    </div>
                  </div>
                  {prof.pontuacao >= 4.8 && (
                    <div className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
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
  );
};

export default CompactSmartSearch;