'use client'

import { SOCIAL_LINKS } from '@/data/landingContent'
import {
  FacebookIcon,
  InstagramIcon,
  TelegramIcon,
  WhatsAppIcon,
  XTwitterIcon,
} from './SocialIcons'

const ICONS = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  whatsapp: WhatsAppIcon,
  twitter: XTwitterIcon,
  telegram: TelegramIcon,
} as const

export function LandingConnect() {
  return (
    <div className="final-pane" id="connect">
      <h3>Connect with us</h3>
      <p className="mt-2 mb-6 text-slate-400 text-base max-w-none">
        Join our community for updates, support, and discussion with other AMC candidates.
      </p>
      <ul className="flex flex-wrap gap-4">
        {SOCIAL_LINKS.map((link) => {
          const Icon = ICONS[link.id]
          return (
            <li key={link.id}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-500/60 bg-white/10 text-slate-100 transition hover:border-[#1c90a6] hover:bg-[#1c90a6]/20 hover:text-[#1c90a6] hover:scale-105"
              >
                <Icon className="h-6 w-6" />
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
