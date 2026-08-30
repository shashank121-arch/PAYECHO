import { motion } from 'framer-motion';

export default function PhilosophySection() {
    return (
        <section className="bg-black py-28 md:py-40 px-6">
            <div className="max-w-7xl mx-auto">
                <motion.h2 
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="font-instrument text-white text-5xl md:text-8xl mb-20 tracking-tight leading-none"
                >
                    Absolute Privacy x <br className="hidden md:block" /> Verifiable Truth.
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center">
                    {/* Left: Video Container */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="rounded-3xl overflow-hidden aspect-[4/3] liquid-glass"
                    >
                        {/* Placeholder video */}
                        <video 
                            className="w-full h-full object-cover opacity-80"
                            autoPlay 
                            muted 
                            loop 
                            playsInline
                            src="https://cdn.pixabay.com/video/2020/05/25/40141-424756539_large.mp4"
                        />
                    </motion.div>

                    {/* Right: Text Blocks */}
                    <motion.div 
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex flex-col gap-12"
                    >
                        <div className="flex flex-col gap-4">
                            <h3 className="font-instrument text-3xl md:text-4xl text-white">The Witness</h3>
                            <p className="text-gray-400 text-lg md:text-xl leading-relaxed">
                                Your exact compensation is a private input. It stays strictly on your local device.
                            </p>
                        </div>
                        
                        <div className="w-full h-px bg-white/10" />
                        
                        <div className="flex flex-col gap-4">
                            <h3 className="font-instrument text-3xl md:text-4xl text-white">Selective Disclosure</h3>
                            <p className="text-gray-400 text-lg md:text-xl leading-relaxed">
                                Through cryptographic proofs, we mathematically verify your salary band and publish only the categorical aggregate to the public Midnight blockchain.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
