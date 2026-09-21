import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, ExternalLink, Calendar, User, Briefcase } from 'lucide-react';
import { getFallbackImage } from '@/lib/placeholders';
import ScrollReveal from '@/components/scroll-reveal';

export default function Show({ project }: any) {
    return (
        <>
            <Head title={`${project.title} - Portafolio`} />
            
            {/* Hero Cover */}
            <section className="relative w-full h-[50vh] min-h-[400px] bg-background">
                {project.cover_image ? (
                    <img src={`/storage/${project.cover_image}`} alt={project.title} className="w-full h-full object-cover" />
                ) : (
                    <img src={getFallbackImage(project.id)} alt={project.title} className="w-full h-full object-cover grayscale-[20%]" />
                )}
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute inset-0 flex flex-col justify-end">
                    <ScrollReveal animation="fade-up" className="container mx-auto px-4 pb-12">
                        <Link href="/portfolio" className="inline-flex items-center text-white/80 hover:text-white mb-6 font-medium transition-colors uppercase tracking-widest text-xs">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Volver al portafolio
                        </Link>
                        <div className="text-white/80 font-medium tracking-[0.2em] uppercase text-xs mb-4">
                            <span className="h-px w-6 bg-primary inline-block align-middle mr-2"></span>
                            {project.category?.name || 'Impresión'}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-light font-serif text-white mb-4">
                            {project.title}
                        </h1>
                    </ScrollReveal>
                </div>
            </section>

            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                        
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            <ScrollReveal animation="fade-up">
                                <div className="prose prose-lg max-w-none text-muted-foreground prose-headings:font-serif prose-headings:font-light prose-headings:text-foreground prose-a:text-primary" dangerouslySetInnerHTML={{ __html: project.description }} />
                            </ScrollReveal>
                            
                            {/* Gallery */}
                            {project.images && project.images.length > 0 && (
                                <div className="mt-20 space-y-8">
                                    <ScrollReveal animation="fade-up">
                                        <h3 className="text-2xl font-light font-serif border-b border-border/50 pb-4 text-foreground">Galería del Proyecto</h3>
                                    </ScrollReveal>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        {project.images.map((img: any, index: number) => (
                                            <ScrollReveal key={img.id} animation="fade-up" delay={index * 150}>
                                                <div className="rounded-sm overflow-hidden border border-border/30 bg-background">
                                                    <img src={`/storage/${img.image_path}`} alt={`Galería ${project.title}`} className="w-full h-auto hover:scale-105 transition-transform duration-700" loading="lazy" />
                                                </div>
                                            </ScrollReveal>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        {/* Sidebar Details */}
                        <div className="lg:col-span-1">
                            <ScrollReveal animation="fade-left" delay={300} className="sticky top-28 bg-background p-8 rounded-sm border border-border/40 shadow-sm">
                                <h3 className="text-xl font-light font-serif mb-6 pb-4 border-b border-border/50 text-foreground">Detalles del Proyecto</h3>
                                
                                <dl className="space-y-6">
                                    {project.client && (
                                        <div>
                                            <dt className="flex items-center text-xs uppercase tracking-widest font-semibold text-primary mb-2">
                                                <User className="mr-2 h-4 w-4" /> Cliente
                                            </dt>
                                            <dd className="text-foreground">{project.client}</dd>
                                        </div>
                                    )}
                                    
                                    {project.role && (
                                        <div>
                                            <dt className="flex items-center text-xs uppercase tracking-widest font-semibold text-primary mb-2">
                                                <Briefcase className="mr-2 h-4 w-4" /> Servicios
                                            </dt>
                                            <dd className="text-foreground">{project.role}</dd>
                                        </div>
                                    )}
                                    
                                    {project.completion_date && (
                                        <div>
                                            <dt className="flex items-center text-xs uppercase tracking-widest font-semibold text-primary mb-2">
                                                <Calendar className="mr-2 h-4 w-4" /> Fecha
                                            </dt>
                                            <dd className="text-foreground">
                                                {new Date(project.completion_date).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                                            </dd>
                                        </div>
                                    )}
                                    
                                    {project.project_url && (
                                        <div className="pt-6 mt-6 border-t border-border/50">
                                            <a href={project.project_url} target="_blank" rel="noopener noreferrer" className="inline-flex w-full items-center justify-center rounded-sm bg-primary px-4 py-4 text-xs uppercase tracking-widest font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:scale-105">
                                                Ver Proyecto en Vivo <ExternalLink className="ml-2 h-4 w-4" />
                                            </a>
                                        </div>
                                    )}
                                </dl>
                            </ScrollReveal>
                        </div>
                        
                    </div>
                </div>
            </section>
        </>
    );
}
