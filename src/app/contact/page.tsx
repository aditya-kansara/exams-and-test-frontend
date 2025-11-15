'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Mail } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left - ET Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-2">
                <div className="h-8 w-8">
                  <Image
                    src="/Examsandtest logo.png"
                    alt="Exams And Test Logo"
                    width={32}
                    height={32}
                    className="h-full w-full object-contain"
                  />
                </div>
                <span className="text-xl font-semibold text-gray-900">
                  Exams <span className="text-[#1c90a6]">And Test</span>
                </span>
              </Link>
            </div>

            {/* Right - Back to Home */}
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1c90a6] transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Contact Us</h1>
            <p className="text-lg text-gray-600">
              Tell us about your goals and we'll get back within 24 hours.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4 p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200">
              <div className="p-3 rounded-full bg-[#1c90a6]/10 flex-shrink-0">
                <Mail className="h-6 w-6 text-[#1c90a6]" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Email us</p>
                <a 
                  href="mailto:examsandtestfounder@gmail.com" 
                  className="text-lg font-semibold text-[#1c90a6] hover:text-[#0d7a8a] hover:underline transition-colors"
                >
                  examsandtestfounder@gmail.com
                </a>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Get in Touch</h2>
              <p className="text-gray-700 mb-4">
                Whether you're a learner looking for support, an institution interested in our services, 
                or have any questions about our platform, we're here to help.
              </p>
              <p className="text-gray-700">
                Send us an email and we'll respond as soon as possible, typically within 24 hours during business days.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}



