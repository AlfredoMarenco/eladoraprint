import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Clock } from 'lucide-react';

export default function Show({ post }: any) {
    return (
        <>
            <Head title={`${post.title} - Blog`} />
            
            <article className="pb-24">
                {/* Header */}
                <header className="pt-20 pb-12 bg-muted/30">
                    <div className="container mx-auto px-4 max-w-3xl text-center">
                        <Link href="/blog" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 font-medium transition-colors">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Volver al blog
                        </Link>
                        
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-foreground">
                            {post.title}
                        </h1>
                        
                        <div className="flex items-center justify-center gap-4 text-muted-foreground text-sm">
                            <div className="flex items-center gap-1.5">
                                <Clock className="h-4 w-4" />
                                <span>
                                    {new Date(post.published_at || post.created_at).toLocaleDateString('es-ES', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Cover Image */}
                {post.cover_image && (
                    <div className="container mx-auto px-4 max-w-5xl -mt-8 relative z-10 mb-16">
                        <div className="rounded-2xl overflow-hidden shadow-xl aspect-video border bg-background">
                            <img src={`/storage/${post.cover_image}`} alt={post.title} className="w-full h-full object-cover" />
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className={`container mx-auto px-4 max-w-3xl ${!post.cover_image ? 'mt-16' : ''}`}>
                    <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary prose-img:rounded-xl" dangerouslySetInnerHTML={{ __html: post.content }} />
                    
                    <div className="mt-16 pt-8 border-t">
                        <h3 className="font-bold text-xl mb-4">Compartir este artículo</h3>
                        <div className="flex gap-4">
                            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window?.location?.href || '')}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                X (Twitter)
                            </a>
                            <a href={`https://www.linkedin.com/shareArticle?mini=true&title=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window?.location?.href || '')}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                LinkedIn
                            </a>
                        </div>
                    </div>
                </div>
            </article>
        </>
    );
}
