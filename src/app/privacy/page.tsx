import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Read how LinkGlimpse handles submitted public URLs and analytics data, including what information is collected and why.',
  alternates: { canonical: '/privacy' },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-700 mb-3">
              Read how LinkGlimpse handles submitted public URLs and analytics data, including what information is collected and why.
            </p>
            <p className="text-gray-600 mb-8">
              Last updated: August 4, 2026
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
              <p className="text-gray-700 mb-4">
                LinkGlimpse processes only the information needed to inspect links and understand whether the product is useful:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Public URLs you submit, which our server fetches to extract metadata and image information</li>
                <li>Basic request and error information that may appear in short-lived infrastructure logs</li>
                <li>Aggregate pageview and product-event analytics, such as whether a preview succeeded or a report was exported</li>
                <li>The submitted URL&apos;s hostname in product events; LinkGlimpse does not intentionally send the full submitted URL as an analytics event property</li>
                <li>URLs inspected from the CLI or browser extension, but only after you explicitly request an inspection</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">
                We use the collected information to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Fetch public metadata and generate previews and diagnostic reports</li>
                <li>Measure preview success, report exports, and feature usage</li>
                <li>Diagnose errors, protect the service, and improve product reliability</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Analytics Providers</h2>
              <p className="text-gray-700">
                LinkGlimpse uses Plausible for aggregate web analytics and may use PostHog for explicit product events when configured. PostHog automatic element capture and session recording are disabled. These providers process analytics under their own data-processing and retention terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">CLI, MCP Server, and Browser Extension</h2>
              <p className="text-gray-700">
                The open-source CLI contains no analytics code. By default it sends the URL you explicitly provide to the public LinkGlimpse API; you can configure another deployment. The local MCP server also contains no analytics or telemetry and fetches only URLs explicitly passed to its tools. The browser extension runs only after you open its toolbar popup, then sends the active public URL to the LinkGlimpse API and renders the returned diagnostics inside the extension. It requests access to the active tab and LinkGlimpse API, and does not request browser history, cookies, credentials, or access to every website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Storage and Retention</h2>
              <p className="text-gray-700 mb-4">
                LinkGlimpse does not require an account to run a preview. Diagnostic reports are generated on demand and returned to your browser; the application does not intentionally persist them in a LinkGlimpse user profile. Infrastructure and analytics providers may retain request or event data according to their configured retention periods.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
              <p className="text-gray-700 mb-4">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Use browser privacy controls or content blockers to limit analytics requests</li>
                <li>Request information or deletion where an event can reasonably be linked to you</li>
                <li>Contact us with questions about processing or retention</li>
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
