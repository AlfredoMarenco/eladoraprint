import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Sparkles, MessageCircle, PenTool, LayoutTemplate, Palette, Star, Quote } from 'lucide-react';
import { getFallbackImage } from '@/lib/placeholders';
import AppLogoIcon from '@/components/app-logo-icon';
import ScrollReveal from '@/components/scroll-reveal';

export default function Home({ featuredProjects = [], services = [], testimonials = [] }: any) {
    const WHATSAPP_NUMBER = "1234567890"; // Reemplazar con número real
    const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=Hola%20Eladora!%20Me%20gustar%C3%ADa%20cotizar%20un%20proyecto.`;

    // Helper to map string icon names to Lucide components if needed, or use a default
    const getServiceIcon = (iconName: string) => {
        switch (iconName?.toLowerCase()) {
            case 'palette': return <Palette className="h-8 w-8 text-primary" />;
            case 'layouttemplate': return <LayoutTemplate className="h-8 w-8 text-primary" />;
            case 'pentool': return <PenTool className="h-8 w-8 text-primary" />;
            case 'image': return <Sparkles className="h-8 w-8 text-primary" />;
            default: return <Sparkles className="h-8 w-8 text-primary" />;
        }
    };

    return (
        <>
            <Head title="Inicio" />
            
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-background pt-24 pb-32 lg:pt-36 lg:pb-40">
                <div className="absolute inset-0 opacity-40">
                    <div className="absolute top-0 -left-1/4 w-1/2 h-full bg-gradient-to-r from-primary/10 to-transparent blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-1/3 h-1/2 bg-gradient-to-t from-primary/5 to-transparent blur-2xl"></div>
                </div>
                
                <div className="container relative mx-auto px-4 text-center z-10">
                    <ScrollReveal animation="fade-in" duration={1000}>
                        <AppLogoIcon className="mx-auto w-[200px] md:w-[280px] h-auto mb-6 opacity-90 object-contain mix-blend-multiply" />
                    </ScrollReveal>
                    
                    <ScrollReveal animation="fade-up" delay={200} duration={800}>
                        <h1 className="mx-auto max-w-4xl text-5xl font-light tracking-tight sm:text-7xl mb-6 text-foreground font-serif">
                            Elevamos tu marca <br className="hidden sm:block" /> a través del <span className="italic text-primary font-serif">papel.</span>
                        </h1>
                    </ScrollReveal>

                    <ScrollReveal animation="fade-up" delay={400} duration={800}>
                        <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-12">
                            Imprenta Boutique y Diseño Gráfico Premium. <br className="hidden sm:block" /> 
                            Transformamos tus ideas en piezas tangibles y memorables que exigen destacar.
                        </p>
                    </ScrollReveal>

                    <ScrollReveal animation="fade-up" delay={600} duration={800}>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <a 
                                href={WHATSAPP_URL} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex h-14 items-center justify-center rounded-sm bg-primary px-10 text-sm uppercase tracking-widest font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:scale-105"
                            >
                                <MessageCircle className="mr-2 h-4 w-4" /> Cotizar Proyecto
                            </a>
                            <Link 
                                href="/portfolio" 
                                className="inline-flex h-14 items-center justify-center rounded-sm border border-border bg-transparent px-10 text-sm uppercase tracking-widest font-medium text-foreground transition-colors hover:bg-foreground hover:text-background"
                            >
                                Ver Portafolio
                            </Link>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* Sobre Mí Section */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                        <ScrollReveal animation="slide-right" className="w-full lg:w-1/2">
                            <div className="aspect-[4/5] relative overflow-hidden rounded-sm shadow-xl">
                                {/* Placeholder for founder photo. Should be replaced in CMS or static asset */}
                                <img 
                                    src="https://images.unsplash.com/photo-1579546929662-711aa81148cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                                    alt="Eladora Print" 
                                    className="object-cover w-full h-full"
                                />
                                <div className="absolute inset-0 border border-primary/20 m-4 rounded-sm pointer-events-none"></div>
                            </div>
                        </ScrollReveal>
                        <ScrollReveal animation="slide-left" delay={200} className="w-full lg:w-1/2 space-y-6">
                            <div className="inline-flex items-center gap-2 text-primary uppercase tracking-widest text-xs font-semibold mb-2">
                                <span className="h-px w-8 bg-primary"></span>
                                Sobre Mí
                            </div>
                            <h2 className="text-4xl sm:text-5xl font-light text-foreground font-serif">
                                Pasión por el <span className="italic">detalle</span>.
                            </h2>
                            <div className="space-y-4 text-muted-foreground leading-relaxed text-lg">
                                <p>
                                    Hola, bienvenida a Eladora Print. Soy una apasionada por el diseño y la textura de lo tangible. Creo firmemente que en un mundo digital, el papel sigue teniendo el poder de crear conexiones genuinas.
                                </p>
                                <p>
                                    Mi enfoque es artesanal y detallista. Cada proyecto que pasa por mis manos es tratado como una obra única. Desde papelería fina hasta empaques que enamoran desde el primer vistazo.
                                </p>
                            </div>
                            <div className="pt-4">
                                <img src="/images/logo.png" alt="Firma" className="h-12 w-auto opacity-50 grayscale" />
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            {/* Featured Projects */}
            <section className="py-24 bg-background">
                <div className="container mx-auto px-4">
                    <ScrollReveal animation="fade-up" className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 text-primary uppercase tracking-widest text-xs font-semibold mb-4">
                                <span className="h-px w-8 bg-primary"></span>
                                Portafolio
                            </div>
                            <h2 className="text-4xl font-light text-foreground font-serif">Trabajos Destacados</h2>
                        </div>
                        <Link href="/portfolio" className="inline-flex items-center text-xs uppercase tracking-widest text-foreground hover:text-primary transition-colors pb-1 border-b border-foreground hover:border-primary">
                            Ver Galería Completa <ArrowRight className="ml-2 h-3 w-3" />
                        </Link>
                    </ScrollReveal>
                    
                    {featuredProjects && featuredProjects.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {featuredProjects.map((project: any, index: number) => (
                                <ScrollReveal key={project.id} animation="fade-up" delay={index * 150}>
                                    <Link href={`/portfolio/${project.slug}`} className="group block">
                                        <div className="aspect-[4/5] overflow-hidden rounded-sm bg-muted mb-6 relative">
                                            {project.cover_image ? (
                                                <img 
                                                    src={`/storage/${project.cover_image}`} 
                                                    alt={project.title} 
                                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" 
                                                />
                                            ) : (
                                                <img 
                                                    src={getFallbackImage(index)} 
                                                    alt={project.title} 
                                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale-[20%]" 
                                                />
                                            )}
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500"></div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-[10px] text-muted-foreground mb-2 uppercase tracking-[0.2em]">{project.category?.name || 'Impresión'}</div>
                                            <h3 className="text-xl font-medium text-foreground group-hover:text-primary transition-colors">{project.title}</h3>
                                        </div>
                                    </Link>
                                </ScrollReveal>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-24 bg-white rounded-sm border border-border/50">
                            <p className="text-muted-foreground italic">El portafolio se está preparando con proyectos hermosos...</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Services */}
            <section className="py-24 bg-white border-y border-border/40">
                <div className="container mx-auto px-4">
                    <ScrollReveal animation="fade-up" className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 text-primary uppercase tracking-widest text-xs font-semibold mb-4">
                            <span className="h-px w-8 bg-primary"></span>
                            Servicios Boutique
                            <span className="h-px w-8 bg-primary"></span>
                        </div>
                        <h2 className="text-4xl font-light text-foreground font-serif">¿Qué puedo crear para ti?</h2>
                    </ScrollReveal>
                    
                    {services && services.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            {services.map((service: any, index: number) => (
                                <ScrollReveal key={service.id} animation="fade-up" delay={index * 150} className="text-center group">
                                    <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-background mb-6 shadow-sm border border-border/50 group-hover:border-primary/50 transition-colors">
                                        {getServiceIcon(service.icon_path)}
                                    </div>
                                    <h3 className="text-xl font-medium mb-4 text-foreground">{service.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed text-sm">
                                        {service.description}
                                    </p>
                                </ScrollReveal>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground italic">
                            Cargando servicios boutique...
                        </div>
                    )}
                </div>
            </section>

            {/* Testimonials */}
            {testimonials && testimonials.length > 0 && (
                <section className="py-24 bg-background">
                    <div className="container mx-auto px-4">
                        <ScrollReveal animation="fade-up" className="text-center mb-16">
                            <h2 className="text-4xl font-light text-foreground font-serif">Palabras de Clientes</h2>
                        </ScrollReveal>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {testimonials.map((testimonial: any, index: number) => (
                                <ScrollReveal key={testimonial.id} animation="fade-up" delay={index * 150} className="bg-white p-10 rounded-sm shadow-sm border border-border/30 relative mt-6">
                                    <Quote className="absolute -top-6 left-8 h-12 w-12 text-primary/20 bg-background rounded-full p-2 border border-border/30" />
                                    <div className="flex mb-6 mt-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="h-4 w-4 text-primary fill-primary" />
                                        ))}
                                    </div>
                                    <p className="text-foreground/80 italic mb-8 leading-relaxed relative z-10 text-sm">
                                        "{testimonial.content}"
                                    </p>
                                    <div className="flex items-center gap-4">
                                        {testimonial.avatar_image ? (
                                            <img src={`/storage/${testimonial.avatar_image}`} alt={testimonial.client_name} className="h-10 w-10 rounded-full object-cover" />
                                        ) : (
                                            <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center text-primary font-serif italic border border-border">
                                                {testimonial.client_name.charAt(0)}
                                            </div>
                                        )}
                                        <div>
                                            <h4 className="font-medium text-sm text-foreground">{testimonial.client_name}</h4>
                                            {testimonial.company && (
                                                <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{testimonial.company}</p>
                                            )}
                                        </div>
                                    </div>
                                </ScrollReveal>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className="py-32 bg-[#1C1917] text-white text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent"></div>
                </div>
                <ScrollReveal animation="fade-up" className="container relative mx-auto px-4 z-10">
                    <h2 className="text-4xl md:text-6xl font-light font-serif mb-6">
                        ¿Lista para impresionar?
                    </h2>
                    <p className="text-white/60 max-w-2xl mx-auto mb-10 text-lg font-light">
                        Hablemos sobre tu próximo proyecto. Envíanos un mensaje y comencemos a diseñar algo extraordinario.
                    </p>
                    <a 
                        href={WHATSAPP_URL}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex h-14 items-center justify-center rounded-sm bg-primary px-10 text-sm uppercase tracking-widest font-medium text-white shadow-sm transition-all hover:bg-primary/90 hover:scale-105"
                    >
                        Contactar por WhatsApp
                    </a>
                </ScrollReveal>
            </section>
        </>
    );
}
