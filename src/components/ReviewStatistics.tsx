import { Star } from 'lucide-react';

interface ReviewStatisticsProps {
  reviews: Array<{
    rating: number;
  }>;
}

export default function ReviewStatistics({ reviews }: ReviewStatisticsProps) {
  if (!reviews || reviews.length === 0) {
    return null;
  }

  const totalReviews = reviews.length;
  const ratingCounts = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length,
  };

  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;

  return (
    <div className="bg-gradient-to-br from-white via-cream-50/30 to-white rounded-2xl p-8 shadow-elevation-2 border border-slate-200/40">
      <div className="flex items-center gap-3 mb-6">
        <Star className="w-6 h-6 text-champagne-500" />
        <h3 className="text-2xl font-serif font-semibold text-oak-900">
          Customer Reviews
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="text-center lg:text-left">
          <div className="flex items-baseline justify-center lg:justify-start gap-2 mb-2">
            <span className="text-5xl font-bold text-oak-900">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-2xl text-oak-600">/5</span>
          </div>
          <div className="flex items-center justify-center lg:justify-start gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= Math.round(averageRating)
                    ? 'fill-champagne-400 text-champagne-400'
                    : 'text-slate-300'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-oak-600">
            {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
          </p>
        </div>

        <div className="lg:col-span-2">
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = ratingCounts[rating as keyof typeof ratingCounts];
              const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

              return (
                <div key={rating} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-16">
                    <span className="text-sm font-medium text-oak-700">{rating}</span>
                    <Star className="w-3.5 h-3.5 fill-champagne-400 text-champagne-400" />
                  </div>
                  <div className="flex-1 bg-slate-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-champagne-400 to-champagne-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-oak-600 w-12 text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
