import { useRef, useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeroSectionProps {
    isWalletConnected: boolean;
    walletAddress?: string | null;
    connectWallet: () => void;
    disconnectWallet?: () => void;
    statusMessage?: string;
}

export default function HeroSection({ isWalletConnected, walletAddress, connectWallet, disconnectWallet, statusMessage }: HeroSectionProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);

    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            const handleCanPlay = () => setIsVideoLoaded(true);
            video.addEventListener('canplay', handleCanPlay);
            return () => video.removeEventListener('canplay', handleCanPlay);
        }
    }, []);

    const handleScrollDown = () => {
        document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleWalletClick = () => {
        if (isWalletConnected && disconnectWallet) {
            disconnectWallet();
        } else {
            connectWallet();
        }
    };

    const getButtonText = () => {
        if (!isWalletConnected) return 'Connect 1AM Wallet';
        if (walletAddress) return `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
        return 'Wallet Connected';
    };

    return (
        <section className="relative w-full h-screen overflow-hidden bg-black flex flex-col items-center justify-center">
            {/* Background Video Placeholder */}
            <video
                ref={videoRef}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                    isVideoLoaded ? 'opacity-40' : 'opacity-0'
                }`}
                autoPlay
                muted
                loop
                playsInline
                src="https://cdn.pixabay.com/video/2021/08/04/83866-584742544_large.mp4"
            />
            
            {/* Gradient Overlay for better readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black pointer-events-none" />

            {/* Navbar */}
            <nav className="absolute top-0 w-full flex items-center justify-between p-6 z-10">
                <div className="flex items-center gap-2 text-white">
                    <Globe className="w-6 h-6" />
                    <span className="font-instrument text-2xl font-bold">PayEcho</span>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <button
                        onClick={handleWalletClick}
                        className="liquid-glass text-white px-6 py-2 rounded-full text-sm font-semibold transition-transform hover:scale-105"
                    >
                        {getButtonText()}
                    </button>
                    {statusMessage && statusMessage.includes('Failed') && (
                        <div className="liquid-glass border border-red-500/30 px-4 py-1.5 rounded-full">
                            <p className="text-red-400 text-xs font-medium">{statusMessage}</p>
                        </div>
                    )}
                </div>
            </nav>

            {/* Center Content */}
            <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="relative z-10 flex flex-col items-center text-center px-4 max-w-5xl"
            >
                <h1 className="font-instrument text-white text-7xl md:text-9xl tracking-tight leading-none mb-6">
                    Know your worth,<br />hide your wealth.
                </h1>
                <p className="text-gray-300 text-lg md:text-xl max-w-2xl mb-10">
                    A zero-knowledge salary benchmark protocol on the Midnight Network.
                </p>
                <button
                    onClick={handleScrollDown}
                    className="liquid-glass text-white px-8 py-4 rounded-full text-lg font-medium transition-transform hover:scale-105"
                >
                    Enter the Protocol
                </button>
            </motion.div>
        </section>
    );
}
