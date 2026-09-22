import { Link, router } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { ReactNode, useState, useEffect } from 'react';
import { ShoppingCart, Trash2, X, Menu } from 'lucide-react';
import { useCartStore } from '@/stores/useCartStore';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function PublicLayout({ children }: { children: ReactNode }) {
    const { items, removeItem, updateQuantity, getCartTotal, getCartCount } = useCartStore();
    const [mounted, setMounted] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const proceedToCheckout = () => {
        setOpen(false);
        router.visit('/checkout');
    };

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-[#D4AF37]/20">
            {/* Header / Navbar */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
                <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
                    <div className="flex items-center gap-2">
                        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <AppLogoIcon className="h-14 w-auto object-contain mix-blend-multiply" />
                        </Link>
                    </div>
                    <nav className="hidden md:flex gap-8 items-center text-sm font-medium">
                        <Link href="/portfolio" className="hover:text-[#D4AF37] transition-colors">Portafolio</Link>
                        <Link href="/shop" className="hover:text-[#D4AF37] transition-colors">Tienda</Link>
                        <Link href="/blog" className="hover:text-[#D4AF37] transition-colors">Blog</Link>
                        <Link href="/about" className="hover:text-[#D4AF37] transition-colors">Sobre Mí</Link>
                    </nav>
                    <div className="flex items-center gap-4">
                        <Sheet open={open} onOpenChange={setOpen}>
                            <SheetTrigger asChild>
                                <button className="relative p-2 hover:bg-muted rounded-full transition-colors">
                                    <ShoppingCart className="h-5 w-5 text-[#3E362E]" />
                                    {mounted && getCartCount() > 0 && (
                                        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 rounded-full bg-[#D4AF37] text-white">
                                            {getCartCount()}
                                        </Badge>
                                    )}
                                </button>
                            </SheetTrigger>
                            <SheetContent className="w-full sm:max-w-md bg-[#F9F6EE] flex flex-col h-full">
                                <SheetHeader>
                                    <SheetTitle className="text-2xl font-serif text-[#3E362E]">Tu Carrito</SheetTitle>
                                </SheetHeader>
                                
                                <div className="flex-1 overflow-y-auto py-4">
                                    {mounted && items.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-full text-[#3E362E]/50">
                                            <ShoppingCart className="h-12 w-12 mb-4 opacity-50" />
                                            <p>Tu carrito está vacío.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {mounted && items.map((item) => (
                                                <div key={item.id} className="flex gap-4 bg-white p-3 rounded-lg shadow-sm">
                                                    <div className="h-20 w-20 bg-muted rounded-md overflow-hidden shrink-0">
                                                        {item.image_url ? (
                                                            <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
                                                        ) : (
                                                            <div className="h-full w-full flex items-center justify-center bg-gray-100 text-xs">Sin img</div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 flex flex-col">
                                                        <div className="flex justify-between items-start">
                                                            <h4 className="font-medium text-[#3E362E] line-clamp-1">{item.name}</h4>
                                                            <button onClick={() => removeItem(item.id)} className="text-red-500 hover:bg-red-50 p-1 rounded">
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                        <p className="text-[#D4AF37] font-semibold">${item.price.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
                                                        
                                                        <div className="flex items-center gap-3 mt-auto">
                                                            <div className="flex items-center border rounded-md">
                                                                <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="px-2 py-1 hover:bg-muted">-</button>
                                                                <span className="px-2 py-1 text-sm">{item.quantity}</span>
                                                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 hover:bg-muted">+</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {mounted && items.length > 0 && (
                                    <div className="border-t pt-4 mt-auto">
                                        <div className="flex justify-between text-lg font-semibold text-[#3E362E] mb-6">
                                            <span>Subtotal</span>
                                            <span>${getCartTotal().toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                                        </div>
                                        <Button 
                                            onClick={proceedToCheckout}
                                            className="w-full bg-[#3E362E] text-white hover:bg-[#2a241f] py-6 text-lg rounded-full"
                                        >
                                            Ir al Checkout
                                        </Button>
                                    </div>
                                )}
                            </SheetContent>
                        </Sheet>

                        {/* Mobile Navigation Menu */}
                        <Sheet>
                            <SheetTrigger asChild>
                                <button className="md:hidden p-2 text-[#3E362E] hover:bg-muted rounded-full transition-colors">
                                    <Menu className="h-6 w-6" />
                                </button>
                            </SheetTrigger>
                            <SheetContent side="left" className="bg-[#F9F6EE] w-[300px] p-6 pt-12">
                                <SheetHeader className="mb-6 p-0">
                                    <SheetTitle className="text-left">
                                        <AppLogoIcon className="h-10 w-auto object-contain mix-blend-multiply" />
                                    </SheetTitle>
                                </SheetHeader>
                                <nav className="flex flex-col">
                                    <Link href="/portfolio" className="hover:text-[#D4AF37] transition-colors border-b border-[#3E362E]/10 py-4 text-xl font-medium">Portafolio</Link>
                                    <Link href="/shop" className="hover:text-[#D4AF37] transition-colors border-b border-[#3E362E]/10 py-4 text-xl font-medium">Tienda</Link>
                                    <Link href="/blog" className="hover:text-[#D4AF37] transition-colors border-b border-[#3E362E]/10 py-4 text-xl font-medium">Blog</Link>
                                    <Link href="/about" className="hover:text-[#D4AF37] transition-colors border-b border-[#3E362E]/10 py-4 text-xl font-medium">Sobre Mí</Link>
                                    <a href="mailto:contacto@eladoraprint.com" className="mt-8 flex items-center justify-center rounded-full bg-[#3E362E] px-6 py-4 text-lg font-medium text-[#F9F6EE] shadow transition-colors hover:bg-[#3E362E]/90 focus-visible:outline-none">
                                        Contáctame
                                    </a>
                                </nav>
                            </SheetContent>
                        </Sheet>

                        <a href="mailto:contacto@eladoraprint.com" className="hidden md:inline-flex items-center justify-center rounded-full bg-[#3E362E] px-6 py-2.5 text-sm font-medium text-[#F9F6EE] shadow transition-colors hover:bg-[#3E362E]/90 focus-visible:outline-none disabled:opacity-50">
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
