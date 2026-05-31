import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
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
            <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
            <p className="mt-2 text-sm text-gray-500">Last updated: June 1, 2026</p>
          </div>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">1. Introduction</h2>
            <p className="text-gray-600 leading-relaxed">
              Business Nexus ("we", "us", "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Platform. Please read this policy carefully. By using the Platform, you consent to the practices described herein.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">2. Information We Collect</h2>
            <p className="text-gray-600 leading-relaxed">
              We collect information you provide directly, including your name, email address, password, role (entrepreneur or investor), profile photo, and bio. For entrepreneurs, we may collect startup information including company name, industry, funding requirements, and pitch materials. For investors, we may collect investment preferences, portfolio information, and investment ranges. We also collect usage data, device information, and IP addresses automatically when you use the Platform.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">3. How We Use Your Information</h2>
            <p className="text-gray-600 leading-relaxed">
              We use your information to provide and improve the Platform; facilitate connections between entrepreneurs and investors; process financial transactions; send administrative communications; respond to your inquiries; enforce our Terms of Service; and comply with legal obligations. We do not sell your personal information to third parties.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">4. Information Sharing</h2>
            <p className="text-gray-600 leading-relaxed">
              Your profile information is visible to other registered users of the Platform as part of the connection and collaboration features. We share information with Stripe for payment processing purposes. We may disclose your information when required by law, to protect our rights, or in connection with a business transaction such as a merger or acquisition. We require all third parties to maintain appropriate security measures.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">5. Data Security</h2>
            <p className="text-gray-600 leading-relaxed">
              We implement industry-standard security measures to protect your information, including bcrypt password hashing, JWT-based authentication with expiration, MongoDB data encryption, HTTPS transport security, and input sanitization to prevent injection attacks. We also offer two-factor authentication as an additional security layer. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">6. Data Retention</h2>
            <p className="text-gray-600 leading-relaxed">
              We retain your personal information for as long as your account is active or as needed to provide services. Transaction records are retained for a minimum of seven years to comply with financial regulations. You may request deletion of your account and associated data by contacting us, subject to our legal obligations to retain certain information.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">7. Cookies and Tracking</h2>
            <p className="text-gray-600 leading-relaxed">
              The Platform uses localStorage to store authentication tokens necessary for your session. We do not use third-party advertising cookies or tracking pixels. We may use analytics tools to understand Platform usage patterns and improve our services. You can clear localStorage through your browser settings, which will log you out of the Platform.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">8. Your Rights</h2>
            <p className="text-gray-600 leading-relaxed">
              You have the right to access, correct, or delete your personal information. You can update your profile information through the Settings page. You may request a copy of your data or request account deletion by contacting us. You have the right to opt out of non-essential communications. Depending on your jurisdiction, you may have additional rights under applicable privacy laws such as GDPR or CCPA.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">9. Children's Privacy</h2>
            <p className="text-gray-600 leading-relaxed">
              The Platform is not intended for users under the age of 18. We do not knowingly collect personal information from minors. If we become aware that a minor has provided us with personal information, we will take steps to delete such information promptly.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">10. Third-Party Services</h2>
            <p className="text-gray-600 leading-relaxed">
              The Platform integrates with Stripe for payment processing and WebRTC technology for video calling. These services have their own privacy policies, and we encourage you to review them. We use Google STUN servers for WebRTC connection establishment; no call content is routed through Google servers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">11. Changes to This Policy</h2>
            <p className="text-gray-600 leading-relaxed">
              We may update this Privacy Policy periodically. We will notify you of significant changes via email or Platform notification. Your continued use of the Platform after changes are posted constitutes your acceptance of the updated policy. We encourage you to review this policy regularly.
            </p>
          </section>

          <div className="pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              For privacy-related inquiries, contact us at{' '}
              <a href="mailto:privacy@businessnexus.com" className="text-primary-600 hover:text-primary-500">
                privacy@businessnexus.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};