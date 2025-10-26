'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function PrivacyTermsPage() {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy and Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-6">
              This Privacy Policy and Terms of Service ("Agreement") govern your use of the Exams and Test platform ("we," "our," "us"). By accessing or using this platform, you acknowledge that you have read, understood, and agreed to be bound by this Agreement.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Data Collection and Use</h2>
            <p className="text-gray-700 mb-4">
              We collect personal information such as your name, email address, device information, and exam performance data when you register, log in, or interact with our adaptive testing system. We may also collect usage statistics, behavioural analytics, and anonymised performance data to enhance platform quality.
            </p>
            <p className="text-gray-700 mb-4">All collected data may be used to:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li>Improve the accuracy and adaptivity of our testing algorithms</li>
              <li>Develop, train, and refine our testing models and recommendation systems</li>
              <li>Provide technical support and personalised performance insights</li>
              <li>Comply with legal and regulatory obligations</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Data Sharing and Disclosure</h2>
            <p className="text-gray-700 mb-6">
              We do not sell, rent, or trade your personal data to third parties. Your data may only be shared with trusted service providers strictly for operational purposes, such as cloud hosting, analytics, or payment processing, under confidentiality agreements.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. Data Retention and Security</h2>
            <p className="text-gray-700 mb-6">
              We retain personal and performance data for as long as necessary to provide our services and improve testing reliability. All data is stored using secure, encrypted systems, and we take reasonable technical and organisational measures to prevent unauthorised access, alteration, or misuse.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. User Responsibilities</h2>
            <p className="text-gray-700 mb-6">
              You agree to maintain the confidentiality of your account credentials and to use the platform solely for lawful and educational purposes. Any unauthorised use or attempt to disrupt platform functionality is prohibited.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Intellectual Property</h2>
            <p className="text-gray-700 mb-6">
              All content, including exam questions, algorithms, and interface design, is the exclusive intellectual property of Exams and Test and may not be reproduced or redistributed without written consent.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Disclaimer</h2>
            <p className="text-gray-700 mb-6">
              Exams and Test is an independent educational platform and is not affiliated with, endorsed by, or connected to the Australian Medical Council (AMC). Our adaptive exams are designed to simulate the AMC computer-based adaptive testing framework for educational purposes only.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Updates to Policy</h2>
            <p className="text-gray-700 mb-6">
              We may update these Terms and our Privacy Policy periodically to reflect changes in our practices or compliance requirements. Updates will take effect immediately upon publication on our website. Continued use of the platform after such updates constitutes acceptance of the revised terms.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. Contact Information</h2>
            <p className="text-gray-700 mb-6">
              For any questions or concerns regarding privacy, data use, or compliance, please contact us at: <a href="mailto:examsandtestfounder@gmail.com" className="text-[#1c90a6] hover:underline">examsandtestfounder@gmail.com</a>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
