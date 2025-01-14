import React, { useState, useEffect } from 'react';
import { Star, X, AlertTriangle } from 'lucide-react';

const ReviewsModal = ({ isOpen, onClose, profId, profName }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    name: '',
    rating: 0,
    comment: ''
  });
  const [hoveredStar, setHoveredStar] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Controla o scroll do body
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && profId) {
      fetchReviews();
    }
  }, [isOpen, profId]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`https://serviamapp-server.vercel.app/api/reviews?profId=${profId}&status=approved`);
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.name || !newReview.rating || !newReview.comment) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('https://serviamapp-server.vercel.app/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newReview,
          profId,
          date: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        fetchReviews();
        setNewReview({ name: '', rating: 0, comment: '' });
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl w-full max-w-2xl h-[700px] m-4 flex flex-col">
        {/* Header - Fixo */}
        <div className="p-6 border-b flex items-center justify-between shrink-0">
          <h2 className="text-xl font-semibold">Avaliações - {profName}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content - Com scroll */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Review Form */}
          <form onSubmit={handleSubmit} className="mb-8 bg-gray-50 p-4 rounded-xl sticky top-0 z-10 shadow-sm">
            <h3 className="text-lg font-medium mb-4">Deixe sua avaliação</h3>
            
            {/* Stars */}
            <div className="flex items-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoveredStar || newReview.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Name Input */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Seu nome"
                value={newReview.name}
                onChange={(e) => setNewReview(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Comment Input */}
            <div className="mb-4">
              <textarea
                placeholder="Seu comentário"
                value={newReview.comment}
                onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Avaliação'}
            </button>

            {/* Mensagem de moderação */}
            <div className="mt-4 text-sm text-gray-500 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span>Sua avaliação será analisada antes de ser publicada.</span>
            </div>
          </form>

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-center text-gray-500">Nenhuma avaliação ainda. Seja o primeiro a avaliar!</p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="border-b pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-medium">{review.name}</span>
                      <span className="text-gray-500 text-sm ml-2">
                      {formatDate(review.date)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsModal;