import ScrollReveal from '@/components/scroll-reveal';
import AppLogoIcon from '@/components/app-logo-icon';
import { MessageCircle } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface HeroBlockProps {
    data: {
        title?: string;
        subtitle?: string;
    };
}

export function HeroBlock({ data }: HeroBlockProps) {
    const WHATSAPP_NUMBER = "1234567890"; // Reemplazar con número real
    const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=Hola%20Eladora!%20Me%20gustar%C3%ADa%20cotizar%20un%20proyecto.`;

    // Parsea el título para mantener los estilos del HTML si el admin usa etiquetas, o muestra el texto plano.
    // Para simplificar, asumiremos que si hay HTML (<i> o <span>), se puede renderizar, pero dado que usamos textarea simple,
    // podríamos simplemente renderizar el texto. Sin embargo, para mantener el estilo original de la maqueta:
    const renderTitle = () => {
        if (data.title) {
            return (
                <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: data.title }} />
            );
        }
        return (
            <>
                <span className="whitespace-nowrap">
                    <span className="italic text-[#D4A853] font-serif font-medium">Diseño, papel y experiencias</span> creadas
                </span>
                <span className="whitespace-nowrap mt-2 md:mt-4">
                    para hacer especiales <span className="italic text-[#D4A853] font-serif font-medium">tus ideas.</span>
                </span>
            </>
        );
    };

    return (
        <section className="relative overflow-hidden bg-[#FAF7F2] pt-20 pb-24 lg:pt-28 lg:pb-32">
            <div className="container relative mx-auto px-4 text-center z-10">
                <ScrollReveal animation="fade-in" duration={1000}>
                    <AppLogoIcon className="mx-auto w-[220px] md:w-[320px] h-auto mb-8 opacity-100 object-contain mix-blend-multiply" />
                </ScrollReveal>
                
                <ScrollReveal animation="fade-up" delay={200} duration={800}>
                    <h1 className="mx-auto flex flex-col items-center justify-center text-[2rem] leading-[1.15] sm:text-5xl md:text-[3.5rem] lg:text-[4.5rem] tracking-tight mb-8 text-[#1A1A1A] font-serif">
                        {renderTitle()}
                    </h1>
                </ScrollReveal>

                <ScrollReveal animation="fade-up" delay={400} duration={800}>
                    <p className="mx-auto max-w-3xl text-base sm:text-lg md:text-xl text-[#1A1A1A]/60 mb-14 font-sans font-medium leading-relaxed">
                        {data.subtitle ? (
                            <span className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: data.subtitle }} />
                        ) : (
                            <>
                                Imprenta Boutique y Diseño Gráfico Premium. <br /> 
                                Transformamos tus ideas en piezas tangibles y memorables que exigen destacar.
                            </>
                        )}
                    </p>
                </ScrollReveal>

                <ScrollReveal animation="fade-up" delay={600} duration={800}>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <a 
                            href={WHATSAPP_URL} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex h-[52px] items-center justify-center bg-[#D2AA4C] px-10 text-sm font-bold tracking-wider text-white transition-all hover:bg-[#c29641] hover:scale-[1.02] rounded-md gap-2"
                        >
                            <MessageCircle className="w-5 h-5" /> COTIZAR PROYECTO
                        </a>
                        <Link 
                            href="/portfolio" 
                            className="inline-flex h-[52px] items-center justify-center border border-[#1A1A1A]/10 bg-transparent px-10 text-sm font-bold tracking-wider text-[#1A1A1A] transition-colors hover:bg-white hover:border-[#1A1A1A]/20 rounded-md"
                        >
                            VER PORTAFOLIO
                        </Link>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
}
