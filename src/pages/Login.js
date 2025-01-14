// pages/LoginPage.jsx
import React, { useState } from 'react';
import { Phone, Lock, Eye, EyeOff } from 'lucide-react';
import Cleave from 'cleave.js/react';
import 'cleave.js/dist/addons/cleave-phone.br';  
import ServianLogoText from '../components/ServianLogoText';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const LoginPage = () => {
  const setAuth = useAuth(state => state.setAuth);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phone: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log('Enviando dados:', {
        telefone: formData.phone.replace(/\D/g, ''),
        password: formData.password
      });
    
      const response = await fetch('https://serviamapp-server.vercel.app/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telefone: formData.phone.replace(/\D/g, ''),
          password: formData.password
        })
      });
      
      const data = await response.json();
      console.log('Resposta login:', data);
      
      if (!response.ok) throw new Error(data.message);
      
      console.log('Setando auth:', { user: data.user, token: data.token });
      setAuth(data.user, data.token);
      
      console.log('Estado após setAuth:', useAuth.getState());
      navigate('/dashboard');
      
    } catch (err) {
      console.error('Erro completo:', err);
      setError('Credenciais inválidas');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-[#273440] p-8">
              <div className="flex justify-center">
                <ServianLogoText />
              </div>
            </div>

            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Bem-vindo(a)!</h2>
                <p className="text-gray-600 mt-2">Entre com seu celular e senha</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 block">
                    Celular
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <Cleave
                      options={{
                        phone: true,
                        phoneRegionCode: 'BR',
                        delimiter: ' ',
                        blocks: [0, 2, 5, 4],
                        numericOnly: true
                      }}
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 block">
                    Senha
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 text-red-500 text-sm py-2 px-3 rounded-lg">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#273440] hover:bg-[#1e2832] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#273440] transition-colors
                    ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? 'Entrando...' : 'Entrar'}
                </button>
              </form>

              <p className="mt-8 text-center text-sm text-gray-600">
                Não tem uma conta?{' '}
                <a href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                  Cadastre-se
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <div className="py-4 px-6">
        <p className="text-center text-sm text-gray-600">
          Desenvolvido por{' '}
          <a href="" className="font-medium text-blue-600 hover:text-blue-500">
            Simões Tecnologia da Informação
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
