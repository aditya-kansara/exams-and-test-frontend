'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function TermsPage() {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">TERMS AND CONDITIONS</h1>
          <div className="text-sm text-gray-600 mb-8 space-y-1">
            <p>Effective Date: 10th October 2025</p>
            <p>Website: www.examsandtest.com</p>
            <p>Entity/Company Name: Exams and Test</p>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Introduction</h2>
            <p className="text-gray-700 mb-6">
              Welcome to Exams and Test, an online learning and assessment platform designed to provide practice examinations, mock tests and multiple-choice question (MCQ) resources for educational and competitive exams.
            </p>
            <p className="text-gray-700 mb-6">
              By accessing or using our website, services or subscription plans ("Services"), you agree to comply with these Terms and Conditions ("Terms"). These Terms constitute a legally binding agreement between you ("User", "you", "your") and Exams and Test.
            </p>
            <p className="text-gray-700 mb-6">
              If you do not agree with these Terms, please discontinue use immediately.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Definitions</h2>
            <p className="text-gray-700 mb-2"><strong>"Account"</strong> refers to your registered user profile on the Website.</p>
            <p className="text-gray-700 mb-2"><strong>"Content"</strong> means all materials available on the Website, including MCQs, tests, videos, text, explanations, reports and graphics.</p>
            <p className="text-gray-700 mb-2"><strong>"Services"</strong> refers to online educational and testing services provided by Exams and Test.</p>
            <p className="text-gray-700 mb-2"><strong>"Subscription Plan"</strong> means any paid or free plan giving access to certain features or materials.</p>
            <p className="text-gray-700 mb-6"><strong>"Website"</strong> means www.examsandtest.com and all associated subdomains.</p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. Eligibility and User Obligations</h2>
            <p className="text-gray-700 mb-4">
              Users must be 18 years or older. Users under 18 may use the platform under parental or guardian supervision.
            </p>
            <p className="text-gray-700 mb-4">
              You agree to provide accurate and complete registration information and to update it as required.
            </p>
            <p className="text-gray-700 mb-6">
              You must use the platform only for lawful educational purposes and comply with all applicable Indian laws, including the Information Technology Act, 2000 and Consumer Protection Act, 2019.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Account Registration and Access</h2>
            <p className="text-gray-700 mb-4">
              To access paid features, you must register and create an account.
            </p>
            <p className="text-gray-700 mb-4">
              You are responsible for maintaining confidentiality of your login credentials.
            </p>
            <p className="text-gray-700 mb-4">
              You must immediately notify us of unauthorized account use.
            </p>
            <p className="text-gray-700 mb-4">
              Sharing or transferring login credentials is strictly prohibited.
            </p>
            <p className="text-gray-700 mb-6">
              We reserve the right to suspend or terminate accounts found in breach of these terms.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Subscription Plans and Payments</h2>
            <p className="text-gray-700 mb-4">
              <strong>Access to Premium Content:</strong> Access to premium learning materials and resources on the website is provided through paid subscription plans or individual payments for specific contents. Each plan offers access for a specific duration or package type, as clearly stated on the Website at the time of purchase.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Currency and Pricing:</strong> All subscription fees are displayed and charged in United States Dollars (USD $). Prices are determined at the time of purchase and are subject to change at our discretion. Any price revisions will apply only to new purchases made after such updates.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Payment Processing:</strong> All payments are securely handled through authorized third-party payment gateways. You acknowledge that the processing, confirmation and refund mechanisms (if applicable) are also governed by the terms and privacy policies of those payment service providers.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Payment Confirmation:</strong> Access to premium features is activated only after payment has been successfully processed and confirmed by the payment gateway. If payment authorization fails or is reversed, access will not be granted or may be suspended until payment is resolved.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>No Automatic Renewal:</strong> Subscription access concludes at the end of the selected plan period. We do not automatically renew or charge your payment method after the access period expires. To continue using premium content, users must manually purchase a new plan through the Website.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Cancellation and Refund Policy:</strong> Once payment is successfully processed, subscriptions cannot be cancelled or refunded. If any candidates' account gets suspended then no refund shall be provided.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Failed or Disputed Payments:</strong> If a transaction fails, is declined or later disputed, your account access may be temporarily restricted until the issue is resolved. Initiating chargebacks or payment disputes without prior written communication to us may result in permanent account suspension.
            </p>
            <p className="text-gray-700 mb-6">
              <strong>Refund policy:</strong> Any payment deemed successful by the third party payment getaway, is non-refundable in itself in any condition, unless given permission and deemed reasonable by Exams and test. You agree that you understand, underperformance or undesirable results in official exams, change of mind about preparation/exams, payment by mistake by you, payment by mistake by another person, false claims of payment by hacking etc. is deemed unsuitable for refunds. Refunds if any may be processed by Exams and test only if the reason is deemed suitable by the members by the company, which varies by case to case and shall not be deemed for comparison with any other cases.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Licence to Use the Platform</h2>
            <p className="text-gray-700 mb-4">
              We grant you/your company a limited, non-exclusive, non-transferable, revocable licence to access and use our Services for personal, non-commercial purposes.
            </p>
            <p className="text-gray-700 mb-4">
              You agree not to engage in any activity that compromises the integrity, security or unlawful use of the website or its content. In particular, you must not:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Copy, reproduce, modify, distribute, transmit, display, sell, lease or otherwise exploit any part of the Website or its content without prior written permission from Exams and Test.</li>
              <li>Decompile, disassemble, reverse-engineer or attempt to derive the source code of any software or digital component used on the website.</li>
              <li>Use any automated system, program or device, including bots, crawlers, spiders, or scrapers, to access, extract or index any part of the Website or its content.</li>
              <li>Bypass, disable or otherwise interfere with any authentication, payment or access control system associated with subscription-based features.</li>
              <li>Engage in any activity that disrupts or degrades the performance of the Website, interferes with other users or violates applicable laws or third-party rights.</li>
            </ul>
            <p className="text-gray-700 mb-6">
              If any attempt by any individual party and or an institutions, to reproduce/reconfigure or make slight changes keeping the essence of source code, database (including the statistics) using via third party or in house Artificial Intelligence shall deem them breach of code of terms of service and shall be held liable in accordance with Indian laws.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Intellectual Property Rights</h2>
            <p className="text-gray-700 mb-6">
              All content on Exams and Test is owned or licensed by us and protected under the Indian Copyright Act, 1957 and applicable intellectual property laws. You may not reproduce or distribute any portion of the website or its contents without prior written consent. Unauthorized use may lead to account termination and legal proceedings.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. User-Generated Content</h2>
            <p className="text-gray-700 mb-4">
              If the platform allows user submissions (e.g., comments, discussions):
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li>You grant us a worldwide, royalty-free, perpetual licence to use, reproduce or display such content.</li>
              <li>You warrant that your content does not infringe any third-party rights.</li>
              <li>We reserve the right to remove any content that violates these Terms or our policies.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">9. Acceptable Use Policy</h2>
            <p className="text-gray-700 mb-4">You agree not to:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Engage in unauthorized copying, distribution or resale of content.</li>
              <li>Use the site for spamming, malware distribution or unethical practices.</li>
              <li>Attempt to gain unauthorized access to any system or user account.</li>
              <li>Interfere with the operation or security of the Website.</li>
            </ul>
            <p className="text-gray-700 mb-6">
              Violation of this clause may result in immediate suspension or legal action.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">10. Availability and Service Modifications</h2>
            <p className="text-gray-700 mb-4">
              We strive for continuous service availability but do not guarantee an uninterrupted access.
            </p>
            <p className="text-gray-700 mb-4">
              We may modify, suspend or discontinue any part of the services for maintenance, upgrades or operational reasons without prior notice.
            </p>
            <p className="text-gray-700 mb-6">
              We are not liable for losses resulting from service interruptions.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">11. Third-Party Links and Tools</h2>
            <p className="text-gray-700 mb-4">
              Our website may include links or integrations with third-party services (e.g., payment gateways).
            </p>
            <p className="text-gray-700 mb-6">
              We do not control, endorse or assume responsibility for third-party websites or policies. Your use of those services is at your own risk.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">12. Privacy and Data Protection</h2>
            <p className="text-gray-700 mb-4">
              Your data usage is governed by our Privacy Policy, available separately at privacy policy page.
            </p>
            <p className="text-gray-700 mb-6">
              We comply with the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">13. Disclaimer of Warranties</h2>
            <p className="text-gray-700 mb-4">
              Exams and Test is an independent educational platform and is not affiliated with, endorsed by, or connected to the Australian Medical Council (AMC). Our adaptive exams are designed to simulate the AMC computer-based adaptive testing framework for educational purposes only. The platform is provided "as is" without warranties of any kind, either express or implied.
            </p>
            <p className="text-gray-700 mb-4">
              The Services are provided on an "as is" and "as available" basis without any warranties, express or implied.
            </p>
            <p className="text-gray-700 mb-4">We do not guarantee that:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Content is error-free or complete;</li>
              <li>Services will be uninterrupted or secure; or</li>
              <li>You will achieve any specific learning outcomes.</li>
            </ul>
            <p className="text-gray-700 mb-4">
              Exams and test is a platform made for learning and educational purposes only, we do not
            </p>
            <p className="text-gray-700 mb-6">
              Use of the Website is at your own risk.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">14. Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">
              To the fullest extent permitted by law, Exams and Test shall not be liable for:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Loss of profits, revenue or data;</li>
              <li>Indirect or consequential damages;</li>
              <li>Errors, omissions or inaccuracies in content.</li>
            </ul>
            <p className="text-gray-700 mb-4">
              We are not liable or be subjected to final results in the exams taken by official councils. The exams, tests and/or other contents provided by Exams and test is only for information, practising and does not claim to be a software assisted medical device, guidelines and does not endorse any particular guidelines.
            </p>
            <p className="text-gray-700 mb-4">
              Entire responsibility of the performance by a candidate and/or client depends on their performance and we do not take any responsibility in any of the official council exams.
            </p>
            <p className="text-gray-700 mb-6">
              Our total liability, if any, shall not exceed the amount paid by you in the preceding 3 months for the subscription.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">15. Indemnification</h2>
            <p className="text-gray-700 mb-6">
              You agree to indemnify and hold harmless Exams and Test, its affiliates, employees and partners from all claims, damages or costs arising from your breach of these Terms, misuse of Services or violation of any law or third-party rights.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">16. Termination</h2>
            <p className="text-gray-700 mb-4">
              We reserve the right to terminate or suspend your account at our discretion if you:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Breach these Terms;</li>
              <li>Engage in fraudulent or abusive activity; or</li>
              <li>Misuse the Website in any way.</li>
            </ul>
            <p className="text-gray-700 mb-6">
              Upon termination, all rights granted to you under these Terms shall immediately cease.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">17. Force Majeure</h2>
            <p className="text-gray-700 mb-6">
              We are not liable for delays or failure to perform obligations caused by events beyond our reasonable control, including but not limited to natural disasters, internet outages or government restrictions.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">18. Dispute Resolution and Governing Law</h2>
            <p className="text-gray-700 mb-4">
              These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in India. We may, at our discretion, offer dispute resolution through arbitration or mediation as per the Arbitration and Conciliation Act, 1996.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">19. Amendments to Terms</h2>
            <p className="text-gray-700 mb-6">
              We may revise these Terms periodically. Updated versions will be posted on the Website with a revised "Effective Date." Continued use after updates constitutes acceptance of the revised Terms.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">20. Severability and Waiver</h2>
            <p className="text-gray-700 mb-6">
              If any clause is found invalid or unenforceable, the remaining clauses remain in full effect. Failure to enforce any term shall not constitute a waiver of that right.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">21. Entire Agreement</h2>
            <p className="text-gray-700 mb-6">
              These Terms constitute the entire agreement between you and Exams and Test and supersede all prior communications or understandings relating to the subject matter herein.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">22. Contact Information</h2>
            <p className="text-gray-700 mb-4">For any concerns, feedback, or complaints:</p>
            <div className="text-gray-700 mb-6 space-y-2">
              <p><strong>Exams and Test</strong></p>
              <p>Email: <a href="mailto:support@examsandtest.com" className="text-[#1c90a6] hover:underline">support@examsandtest.com</a></p>
              <p>Support Hours: Monday–Friday, 9:00 AM – 6:00 PM IST</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

