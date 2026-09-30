import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Wallet, ExternalLink, Zap, ShieldCheck, AlertCircle } from 'lucide-react';
import type { DetectedWallet } from '../hooks/useMidnight';

interface HeroSectionProps {
    isWalletConnected: boolean;
    walletAddress?: string | null;
    nightBalance?: string;
    dustBalance?: { balance: string; cap: string };
    availableWallets: DetectedWallet[];
    isDetectingWallets: boolean;
    connectWallet: (walletId?: string) => void;
    disconnectWallet?: () => void;
    statusMessage?: string;
}

export default function HeroSection({ 
    isWalletConnected, 
    walletAddress, 
    nightBalance = '0',
    dustBalance = { balance: '0', cap: '0' },
    availableWallets,
    isDetectingWallets,
    connectWallet, 
    disconnectWallet, 
    statusMessage 
}: HeroSectionProps) {
    const [isWalletMenuOpen, setIsWalletMenuOpen] = useState(false);

    const handleScrollDown = () => {
        document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handlePrimaryClick = () => {
        if (isWalletConnected && disconnectWallet) {
            disconnectWallet();
        } else if (availableWallets.length > 1) {
            setIsWalletMenuOpen(!isWalletMenuOpen);
        } else if (availableWallets.length === 1) {
            connectWallet(availableWallets[0].id);
        } else {
            connectWallet();
        }
    };

    const formatAddress = (addr?: string | null) => {
        if (!addr) return '';
        if (addr.length <= 14) return addr;
        return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
    };

    return (
        <section className="relative w-full min-h-screen overflow-hidden bg-black flex flex-col items-center justify-center">
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-purple-950/20 via-black to-blue-950/20 animate-pulse opacity-60" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,50,255,0.15),rgba(255,255,255,0))]" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black pointer-events-none" />

            {/* Navbar */}
            <nav className="absolute top-0 w-full flex items-center justify-between p-6 md:px-12 z-20">
                <div className="flex items-center gap-3">
                    <img src="/favicon.svg" alt="PayEcho Logo" className="w-8 h-8 rounded-full shadow-lg shadow-purple-500/20" />
                    <div className="flex flex-col">
                        <span className="font-instrument text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                            PayEcho
                            <span className="text-[10px] uppercase font-sans tracking-widest px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                Preview
                            </span>
                        </span>
                    </div>
                </div>

                {/* Wallet Connection Control */}
                <div className="relative flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2">
                        {isWalletConnected ? (
                            <div className="flex items-center gap-2">
                                {/* Token Gas / Fee Badge */}
                                <div className="hidden sm:flex items-center gap-2 liquid-glass px-3 py-1.5 rounded-full text-xs text-gray-300">
                                    <span className="flex items-center gap-1 text-emerald-400 font-mono">
                                        <Zap className="w-3.5 h-3.5" />
                                        {dustBalance.balance} DUST
                                    </span>
                                    <span className="text-gray-600">|</span>
                                    <span className="text-purple-300 font-mono">
                                        {nightBalance} tNIGHT
                                    </span>
                                </div>

                                <button
                                    onClick={disconnectWallet}
                                    className="liquid-glass text-white px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all hover:bg-white/10 flex items-center gap-2 border border-purple-500/40"
                                    title="Click to Disconnect"
                                >
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                    <span>{formatAddress(walletAddress)}</span>
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={handlePrimaryClick}
                                    className="liquid-glass text-white px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-transform hover:scale-105 flex items-center gap-2 bg-gradient-to-r from-purple-600/30 to-blue-600/30 border border-purple-500/30"
                                >
                                    <Wallet className="w-4 h-4 text-purple-400" />
                                    {isDetectingWallets ? 'Detecting Wallets...' : availableWallets.length > 0 ? `Connect ${availableWallets[0].name}` : 'Connect Wallet'}
                                    {availableWallets.length > 1 && <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Multi-wallet Dropdown */}
                    <AnimatePresence>
                        {isWalletMenuOpen && !isWalletConnected && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute top-12 right-0 w-56 rounded-2xl liquid-glass p-2 border border-white/10 z-30 shadow-2xl backdrop-blur-xl bg-black/90"
                            >
                                <div className="text-[11px] text-gray-400 font-medium px-3 py-1 uppercase tracking-wider">
                                    Detected Wallets
                                </div>
                                {availableWallets.map(w => (
                                    <button
                                        key={w.id}
                                        onClick={() => {
                                            connectWallet(w.id);
                                            setIsWalletMenuOpen(false);
                                        }}
                                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-white/10 transition-colors text-xs text-white"
                                    >
                                        <span className="font-semibold">{w.name}</span>
                                        <span className="text-[10px] text-gray-400 font-mono">{w.rdns ? w.rdns.split('.').pop() : 'Detected'}</span>
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Status Feedback Banner */}
                    {statusMessage && (
                        <div className="flex items-center gap-1.5 text-[11px] text-purple-300 bg-purple-950/40 border border-purple-500/30 px-3 py-1 rounded-full backdrop-blur-md">
                            <span>{statusMessage}</span>
                        </div>
                    )}

                    {/* No Wallet Warning Banner */}
                    {!isDetectingWallets && availableWallets.length === 0 && !isWalletConnected && (
                        <div className="flex items-center gap-1.5 text-[11px] text-amber-300/90 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                            <span>No extension found. Install 1AM or Lace.</span>
                        </div>
                    )}
                </div>
            </nav>

            {/* Center Content */}
            <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.1 }}
                className="relative z-10 flex flex-col items-center text-center px-4 max-w-5xl mt-12"
            >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass border border-purple-500/30 text-xs text-purple-300 mb-8 font-medium">
                    <ShieldCheck className="w-4 h-4 text-purple-400" />
                    <span>Zero-Knowledge Proofs on Midnight Preview Testnet</span>
                </div>

                <h1 className="font-instrument text-white text-6xl sm:text-7xl md:text-9xl tracking-tight leading-none mb-6">
                    Know your worth,<br />hide your wealth.
                </h1>
                
                <p className="text-gray-300 text-base sm:text-lg md:text-xl max-w-2xl mb-10 leading-relaxed font-light">
                    Anonymously benchmark compensation on the Midnight Network. Prove categorical salary tiers in zero-knowledge without revealing your salary or identity.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <button
                        onClick={handleScrollDown}
                        className="liquid-glass text-white px-8 py-4 rounded-full text-base sm:text-lg font-medium transition-all hover:scale-105 hover:bg-white/10 border border-white/20"
                    >
                        Enter the Protocol
                    </button>
                    
                    <a
                        href="https://preview.midnight.network/"
                        target="_blank"
                        rel="noreferrer"
                        className="text-gray-400 hover:text-white text-sm flex items-center gap-1 px-4 py-2 transition-colors"
                    >
                        Midnight Preview Network <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                </div>
            </motion.div>
        </section>
    );
}
