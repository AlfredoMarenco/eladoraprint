import { Head } from '@inertiajs/react';

export default function About() {
    return (
        <>
            <Head title="Sobre Mí" />
            
            <section className="py-24">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="order-2 md:order-1">
                            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
                                Hola, soy <span className="text-primary">Eladora.</span>
                            </h1>
                            <div className="space-y-6 text-lg text-muted-foreground">
                                <p>
                                    Soy una diseñadora gráfica independiente apasionada por el <strong>branding estratégico</strong> y la creación de experiencias visuales que conectan con las personas.
                                </p>
                                <p>
                                    Mi enfoque se basa en entender profundamente la esencia de tu proyecto para traducirlo en un lenguaje visual coherente, estético y, sobre todo, funcional.
                                </p>
                                <p>
                                    A lo largo de los años, he tenido el privilegio de trabajar con marcas increíbles, desde pequeños emprendimientos locales hasta corporativos, ayudándoles a destacar y a contar su historia a través del diseño.
                                </p>
                            </div>
                            
                            <div className="mt-10 flex gap-4">
                                <a href="mailto:contacto@eladoraprint.com" className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
                                    Trabajemos Juntos
                                </a>
                            </div>
                        </div>
                        
                        <div className="order-1 md:order-2">
                            <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-muted relative">
                                {/* Decoración de fondo */}
                                <div className="absolute inset-0 bg-primary/10 mix-blend-multiply"></div>
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground border-2 border-dashed border-primary/20 rounded-3xl">
                                    [Fotografía de Eladora]
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
