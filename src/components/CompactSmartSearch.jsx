import React, { useState, useMemo } from 'react';
import { Brain, X } from 'lucide-react';
import _ from 'lodash';

const CompactSmartSearch = ({ profissionais, onSearch }) => {
  const [searchText, setSearchText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Função para limpar a busca
  const handleClear = () => {
    setSearchText('');
    onSearch(profissionais); // Resetar para todos os profissionais
  };

  // Construir automaticamente o mapa de contextos a partir dos dados
  const contextMap = useMemo(() => {
    const map = new Map();
    
    profissionais.forEach(prof => {
      // Coletar todas as informações relevantes do profissional
      const terms = [
        prof.tipo,
        ...(prof.atuacao || []),
        ...(prof.especializacao || []),
        ...(prof.cursos || []),
        ...(prof.graduacao || []),
        ...(prof.pos_graduacao || [])
      ].filter(Boolean).map(term => term.toLowerCase());

      // Para cada termo, criar relações com outros termos do mesmo profissional
      terms.forEach(term => {
        if (!map.has(term)) {
          map.set(term, {
            relacionados: new Set(),
            profissionais: new Set(),
            tipos: new Set()
          });
        }

        const entry = map.get(term);
        entry.profissionais.add(prof.id);
        entry.tipos.add(prof.tipo.toLowerCase());
        
        // Relacionar com outros termos do mesmo profissional
        terms.forEach(relatedTerm => {
          if (term !== relatedTerm) {
            entry.relacionados.add(relatedTerm);
          }
        });
      });
    });

    return map;
  }, [profissionais]);

  const analyzeText = (text) => {
    setIsAnalyzing(true);
    const words = text.toLowerCase().split(/\s+/);
    
    // Encontrar termos relevantes no texto
    const relevantTerms = new Set();
    
    // Para cada palavra no texto de busca
    words.forEach(word => {
      // Procurar matches diretos e parciais no contextMap
      contextMap.forEach((value, key) => {
        if (key.includes(word) || word.includes(key)) {
          relevantTerms.add(key);
          // Adicionar termos relacionados
          value.relacionados.forEach(related => relevantTerms.add(related));
        }
      });
    });

    // Encontrar profissionais relevantes
    const matchedProfessionals = profissionais.filter(prof => {
      const profTerms = [
        prof.tipo,
        ...(prof.atuacao || []),
        ...(prof.especializacao || [])
      ].map(term => term.toLowerCase());

      return profTerms.some(term => relevantTerms.has(term)) ||
             Array.from(relevantTerms).some(term => 
               profTerms.some(profTerm => 
                 profTerm.includes(term) || term.includes(profTerm)
               )
             );
    });

    // Calcular relevância
    const scoredResults = matchedProfessionals.map(prof => {
      let score = prof.pontuacao || 0;
      
      const profTerms = [
        prof.tipo,
        ...(prof.atuacao || []),
        ...(prof.especializacao || [])
      ].map(term => term.toLowerCase());

      // Aumentar score baseado em matches
      relevantTerms.forEach(term => {
        const directMatch = profTerms.some(pt => pt === term);
        const partialMatch = profTerms.some(pt => pt.includes(term) || term.includes(pt));
        
        if (directMatch) score += 3;
        if (partialMatch) score += 1;
      });

      return { ...prof, matchScore: score };
    });

    const sortedResults = _.orderBy(scoredResults, ['matchScore', 'pontuacao'], ['desc', 'desc']);
    setIsAnalyzing(false);
    onSearch(sortedResults);
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
            onClick={() => handleClear()}
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

      <div className="mt-3">
        <p className="text-sm text-gray-600 mb-2">Sugestões populares:</p>
        <div className="flex flex-wrap gap-2">
          {_.sampleSize(
            profissionais
              .flatMap(prof => prof.atuacao || [])
              .filter(Boolean)
              .map(area => {
                const emoji = area.toLowerCase().includes('psico') ? '🧠' :
                            area.toLowerCase().includes('nutri') ? '🥗' :
                            area.toLowerCase().includes('fisio') ? '💪' :
                            area.toLowerCase().includes('pediatr') ? '👶' :
                            area.toLowerCase().includes('cardio') ? '❤️' :
                            area.toLowerCase().includes('neuro') ? '🔬' :
                            area.toLowerCase().includes('dent') ? '🦷' :
                            '⚕️';
                return `${emoji} ${area}`;
              }),
            3
          ).map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => {
                const text = suggestion.split(' ').slice(1).join(' ');
                setSearchText(text);
                analyzeText(text);
              }}
              className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full cursor-pointer hover:bg-indigo-100 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompactSmartSearch;