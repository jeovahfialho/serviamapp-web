import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid 
} from '@mui/material';
import { 
  Trophy, 
  Users, 
  Star, 
  Award, 
  Map 
} from 'lucide-react';

import { MdVerified } from 'react-icons/md';

const ConquistasDaPlataforma = ({ 
  profissionais, 
  calculaEstatisticas 
}) => {
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        borderRadius: 3, 
        p: 3 
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Trophy 
          style={{ 
            marginRight: 8, 
            color: '#eab308', 
            width: 20, 
            height: 20 
          }} 
        />
        <Typography variant="h6" fontWeight="600">
          Conquistas da Plataforma
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Profissionais */}
        <Grid item xs={6}>
          <Box 
            sx={{ 
              backgroundColor: 'yellow.50', 
              borderRadius: 3, 
              p: 3, 
              textAlign: 'center' 
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Users 
                style={{ 
                  width: 32, 
                  height: 32, 
                  color: '#eab308' 
                }} 
              />
            </Box>
            <Typography 
              variant="h4" 
              fontWeight="bold" 
              color="yellow.700"
            >
              {profissionais.filter(prof => prof.status === 'approved').length}
            </Typography>
            <Typography 
              variant="body2" 
              color="yellow.600"
            >
              Profissionais Ativos
            </Typography>
          </Box>
        </Grid>

        {/* Avaliações */}
        <Grid item xs={6}>
          <Box 
            sx={{ 
              backgroundColor: 'green.50', 
              borderRadius: 3, 
              p: 3, 
              textAlign: 'center' 
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Star 
                style={{ 
                  width: 32, 
                  height: 32, 
                  color: '#22c55e' 
                }} 
              />
            </Box>
            <Typography 
              variant="h4" 
              fontWeight="bold" 
              color="green.700"
            >
              {calculaEstatisticas.satisfacaoMedia}
            </Typography>
            <Typography 
              variant="body2" 
              color="green.600"
            >
              Satisfação Média
            </Typography>
          </Box>
        </Grid>

        {/* Profissionais Verificados */}
        <Grid item xs={6}>
          <Box 
            sx={{ 
              backgroundColor: 'blue.50', 
              borderRadius: 3, 
              p: 3, 
              textAlign: 'center' 
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <MdVerified 
                style={{ 
                  width: 32, 
                  height: 32, 
                  color: '#3b82f6' 
                }} 
              />
            </Box>
            <Typography 
              variant="h4" 
              fontWeight="bold" 
              color="blue.700"
            >
              {profissionais.filter(prof => prof.verificado).length}
            </Typography>
            <Typography 
              variant="body2" 
              color="blue.600"
            >
              Profissionais Verificados
            </Typography>
          </Box>
        </Grid>

        {/* Especialidades */}
        <Grid item xs={6}>
          <Box 
            sx={{ 
              backgroundColor: 'orange.50', 
              borderRadius: 3, 
              p: 3, 
              textAlign: 'center' 
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Award 
                style={{ 
                  width: 32, 
                  height: 32, 
                  color: '#f97316' 
                }} 
              />
            </Box>
            <Typography 
              variant="h4" 
              fontWeight="bold" 
              color="orange.700"
            >
              {calculaEstatisticas.especialidadesUnicas}
            </Typography>
            <Typography 
              variant="body2" 
              color="orange.600"
            >
              Especialidades
            </Typography>
          </Box>
        </Grid>

        {/* Total Avaliações */}
        <Grid item xs={6}>
          <Box 
            sx={{ 
              backgroundColor: 'purple.50', 
              borderRadius: 3, 
              p: 3, 
              textAlign: 'center' 
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Star 
                style={{ 
                  width: 32, 
                  height: 32, 
                  color: '#9333ea' 
                }} 
              />
            </Box>
            <Typography 
              variant="h4" 
              fontWeight="bold" 
              color="purple.700"
            >
              {profissionais.reduce((acc, p) => acc + (p.referencias || 0), 0)}
            </Typography>
            <Typography 
              variant="body2" 
              color="purple.600"
            >
              Total de Avaliações
            </Typography>
          </Box>
        </Grid>

        {/* Estados Atendidos */}
        <Grid item xs={6}>
          <Box 
            sx={{ 
              backgroundColor: 'indigo.50', 
              borderRadius: 3, 
              p: 3, 
              textAlign: 'center' 
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Map 
                style={{ 
                  width: 32, 
                  height: 32, 
                  color: '#6366f1' 
                }} 
              />
            </Box>
            <Typography 
              variant="h4" 
              fontWeight="bold" 
              color="indigo.700"
            >
              {new Set(profissionais.map(p => p.estado).filter(Boolean)).size}
            </Typography>
            <Typography 
              variant="body2" 
              color="indigo.600"
            >
              Estados Atendidos
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ConquistasDaPlataforma;