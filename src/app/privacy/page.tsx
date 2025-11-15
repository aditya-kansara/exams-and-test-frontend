'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function PrivacyPage() {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">PRIVACY POLICY</h1>
          <div className="text-sm text-gray-600 mb-8 space-y-1">
            <p>Effective Date: 10th October 2025</p>
            <p>Website: www.examsandtest.com</p>
            <p>Entity/Company Name: Exams and Test</p>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Introduction</h2>
            <p className="text-gray-700 mb-6">
              Your privacy is important to us. This Privacy Policy explains how Exams and Test collects, uses, discloses and protects your personal information when you access our website, mobile site or related services ("Services").
            </p>
            <p className="text-gray-700 mb-6">
              By using our Services, you consent to the collection and use of your information as described in this Policy.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Scope and Applicability</h2>
            <p className="text-gray-700 mb-6">
              This Privacy Policy applies to all users who access or use our website www.examsandtest.com, whether through desktop, mobile or any digital platform. It does not apply to third-party sites, services or applications that we do not control.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. Information We Collect</h2>
            <p className="text-gray-700 mb-4">We collect the following types of information:</p>
            
            <p className="text-gray-700 mb-2 mt-4"><strong>a. Personal Information</strong></p>
            <p className="text-gray-700 mb-2">When you create an account, subscribe or contact us, we may collect:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Full name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Age or date of birth</li>
              <li>Payment details (processed securely via third-party gateways; we do not store card numbers)</li>
              <li>Account login credentials (hashed/encrypted)</li>
            </ul>

            <p className="text-gray-700 mb-2 mt-4"><strong>b. Non-Personal Information</strong></p>
            <p className="text-gray-700 mb-2">We automatically collect certain data such as:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Browser type, IP address and device information</li>
              <li>Date/time of access</li>
              <li>Pages visited and test performance analytics</li>
              <li>Cookies and similar tracking data</li>
              <li>Data based on your activity of the content you access.</li>
            </ul>

            <p className="text-gray-700 mb-2 mt-4"><strong>c. Sensitive Personal Data</strong></p>
            <p className="text-gray-700 mb-6">
              We generally do not collect sensitive data (e.g., health, biometric or religious details). If ever required for a specific feature, explicit consent will be obtained.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. How We Use Your Information</h2>
            <p className="text-gray-700 mb-4">We use your data to:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Create and manage your user account.</li>
              <li>Provide access to practice exams, subscriptions and personalized content.</li>
              <li>Process payments securely.</li>
              <li>Communicate with you regarding updates, performance reports or new features.</li>
              <li>Improve our website and user experience through analytics.</li>
              <li>Prevent fraud, unauthorized access and ensure platform security.</li>
              <li>Comply with legal obligations, and meet regulation for using third party payment gateway.</li>
            </ul>
            <p className="text-gray-700 mb-6">
              We do not sell, rent or trade your personal information to third parties.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Legal Basis for Processing (GDPR-Aligned)</h2>
            <p className="text-gray-700 mb-4">For users outside India, our processing of data is based on:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li><strong>Consent:</strong> when you register or subscribe.</li>
              <li><strong>Contractual necessity:</strong> to deliver services you request.</li>
              <li><strong>Legitimate interest:</strong> to improve and secure our platform.</li>
              <li><strong>Legal obligation:</strong> to comply with applicable laws.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Cookies and Tracking Technologies</h2>
            <p className="text-gray-700 mb-4">We use cookies and similar tools to:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Maintain session login state.</li>
              <li>Remember user preferences.</li>
              <li>Measure site traffic and engagement.</li>
              <li>Provide targeted (non-intrusive) content suggestions.</li>
            </ul>
            <p className="text-gray-700 mb-6">
              You can disable cookies through your browser settings, but this may limit functionality.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Data Retention</h2>
            <p className="text-gray-700 mb-4">
              We retain your data only as long as necessary for the purposes stated above or as required by law.
            </p>
            <p className="text-gray-700 mb-6">
              Upon account deletion or inactivity beyond a defined period (e.g., 24 months), your data will be securely deleted or anonymized. If you want, you can request deletion of your information by connecting with a designated department in the company, however making a request does not automatically mean confirmation of deletion of your data. Make sure you receive an appropriate answer from the department and the information deletion is subject to guidelines of the company, deleting of any data from the database given by a user, final decision would be given by the department of the company.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. Data Sharing and Disclosure</h2>
            <p className="text-gray-700 mb-4">We may share limited information with:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Payment processors (for secure transactions).</li>
              <li>Analytics partners (for site performance monitoring).</li>
              <li>Email service providers (for account notifications).</li>
              <li>Legal authorities (if required by court order or law).</li>
            </ul>
            <p className="text-gray-700 mb-4">
              We do not sell, rent, or trade your personal data to third parties. We may share your information only in the following circumstances:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li><strong>Service Providers:</strong> With trusted service providers who assist us in operating our platform, such as cloud hosting, analytics, payment processing, and email services, under strict confidentiality agreements</li>
              <li><strong>Legal Requirements:</strong> When required by law, court order, or governmental authority</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets, where your information may be transferred as part of the transaction</li>
              <li><strong>With Your Consent:</strong> When you have explicitly given us permission to share your information</li>
            </ul>
            <p className="text-gray-700 mb-6">
              All third-party partners operate under confidentiality and data-protection agreements.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">9. International Data Transfers</h2>
            <p className="text-gray-700 mb-6">
              While we primarily store data on secure servers in India, some processing may occur through third-party providers outside India (e.g., analytics or hosting). We ensure such transfers comply with applicable data protection standards.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">10. Data Security</h2>
            <p className="text-gray-700 mb-4">We maintain strict administrative, technical and physical safeguards to protect your data, including:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>SSL encryption for data transmission.</li>
              <li>Encrypted password storage.</li>
              <li>Role-based access control</li>
              <li>Regular vulnerability scans and backups.</li>
            </ul>
            <p className="text-gray-700 mb-6">
              Despite best efforts, no online platform is completely secure. Users share data at their own risk.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">11. Your Rights</h2>
            <p className="text-gray-700 mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Access and review your personal information</li>
              <li>Request correction of inaccurate or incomplete data</li>
              <li>Request deletion of your personal information (subject to legal and operational requirements)</li>
              <li>Opt-out of certain communications and marketing materials</li>
              <li>Manage cookie preferences through your browser settings</li>
            </ul>
            <p className="text-gray-700 mb-6">
              Requests can be made via <a href="mailto:privacy@examsandtest.com" className="text-[#1c90a6] hover:underline">privacy@examsandtest.com</a>. We will respond within 30 business days.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">12. Links to Third-Party Websites</h2>
            <p className="text-gray-700 mb-6">
              Our platform may contain links to third-party sites (e.g., payment gateways). We are not responsible for their privacy practices. Please review their policies before engaging with them.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">13. Data Breach Policy</h2>
            <p className="text-gray-700 mb-4">In case of a data breach:</p>
            <p className="text-gray-700 mb-4">
              We will promptly assess the impact, secure affected systems and notify users and authorities as required by Indian IT law.
            </p>
            <p className="text-gray-700 mb-6">
              Affected users will receive an email describing the nature of the breach and mitigation steps.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">14. Changes to This Policy</h2>
            <p className="text-gray-700 mb-6">
              We may update this Privacy Policy periodically. Any revisions will be posted on this page with a new "Effective Date." Continued use of the Website after updates constitutes acceptance of the revised Policy.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">15. Contact Us</h2>
            <p className="text-gray-700 mb-4">For questions, complaints or feedback about this Privacy Policy:</p>
            <div className="text-gray-700 mb-6 space-y-2">
              <p><strong>Exams and Test</strong></p>
              <p>Email: <a href="mailto:privacy@examsandtest.com" className="text-[#1c90a6] hover:underline">privacy@examsandtest.com</a></p>
              <p>Support Hours: Monday–Friday, 9:00 AM – 6:00 PM IST</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

