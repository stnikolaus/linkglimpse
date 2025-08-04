import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | LinkGlimpse',
  description: 'Learn how LinkGlimpse protects your privacy and handles your data. Our commitment to transparency and data security.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-8">
              Last updated: January 15, 2025
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
              <p className="text-gray-700 mb-4">
                LinkGlimpse collects minimal information to provide our social media preview service:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>URLs you submit for preview generation</li>
                <li>Usage analytics to improve our service</li>
                <li>Technical information (browser type, device info)</li>
                <li>Optional email for newsletter subscription</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">
                We use the collected information to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Generate social media previews for your URLs</li>
                <li>Improve our service and user experience</li>
                <li>Send you relevant updates and tips (with consent)</li>
                <li>Ensure security and prevent abuse</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
              <p className="text-gray-700">
                We implement industry-standard security measures to protect your data. 
                All data is encrypted in transit and at rest. We never sell or share 
                your personal information with third parties.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies and Analytics</h2>
              <p className="text-gray-700 mb-4">
                We use essential cookies to provide our service and analytics cookies 
                to understand usage patterns. You can control cookie settings in your browser.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
              <p className="text-gray-700 mb-4">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Access your personal data</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
                <li>Contact us with privacy concerns</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-700">
                If you have questions about this privacy policy, please contact us at:{' '}
                <a href="mailto:privacy@linkglimpse.com" className="text-blue-600 hover:text-blue-700">
                  privacy@linkglimpse.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
} 