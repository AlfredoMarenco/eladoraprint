import { Head, Link } from '@inertiajs/react';
import { BreadcrumbItem } from '@/types';
import admin from '@/routes/admin/index';
import { 
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { create } from '@/routes/admin/products';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: admin.dashboard() },
    { title: 'Productos', href: admin.products.index() },
];

export default function ProductIndex({ products }: { products: any }) {
    return (
        <>
            <Head title="Productos" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Administrar Productos</h2>
                    <Button asChild>
                        <Link href={create()}>
                            <Plus className="mr-2 h-4 w-4" />
                            Nuevo Producto
                        </Link>
                    </Button>
                </div>
                
                {/* Mobile View (Cards) */}
                <div className="md:hidden flex flex-col gap-4">
                    {products.data.length === 0 ? (
                        <div className="text-center p-8 text-muted-foreground border rounded-lg bg-white">
                            No hay productos registrados.
                        </div>
                    ) : (
                        products.data.map((product: any) => (
                            <div key={product.id} className="flex flex-col p-4 bg-white border rounded-xl shadow-sm gap-4">
                                <div className="flex gap-4 items-center">
                                    <div className="shrink-0">
                                        {product.images && product.images.length > 0 ? (
                                            <img src={product.images.find((i:any) => i.is_primary)?.image_url || product.images[0].image_url} alt={product.name} className="h-16 w-16 rounded-lg object-cover border" />
                                        ) : (
                                            <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center border">
                                                <span className="text-xs text-muted-foreground">No img</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col flex-1 min-w-0">
                                        <span className="font-semibold text-primary truncate">{product.name}</span>
                                        <span className="font-bold text-lg mt-1">${product.base_price}</span>
                                    </div>
                                </div>
                                
                                <div className="flex justify-between items-center pt-3 border-t mt-1">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-muted-foreground uppercase tracking-wider">Stock</span>
                                        <span className="font-medium text-sm">{product.stock !== null ? product.stock : 'N/A'}</span>
                                    </div>
                                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${product.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                                        {product.is_active ? 'Activo' : 'Inactivo'}
                                    </span>
                                </div>
                                <Button variant="outline" className="w-full mt-2" asChild>
                                    <Link href={admin.products.edit(product.id)}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Editar Producto
                                    </Link>
                                </Button>
                            </div>
                        ))
                    )}
                </div>

                {/* Desktop View (Table) */}
                <div className="hidden md:block rounded-md border bg-white overflow-hidden shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50 hover:bg-muted/50">
                                <TableHead className="w-16 font-semibold">Imagen</TableHead>
                                <TableHead className="font-semibold">Nombre</TableHead>
                                <TableHead className="font-semibold">Precio Base</TableHead>
                                <TableHead className="font-semibold">Stock</TableHead>
                                <TableHead className="font-semibold">Estado</TableHead>
                                <TableHead className="text-right font-semibold">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                        No hay productos registrados.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                products.data.map((product: any) => (
                                    <TableRow key={product.id} className="hover:bg-muted/30 transition-colors">
                                        <TableCell>
                                            {product.images && product.images.length > 0 ? (
                                                <img src={product.images.find((i:any) => i.is_primary)?.image_url || product.images[0].image_url} alt={product.name} className="h-10 w-10 rounded-md object-cover border" />
                                            ) : (
                                                <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center border">
                                                    <span className="text-[10px] text-muted-foreground">No img</span>
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium text-primary">{product.name}</TableCell>
                                        <TableCell className="font-semibold">${product.base_price}</TableCell>
                                        <TableCell>{product.stock !== null ? product.stock : 'N/A'}</TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${product.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                                                {product.is_active ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary" asChild>
                                                <Link href={admin.products.edit(product.id)}>
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    );
}

ProductIndex.layout = { breadcrumbs };
