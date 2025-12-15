import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, ThumbsUp, CheckCircle, Filter, Search, MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Database } from '../lib/database.types';
import ReviewSubmissionModal from '../components/ReviewSubmissionModal';

type Review = Database['public']['Tables']['product_reviews']['Row'] & {
  products: { name: string; slug: string } | null;
};

export default function Reviews() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [ratingStats, setRatingStats] = useState<{ rating: number; count: number }[]>([]);
  const reviewsPerPage = 20;

  useEffect(() => {
    loadReviews();
    loadRatingStats();
  }, [filterRating, searchQuery, currentPage]);

  async function loadReviews() {
    setLoading(true);
    try {
      let query = supabase
        .from('product_reviews')
        .select('*, products(name, slug)', { count: 'exact' })
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
        .range((currentPage - 1) * reviewsPerPage, currentPage * reviewsPerPage - 1);

      if (filterRating) {
        query = query.eq('rating', filterRating);
      }

      if (searchQuery) {
        query = query.or(`review_text.ilike.%${searchQuery}%,order_number.ilike.%${searchQuery}%,title.ilike.%${searchQuery}%`);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      setReviews((data as Review[]) || []);
      setTotalReviews(count || 0);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadRatingStats() {
    try {
      const { data, error } = await supabase
        .from('product_reviews')
        .select('rating')
        .eq('is_approved', true);

      if (error) throw error;

      const stats = [5, 4, 3, 2, 1].map(rating => ({
        rating,
        count: (data || []).filter(r => r.rating === rating).length
      }));

      setRatingStats(stats);
    } catch (error) {
      console.error('Error loading rating stats:', error);
    }
  }

  async function handleMarkHelpful(reviewId: string) {
    if (!user) {
      alert('Please sign in to mark reviews as helpful');
      return;
    }

    try {
      const { error } = await supabase
        .from('review_helpful')
        .insert({ review_id: reviewId, user_id: user.id });

      if (error) {
        if (error.code === '23505') {
          await supabase
            .from('review_helpful')
            .delete()
            .eq('review_id', reviewId)
            .eq('user_id', user.id);
        } else {
          throw error;
        }
      }

      loadReviews();
    } catch (error) {
      console.error('Error marking review as helpful:', error);
    }
  }

  function renderStars(rating: number) {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${
              i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'
            }`}
          />
        ))}
      </div>
    );
  }

  const totalPages = Math.ceil(totalReviews / reviewsPerPage);

  const totalRatingCount = ratingStats.reduce((sum, stat) => sum + stat.count, 0);
  const averageRating = totalRatingCount > 0
    ? ratingStats.reduce((sum, stat) => sum + (stat.rating * stat.count), 0) / totalRatingCount
    : 0;

  const ratingDistribution = ratingStats.map(stat => ({
    rating: stat.rating,
    count: stat.count,
    percentage: totalRatingCount > 0
      ? (stat.count / totalRatingCount) * 100
      : 0
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 via-white to-cream-50/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-oak-900 mb-4">Customer Reviews</h1>
          <p className="text-lg text-oak-600">See what our customers are saying about our furniture</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200/40 sticky top-24">
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-oak-900 mb-2">
                  {averageRating.toFixed(1)}
                </div>
                <div className="flex justify-center mb-2">
                  {renderStars(Math.round(averageRating))}
                </div>
                <p className="text-sm text-oak-600">Based on {totalRatingCount} reviews</p>
              </div>

              <div className="space-y-3 mb-6">
                {ratingDistribution.map(({ rating, count, percentage }) => (
                  <button
                    key={rating}
                    onClick={() => setFilterRating(filterRating === rating ? null : rating)}
                    className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors ${
                      filterRating === rating ? 'bg-oak-100' : 'hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-sm font-medium text-oak-900 w-12">{rating} star</span>
                    <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-yellow-400 h-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-oak-600 w-8 text-right">{count}</span>
                  </button>
                ))}
              </div>

              {filterRating && (
                <button
                  onClick={() => setFilterRating(null)}
                  className="w-full text-sm text-oak-600 hover:text-oak-900 underline mb-6"
                >
                  Clear filter
                </button>
              )}

              <button
                onClick={() => setShowSubmitModal(true)}
                className="w-full bg-gradient-to-r from-oak-700 via-oak-600 to-oak-800 text-white py-3 rounded-xl font-semibold hover:from-oak-800 hover:via-oak-700 hover:to-oak-900 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Write a Review
              </button>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200/40 mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-oak-400" />
                <input
                  type="text"
                  placeholder="Search reviews..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-oak-700 focus:border-transparent"
                />
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-oak-900 border-t-transparent"></div>
              </div>
            ) : reviews.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-slate-200/40">
                <p className="text-oak-600">No reviews found matching your criteria.</p>
              </div>
            ) : (
              <>
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200/40 hover:shadow-xl transition-shadow duration-300"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-oak-900">Order #{review.order_number}</h3>
                          </div>
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-sm text-oak-500">
                          {new Date(review.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>

                      {review.products && (
                        <Link
                          to={`/product/${review.products.slug}`}
                          className="inline-block mb-3 text-sm text-oak-600 hover:text-oak-900 font-medium"
                        >
                          Product: {review.products.name}
                        </Link>
                      )}

                      {review.title && (
                        <h4 className="font-semibold text-lg text-oak-900 mb-2">{review.title}</h4>
                      )}

                      <p className="text-oak-700 leading-relaxed mb-4">{review.review_text}</p>

                      {review.company_response && (
                        <div className="mt-4 p-4 bg-gradient-to-br from-oak-50 via-cream-50 to-oak-50/50 rounded-xl border-l-4 border-oak-400">
                          <div className="flex items-center gap-2 mb-2">
                            <MessageSquare className="w-4 h-4 text-oak-600" />
                            <span className="font-semibold text-oak-900 text-sm">Response from Harts Furniture</span>
                            {review.company_response_date && (
                              <span className="text-xs text-oak-500">
                                • {new Date(review.company_response_date).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-oak-700 leading-relaxed">{review.company_response}</p>
                        </div>
                      )}

                      <div className="flex items-center gap-4 pt-4 border-t border-slate-200">
                        <button
                          onClick={() => handleMarkHelpful(review.id)}
                          className="flex items-center gap-2 text-sm text-oak-600 hover:text-oak-900 transition-colors"
                        >
                          <ThumbsUp className="w-4 h-4" />
                          <span>Helpful ({review.helpful_count})</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-8">
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200/40">
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-sm text-oak-600">
                          Showing {((currentPage - 1) * reviewsPerPage) + 1} - {Math.min(currentPage * reviewsPerPage, totalReviews)} of {totalReviews} reviews
                        </p>
                        <p className="text-sm text-oak-600">
                          Page {currentPage} of {totalPages}
                        </p>
                      </div>
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          className="px-6 py-3 bg-white border-2 border-oak-900 text-oak-900 rounded-xl font-semibold hover:bg-oak-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                        >
                          Previous
                        </button>
                        <div className="flex gap-2">
                          {[...Array(Math.min(10, totalPages))].map((_, i) => {
                            const page = i + 1;
                            return (
                              <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-4 py-3 border-2 rounded-xl font-semibold transition-all duration-300 ${
                                  currentPage === page
                                    ? 'bg-gradient-to-r from-oak-700 via-oak-600 to-oak-800 text-white border-oak-900 shadow-lg scale-105'
                                    : 'bg-white border-slate-300 text-oak-900 hover:bg-slate-50 hover:border-oak-400'
                                }`}
                              >
                                {page}
                              </button>
                            );
                          })}
                        </div>
                        <button
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                          className="px-6 py-3 bg-white border-2 border-oak-900 text-oak-900 rounded-xl font-semibold hover:bg-oak-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {showSubmitModal && (
        <ReviewSubmissionModal
          onClose={() => setShowSubmitModal(false)}
          onSuccess={() => {
            setShowSubmitModal(false);
            loadReviews();
          }}
        />
      )}
    </div>
  );
}
