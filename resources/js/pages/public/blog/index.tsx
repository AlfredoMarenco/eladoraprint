import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Clock } from 'lucide-react';

export default function Index({ posts }: any) {
    return (
        <>
            <Head title="Blog" />
            
            {/* Header */}
            <section className="bg-muted/30 pt-20 pb-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold tracking-tight mb-4 text-primary">Blog & Notas</h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                        Reflexiones sobre diseño, procesos creativos, y recursos para impulsar tu marca.
                    </p>
                </div>
            </section>

            {/* Grid */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    {posts.data.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {posts.data.map((post: any) => (
                                <article key={post.id} className="group flex flex-col items-start justify-between bg-background border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                    <Link href={`/blog/${post.slug}`} className="w-full aspect-[16/9] overflow-hidden bg-muted">
                                        {post.cover_image ? (
                                            <img src={`/storage/${post.cover_image}`} alt={post.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center text-muted-foreground">Sin Imagen</div>
                                        )}
                                    </Link>
                                    <div className="flex flex-col flex-1 p-6">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                                            <Clock className="h-3.5 w-3.5" />
                                            <span>
                                                {new Date(post.published_at || post.created_at).toLocaleDateString('es-ES', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                                        </h3>
                                        <p className="text-muted-foreground text-sm line-clamp-3 mb-6" dangerouslySetInnerHTML={{__html: post.excerpt || ''}}></p>
                                        
                                        <Link href={`/blog/${post.slug}`} className="mt-auto inline-flex items-center text-sm font-medium text-primary hover:underline">
                                            Leer artículo <ArrowRight className="ml-1 h-4 w-4" />
                                        </Link>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-24 bg-muted/20 rounded-xl border border-dashed">
                            <p className="text-xl text-muted-foreground">Pronto publicaré mis primeros artículos aquí.</p>
                        </div>
                    )}

                    {/* Pagination */}
                    {posts.links && posts.links.length > 3 && (
                        <div className="mt-16 flex justify-center gap-2">
                            {posts.links.map((link: any, index: number) => (
                                <Link 
                                    key={index} 
                                    href={link.url || '#'}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                        link.active 
                                        ? 'bg-primary text-primary-foreground' 
                                        : link.url 
                                            ? 'bg-muted hover:bg-muted/80 text-foreground' 
                                            : 'bg-muted/50 text-muted-foreground cursor-not-allowed'
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
