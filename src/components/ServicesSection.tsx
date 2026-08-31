import { motion } from 'framer-motion';

export default function ServicesSection() {
    return (
        <section className="relative bg-black py-28 px-6 overflow-hidden">
            {/* Radial gradient background overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 via-black to-black pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto flex flex-col gap-16">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <motion.h2 
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="font-instrument text-white text-5xl md:text-7xl tracking-tight"
                    >
                        Protocol Features
                    </motion.h2>
                    <motion.span 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-gray-400 text-lg uppercase tracking-widest"
                    >
                        How it works
                    </motion.span>
                </div>

                {/* Two-Card Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Card 1: Anti-Sybil */}
                    <motion.div 
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="liquid-glass rounded-3xl p-8 flex flex-col h-full"
                    >
                        <div className="rounded-2xl overflow-hidden aspect-video mb-8 relative">
                            {/* Strategy Video Placeholder */}
                            <div className="w-full h-full bg-gradient-to-tr from-blue-900 via-black to-purple-900 animate-pulse opacity-80" />
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-white/10 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                                Security
                            </span>
                        </div>
                        <h3 className="font-instrument text-4xl text-white mb-4">One-way Nullifiers</h3>
                        <p className="text-gray-400 text-lg leading-relaxed flex-grow">
                            A unique, one-way hash ensures that each user can only submit their salary once, preventing skewed data while preserving total anonymity.
                        </p>
                    </motion.div>

                    {/* Card 2: Network */}
                    <motion.div 
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="liquid-glass rounded-3xl p-8 flex flex-col h-full"
                    >
                        <div className="rounded-2xl overflow-hidden aspect-video mb-8 relative">
                            {/* Execution Video Placeholder */}
                            <div className="w-full h-full bg-gradient-to-br from-indigo-900 via-black to-gray-900 animate-pulse opacity-80" />
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-white/10 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                                Infrastructure
                            </span>
                        </div>
                        <h3 className="font-instrument text-4xl text-white mb-4">Midnight Network</h3>
                        <p className="text-gray-400 text-lg leading-relaxed flex-grow">
                            Built on Midnight's Preview Testnet, leveraging Compact smart contracts for native zero-knowledge circuit execution.
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
