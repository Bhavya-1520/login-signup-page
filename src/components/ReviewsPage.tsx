"use client";

import { useEffect, useState } from "react";
import { getAllReviews, PublicReview } from "@/lib/orders";

interface ReviewsPageProps {
  onNavigate: (page: string) => void;
}

function Stars({ rating }: { rating: number }) {
  const full = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <div className="text-yellow-400 text-base">
      {"★".repeat(full)}
      <span className="text-gray-300">{"★".repeat(5 - full)}</span>
    </div>
  );
}

export default function ReviewsPage({ onNavigate }: ReviewsPageProps) {
  const [reviews, setReviews] = useState<PublicReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllReviews()
      .then((r) => { setReviews(r); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="text-center mb-8">
        <p className="text-[#5EAED4] font-medium tracking-wider text-sm mb-2">Handcrafted Gifts, Delivered With Love</p>
        <h1 className="font-display text-2xl sm:text-4xl font-bold text-[#2C1810]">Customer Reviews</h1>
        <p className="text-gray-500 mt-2 text-sm">Real feedback from our happy customers</p>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="animate-spin w-8 h-8 border-4 border-[#89C4E1] border-t-transparent rounded-full mx-auto"></div>
          <p className="text-gray-400 mt-3">Loading reviews...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-16">
          <span className="text-5xl block mb-4">⭐</span>
          <p className="text-gray-500">No reviews yet. Be the first to share your experience!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviews.map((r, idx) => (
            <div key={r.orderId + idx} className="glass-card rounded-2xl p-5 hover:shadow-lg transition-shadow">
              <Stars rating={r.rating} />
              {r.comment && (
                <p className="text-gray-600 text-sm leading-relaxed mt-2 mb-3">&quot;{r.comment}&quot;</p>
              )}
              {r.photos && r.photos.length > 0 && (
                <div className="flex gap-2 flex-wrap mb-3">
                  {r.photos.slice(0, 4).map((p, i) => (
                    <img key={i} src={p} alt="review" className="w-14 h-14 rounded-lg object-cover border border-gray-100" />
                  ))}
                </div>
              )}
              <div className="flex items-center gap-2 mt-2">
                <div>
                  <p className="font-semibold text-[#2C1810] text-sm">— {r.customerName} <span className="text-[#5EAED4]">✓</span></p>
                  <p className="text-xs text-gray-400">{r.productName}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-center mt-10">
        <button
          onClick={() => onNavigate("home")}
          className="px-6 py-2.5 bg-gradient-to-r from-[#89C4E1] to-[#F8C8DC] text-white font-medium rounded-full text-sm hover:shadow-lg transition-all"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}
