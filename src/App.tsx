import HeroSection from './components/HeroSection';
import DashboardSection from './components/DashboardSection';
import PhilosophySection from './components/PhilosophySection';
import ServicesSection from './components/ServicesSection';
import { useMidnight } from './hooks/useMidnight';

export default function App() {
    const { 
        isWalletConnected, 
        walletAddress,
        connectWallet, 
        disconnectWallet,
        submitSalary, 
        bandCounts, 
        statusMessage, 
        isSubmitting 
    } = useMidnight();

    return (
        <main className="min-h-screen bg-black text-white font-outfit antialiased selection:bg-white selection:text-black">
            <HeroSection 
                isWalletConnected={isWalletConnected}
                walletAddress={walletAddress}
                connectWallet={connectWallet}
                disconnectWallet={disconnectWallet}
                statusMessage={statusMessage}
            />
            <DashboardSection 
                bandCounts={bandCounts}
                submitSalary={submitSalary}
                isSubmitting={isSubmitting}
                statusMessage={statusMessage}
            />
            <PhilosophySection />
            <ServicesSection />
        </main>
    );
}
