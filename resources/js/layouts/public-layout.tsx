import { Link } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { ReactNode } from 'react';

export default function PublicLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20">
            {/* Header / Navbar */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
                <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
                    <div className="flex items-center gap-2">
                        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <AppLogoIcon className="h-14 w-auto object-contain mix-blend-multiply" />
                        </Link>
                    </div>
                    <nav className="hidden md:flex gap-8 items-center text-sm font-medium">
                        <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
                        <Link href="/portfolio" className="hover:text-primary transition-colors">Portafolio</Link>
                        <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
                        <Link href="/about" className="hover:text-primary transition-colors">Sobre Mí</Link>
                    </nav>
                    <div className="flex items-center gap-4">
                        <Link href="/admin" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            Ingresar
                        </Link>
                        <a href="mailto:contacto@eladoraprint.com" className="hidden md:inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                            Contáctame
                        </a>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1">
                {children}
            </main>

            {/* Footer */}
            <footer className="border-t bg-muted/30">
                <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="md:col-span-2">
                            <AppLogoIcon className="h-16 w-auto mb-4 object-contain mix-blend-multiply" />
                            <p className="text-muted-foreground text-sm max-w-xs">
                                Transformando ideas en experiencias visuales memorables. Diseño gráfico, branding y desarrollo web con atención al detalle.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Enlaces</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><Link href="/" className="hover:text-primary">Inicio</Link></li>
                                <li><Link href="/portfolio" className="hover:text-primary">Portafolio</Link></li>
                                <li><Link href="/blog" className="hover:text-primary">Blog</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Social</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><a href="#" className="hover:text-primary">Instagram</a></li>
                                <li><a href="#" className="hover:text-primary">Behance</a></li>
                                <li><a href="#" className="hover:text-primary">LinkedIn</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
                        © {new Date().getFullYear()} Eladora Print. Todos los derechos reservados.
                    </div>
                </div>
            </footer>
        </div>
    );
}
