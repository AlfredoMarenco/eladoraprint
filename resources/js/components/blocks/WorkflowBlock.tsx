import ScrollReveal from '@/components/scroll-reveal';

export function WorkflowBlock() {
    return (
        <section className="bg-[#1A1A1A] py-24 sm:py-32 text-white relative overflow-hidden">
            {/* Elemento decorativo de fondo */}
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-[#D4A853] rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
            
            <div className="container relative mx-auto px-4 z-10">
                <ScrollReveal>
                    <div className="mx-auto max-w-2xl text-center mb-20">
                        <span className="text-[#D4A853] font-serif italic text-xl mb-4 block">Nuestro Proceso</span>
                        <h2 className="text-4xl font-serif tracking-tight sm:text-5xl">
                            Cómo trabajamos
                        </h2>
                    </div>
                </ScrollReveal>

                <div className="mx-auto max-w-5xl">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        {/* Línea conectora (solo desktop) */}
                        <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-transparent via-[#D4A853]/50 to-transparent"></div>

                        {/* Paso 1 */}
                        <ScrollReveal delay={100} animation="fade-up">
                            <div className="relative text-center group">
                                <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-[#2A2A2A] border border-white/10 text-3xl font-serif italic text-[#D4A853] transition-transform group-hover:scale-110 duration-500 shadow-[0_0_30px_rgba(212,168,83,0.1)] group-hover:shadow-[0_0_40px_rgba(212,168,83,0.2)] relative z-10">
                                    01
                                </div>
                                <h3 className="mb-4 text-2xl font-serif">Idea</h3>
                                <p className="text-white/60 font-light leading-relaxed">
                                    Plasmamos tu visión. Entendemos tus necesidades y definimos el concepto inicial.
                                </p>
                            </div>
                        </ScrollReveal>

                        {/* Paso 2 */}
                        <ScrollReveal delay={300} animation="fade-up">
                            <div className="relative text-center group">
                                <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-[#2A2A2A] border border-white/10 text-3xl font-serif italic text-[#D4A853] transition-transform group-hover:scale-110 duration-500 shadow-[0_0_30px_rgba(212,168,83,0.1)] group-hover:shadow-[0_0_40px_rgba(212,168,83,0.2)] relative z-10">
                                    02
                                </div>
                                <h3 className="mb-4 text-2xl font-serif">Diseño</h3>
                                <p className="text-white/60 font-light leading-relaxed">
                                    Creamos propuestas únicas. Ajustamos detalles hasta lograr la perfección visual.
                                </p>
                            </div>
                        </ScrollReveal>

                        {/* Paso 3 */}
                        <ScrollReveal delay={500} animation="fade-up">
                            <div className="relative text-center group">
                                <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-[#D4A853] text-[#1A1A1A] text-3xl font-serif italic transition-transform group-hover:scale-110 duration-500 shadow-[0_0_30px_rgba(212,168,83,0.3)] group-hover:shadow-[0_0_50px_rgba(212,168,83,0.5)] relative z-10">
                                    03
                                </div>
                                <h3 className="mb-4 text-2xl font-serif text-[#D4A853]">Realidad</h3>
                                <p className="text-white/60 font-light leading-relaxed">
                                    Materializamos el proyecto con la más alta calidad de impresión y acabados.
                                </p>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </div>
        </section>
    );
}
