import ScrollReveal from '@/components/scroll-reveal';
import { MessageCircle } from 'lucide-react';

interface CtaBlockProps {
    data: {
        text?: string;
        button_text?: string;
    };
}

export function CtaBlock({ data }: CtaBlockProps) {
    const WHATSAPP_NUMBER = "1234567890"; // Reemplazar con número real
    const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=Hola%20Eladora!%20Me%20gustar%C3%ADa%20cotizar%20un%20proyecto.`;

    return (
        <section className="bg-[#FAF7F2] py-24 sm:py-32">
            <div className="container mx-auto px-4">
                <ScrollReveal animation="fade-up">
                    <div className="mx-auto max-w-4xl bg-[#1A1A1A] rounded-[3rem] p-12 sm:p-20 text-center relative overflow-hidden">
                        {/* Decoración */}
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-[#D4A853] rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-white rounded-full blur-[80px] opacity-5 pointer-events-none"></div>
                        
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white mb-10 relative z-10 leading-tight">
                            {data.text || "¿Tienes algo diferente en mente?"}
                        </h2>
                        
                        <a 
                            href={WHATSAPP_URL} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex h-[60px] items-center justify-center bg-[#D4A853] px-12 text-base font-bold tracking-wider text-white transition-all hover:bg-[#c29641] hover:scale-[1.02] rounded-full gap-3 shadow-[0_10px_30px_rgba(212,168,83,0.3)] hover:shadow-[0_15px_40px_rgba(212,168,83,0.4)] relative z-10"
                        >
                            <MessageCircle className="w-6 h-6" /> {data.button_text || "ESCRÍBENOS"}
                        </a>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
}
