import HeroSection from './components/HeroSection';
import DashboardSection from './components/DashboardSection';
import PhilosophySection from './components/PhilosophySection';
import ServicesSection from './components/ServicesSection';
import { useMidnight } from './hooks/useMidnight';

export default function App() {
    const { 
        availableWallets,
        isDetectingWallets,
        isWalletConnected, 
        walletAddress,
        nightBalance,
        dustBalance,
        connectWallet, 
        disconnectWallet,
        submitSalary, 
        bandCounts, 
        statusMessage, 
        txStage,
        latestTxHash,
        txHistory,
        explorerBase,
        isSubmitting 
    } = useMidnight();

    return (
        <main className="min-h-screen bg-black text-white font-outfit antialiased selection:bg-purple-500 selection:text-white">
            <HeroSection 
                isWalletConnected={isWalletConnected}
                walletAddress={walletAddress}
                nightBalance={nightBalance}
                dustBalance={dustBalance}
                availableWallets={availableWallets}
                isDetectingWallets={isDetectingWallets}
                connectWallet={connectWallet}
                disconnectWallet={disconnectWallet}
                statusMessage={statusMessage}
            />
            <DashboardSection 
                bandCounts={bandCounts}
                submitSalary={submitSalary}
                isSubmitting={isSubmitting}
                statusMessage={statusMessage}
                txStage={txStage}
                latestTxHash={latestTxHash}
                txHistory={txHistory}
                explorerBase={explorerBase}
                isWalletConnected={isWalletConnected}
            />
            <PhilosophySection />
            <ServicesSection />
        </main>
    );
}
