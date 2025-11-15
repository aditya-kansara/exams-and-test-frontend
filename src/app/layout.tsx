import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AMC Adaptive Exam Platform',
  description: 'Advanced adaptive exam platform with 3PL IRT and Google OAuth authentication',
  icons: {
    icon: '/Examsandtest logo.png',
    shortcut: '/Examsandtest logo.png',
    apple: '/Examsandtest logo.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/Examsandtest logo.png" type="image/png" />
        <link rel="shortcut icon" href="/Examsandtest logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/Examsandtest logo.png" />
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
      </head>
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}