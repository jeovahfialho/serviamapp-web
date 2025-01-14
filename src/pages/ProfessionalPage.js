import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Star, Phone, Mail, MapPin, Clock,
  Award, BookOpen, DollarSign, Users, Calendar,
  Building, CheckCircle, User
} from 'lucide-react';
import { MdVerified } from 'react-icons/md';
import ServianLogoText from '../components/ServianLogoText';
import ReviewsModal from '../components/ReviewsModal';

const ProfessionalPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [professional, setProfessional] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReviews, setShowReviews] = useState(false);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    const fetchProfessional = async () => {
      console.log('Buscando profissional com ID:', id);
      try {
        const response = await fetch(`https://serviamapp-server.vercel.app/api/profissionais?id=${id}`);
        console.log('Status da resposta:', response.status);
        const data = await response.json();
        console.log('Dados recebidos:', data);
        setProfessional(data);
      } catch (error) {
        console.error('Erro ao buscar profissional:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessional();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!professional) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Profissional não encontrado</h2>
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
          >
            <ArrowLeft className="h-5 w-5" />
            Voltar
          </button>
        </div>
      </div>
    );
  }

  const InfoSection = ({ icon: Icon, title, children }) => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      </div>
      {children}
    </div>
  );

  const Tag = ({ children, color = "blue" }) => (
    <span className={`px-3 py-1 bg-${color}-50 text-${color}-600 rounded-full text-sm`}>
      {children}
    </span>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-[#273440] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <ServianLogoText />
            <button
              onClick={() => navigate(-1)}
              className="text-white hover:text-gray-200 flex items-center gap-2"
            >
              <ArrowLeft className="h-5 w-5" />
              Voltar
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Hero Section */}
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            {/* Foto */}
            <div className="flex-shrink-0 flex justify-center md:justify-start">
              {professional.foto ? (
                <img
                  src={professional.foto}
                  alt={professional.nome}
                  className="h-24 w-24 sm:h-32 sm:w-32 rounded-2xl object-cover"
                />
              ) : (
                <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  <User className="h-10 w-10 sm:h-12 sm:w-12 text-blue-600" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 sm:gap-3 mb-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{professional.nome}</h1>
                {professional.verificado && (
                  <MdVerified className="h-6 w-6 sm:h-7 sm:w-7 text-blue-500" />
                )}
              </div>
              <p className="text-base sm:text-lg text-blue-600 font-medium mb-1">{professional.tipo}</p>
              <p className="text-sm sm:text-base text-gray-600 mb-4">{professional.registro}</p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                <button 
                  onClick={() => setShowReviews(true)}
                  className="flex items-center group hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors"
                >
                  <Star className="h-5 w-5 text-yellow-400 group-hover:scale-110 transition-transform" />
                  <span className="ml-1 font-medium">{professional.pontuacao}</span>
                  <span className="mx-1 text-gray-300">•</span>
                  <span className="text-gray-600">
                    {professional.referencias} {professional.referencias === 1 ? 'avaliação' : 'avaliações'}
                  </span>
                </button>

                <div className="text-xl font-bold text-gray-900">
                  {Number(professional.valor) === 0 
                    ? "Valor a Consultar" 
                    : `R$ ${Number(professional.valor).toFixed(2)}`
                  }
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="w-full md:w-auto mt-4 md:mt-0">
              <button
                onClick={() => setShowContact(!showContact)}
                className="w-full bg-[#273440] text-white px-4 sm:px-6 py-3 rounded-xl hover:bg-[#1e2832] transition-colors flex items-center justify-center gap-2"
              >
                <Phone className="h-5 w-5" />
                <span>Contatar</span>
              </button>

              {showContact && (
                <div className="mt-4 bg-gray-100 p-4 rounded-xl space-y-3">
                  {professional.telefone && (
                    <a
                      href={`https://wa.me/${professional.telefone}?text=Olá, cheguei até você por meio da Plataforma Serviam.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-green-600 hover:text-green-700"
                    >
                      <Phone className="h-5 w-5" />
                      <span className="break-all">{professional.telefone}</span>
                    </a>
                  )}
                  {professional.email && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="h-5 w-5" />
                      <span className="break-all">{professional.email}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Sobre e Especialização */}
            <div className="space-y-6">
              {professional.descricao && (
                <InfoSection icon={User} title="Sobre">
                  <p className="text-gray-600 whitespace-pre-wrap">
                    {professional.descricao}
                  </p>
                </InfoSection>
              )}

              {professional.especializacao && professional.especializacao.length > 0 && (
                <InfoSection icon={Award} title="Especializações">
                  <div className="flex flex-wrap gap-2">
                    {professional.especializacao.map((esp, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-sm"
                      >
                        {esp}
                      </span>
                    ))}
                  </div>
                </InfoSection>
              )}
            </div>

            {/* Seção de Avaliações */}
            {professional.reviews && professional.reviews.length > 0 && (
              <InfoSection icon={Star} title="Avaliações dos Pacientes">
                <div className="space-y-4">
                  {/* Resumo das avaliações */}
                  <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Star className="h-8 w-8 text-yellow-400 fill-current" />
                      <div>
                        <div className="text-2xl font-bold">{professional.pontuacao}</div>
                        <div className="text-sm text-gray-600">{professional.referencias} avaliações</div>
                      </div>
                    </div>
                  </div>

                  {/* Lista de reviews */}
                  <div className="space-y-4">
                    {professional.reviews.map((review, index) => (
                      <div key={review.id || index} className="border-b border-gray-100 pb-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="bg-blue-50 p-2 rounded-full">
                              <User className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="font-medium text-gray-900">
                              {review.nome || 'Paciente'}
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Star className="h-5 w-5 text-yellow-400 fill-current" />
                            <span className="ml-1 font-medium">{review.rating}</span>
                          </div>
                        </div>
                        <p className="text-gray-600">{review.comentario}</p>
                        {review.data && (
                          <p className="text-sm text-gray-400 mt-2">
                            {new Date(review.data).toLocaleDateString('pt-BR')}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </InfoSection>
            )}

            {/* Formação */}
            <InfoSection icon={BookOpen} title="Formação">
              <div className="space-y-4">
                {professional.graduacao?.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-800 mb-2">Graduação</h3>
                    <ul className="space-y-2">
                      {professional.graduacao.map((grad, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Building className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-600">{grad}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {professional.pos_graduacao?.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-800 mb-2">Pós-Graduação</h3>
                    <ul className="space-y-2">
                      {professional.pos_graduacao.map((pos, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Award className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-600">{pos}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </InfoSection>

            {/* Cursos e Certificações */}
            {professional.cursos?.length > 0 && (
              <InfoSection icon={Award} title="Cursos e Certificações">
                <ul className="space-y-2">
                  {professional.cursos.map((curso, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">{curso}</span>
                    </li>
                  ))}
                </ul>
              </InfoSection>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Áreas de Atuação */}
            <InfoSection icon={Users} title="Áreas de Atuação">
              <div className="flex flex-wrap gap-2">
                {professional.atuacao?.map((area, index) => (
                  <Tag key={index}>{area}</Tag>
                ))}
              </div>
            </InfoSection>

            {/* Formas de Atendimento */}
            <InfoSection icon={Calendar} title="Formas de Atendimento">
              <div className="space-y-3">
                {professional.atendimentoonline && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Atendimento Online</span>
                  </div>
                )}
                {professional.atendimentopresencial && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-500" />
                    <span>Atendimento Presencial</span>
                  </div>
                )}
                {professional.atendimentoemergencia && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-red-500" />
                    <span>Atendimento de Emergência</span>
                  </div>
                )}
              </div>
            </InfoSection>

            {/* Convênios */}
            {professional.planos?.length > 0 && (
              <InfoSection icon={DollarSign} title="Convênios">
                <div className="flex flex-wrap gap-2">
                  {professional.planos.map((plano, index) => (
                    <Tag key={index} color="green">{plano}</Tag>
                  ))}
                </div>
              </InfoSection>
            )}

            {/* Faixa Etária */}
            {professional.faixa_etaria?.length > 0 && (
              <InfoSection icon={Users} title="Faixa Etária">
                <div className="flex flex-wrap gap-2">
                  {professional.faixa_etaria.map((faixa, index) => (
                    <Tag key={index} color="purple">{faixa}</Tag>
                  ))}
                </div>
              </InfoSection>
            )}

            {/* Localização */}
            {(professional.cidade || professional.estado) && (
              <InfoSection icon={MapPin} title="Localização">
                <p className="text-gray-600">
                  {professional.cidade}{professional.estado && `, ${professional.estado}`}
                </p>
              </InfoSection>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Avaliações */}
      <ReviewsModal
        isOpen={showReviews}
        onClose={() => setShowReviews(false)}
        profId={professional.id}
        profName={professional.nome}
      />
    </div>
  );
};

export default ProfessionalPage;