'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import clsx from 'clsx'
import { LANDING_FAQ } from '@/data/landingContent'

export function LandingFaq() {
  const [openId, setOpenId] = useState<string | null>(LANDING_FAQ[0]?.id ?? null)

  return (
    <div className="final-pane" id="faq">
      <h3>Frequently asked questions</h3>
      <ul className="mt-6 space-y-3 max-w-xl">
        {LANDING_FAQ.map((item) => {
          const isOpen = openId === item.id
          return (
            <li
              key={item.id}
              className="rounded-lg border border-slate-600/50 bg-white/5 overflow-hidden"
            >
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left"
                aria-expanded={isOpen}
                onClick={() => setOpenId(isOpen ? null : item.id)}
              >
                <span className="font-semibold text-slate-50 text-base sm:text-lg">
                  {item.question}
                </span>
                <ChevronDown
                  className={clsx(
                    'h-5 w-5 shrink-0 text-[#1c90a6] transition-transform',
                    isOpen && 'rotate-180',
                  )}
                  aria-hidden
                />
              </button>
              {isOpen && (
                <div className="px-4 pb-4 text-slate-300 text-sm sm:text-base leading-relaxed border-t border-slate-600/40 pt-3">
                  {item.answer}
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

