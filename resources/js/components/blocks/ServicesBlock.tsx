import ScrollReveal from '@/components/scroll-reveal';
import { Sparkles, FileType2, Mail, Users, Box, Stamp } from 'lucide-react';

interface ServicesBlockProps {
    data: {
        title?: string;
        text?: string;
    };
}

const defaultServices = [
    {
        title: "Papelería Social",
        description: "Invitaciones de boda, bautizos, eventos exclusivos. Detalles que cuentan historias con los mejores acabados y tipos de papel.",
        icon: Mail,
    },
    {
        title: "Empaque y Packaging",
        description: "Diseño y producción de cajas, bolsas y etiquetas. La primera impresión de tu producto, diseñada para impactar.",
        icon: Box,
    },
    {
        title: "Identidad Corporativa",
        description: "Tarjetas de presentación, hojas membretadas, carpetas. Tu marca, reflejada con profesionalismo y distinción.",
        icon: Stamp,
    },
    {
        title: "Branding",
        description: "Desarrollo de marca, desde el logotipo hasta la guía de estilo. Creamos identidades visuales que conectan con tu audiencia.",
        icon: Sparkles,
    },
    {
        title: "Papelería para Empresas",
        description: "Agendas personalizadas, libretas, papelería interna. Soluciones integrales para la comunicación visual de tu empresa.",
        icon: Users,
    },
    {
        title: "Letras 3D / Anuncios",
        description: "Letras corpóreas, letreros luminosos, anuncios en acrílico. Haz que tu negocio destaque, de día y de noche.",
        icon: FileType2,
    },
];

export function ServicesBlock({ data }: ServicesBlockProps) {
    return (
        <section className="bg-white py-24 sm:py-32">
            <div className="container mx-auto px-4">
                <ScrollReveal>
                    <div className="mx-auto max-w-2xl text-center mb-16">
                        <span className="text-[#D4A853] font-serif italic text-xl mb-4 block">Nuestros Servicios</span>
                        <h2 className="text-4xl font-serif tracking-tight text-[#1A1A1A] sm:text-5xl">
                            {data.title || "Universo Eladora"}
                        </h2>
                        <p className="mt-6 text-lg leading-8 text-[#1A1A1A]/70 font-sans font-light">
                            {data.text || "Nos especializamos en brindar soluciones creativas y de alta calidad para cada proyecto. Desde el diseño hasta la impresión final."}
                        </p>
                    </div>
                </ScrollReveal>

                <div className="mx-auto mt-16 max-w-7xl">
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {defaultServices.map((service, index) => (
                            <ScrollReveal key={service.title} delay={index * 100} animation="fade-up">
                                <div className="group relative bg-[#FAF7F2] rounded-[2rem] p-10 transition-all hover:bg-[#1A1A1A] hover:-translate-y-2 duration-300">
                                    <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm transition-colors group-hover:bg-[#2A2A2A]">
                                        <service.icon className="h-8 w-8 text-[#D4A853]" />
                                    </div>
                                    <h3 className="mb-4 text-2xl font-serif text-[#1A1A1A] group-hover:text-white transition-colors">
                                        {service.title}
                                    </h3>
                                    <p className="text-base font-light text-[#1A1A1A]/70 group-hover:text-white/70 transition-colors leading-relaxed">
                                        {service.description}
                                    </p>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
