'use client';

import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-blue-400 hover:text-blue-300 transition-colors mb-4 inline-block">
            ← Back to SpendControl
          </Link>
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-gray-400">Last updated: December 28, 2024</p>
        </div>

        {/* Content */}
        <div className="glass-strong rounded-2xl p-8 border border-gray-700/50 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
            <p className="text-gray-300">
              By accessing and using SpendControl, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use SpendControl.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">2. Description of Service</h2>
            <p className="text-gray-300">
              SpendControl is a free analytics dashboard for tracking USDC spending, gas costs, and transaction trends on the Base blockchain. The service:
            </p>
            <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1 ml-4">
              <li>Analyzes your on-chain transaction data from Basescan API</li>
              <li>Provides gas optimization insights and spending trends</li>
              <li>Displays read-only analytics based on public blockchain data</li>
              <li>Does not have access to your private keys or funds</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">3. No Financial Advice</h2>
            <p className="text-gray-300">
              SpendControl provides informational analytics only. The insights, recommendations, and data presented are NOT financial, investment, or tax advice. You should consult with qualified professionals before making any financial decisions. We are not responsible for any losses or damages resulting from your use of this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">4. Blockchain Data</h2>
            <p className="text-gray-300">
              SpendControl reads publicly available data from the Base blockchain via the Basescan API. We do not:
            </p>
            <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1 ml-4">
              <li>Store your private keys or seed phrases</li>
              <li>Have the ability to execute transactions on your behalf</li>
              <li>Guarantee 100% accuracy of data (blockchain data may have delays)</li>
              <li>Store your personal information beyond your wallet address for analytics</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">5. User Responsibilities</h2>
            <p className="text-gray-300">
              You are responsible for:
            </p>
            <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1 ml-4">
              <li>Maintaining the security of your wallet and private keys</li>
              <li>Verifying all transaction data independently before making decisions</li>
              <li>Understanding the risks associated with cryptocurrency transactions</li>
              <li>Complying with all applicable laws and regulations in your jurisdiction</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">6. Donations</h2>
            <p className="text-gray-300">
              SpendControl accepts voluntary donations via smart contract. All donations are:
            </p>
            <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1 ml-4">
              <li>Completely voluntary and non-refundable</li>
              <li>Processed on-chain via smart contracts on Base</li>
              <li>Not tax-deductible (we are not a registered charity)</li>
              <li>Used to support continued development and hosting</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">7. Limitation of Liability</h2>
            <p className="text-gray-300">
              SpendControl is provided &quot;as is&quot; without any warranties. We are not liable for:
            </p>
            <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1 ml-4">
              <li>Any financial losses from using our analytics</li>
              <li>Inaccurate data due to API delays or blockchain issues</li>
              <li>Service interruptions or downtime</li>
              <li>Third-party wallet or blockchain network issues</li>
              <li>Loss of funds due to user error or external attacks</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">8. Third-Party Services</h2>
            <p className="text-gray-300">
              SpendControl integrates with:
            </p>
            <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1 ml-4">
              <li>Basescan API for blockchain data</li>
              <li>OnchainKit by Coinbase for wallet connectivity</li>
              <li>Base blockchain network</li>
            </ul>
            <p className="text-gray-300 mt-2">
              We are not responsible for the performance, security, or policies of these third-party services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">9. Changes to Terms</h2>
            <p className="text-gray-300">
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of SpendControl after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">10. Contact</h2>
            <p className="text-gray-300">
              For questions about these Terms of Service, please reach out via the support wallet address: 0x105d1701d2B6ca218EfbceC3B2AE9088bE58aD67
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
