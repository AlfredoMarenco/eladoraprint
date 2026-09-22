import { Head, useForm } from '@inertiajs/react';

import { useCartStore } from '@/stores/useCartStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function Checkout() {
    const { items, getCartTotal, getCartCount } = useCartStore();
    const [mounted, setMounted] = useState(false);

    // Costo de envío local de ejemplo
    const shippingCost = 150.00; 

    const { data, setData, post, processing, errors } = useForm({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        shipping_address: '',
        shipping_city: 'Mérida', // Asumiendo local
        shipping_state: 'Yucatán',
        shipping_zip: '',
        shipping_cost: shippingCost,
        items: [] as any[]
    });

    useEffect(() => {
        setMounted(true);
        if (items.length > 0) {
            setData('items', items.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity,
                price: item.price
            })));
        }
    }, [items]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (items.length === 0) {
            toast.error('Tu carrito está vacío');
            return;
        }

        post('/checkout', {
            preserveScroll: true,
            onSuccess: () => {
                // Cart will be cleared on the success page
            },
            onError: (err) => {
                toast.error('Por favor, revisa los datos del formulario.');
                console.error(err);
            }
        });
    };

    if (!mounted) return <div className="min-h-screen bg-[#F9F6EE]" />;

    const total = getCartTotal() + shippingCost;

    return (
        <>
            <Head title="Checkout | Finalizar Compra" />
            
            <div className="bg-[#F9F6EE] min-h-screen pt-24 pb-16">
                <div className="container mx-auto px-4 md:px-6">
                    <h1 className="text-3xl md:text-4xl font-serif text-[#3E362E] mb-8">Finalizar Compra</h1>

                    {items.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-[#3E362E]/10">
                            <p className="text-[#3E362E]/60 text-lg mb-4">No tienes productos en tu carrito.</p>
                            <Button asChild className="bg-[#3E362E] text-white hover:bg-[#2a241f]">
                                <a href="/shop">Volver a la Tienda</a>
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            {/* Formulario */}
                            <div className="lg:col-span-2">
                                <form onSubmit={submit} className="space-y-8 bg-white p-6 md:p-8 rounded-xl shadow-sm border border-[#3E362E]/10">
                                    <div>
                                        <h2 className="text-xl font-medium text-[#3E362E] mb-4">Datos de Contacto</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="customer_name">Nombre completo</Label>
                                                <Input 
                                                    id="customer_name" 
                                                    value={data.customer_name} 
                                                    onChange={e => setData('customer_name', e.target.value)} 
                                                    className={errors.customer_name ? 'border-red-500' : ''}
                                                />
                                                {errors.customer_name && <p className="text-sm text-red-500">{errors.customer_name}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="customer_email">Correo electrónico</Label>
                                                <Input 
                                                    id="customer_email" 
                                                    type="email"
                                                    value={data.customer_email} 
                                                    onChange={e => setData('customer_email', e.target.value)} 
                                                    className={errors.customer_email ? 'border-red-500' : ''}
                                                />
                                                {errors.customer_email && <p className="text-sm text-red-500">{errors.customer_email}</p>}
                                            </div>
                                            <div className="space-y-2 md:col-span-2">
                                                <Label htmlFor="customer_phone">Teléfono</Label>
                                                <Input 
                                                    id="customer_phone" 
                                                    value={data.customer_phone} 
                                                    onChange={e => setData('customer_phone', e.target.value)} 
                                                    className={errors.customer_phone ? 'border-red-500' : ''}
                                                />
                                                {errors.customer_phone && <p className="text-sm text-red-500">{errors.customer_phone}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h2 className="text-xl font-medium text-[#3E362E] mb-4">Dirección de Envío (Local)</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2 md:col-span-2">
                                                <Label htmlFor="shipping_address">Dirección completa (Calle, No., Colonia)</Label>
                                                <Input 
                                                    id="shipping_address" 
                                                    value={data.shipping_address} 
                                                    onChange={e => setData('shipping_address', e.target.value)} 
                                                    className={errors.shipping_address ? 'border-red-500' : ''}
                                                />
                                                {errors.shipping_address && <p className="text-sm text-red-500">{errors.shipping_address}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="shipping_city">Ciudad</Label>
                                                <Input 
                                                    id="shipping_city" 
                                                    value={data.shipping_city} 
                                                    onChange={e => setData('shipping_city', e.target.value)} 
                                                    className={errors.shipping_city ? 'border-red-500' : ''}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="shipping_state">Estado</Label>
                                                <Input 
                                                    id="shipping_state" 
                                                    value={data.shipping_state} 
                                                    onChange={e => setData('shipping_state', e.target.value)} 
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="shipping_zip">Código Postal</Label>
                                                <Input 
                                                    id="shipping_zip" 
                                                    value={data.shipping_zip} 
                                                    onChange={e => setData('shipping_zip', e.target.value)} 
                                                    className={errors.shipping_zip ? 'border-red-500' : ''}
                                                />
                                                {errors.shipping_zip && <p className="text-sm text-red-500">{errors.shipping_zip}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    <Button 
                                        type="submit" 
                                        disabled={processing}
                                        className="w-full py-6 text-lg bg-[#3E362E] hover:bg-[#2a241f] text-white"
                                    >
                                        {processing ? 'Procesando...' : 'Proceder al Pago'}
                                    </Button>
                                </form>
                            </div>

                            {/* Resumen */}
                            <div>
                                <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-[#3E362E]/10 sticky top-24">
                                    <h2 className="text-xl font-medium text-[#3E362E] mb-6">Resumen del Pedido</h2>
                                    
                                    <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
                                        {items.map(item => (
                                            <div key={item.id} className="flex gap-4">
                                                <div className="h-16 w-16 bg-muted rounded overflow-hidden shrink-0">
                                                    {item.image_url && <img src={item.image_url} className="w-full h-full object-cover" />}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-sm text-[#3E362E] line-clamp-1">{item.name}</h4>
                                                    <p className="text-xs text-[#3E362E]/60">Cant: {item.quantity}</p>
                                                    <p className="text-sm text-[#D4AF37] font-semibold">${item.price.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t pt-4 space-y-3">
                                        <div className="flex justify-between text-sm text-[#3E362E]/80">
                                            <span>Subtotal ({getCartCount()} productos)</span>
                                            <span>${getCartTotal().toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-[#3E362E]/80">
                                            <span>Envío (Fijo Local)</span>
                                            <span>${shippingCost.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                                        </div>
                                        <div className="flex justify-between text-lg font-semibold text-[#3E362E] pt-3 border-t">
                                            <span>Total</span>
                                            <span>${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
