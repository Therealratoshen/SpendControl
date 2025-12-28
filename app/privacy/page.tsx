'use client';

import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-blue-400 hover:text-blue-300 transition-colors mb-4 inline-block">
            ← Back to SpendControl
          </Link>
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-gray-400">Last updated: December 28, 2024</p>
        </div>

        {/* Content */}
        <div className="glass-strong rounded-2xl p-8 border border-gray-700/50 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-3">1. Information We Collect</h2>
            <p className="text-gray-300 mb-3">
              SpendControl is designed with privacy in mind. We collect minimal information:
            </p>

            <h3 className="text-xl font-semibold mb-2 text-blue-300">Blockchain Data</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4 mb-4">
              <li>Your wallet address (when you connect your wallet)</li>
              <li>Public transaction data from the Base blockchain via Basescan API</li>
              <li>USDC transfer data associated with your address</li>
              <li>Gas usage and transaction history</li>
            </ul>

            <h3 className="text-xl font-semibold mb-2 text-blue-300">Technical Data</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4">
              <li>Browser type and version (for compatibility)</li>
              <li>Device type (desktop/mobile for responsive design)</li>
              <li>Connection status (to enable/disable features)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">2. What We Do NOT Collect</h2>
            <p className="text-gray-300">
              We respect your privacy and do NOT collect:
            </p>
            <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1 ml-4">
              <li>Your private keys or seed phrases</li>
              <li>Your personal identity information (name, email, phone)</li>
              <li>Your location or IP address</li>
              <li>Cookies or persistent tracking identifiers</li>
              <li>Third-party analytics or advertising data</li>
              <li>Any information beyond public blockchain data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">3. How We Use Your Data</h2>
            <p className="text-gray-300">
              We use the collected data solely to:
            </p>
            <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1 ml-4">
              <li>Display your transaction analytics and spending trends</li>
              <li>Calculate gas optimization insights</li>
              <li>Compare your metrics to network averages</li>
              <li>Show your supporter badge if you&apos;ve donated</li>
              <li>Provide a personalized dashboard experience</li>
            </ul>
            <p className="text-gray-300 mt-3">
              All data processing happens in your browser. We do not store your transaction data on our servers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">4. Data Storage</h2>
            <p className="text-gray-300">
              SpendControl operates as a client-side application:
            </p>
            <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1 ml-4">
              <li>All analytics are computed in your browser in real-time</li>
              <li>We cache API responses temporarily (30 seconds) to reduce API calls</li>
              <li>Your wallet connection state is stored locally in your browser only</li>
              <li>No personal data is sent to or stored on external servers</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">5. Third-Party Services</h2>
            <p className="text-gray-300 mb-3">
              SpendControl relies on these third-party services:
            </p>

            <h3 className="text-xl font-semibold mb-2 text-blue-300">Basescan API</h3>
            <p className="text-gray-300 ml-4 mb-3">
              We fetch public blockchain data from Basescan. They may log API requests. Review their privacy policy at basescan.org.
            </p>

            <h3 className="text-xl font-semibold mb-2 text-blue-300">OnchainKit (Coinbase)</h3>
            <p className="text-gray-300 ml-4 mb-3">
              Wallet connectivity is provided by Coinbase&apos;s OnchainKit. They may collect connection metadata. Review their privacy policy at coinbase.com/legal/privacy.
            </p>

            <h3 className="text-xl font-semibold mb-2 text-blue-300">Base Blockchain</h3>
            <p className="text-gray-300 ml-4">
              All transactions are recorded on the public Base blockchain. Blockchain data is permanent and publicly accessible.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">6. Data Security</h2>
            <p className="text-gray-300">
              We implement security best practices:
            </p>
            <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1 ml-4">
              <li>HTTPS encryption for all connections</li>
              <li>No server-side storage of sensitive data</li>
              <li>Read-only access to blockchain data</li>
              <li>Smart contracts audited for security vulnerabilities</li>
            </ul>
            <p className="text-gray-300 mt-3">
              However, no system is 100% secure. You are responsible for securing your wallet and private keys.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">7. Your Privacy Rights</h2>
            <p className="text-gray-300">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1 ml-4">
              <li>Disconnect your wallet at any time to stop data access</li>
              <li>Clear your browser cache to remove local data</li>
              <li>Use SpendControl without creating an account</li>
              <li>View only publicly available blockchain data</li>
            </ul>
            <p className="text-gray-300 mt-3">
              Note: Blockchain data is public and permanent. We cannot delete on-chain transaction records.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">8. Children&apos;s Privacy</h2>
            <p className="text-gray-300">
              SpendControl is not intended for users under 18 years old. We do not knowingly collect data from minors. If you believe a minor has used our service, please contact us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">9. International Users</h2>
            <p className="text-gray-300">
              SpendControl is hosted and operated from Indonesia. By using our service, you consent to the transfer and processing of data in Indonesia. We comply with applicable data protection laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">10. Changes to This Policy</h2>
            <p className="text-gray-300">
              We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date. Continued use of SpendControl after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">11. Contact Us</h2>
            <p className="text-gray-300">
              For privacy-related questions or concerns, contact us via the support wallet address: 0x105d1701d2B6ca218EfbceC3B2AE9088bE58aD67
            </p>
          </section>

          <section className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-3 text-blue-300">Privacy Summary (TL;DR)</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4">
              <li>We only read public blockchain data - nothing private</li>
              <li>No tracking, cookies, or analytics</li>
              <li>All processing happens in your browser</li>
              <li>We never see your private keys</li>
              <li>Disconnect anytime to stop data access</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
