import { Head, Link } from '@inertiajs/react';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

export default function ShopIndex({ products }: { products: any }) {
    return (
        <>
            <Head title="Tienda" />
            
            <div className="bg-[#F9F6EE] min-h-screen pt-24 pb-16">
                <div className="container mx-auto px-4 md:px-6">
                    
                    <div className="text-center mb-16">
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-serif text-[#3E362E] mb-4"
                        >
                            Tienda Exclusiva
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-[#3E362E]/70 max-w-2xl mx-auto"
                        >
                            Colecciones de diseño de autor, invitaciones premium y artículos de papelería únicos, listos para hacer especiales tus eventos.
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {products.data.length === 0 ? (
                            <div className="col-span-full text-center py-12">
                                <p className="text-muted-foreground">No hay productos disponibles por ahora.</p>
                            </div>
                        ) : (
                            products.data.map((product: any, index: number) => (
                                <motion.div 
                                    key={product.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ y: -5 }}
                                    className="group"
                                >
                                    <Link href={`/shop/${product.slug}`}>
                                        <Card className="overflow-hidden border-none shadow-sm bg-white hover:shadow-lg transition-all duration-300">
                                            <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                                                {product.images && product.images.length > 0 ? (
                                                    <img 
                                                        src={product.images.find((i:any) => i.is_primary)?.image_url || product.images[0].image_url} 
                                                        alt={product.name} 
                                                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center bg-gray-100">
                                                        <span className="text-gray-400">Sin imagen</span>
                                                    </div>
                                                )}
                                                {product.type === 'digital' && (
                                                    <Badge className="absolute top-3 right-3 bg-[#D4AF37] hover:bg-[#c19b2e] text-white">
                                                        Digital
                                                    </Badge>
                                                )}
                                            </div>
                                            <CardContent className="p-5">
                                                <h3 className="font-medium text-lg text-[#3E362E] mb-2 line-clamp-1">{product.name}</h3>
                                                <p className="text-[#D4AF37] font-semibold text-lg">
                                                    ${parseFloat(product.base_price).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </motion.div>
                            ))
                        )}
                    </div>

                    {products.last_page > 1 && (
                        <div className="mt-16 flex justify-center gap-2">
                            {products.links.map((link: any, index: number) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={`px-4 py-2 rounded-md transition-colors ${
                                        link.active 
                                            ? 'bg-[#3E362E] text-[#F9F6EE]' 
                                            : 'bg-white text-[#3E362E] hover:bg-[#D4AF37] hover:text-white'
                                    } ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
