import React, { useState, useEffect } from 'react';
import { Menu, X, User } from 'lucide-react';

const Dashboard = () => {
    const [menuAberto, setMenuAberto] = useState(false);
    const [mostrarModalCadastro, setMostrarModalCadastro] = useState(false);
    const [etapaAtual, setEtapaAtual] = useState(0);
    const [formDados, setFormDados] = useState({
        tipo: '',
        nome: '',
        especializacao: '',
        graduacao: '',
        posGraduacao: '',
        cursos: [],
        atuacao: [],
        planos: [],
        registro: '',
        valor: '',
        atendimentoOnline: false,
        atendimentoEmergencia: false,
        atendeDomicilio: false,
    });

    const avancarEtapa = () => setEtapaAtual(etapaAtual + 1);
    const voltarEtapa = () => setEtapaAtual(etapaAtual - 1);

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Menu Superior */}
            <nav className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <button
                                onClick={() => setMenuAberto(!menuAberto)}
                                className="p-2 rounded-md text-gray-600 hover:text-gray-900"
                            >
                                <Menu size={24} />
                            </button>
                            <div className="ml-4 font-bold text-xl">Admin Dashboard</div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                    <User size={20} className="text-blue-600" />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex">
                {/* Menu Lateral */}
                <aside className={`fixed top-0 left-0 h-full bg-white shadow-lg w-64 transform transition-transform duration-300 ease-in-out ${menuAberto ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static`}>
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <img src="/api/placeholder/120/40" alt="Logo" />
                        <button 
                            onClick={() => setMenuAberto(false)}
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                        >
                            <X size={24} className="text-gray-500" />
                        </button>
                    </div>
                    <nav className="p-4">
                        <a 
                            href="#" 
                            onClick={() => setMostrarModalCadastro(true)} 
                            className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
                        >
                            Cadastro de Profissionais
                        </a>
                    </nav>
                </aside>

                {/* Conteúdo Principal */}
                <main className="flex-1 p-8">
                    <h1 className="text-2xl font-bold">Bem-vindo ao Dashboard</h1>
                </main>
            </div>

            {/* Modal de Cadastro */}
            {mostrarModalCadastro && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
                        <h2 className="text-xl font-bold mb-4">Cadastro de Profissional</h2>

                        {etapaAtual === 0 && (
                            <div>
                                <label className="block mb-2">Nome</label>
                                <input
                                    type="text"
                                    value={formDados.nome}
                                    onChange={(e) => setFormDados({ ...formDados, nome: e.target.value })}
                                    className="w-full border rounded-md p-2"
                                />
                                <label className="block mt-4 mb-2">Tipo</label>
                                <select
                                    value={formDados.tipo}
                                    onChange={(e) => setFormDados({ ...formDados, tipo: e.target.value })}
                                    className="w-full border rounded-md p-2"
                                >
                                    <option value="">Selecione</option>
                                    <option value="Psicólogo">Psicólogo</option>
                                    <option value="Médico">Médico</option>
                                    <option value="Terapeuta">Terapeuta</option>
                                </select>
                            </div>
                        )}

                        {etapaAtual === 1 && (
                            <div>
                                <label className="block mb-2">Especialização</label>
                                <input
                                    type="text"
                                    value={formDados.especializacao}
                                    onChange={(e) => setFormDados({ ...formDados, especializacao: e.target.value })}
                                    className="w-full border rounded-md p-2"
                                />
                                <label className="block mt-4 mb-2">Cursos</label>
                                <textarea
                                    value={formDados.cursos.join('\n')}
                                    onChange={(e) => setFormDados({ ...formDados, cursos: e.target.value.split('\n') })}
                                    className="w-full border rounded-md p-2"
                                />
                            </div>
                        )}

                        <div className="flex justify-between mt-6">
                            {etapaAtual > 0 && (
                                <button 
                                    onClick={voltarEtapa} 
                                    className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                                >
                                    Voltar
                                </button>
                            )}
                            {etapaAtual < 1 ? (
                                <button 
                                    onClick={avancarEtapa} 
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                                >
                                    Próximo
                                </button>
                            ) : (
                                <button 
                                    onClick={() => {
                                        console.log(formDados);
                                        setMostrarModalCadastro(false);
                                    }} 
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg"
                                >
                                    Concluir
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
