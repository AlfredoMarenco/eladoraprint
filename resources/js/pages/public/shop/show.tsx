import { Head, Link } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ShoppingCart, ChevronLeft, Check } from 'lucide-react';
import { useState } from 'react';
import { useCartStore } from '@/stores/useCartStore';
import { toast } from 'sonner';

export default function ShopShow({ product, relatedProducts }: { product: any, relatedProducts: any[] }) {
    const [selectedImage, setSelectedImage] = useState(
        product.images?.find((i:any) => i.is_primary)?.image_url || product.images?.[0]?.image_url
    );
    const [quantity, setQuantity] = useState(1);
    const addItem = useCartStore((state) => state.addItem);

    const addToCart = () => {
        addItem({
            id: product.id.toString(), // Later we append variations if any
            product_id: product.id,
            name: product.name,
            price: parseFloat(product.base_price),
            quantity: quantity,
            type: product.type,
            image_url: selectedImage,
        });
        
        toast.success(`Se agregaron ${quantity} piezas de ${product.name} al carrito.`);
    };

    return (
        <>
            <Head title={`${product.name} | Tienda`} />
            
            <div className="bg-[#F9F6EE] min-h-screen pt-24 pb-16">
                <div className="container mx-auto px-4 md:px-6">
                    
                    <Link href="/shop" className="inline-flex items-center text-[#3E362E]/70 hover:text-[#D4AF37] mb-8 transition-colors">
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Volver a la tienda
                    </Link>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
                        {/* Galería */}
                        <div className="space-y-4">
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="aspect-[4/5] overflow-hidden rounded-xl bg-white shadow-sm"
                            >
                                {selectedImage ? (
                                    <img src={selectedImage} alt={product.name} className="object-cover w-full h-full" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-gray-100">
                                        <span className="text-gray-400">Sin imagen</span>
                                    </div>
                                )}
                            </motion.div>
                            
                            {product.images && product.images.length > 1 && (
                                <div className="flex gap-4 overflow-x-auto pb-2">
                                    {product.images.map((img: any) => (
                                        <button 
                                            key={img.id}
                                            onClick={() => setSelectedImage(img.image_url)}
                                            className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-md border-2 transition-all ${selectedImage === img.image_url ? 'border-[#D4AF37]' : 'border-transparent hover:border-[#3E362E]/30'}`}
                                        >
                                            <img src={img.image_url} alt="" className="object-cover w-full h-full" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Detalles */}
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex flex-col"
                        >
                            <div className="mb-6">
                                {product.type === 'digital' && (
                                    <Badge className="mb-4 bg-[#D4AF37] text-white hover:bg-[#c19b2e]">Producto Digital</Badge>
                                )}
                                <h1 className="text-3xl md:text-4xl font-serif text-[#3E362E] mb-4">{product.name}</h1>
                                <p className="text-2xl text-[#D4AF37] font-semibold">
                                    ${parseFloat(product.base_price).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                </p>
                            </div>

                            <div className="prose prose-sm md:prose-base prose-stone text-[#3E362E]/80 mb-8" dangerouslySetInnerHTML={{ __html: product.description || '<p>No hay descripción disponible.</p>' }} />

                            <div className="space-y-6 mt-auto">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center border border-[#3E362E]/20 rounded-md">
                                        <button 
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="px-4 py-2 text-[#3E362E] hover:bg-white transition-colors"
                                        >
                                            -
                                        </button>
                                        <span className="px-4 py-2 font-medium text-[#3E362E] border-x border-[#3E362E]/20 min-w-[3rem] text-center">
                                            {quantity}
                                        </span>
                                        <button 
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="px-4 py-2 text-[#3E362E] hover:bg-white transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <p className="text-sm text-[#3E362E]/60">
                                        {product.stock !== null ? `${product.stock} disponibles` : 'Disponible bajo pedido'}
                                    </p>
                                </div>

                                <Button 
                                    onClick={addToCart}
                                    className="w-full py-6 text-lg bg-[#3E362E] hover:bg-[#2a241f] text-[#F9F6EE] transition-all shadow-md hover:shadow-lg"
                                >
                                    <ShoppingCart className="mr-2 h-5 w-5" />
                                    Añadir al Carrito
                                </Button>

                                <div className="pt-6 border-t border-[#3E362E]/10 space-y-3">
                                    <div className="flex items-center text-sm text-[#3E362E]/70">
                                        <Check className="mr-2 h-4 w-4 text-[#D4AF37]" />
                                        Diseño premium de autor
                                    </div>
                                    <div className="flex items-center text-sm text-[#3E362E]/70">
                                        <Check className="mr-2 h-4 w-4 text-[#D4AF37]" />
                                        Pago seguro vía MercadoPago
                                    </div>
                                    {product.type === 'physical' && (
                                        <div className="flex items-center text-sm text-[#3E362E]/70">
                                            <Check className="mr-2 h-4 w-4 text-[#D4AF37]" />
                                            Envíos locales garantizados
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Relacionados */}
                    {relatedProducts && relatedProducts.length > 0 && (
                        <div className="pt-16 border-t border-[#3E362E]/10">
                            <h2 className="text-2xl font-serif text-[#3E362E] mb-8">También te podría interesar</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                                {relatedProducts.map((p) => (
                                    <Link href={`/shop/${p.slug}`} key={p.id} className="group">
                                        <Card className="overflow-hidden border-none shadow-sm bg-white hover:shadow-md transition-all">
                                            <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                                                <img 
                                                    src={p.images?.find((i:any) => i.is_primary)?.image_url || p.images?.[0]?.image_url} 
                                                    alt={p.name} 
                                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>
                                            <CardContent className="p-4">
                                                <h3 className="font-medium text-[#3E362E] line-clamp-1">{p.name}</h3>
                                                <p className="text-[#D4AF37] font-semibold text-sm">
                                                    ${parseFloat(p.base_price).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
