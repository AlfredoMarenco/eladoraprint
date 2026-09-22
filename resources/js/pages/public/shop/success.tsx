import { Head, Link } from '@inertiajs/react';

import { useCartStore } from '@/stores/useCartStore';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CheckoutSuccess({ order }: { order: any }) {
    const clearCart = useCartStore((state) => state.clearCart);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Al llegar a esta página, la orden ya se procesó.
        clearCart();
    }, []);

    if (!mounted) return <div className="min-h-screen bg-[#F9F6EE]" />;

    return (
        <>
            <Head title="¡Orden Confirmada!" />
            
            <div className="bg-[#F9F6EE] min-h-screen flex items-center justify-center py-20">
                <div className="container mx-auto px-4 md:px-6 max-w-2xl text-center">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, type: 'spring' }}
                    >
                        <CheckCircle2 className="h-24 w-24 text-[#D4AF37] mx-auto mb-6" />
                        <h1 className="text-4xl md:text-5xl font-serif text-[#3E362E] mb-4">¡Gracias por tu compra!</h1>
                        <p className="text-lg text-[#3E362E]/70 mb-8">
                            Hemos recibido tu orden <strong className="text-[#3E362E]">#{order.order_number}</strong> y la estamos procesando. Te enviaremos un correo electrónico de confirmación con los detalles de tu pedido.
                        </p>
                    </motion.div>

                    <div className="bg-white p-8 rounded-xl shadow-sm border border-[#3E362E]/10 mb-8 text-left">
                        <h2 className="font-semibold text-[#3E362E] mb-4 text-lg border-b pb-2">Resumen de tu Orden</h2>
                        
                        <div className="space-y-4 mb-6">
                            {order.items.map((item: any) => (
                                <div key={item.id} className="flex justify-between items-center text-sm">
                                    <div className="flex-1">
                                        <p className="font-medium text-[#3E362E]">{item.product?.name || 'Producto eliminado'}</p>
                                        <p className="text-[#3E362E]/60">Cant: {item.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-[#3E362E]">${parseFloat(item.subtotal).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t pt-4 text-sm text-[#3E362E]/80 space-y-2">
                            <div className="flex justify-between">
                                <span>Envío</span>
                                <span>${parseFloat(order.shipping_cost).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between font-semibold text-[#3E362E] text-lg pt-2 border-t">
                                <span>Total Pagado</span>
                                <span>${parseFloat(order.total_amount).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                            </div>
                        </div>
                    </div>

                    <Button asChild className="bg-[#3E362E] text-white hover:bg-[#2a241f] py-6 px-8 rounded-full text-lg shadow-md transition-all hover:shadow-lg">
                        <Link href="/shop">Seguir Comprando</Link>
                    </Button>
                </div>
            </div>
        </>
    );
}
