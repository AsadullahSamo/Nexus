import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const TermsOfServicePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link to="/register" className="flex items-center text-sm text-primary-600 hover:text-primary-500">
            <ArrowLeft size={16} className="mr-1" />
            Back to Register
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg px-8 py-10 space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
            <p className="mt-2 text-sm text-gray-500">Last updated: June 1, 2026</p>
          </div>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">1. Acceptance of Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              By accessing or using Business Nexus ("Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not access or use the Platform. These terms apply to all users, including entrepreneurs and investors who register on the Platform.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">2. Platform Description</h2>
            <p className="text-gray-600 leading-relaxed">
              Business Nexus is a collaboration platform designed to connect entrepreneurs with investors. The Platform facilitates communication, document sharing, meeting scheduling, video conferencing, and financial transactions between registered users. Business Nexus does not act as a financial advisor, broker, or intermediary in any investment transaction.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">3. User Eligibility</h2>
            <p className="text-gray-600 leading-relaxed">
              You must be at least 18 years of age and have the legal capacity to enter into binding agreements to use this Platform. By registering, you represent and warrant that all information you provide is accurate, current, and complete. You may register as either an Entrepreneur or an Investor, and your account type determines the features available to you.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">4. Account Responsibilities</h2>
            <p className="text-gray-600 leading-relaxed">
              You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify Business Nexus immediately of any unauthorized use of your account. Business Nexus is not liable for any loss or damage arising from your failure to comply with this obligation. You may not share your account with any third party.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">5. Entrepreneur Obligations</h2>
            <p className="text-gray-600 leading-relaxed">
              Entrepreneurs using the Platform agree to provide accurate information about their startups, funding requirements, and business plans. Any documents shared through the Platform must not contain false or misleading information. Entrepreneurs acknowledge that investors may rely on the accuracy of the information provided when making investment decisions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">6. Investor Obligations</h2>
            <p className="text-gray-600 leading-relaxed">
              Investors using the Platform agree to conduct their own due diligence before making any investment decisions. Business Nexus does not verify the accuracy of entrepreneur-provided information and is not responsible for investment outcomes. Investors must comply with all applicable securities laws and regulations in their jurisdiction.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">7. Payment and Transactions</h2>
            <p className="text-gray-600 leading-relaxed">
              The Platform facilitates financial transactions including deposits, withdrawals, and transfers between users via Stripe payment processing. All transactions are subject to Stripe's terms of service. Business Nexus does not store payment card information. Transaction fees may apply and will be disclosed prior to transaction completion. All transactions are final unless otherwise required by applicable law.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">8. Intellectual Property</h2>
            <p className="text-gray-600 leading-relaxed">
              All content on the Platform, including but not limited to text, graphics, logos, and software, is the property of Business Nexus or its licensors and is protected by applicable intellectual property laws. Users retain ownership of content they upload but grant Business Nexus a non-exclusive license to use such content to operate the Platform.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">9. Prohibited Conduct</h2>
            <p className="text-gray-600 leading-relaxed">
              Users may not use the Platform to engage in fraudulent, deceptive, or misleading practices; transmit spam or unsolicited communications; upload malware or harmful code; violate any applicable laws or regulations; impersonate other users or entities; or interfere with the Platform's operation. Violation of these prohibitions may result in immediate account termination.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">10. Limitation of Liability</h2>
            <p className="text-gray-600 leading-relaxed">
              Business Nexus is provided on an "as is" basis without warranties of any kind. To the fullest extent permitted by law, Business Nexus shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Platform, including but not limited to lost profits, data loss, or investment losses.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">11. Termination</h2>
            <p className="text-gray-600 leading-relaxed">
              Business Nexus reserves the right to suspend or terminate your account at any time for violation of these Terms of Service or for any other reason at our sole discretion. Upon termination, your right to use the Platform will immediately cease. Provisions that by their nature should survive termination will remain in effect.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">12. Changes to Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              Business Nexus reserves the right to modify these Terms of Service at any time. We will notify users of significant changes via email or Platform notification. Your continued use of the Platform after such changes constitutes acceptance of the updated terms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">13. Governing Law</h2>
            <p className="text-gray-600 leading-relaxed">
              These Terms of Service shall be governed by and construed in accordance with applicable laws. Any disputes arising from these terms shall be resolved through binding arbitration in accordance with applicable arbitration rules.
            </p>
          </section>

          <div className="pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              For questions about these Terms of Service, contact us at{' '}
              <a href="mailto:legal@businessnexus.com" className="text-primary-600 hover:text-primary-500">
                legal@businessnexus.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};