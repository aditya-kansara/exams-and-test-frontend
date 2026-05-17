'use client'

import { LANDING_REVIEWS } from '@/data/landingContent'

export function LandingReviews() {
  return (
    <div className="final-pane" id="reviews">
      <h3>Reviews</h3>
      <p className="mt-2 mb-6 text-slate-400 text-base">
        From candidates preparing for AMC exams
      </p>
      <ul className="space-y-4">
        {LANDING_REVIEWS.map((review) => (
          <li
            key={review.id}
            className="rounded-xl border border-slate-600/50 bg-white/5 p-5 sm:p-6"
          >
            <blockquote className="text-slate-200 text-sm sm:text-base leading-relaxed">
              &ldquo;{review.quote}&rdquo;
            </blockquote>
            <p className="mt-3 text-sm font-medium text-[#1c90a6]">
              By {review.author}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}

