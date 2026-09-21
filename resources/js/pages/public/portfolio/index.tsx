import { Head, Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { getFallbackImage } from '@/lib/placeholders';
import ScrollReveal from '@/components/scroll-reveal';

export default function Index({ projects }: any) {
    return (
        <>
            <Head title="Portafolio" />
            
            {/* Header */}
            <section className="bg-background pt-20 pb-16">
                <ScrollReveal animation="fade-up" className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 text-primary uppercase tracking-widest text-xs font-semibold mb-6">
                        <span className="h-px w-8 bg-primary"></span>
                        Mi Trabajo
                        <span className="h-px w-8 bg-primary"></span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-light tracking-tight mb-6 text-foreground font-serif">
                        Portafolio <span className="italic text-primary">Boutique</span>
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
                        Explora una selección de proyectos impresos, branding y diseño gráfico. 
                        Cada pieza está creada con atención artesanal al detalle.
                    </p>
                </ScrollReveal>
            </section>

            {/* Grid */}
            <section className="py-16 bg-white border-t border-border/40">
                <div className="container mx-auto px-4">
                    {projects.data.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {projects.data.map((project: any, index: number) => (
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

                    {/* Pagination */}
                    {projects.links && projects.links.length > 3 && (
                        <div className="mt-20 flex justify-center gap-2">
                            {projects.links.map((link: any, index: number) => (
                                <Link 
                                    key={index} 
                                    href={link.url || '#'}
                                    className={`px-4 py-2 rounded-sm text-sm font-medium transition-colors border ${
                                        link.active 
                                        ? 'bg-primary text-primary-foreground border-primary' 
                                        : link.url 
                                            ? 'bg-transparent border-border hover:border-primary hover:text-primary text-foreground' 
                                            : 'bg-transparent border-transparent text-muted-foreground cursor-not-allowed'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
