import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';

const PhoneDisplay = ({ telefone }) => {
  const [showPhone, setShowPhone] = useState(false);

  const formatPhoneNumber = (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
  };

  const getWhatsAppLink = (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    return `https://wa.me/55${cleaned}`;
  };

  return (
    <div className="space-y-2">
      <button 
        onClick={() => setShowPhone(!showPhone)}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        {showPhone ? 'Ocultar Telefone' : 'Mostrar Telefone'}
      </button>
      
      {showPhone && (
        <div className="flex items-center justify-center gap-4 mt-2">
          <span className="text-gray-700 font-medium">
            {formatPhoneNumber(telefone)}
          </span>
          <a 
            href={getWhatsAppLink(telefone)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-green-600 hover:text-green-700"
          >
            <MessageSquare className="w-5 h-5" />
          </a>
        </div>
      )}
    </div>
  );
};

export default PhoneDisplay;