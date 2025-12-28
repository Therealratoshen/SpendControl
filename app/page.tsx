'use client';

import { useAccount } from 'wagmi';
import LandingPage from '@/components/LandingPage';
import ConnectedDashboard from '@/components/ConnectedDashboard';

export default function Home() {
  const { address, isConnected } = useAccount();

  // Show landing page if no wallet connected
  if (!isConnected || !address) {
    return <LandingPage />;
  }

  // Show dashboard when wallet is connected
  return <ConnectedDashboard address={address} />;
}
