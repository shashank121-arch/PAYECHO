import { useState } from 'react';
import { motion } from 'framer-motion';

interface DashboardSectionProps {
    bandCounts: { band1: number; band2: number; band3: number };
    submitSalary: (salary: number, salt: string) => Promise<void>;
    isSubmitting: boolean;
    statusMessage: string;
}

export default function DashboardSection({ bandCounts, submitSalary, isSubmitting, statusMessage }: DashboardSectionProps) {
    const [salaryInput, setSalaryInput] = useState('');
    
    // We will use a persistent salt per user from localStorage to allow the nullifier to prevent double-submissions
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
    const total = bandCounts.band1 + bandCounts.band2 + bandCounts.band3 || 1; // Prevent division by zero
    
    const bands = [
        { label: '< $50k', count: bandCounts.band1, percentage: (bandCounts.band1 / total) * 100 },
        { label: '$50k - $100k', count: bandCounts.band2, percentage: (bandCounts.band2 / total) * 100 },
        { label: '> $100k', count: bandCounts.band3, percentage: (bandCounts.band3 / total) * 100 },
    ];

    return (
        <section id="dashboard" className="w-full bg-black pt-10 pb-32 px-6">
            <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-6xl mx-auto liquid-glass rounded-3xl p-8 md:p-12 flex flex-col md:flex-row gap-12"
            >
                {/* Left Column (Input) */}
                <div className="flex-1 flex flex-col justify-center">
                    <h2 className="font-instrument text-4xl md:text-5xl mb-8">Submit your salary anonymously.</h2>
                    
                    <div className="flex flex-col gap-6 max-w-md">
                        <div className="liquid-glass rounded-full px-6 py-4 flex items-center">
                            <span className="text-gray-400 mr-2">$</span>
                            <input
                                type="number"
                                placeholder="Exact salary amount"
                                value={salaryInput}
                                onChange={(e) => setSalaryInput(e.target.value)}
                                className="bg-transparent text-white outline-none w-full font-medium"
                                disabled={isSubmitting}
                            />
                        </div>

                        <button
                            onClick={handleGenerateProof}
                            disabled={isSubmitting || !salaryInput}
                            className="bg-white text-black font-semibold rounded-full px-6 py-4 transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
                        >
                            {isSubmitting ? 'Generating ZK Proof...' : 'Generate ZK Proof'}
                        </button>
                        
                        {statusMessage && (
                            <div className={`p-4 rounded-xl liquid-glass ${statusMessage.includes('Failed') ? 'border border-red-500/30' : 'border border-emerald-500/30'}`}>
                                <p className={`text-sm ${statusMessage.includes('Failed') ? 'text-red-400' : 'text-emerald-400'}`}>
                                    {statusMessage}
                                </p>
                            </div>
                        )}
                        
                        <p className="text-gray-400 text-sm mt-4 leading-relaxed">
                            Your exact salary never leaves your device. Only the calculated band is disclosed and verified by the network.
                        </p>
                    </div>
                </div>

                {/* Right Column (Ledger Chart) */}
                <div className="flex-1 flex flex-col justify-center gap-8">
                    <h3 className="font-instrument text-3xl mb-2 text-white/90">Public Ledger State</h3>
                    
                    <div className="flex flex-col gap-6">
                        {bands.map((band, index) => (
                            <div key={index} className="flex flex-col gap-2">
                                <div className="flex justify-between text-sm font-medium">
                                    <span className="text-gray-300">{band.label}</span>
                                    <span className="text-white">{band.count} submissions</span>
                                </div>
                                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${band.percentage}%` }}
                                        transition={{ duration: 1.5, delay: 0.2 + (index * 0.1), ease: "easeOut" }}
                                        className="h-full bg-white rounded-full relative"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/30" />
                                    </motion.div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
