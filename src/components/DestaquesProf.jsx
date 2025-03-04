import React from 'react';
import { 
  Box, 
  Typography, 
  Grid 
} from '@mui/material';
import { 
  Shield as ShieldIcon, 
  Video as VideoIcon, 
  Zap as ZapIcon, 
  GraduationCap as GraduationCapIcon, 
  Star as StarIcon, 
  Instagram as InstagramIcon 
} from 'lucide-react';

const DestaquesProf = ({ userData }) => {
  // Função auxiliar para renderizar item de destaque
  const renderDestaque = (icon, texto, condicao, cor = 'text.secondary') => {
    const Icon = icon;
    const isAtivo = typeof condicao === 'boolean' ? condicao : (condicao?.length > 0);
    
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          color: isAtivo ? cor : 'text.disabled'
        }}
      >
        <Icon 
          size={20} 
          style={{ 
            marginRight: 8, 
            color: isAtivo ? cor : undefined 
          }} 
        />
        <Typography 
          variant="body1" 
          sx={{ 
            fontWeight: isAtivo ? 'medium' : 'regular',
            color: isAtivo ? cor : 'text.disabled'
          }}
        >
          {texto}
        </Typography>
      </Box>
    );
  };

  return (
    <Box 
      sx={{ 
        backgroundColor: 'background.paper', 
        borderRadius: 2, 
        p: 3, 
        boxShadow: 1 
      }}
    >
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 3, 
          fontWeight: 'bold', 
          color: 'text.primary' 
        }}
      >
        Destaques do Profissional
      </Typography>

      <Grid container spacing={3}>
        {/* Coluna 1 */}
        <Grid item xs={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {renderDestaque(
              ShieldIcon, 
              userData.verificado ? 'Profissional Verificado' : 'Aguardando Verificação',
              userData.verificado,
              'primary.main'
            )}
            {renderDestaque(
              VideoIcon, 
              userData.atendimentoonline ? 'Atendimento Online' : 'Sem Atendimento Online',
              userData.atendimentoonline,
              'secondary.main'
            )}
            {renderDestaque(
              ZapIcon, 
              userData.atendimentoemergencia ? 'Atendimento Emergencial' : 'Sem Atendimento Emergencial',
              userData.atendimentoemergencia,
              'error.main'
            )}
          </Box>
        </Grid>

        {/* Coluna 2 */}
        <Grid item xs={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {renderDestaque(
              GraduationCapIcon, 
              userData.especializacao?.length > 0 
                ? `${userData.especializacao.length} Especializações` 
                : 'Sem Especializações',
              userData.especializacao,
              'success.main'
            )}
            {renderDestaque(
              GraduationCapIcon, 
              userData.pos_graduacao?.length > 0 
                ? `${userData.pos_graduacao.length} Pós-Graduações` 
                : 'Sem Pós-Graduação',
              userData.pos_graduacao,
              'warning.main'
            )}
            {renderDestaque(
              StarIcon, 
              (userData.referencias || 0) >= 10
                ? `${userData.referencias} Avaliações`
                : `${userData.referencias || 0}/10 Avaliações Necessárias`,
              (userData.referencias || 0) >= 10,
              'warning.main'
            )}
          </Box>
        </Grid>

        {/* Coluna 3 */}
        <Grid item xs={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {renderDestaque(
              InstagramIcon, 
              userData.instagram 
                ? `@${userData.instagram}` 
                : 'Perfil do Instagram não informado',
              userData.instagram,
              'pink.main'
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DestaquesProf;