import Image from 'next/image'
import Link from 'next/link'

export const metadata = {
  title: 'Payment Successful | Exams And Test',
  description: 'Your payment was successful.',
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <nav className="sticky top-0 z-50 bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="flex items-center gap-2">
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
            <Link
              href="/dashboard"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-[#1c90a6] bg-[#1c90a6]/10 border border-[#1c90a6]/20 rounded-md hover:bg-[#1c90a6]/20 transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful</h1>
        <p className="text-gray-600 mb-10">
          Thank you. Your payment has been processed.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-md bg-[#1c90a6] hover:bg-[#0d7a8a] text-white font-medium"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}


