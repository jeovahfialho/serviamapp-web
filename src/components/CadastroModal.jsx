import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Plus } from 'lucide-react';


// Registration Modal Component
const CadastroModal = ({ onClose }) => {
    const [step, setStep] = useState(1);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
  
    const [lgpdConsent, setLgpdConsent] = useState({
      dataProcessing: false,
      marketplaceUsage: false
    });
  
    const [formData, setFormData] = useState({
      tipo: '',
      nome: '',
      cpf: '',
      email: '',
      foto: null,
      registro: '',
      telefone: '',
      especializacao: [''],
      graduacao: [''],
      pos_graduacao: [''],
      cursos: [''],
      atuacao: [''],
      valor: '',
      planos: ['Particular'],
      atendimentoOnline: false,
      atendimentoEmergencia: false,
      atendimentoPresencial: false,
      status: 'pending'
    });
  
    const handlePhotoUpload = async (event) => {
      const file = event.target.files[0];
      
      if (!file) {
        alert('Nenhum arquivo selecionado');
        return;
      }
    
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        alert('Tipo de arquivo não suportado. Escolha uma imagem JPG, PNG ou GIF.');
        return;
      }
    
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('O arquivo é muito grande. Limite máximo é de 5MB.');
        return;
      }
    
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'ml_default');
      
      try {
        setIsUploading(true);
        
        const response = await fetch(
          'https://api.cloudinary.com/v1_1/dvdpqiukz/image/upload',
          {
            method: 'POST',
            body: formData
          }
        );
    
        if (!response.ok) {
          throw new Error('Erro no upload da imagem');
        }
  
        const data = await response.json();
        
        if (!data.secure_url) {
          throw new Error('Nenhuma URL de imagem foi gerada');
        }
    
        setFormData(prev => ({
          ...prev,
          foto: data.secure_url
        }));
    
        alert('Imagem enviada com sucesso!');
    
      } catch (error) {
        console.error('Erro no upload:', error);
        alert('Não foi possível fazer upload da imagem.');
      } finally {
        setIsUploading(false);
      }
    };
  
    const handleSubmit = async () => {
      if (!lgpdConsent.dataProcessing || !lgpdConsent.marketplaceUsage) {
        alert('Por favor, aceite os termos de consentimento para continuar.');
        return;
      }
    
      if (isSubmitting) return;
      setIsSubmitting(true);
    
      try {
        const dataToSend = {
          ...formData,
          especializacao: formData.especializacao.filter(item => item.trim() !== ''),
          graduacao: formData.graduacao.filter(item => item.trim() !== ''),
          pos_graduacao: formData.pos_graduacao.filter(item => item.trim() !== ''),
          cursos: formData.cursos.filter(item => item.trim() !== ''),
          atuacao: formData.atuacao.filter(item => item.trim() !== ''),
          valor: formData.valor === '' || isNaN(formData.valor) ? 0 : Number(formData.valor),
          planos: formData.planos.filter(item => item.trim() !== ''),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          lgpdConsent: {
            dataProcessing: lgpdConsent.dataProcessing,
            marketplaceUsage: lgpdConsent.marketplaceUsage,
            consentDate: new Date().toISOString()
          }
        };
    
        const response = await fetch('https://serviamapp-server.vercel.app/api/profissionais', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSend)
        });
    
        if (response.ok) {
          setIsSuccess(true);
          setTimeout(() => {
            onClose();
            window.location.reload();
          }, 3000);
        } else {
          const error = await response.json();
          alert('Erro ao cadastrar profissional: ' + (error.message || 'Erro desconhecido'));
        }
      } catch (error) {
        console.error('Erro ao enviar dados:', error);
        alert('Erro ao cadastrar profissional: ' + error.message);
      } finally {
        setIsSubmitting(false);
      }
    };
  
    const steps = [
      { number: 1, title: 'Informações Básicas' },
      { number: 2, title: 'Formação' },
      { number: 3, title: 'Atuação' },
      { number: 4, title: 'Atendimento' },
      { number: 5, title: 'Termos e Consentimento' }
    ];
  
    const nextStep = () => setStep((prev) => Math.min(prev + 1, steps.length));
    const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));
  
    if (isSuccess) {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-full max-w-md p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Cadastro Realizado!</h2>
            <p className="text-gray-600 mb-6">O profissional foi cadastrado com sucesso.</p>
            <p className="text-sm text-gray-500">Esta janela será fechada automaticamente...</p>
          </div>
        </div>
      );
    }
  
    const renderStepContent = () => {
      switch (step) {
        case 1:
          return (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Informações Básicas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Foto do Profissional
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                    <div className="space-y-1 text-center">
                      {formData.foto ? (
                        <div className="flex flex-col items-center">
                          <img
                            src={formData.foto}
                            alt="Preview"
                            className="h-24 w-24 object-cover rounded-full"
                          />
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, foto: null }))}
                            className="mt-2 text-sm text-red-600 hover:text-red-700"
                          >
                            Remover foto
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer flex flex-col items-center">
                          <Plus className="mx-auto h-12 w-12 text-gray-400" />
                          <p className="text-gray-600">Clique para fazer upload</p>
                          <input
                            type="file"
                            className="hidden"
                            onChange={handlePhotoUpload}
                            accept="image/*"
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CPF
                  </label>
                  <input
                    type="text"
                    value={formData.cpf}
                    onChange={(e) => setFormData(prev => ({ ...prev, cpf: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 p-2.5"
                    placeholder="000.000.000-00"
                  />
                </div>
  
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 p-2.5"
                    placeholder="seu@email.com"
                  />
                </div>
  
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoria
                  </label>
                  <select
                    value={formData.tipo}
                    onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 p-2.5"
                  >
                    <option value="">Selecione...</option>
                    <option value="Médico">Médico</option>
                    <option value="Psicólogo">Psicólogo</option>
                    <option value="Terapeuta">Terapeuta</option>
                    <option value="Nutricionista">Nutricionista</option>
                    <option value="Fisioterapeuta">Fisioterapeuta</option>
                    <option value="Pedagogo">Pedagogo</option>
                    <option value="Educador Físico">Educador Físico</option>
                    <option value="Consultor">Consultor</option>
                    <option value="Assessor">Assessor</option>
                    <option value="Especialista">Especialista</option>
                  </select>
                </div>
  
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 p-2.5"
                  />
                </div>
  
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Registro Profissional
                  </label>
                  <input
                    type="text"
                    value={formData.registro}
                    onChange={(e) => setFormData(prev => ({ ...prev, registro: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 p-2.5"
                  />
                </div>
  
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    value={formData.telefone}
                    onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
                    placeholder="(11) 99999-9999"
                    className="w-full rounded-lg border border-gray-300 p-2.5"
                  />
                </div>
  
                <div className="col-span-2">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Especializações
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          especializacao: [...prev.especializacao, '']
                        }));
                      }}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      + Adicionar Especialização
                    </button>
                  </div>
                  {formData.especializacao.map((esp, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={esp}
                        onChange={(e) => {
                          const updatedEsp = [...formData.especializacao];
                          updatedEsp[index] = e.target.value;
                          setFormData(prev => ({
                            ...prev,
                            especializacao: updatedEsp
                          }));
                        }}
                        className="w-full rounded-lg border border-gray-300 p-2.5"
                        placeholder="Ex: Cardiologia"
                      />
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            const updatedEsp = formData.especializacao.filter((_, i) => i !== index);
                            setFormData(prev => ({
                              ...prev,
                              especializacao: updatedEsp
                            }));
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X size={20} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        case 2:
          return (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Formação</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Graduação
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          graduacao: [...prev.graduacao, '']
                        }));
                      }}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      + Adicionar Graduação
                    </button>
                  </div>
                  {formData.graduacao.map((grad, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={grad}
                        onChange={(e) => {
                          const updatedGrad = [...formData.graduacao];
                          updatedGrad[index] = e.target.value;
                          setFormData(prev => ({
                            ...prev,
                            graduacao: updatedGrad
                          }));
                        }}
                        className="w-full rounded-lg border border-gray-300 p-2.5"
                        placeholder="Ex: Medicina - USP"
                      />
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            const updatedGrad = formData.graduacao.filter((_, i) => i !== index);
                            setFormData(prev => ({
                              ...prev,
                              graduacao: updatedGrad
                            }));
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X size={20} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
  
                {/* Pós-Graduação */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Pós-Graduação
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          pos_graduacao: [...prev.pos_graduacao, '']
                        }));
                      }}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      + Adicionar Pós-Graduação
                    </button>
                  </div>
                  {formData.pos_graduacao.map((pos, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={pos}
                        onChange={(e) => {
                          const updatedPos = [...formData.pos_graduacao];
                          updatedPos[index] = e.target.value;
                          setFormData(prev => ({
                            ...prev,
                            pos_graduacao: updatedPos
                          }));
                        }}
                        className="w-full rounded-lg border border-gray-300 p-2.5"
                        placeholder="Ex: Mestrado em Cardiologia"
                      />
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            const updatedPos = formData.pos_graduacao.filter((_, i) => i !== index);
                            setFormData(prev => ({
                              ...prev,
                              pos_graduacao: updatedPos
                            }));
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X size={20} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
  
                {/* Cursos */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Cursos e Formações
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          cursos: [...prev.cursos, '']
                        }));
                      }}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      + Adicionar Curso
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.cursos.map((curso, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={curso}
                          onChange={(e) => {
                            const updatedCursos = [...formData.cursos];
                            updatedCursos[index] = e.target.value;
                            setFormData((prev) => ({
                              ...prev,
                              cursos: updatedCursos
                            }));
                          }}
                          className="w-full rounded-lg border border-gray-300 p-2.5"
                          placeholder="Nome do curso"
                        />
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              const updatedCursos = formData.cursos.filter((_, i) => i !== index);
                              setFormData(prev => ({
                                ...prev,
                                cursos: updatedCursos
                              }));
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X size={20} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        case 3:
          return (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Atuação</h3>
              <div className="space-y-4">
                {/* Áreas de Atuação */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Áreas de Atuação (tags)
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          atuacao: [...prev.atuacao, '']
                        }));
                      }}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      + Adicionar Área
                    </button>
                  </div>
                  {formData.atuacao.map((area, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={area}
                        onChange={(e) => {
                          const updatedAreas = [...formData.atuacao];
                          updatedAreas[index] = e.target.value;
                          setFormData((prev) => ({
                            ...prev,
                            atuacao: updatedAreas
                          }));
                        }}
                        className="w-full rounded-lg border border-gray-300 p-2.5"
                        placeholder="Ex: Ansiedade"
                      />
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            const updatedAreas = formData.atuacao.filter((_, i) => i !== index);
                            setFormData(prev => ({
                              ...prev,
                              atuacao: updatedAreas
                            }));
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X size={20} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
  
                {/* Valor da consulta */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valor da Consulta
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.valor === ''}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData((prev) => ({ ...prev, valor: '' }));
                          } else {
                            setFormData((prev) => ({ ...prev, valor: '0' }));
                          }
                        }}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300"
                      />
                      <label className="ml-2 block text-sm text-gray-700">
                        Valores a consultar
                      </label>
                    </div>
                    
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                        R$
                      </span>
                      <input
                        type="number"
                        value={formData.valor}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, valor: e.target.value }))
                        }
                        disabled={formData.valor === ''}
                        className={`w-full rounded-lg border border-gray-300 p-2.5 pl-8 ${
                          formData.valor === '' ? 'bg-gray-100' : ''
                        }`}
                      />
                    </div>
                  </div>
                </div>
  
                {/* Convênios */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Convênios
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          planos: [...prev.planos, '']
                        }));
                      }}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      + Adicionar Convênio
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.planos.map((plano, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={plano}
                          onChange={(e) => {
                            const updatedPlanos = [...formData.planos];
                            updatedPlanos[index] = e.target.value;
                            setFormData((prev) => ({
                              ...prev,
                              planos: updatedPlanos
                            }));
                          }}
                          className="w-full rounded-lg border border-gray-300 p-2.5"
                          placeholder="Ex: Particular, Unimed, etc."
                        />
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              const updatedPlanos = formData.planos.filter((_, i) => i !== index);
                              setFormData(prev => ({
                                ...prev,
                                planos: updatedPlanos
                              }));
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X size={20} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        case 4:
          return (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Atendimento</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.atendimentoOnline}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        atendimentoOnline: e.target.checked
                      }))
                    }
                    className="h-4 w-4 text-blue-600 rounded border-gray-300"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Atendimento Online
                  </label>
                </div>
  
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.atendimentoEmergencia}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        atendimentoEmergencia: e.target.checked
                      }))
                    }
                    className="h-4 w-4 text-blue-600 rounded border-gray-300"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Atendimento de Emergência
                  </label>
                </div>
  
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.atendimentoPresencial}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        atendimentoPresencial: e.target.checked
                      }))
                    }
                    className="h-4 w-4 text-blue-600 rounded border-gray-300"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Atendimento Presencial
                  </label>
                </div>
              </div>
            </div>
          );
        case 5:
          return (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Termos de Consentimento</h3>
              
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <p className="text-sm text-blue-800 mb-2">
                  Seus dados serão utilizados de acordo com a Lei Geral de Proteção de Dados (LGPD).
                  Por favor, leia e confirme seu consentimento abaixo:
                </p>
              </div>
    
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      checked={lgpdConsent.dataProcessing}
                      onChange={(e) => setLgpdConsent(prev => ({
                        ...prev,
                        dataProcessing: e.target.checked
                      }))}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300"
                    />
                  </div>
                  <div className="ml-3">
                    <label className="text-sm text-gray-700">
                      Concordo com o processamento dos meus dados para criação de um perfil profissional 
                      em um marketplace nacional e internacional. Entendo que minhas informações serão 
                      utilizadas exclusivamente para conectar-me com potenciais pacientes/clientes.
                    </label>
                  </div>
                </div>
    
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      checked={lgpdConsent.marketplaceUsage}
                      onChange={(e) => setLgpdConsent(prev => ({
                        ...prev,
                        marketplaceUsage: e.target.checked
                      }))}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300"
                    />
                  </div>
                  <div className="ml-3">
                    <label className="text-sm text-gray-700">
                      Estou ciente de que meus dados profissionais serão exibidos publicamente na 
                      plataforma e poderão ser acessados por usuários interessados em meus serviços. 
                      Posso solicitar a exclusão dos meus dados a qualquer momento.
                    </label>
                  </div>
                </div>
  
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-2">Segurança e Disponibilidade:</p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
                    <li>Seus dados são armazenados em infraestrutura de nuvem distribuída geograficamente</li>
                    <li>Sistema com alta disponibilidade e backups automáticos</li>
                    <li>Dados criptografados em repouso e em trânsito</li>
                    <li>Infraestrutura com certificações de segurança internacionais</li>
                    <li>Monitoramento contínuo de segurança e proteção contra ameaças</li>
                    <li>Sistema hospedado em provedores de nuvem de classe mundial</li>
                    <li>Conformidade com padrões internacionais de proteção de dados</li>
                  </ul>
                </div>
  
                <div className="mt-4 text-sm text-gray-500">
                  <p className="font-medium">Informações importantes:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Seus dados não serão vendidos ou compartilhados com terceiros</li>
                    <li>Você pode solicitar a exclusão dos seus dados a qualquer momento</li>
                    <li>Apenas informações profissionais serão exibidas publicamente</li>
                    <li>Você terá controle sobre quais informações serão visíveis</li>
                    <li>Acesso ao sistema é protegido por autenticação segura</li>
                    <li>Sistema com disponibilidade 24/7 e suporte técnico</li>
                  </ul>
                </div>
              </div>
            </div>
          );
        default:
          return null;
      }
    };
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Cadastrar Profissional</h2>
              <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
  
            <div className="mt-6 flex justify-between">
              {steps.map((s) => (
                <div key={s.number} className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step >= s.number
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {s.number}
                  </div>
                  <span className="mt-2 text-xs text-gray-600">{s.title}</span>
                </div>
              ))}
            </div>
          </div>
  
          <div className="p-6">{renderStepContent()}</div>
  
          <div className="p-6 border-t border-gray-200 flex justify-between">
            <button
              onClick={prevStep}
              className={`px-4 py-2 text-gray-600 rounded-lg border border-gray-300 hover:bg-gray-50 ${
                step === 1 ? 'invisible' : ''
              }`}
            >
              Voltar
            </button>
            <button
              onClick={step === steps.length ? handleSubmit : nextStep}
              disabled={isSubmitting}
              className={`px-4 py-2 rounded-lg text-white flex items-center justify-center gap-2 transition-colors ${
                isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed opacity-70' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {step === steps.length ? (
                <>
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processando...
                    </>
                  ) : (
                    'Concluir'
                  )}
                </>
              ) : (
                'Próximo'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  export default CadastroModal;