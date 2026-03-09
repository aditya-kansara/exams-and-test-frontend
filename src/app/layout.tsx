import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Exams And Test',
  description: 'Adaptive exam platform designed for candidates preparing for AMC(Australian Medical Council) exams.',
  icons: {
    icon: '/Examsandtest logo.png',
    shortcut: '/Examsandtest logo.png',
    apple: '/Examsandtest logo.png',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
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
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
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