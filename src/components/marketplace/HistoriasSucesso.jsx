import React, { useState, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Rating, 
  Avatar, 
  Button, 
  IconButton 
} from '@mui/material';
import { Quote, Users, ArrowRight } from 'lucide-react';

const HistoriasSucesso = ({ 
  reviews, 
  profissionais, 
  loading, 
  setSelectedProfReview 
}) => {
  // Embaralhar reviews aleatoriamente
  const randomizedReviews = useMemo(() => {
    return [...reviews].sort(() => 0.5 - Math.random());
  }, [reviews]);

  // Renderizar conteúdo de cada review
  const renderReview = (review) => {
    const prof = profissionais.find(p => p.id === review.prof_id);
    if (!prof) return null;

    return (
      <Paper 
        key={review.id}
        elevation={2}
        sx={{ 
          background: 'linear-gradient(to right, #eef2ff, #f3e8ff)', 
          borderRadius: 3,
          p: 3,
          mb: 2,
          transition: 'all 0.3s',
          '&:hover': { 
            boxShadow: 3 
          }
        }}
      >
        {/* Avaliação */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Rating 
            value={review.rating} 
            readOnly 
            precision={0.5}
          />
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ ml: 1 }}
          >
            {review.rating}
          </Typography>
        </Box>

        {/* Comentário */}
        <Typography 
          variant="body1" 
          color="text.primary" 
          sx={{ mb: 2 }}
        >
          {review.comment}
        </Typography>

        {/* Informações do avaliador */}
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ mb: 2 }}
        >
          Avaliado por: <strong>{review.name || 'Cliente Anônimo'}</strong>
          {review.date && (
            <> • {new Date(review.date).toLocaleDateString('pt-BR')}</>
          )}
        </Typography>

        {/* Informações do Profissional */}
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            borderTop: '1px solid', 
            borderColor: 'divider',
            pt: 2 
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar 
              src={prof.foto} 
              alt={prof.nome}
              sx={{ 
                width: 48, 
                height: 48, 
                border: '2px solid white', 
                boxShadow: 1 
              }}
            >
              {!prof.foto && <Users />}
            </Avatar>
            <Box>
              <Typography variant="body1" fontWeight="medium">
                {prof.nome}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {prof.tipo}
              </Typography>
            </Box>
          </Box>

          <Button
            onClick={() => setSelectedProfReview?.(prof)}
            endIcon={<ArrowRight />}
            sx={{ 
              textTransform: 'none',
              '&:hover': { 
                backgroundColor: 'action.hover' 
              }
            }}
          >
            Ver mais
          </Button>
        </Box>
      </Paper>
    );
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        borderRadius: 3, 
        p: 3 
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Quote 
          style={{ 
            marginRight: 8, 
            color: '#6366f1', 
            width: 20, 
            height: 20 
          }} 
        />
        <Typography variant="h6" fontWeight="600">
          Histórias de Sucesso
        </Typography>
      </Box>

      {loading ? (
        <Typography 
          variant="body1" 
          color="text.secondary" 
          align="center" 
          sx={{ py: 4 }}
        >
          Carregando histórias de sucesso...
        </Typography>
      ) : reviews.length > 0 ? (
        <Box>
          {randomizedReviews.slice(0, 3).map(renderReview)}
        </Box>
      ) : (
        <Typography 
          variant="body1" 
          color="text.secondary" 
          align="center" 
          sx={{ py: 4 }}
        >
          Nenhuma história encontrada no momento.
        </Typography>
      )}
    </Paper>
  );
};

export default HistoriasSucesso;