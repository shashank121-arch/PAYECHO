import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, CheckCircle2, AlertTriangle, ExternalLink, Cpu, KeyRound, Radio, ArrowUpRight, History } from 'lucide-react';
import type { TxStage, TransactionRecord } from '../hooks/useMidnight';

interface DashboardSectionProps {
    bandCounts: { band1: number; band2: number; band3: number };
    submitSalary: (salary: number, salt: string) => Promise<void>;
    isSubmitting: boolean;
    statusMessage: string;
    txStage: TxStage;
    latestTxHash: string | null;
    txHistory: TransactionRecord[];
    explorerBase: string;
    isWalletConnected: boolean;
}

export default function DashboardSection({ 
    bandCounts, 
    submitSalary, 
    isSubmitting, 
    statusMessage,
    txStage,
    latestTxHash,
    txHistory,
    explorerBase,
    isWalletConnected
}: DashboardSectionProps) {
    const [salaryInput, setSalaryInput] = useState('');
    
    const handleGenerateProof = () => {
        if (!salaryInput) return;
        let salt = localStorage.getItem('payecho_salt');
        if (!salt) {
            salt = crypto.randomUUID().replace(/-/g, '').substring(0, 32);
            localStorage.setItem('payecho_salt', salt);
        }
        submitSalary(Number(salaryInput), salt);
    };

    // Calculate percentages for the bars
    const total = bandCounts.band1 + bandCounts.band2 + bandCounts.band3 || 1;
    
    const bands = [
        { label: '< $50k', count: bandCounts.band1, percentage: (bandCounts.band1 / total) * 100, color: 'from-blue-500 to-indigo-500' },
        { label: '$50k - $100k', count: bandCounts.band2, percentage: (bandCounts.band2 / total) * 100, color: 'from-purple-500 to-pink-500' },
        { label: '> $100k', count: bandCounts.band3, percentage: (bandCounts.band3 / total) * 100, color: 'from-emerald-500 to-teal-500' },
    ];

    const getStageText = () => {
        switch (txStage) {
            case 'proving': return 'Step 1/3: Computing ZK Proof on Device';
            case 'signing': return 'Step 2/3: Authorizing DUST Gas with Wallet';
            case 'submitting': return 'Step 3/3: Submitting to Midnight Preview Sequencer';
            case 'confirmed': return 'Proof Validated on Midnight Ledger';
            case 'failed': return 'Transaction Failed';
            default: return 'Ready for Input';
        }
    };

    return (
        <section id="dashboard" className="w-full bg-black pt-12 pb-32 px-6">
            <div className="max-w-6xl mx-auto flex flex-col gap-12">
                {/* Main Interactive Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="liquid-glass rounded-3xl p-8 md:p-12 flex flex-col lg:flex-row gap-12 border border-white/10"
                >
                    {/* Left Column (Input & ZK Lifecycle) */}
                    <div className="flex-1 flex flex-col justify-center">
                        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-purple-400 font-semibold mb-3">
                            <ShieldCheck className="w-4 h-4" />
                            Client-Side Zero-Knowledge Execution
                        </div>
                        <h2 className="font-instrument text-4xl md:text-5xl mb-6 text-white">
                            Submit your salary anonymously.
                        </h2>
                        
                        <div className="flex flex-col gap-5 max-w-md">
                            <div className="liquid-glass rounded-2xl px-5 py-3.5 flex items-center border border-white/10 focus-within:border-purple-500/50 transition-colors">
                                <span className="text-gray-400 mr-2 text-lg">$</span>
                                <input
                                    type="number"
                                    placeholder="Enter exact annual salary (e.g. 85000)"
                                    value={salaryInput}
                                    onChange={(e) => setSalaryInput(e.target.value)}
                                    className="bg-transparent text-white outline-none w-full font-medium placeholder:text-gray-600 text-base"
                                    disabled={isSubmitting}
                                />
                            </div>

                            <button
                                onClick={handleGenerateProof}
                                disabled={isSubmitting || !salaryInput}
                                className="w-full bg-white text-black font-semibold rounded-2xl px-6 py-4 transition-all hover:bg-gray-100 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-xl shadow-white/5"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                        <span>{getStageText()}</span>
                                    </>
                                ) : (
                                    <>
                                        <Cpu className="w-4 h-4" />
                                        <span>{isWalletConnected ? 'Generate ZK Proof & Submit' : 'Connect Wallet & Submit Proof'}</span>
                                    </>
                                )}
                            </button>

                            {/* Lifecycle Stepper */}
                            <AnimatePresence>
                                {isSubmitting && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="flex flex-col gap-2 p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/20 text-xs"
                                    >
                                        <div className="flex items-center justify-between text-gray-400">
                                            <span className="flex items-center gap-1.5 text-purple-300 font-medium">
                                                <Radio className="w-3.5 h-3.5 animate-pulse text-purple-400" />
                                                {getStageText()}
                                            </span>
                                        </div>
                                        <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                                            <div 
                                                className="bg-gradient-to-r from-purple-500 to-blue-500 h-full transition-all duration-500 rounded-full"
                                                style={{
                                                    width: txStage === 'proving' ? '33%' : txStage === 'signing' ? '66%' : '100%'
                                                }}
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            
                            {/* Status Message Alert */}
                            {statusMessage && (
                                <div className={`p-4 rounded-2xl liquid-glass text-xs flex items-start gap-2.5 ${
                                    txStage === 'failed' || statusMessage.includes('Failed') || statusMessage.includes('Error')
                                        ? 'border border-red-500/30 text-red-300 bg-red-950/10'
                                        : txStage === 'confirmed'
                                        ? 'border border-emerald-500/30 text-emerald-300 bg-emerald-950/10'
                                        : 'border border-purple-500/30 text-purple-200 bg-purple-950/10'
                                }`}>
                                    {txStage === 'failed' ? (
                                        <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                                    ) : txStage === 'confirmed' ? (
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                    ) : (
                                        <KeyRound className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                                    )}
                                    <div className="flex flex-col gap-1">
                                        <span className="font-medium leading-relaxed">{statusMessage}</span>
                                        {latestTxHash && (
                                            <a 
                                                href={`${explorerBase}/${latestTxHash}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="underline hover:text-white flex items-center gap-1 font-mono text-[11px] mt-1 text-emerald-400"
                                            >
                                                TX: {latestTxHash.slice(0, 10)}...{latestTxHash.slice(-8)}
                                                <ArrowUpRight className="w-3 h-3" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}
                            
                            <p className="text-gray-400 text-xs leading-relaxed">
                                <strong className="text-gray-300">Privacy Guarantee:</strong> Your exact salary and identity remain on your personal device. Only the categorical tier and one-way nullifier are disclosed on-chain.
                            </p>
                        </div>
                    </div>

                    {/* Right Column (Live Public Ledger State) */}
                    <div className="flex-1 flex flex-col justify-center gap-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Live State</span>
                                <h3 className="font-instrument text-3xl text-white">Public Ledger Distribution</h3>
                            </div>
                            <span className="px-3 py-1 rounded-full text-xs font-mono bg-white/5 border border-white/10 text-gray-300">
                                {total} Submissions
                            </span>
                        </div>
                        
                        <div className="flex flex-col gap-5">
                            {bands.map((band, index) => (
                                <div key={index} className="flex flex-col gap-2 p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
                                    <div className="flex justify-between text-xs font-medium">
                                        <span className="text-gray-300 font-semibold">{band.label}</span>
                                        <span className="text-white font-mono">{band.count} ({band.percentage.toFixed(1)}%)</span>
                                    </div>
                                    <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${band.percentage}%` }}
                                            transition={{ duration: 1.2, delay: 0.1 * index, ease: "easeOut" }}
                                            className={`h-full bg-gradient-to-r ${band.color} rounded-full relative`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Gas / Fee Explanation Card (Item 18) */}
                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-xs text-gray-400 flex flex-col gap-1.5">
                            <span className="text-gray-300 font-semibold flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                Gas & Resource Mechanics (DUST vs NIGHT)
                            </span>
                            <p className="leading-relaxed">
                                Midnight uses <strong>DUST</strong> as non-transferable shielded gas for ZK transaction settlement, generated by registering <strong>NIGHT</strong> UTXOs on the Preview Testnet.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Activity & Verification View (Item 22) */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="liquid-glass rounded-3xl p-6 md:p-8 border border-white/10 flex flex-col gap-5"
                >
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                        <div className="flex items-center gap-2 text-white">
                            <History className="w-4 h-4 text-purple-400" />
                            <h4 className="font-instrument text-2xl font-bold">On-Chain Activity & Verification</h4>
                        </div>
                        <span className="text-xs text-gray-400">Independent Ledger Audit</span>
                    </div>

                    {txHistory.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 text-xs">
                            No recent transactions from this session yet. Submit a salary proof above to see verifiable on-chain receipts.
                        </div>
                    ) : (
                        <div className="divide-y divide-white/5">
                            {txHistory.map((item, idx) => (
                                <div key={idx} className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                                        <span className="font-semibold text-white">{item.bandLabel}</span>
                                        <span className="text-gray-500 font-mono text-[11px]">{item.timestamp}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-400 font-mono text-[11px]">
                                            {item.txHash.slice(0, 14)}...{item.txHash.slice(-8)}
                                        </span>
                                        <a
                                            href={item.explorerUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="px-2.5 py-1 rounded-full bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 font-medium flex items-center gap-1 transition-colors"
                                        >
                                            Explorer <ExternalLink className="w-3 h-3" />
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </section>
    );
}
