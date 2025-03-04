import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  LinearProgress, 
  Tooltip 
} from '@mui/material';
import { 
  CheckCircle as CheckCircleIcon, 
  XCircle as XCircleIcon 
} from 'lucide-react';

const StatusCadastro = ({ userData, calculateProfileCompleteness }) => {
  // Função para renderizar item de status
  const renderStatusItem = (condition, label, required = true) => {
    const isComplete = condition;
    
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          color: isComplete 
            ? (required ? 'success.main' : 'warning.main') 
            : 'text.disabled' 
        }}
      >
        {isComplete ? (
          <CheckCircleIcon 
            size={20} 
            style={{ marginRight: 8, color: required ? '#2e7d32' : '#ed6c02' }} 
          />
        ) : (
          <XCircleIcon 
            size={20} 
            style={{ marginRight: 8, color: '#757575' }} 
          />
        )}
        <Typography 
          variant="body2" 
          sx={{ 
            fontWeight: isComplete ? 'medium' : 'regular',
            color: isComplete 
              ? (required ? 'success.main' : 'warning.main') 
              : 'text.disabled' 
          }}
        >
          {label} {!isComplete && required ? '*' : ''}
        </Typography>
      </Box>
    );
  };

  const completeness = calculateProfileCompleteness(userData);

  return (
    <Box sx={{ 
      backgroundColor: 'background.paper', 
      borderRadius: 2, 
      p: 3, 
      boxShadow: 1 
    }}>
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 3, 
          fontWeight: 'bold', 
          color: 'text.primary' 
        }}
      >
        Status do Cadastro
      </Typography>

      <Grid container spacing={3}>
        {/* Coluna 1 */}
        <Grid item xs={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {renderStatusItem(userData.nome, 'Nome')}
            {renderStatusItem(userData.cpf, 'CPF')}
            {renderStatusItem(userData.email, 'Email')}
            {renderStatusItem(userData.instagram, 'Instagram', false)}
          </Box>
        </Grid>

        {/* Coluna 2 */}
        <Grid item xs={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {renderStatusItem(userData.telefone, 'Telefone')}
            {renderStatusItem(userData.tipo, 'Tipo')}
            {renderStatusItem(userData.especializacao?.length > 0, 'Especialização')}
            {renderStatusItem(userData.pos_graduacao?.length > 0, 'Pós-graduação', false)}
          </Box>
        </Grid>

        {/* Coluna 3 */}
        <Grid item xs={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {renderStatusItem(userData.cidade, 'Cidade')}
            {renderStatusItem(userData.estado, 'Estado')}
            {renderStatusItem(userData.bairro, 'Bairro')}
            {renderStatusItem(userData.cursos?.length > 0, 'Cursos', false)}
          </Box>
        </Grid>
      </Grid>

      {/* Barra de Progresso */}
      <Box sx={{ mt: 4 }}>
        <Tooltip title={`${completeness}% Concluído`} placement="top">
          <LinearProgress 
            variant="determinate" 
            value={completeness}
            sx={{
              height: 10,
              borderRadius: 5,
              backgroundColor: 'background.default',
              '& .MuiLinearProgress-bar': {
                borderRadius: 5,
                backgroundColor: 
                  completeness < 50 ? 'error.main' : 
                  completeness < 80 ? 'warning.main' : 
                  'success.main'
              }
            }}
          />
        </Tooltip>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mt: 2 
        }}>
          <Typography variant="body2" color="text.secondary">
            {completeness}% concluído
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ 
                width: 12, 
                height: 12, 
                borderRadius: '50%', 
                backgroundColor: 'success.main', 
                mr: 1 
              }} />
              <Typography variant="caption" color="text.secondary">
                Obrigatório
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ 
                width: 12, 
                height: 12, 
                borderRadius: '50%', 
                backgroundColor: 'warning.main', 
                mr: 1 
              }} />
              <Typography variant="caption" color="text.secondary">
                Opcional
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default StatusCadastro;