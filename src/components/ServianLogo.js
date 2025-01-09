import React from 'react';
import logo from '../img/logo.png';

const ServianLogo = () => {
  return (
    <div className="flex items-center space-x-4">
      {/* Logo sem fundo e sem contorno, um pouco maior */}
      <img
        src={logo}
        alt="Logo"
        className="h-10 object-contain"
        style={{ 
          filter: 'brightness(0) invert(1)' // Torna o logo branco para o fundo escuro
        }}
      />
    </div>
  );
};

export default ServianLogo;