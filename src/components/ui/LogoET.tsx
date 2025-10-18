import React from 'react'

export function LogoET() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" className="h-full w-full">
      {/* Outer adaptive ring */}
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2.5" opacity="0.25"></circle>
      <path d="M44 24a20 20 0 0 0-20-20" stroke="currentColor" strokeWidth="3" strokeLinecap="round"></path>

      {/* Stylised 'E' */}
      <path d="M16 15h10M16 24h7M16 33h10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"></path>

      {/* Stylised 'T' */}
      <path d="M30 15h8M34 15v18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
}
