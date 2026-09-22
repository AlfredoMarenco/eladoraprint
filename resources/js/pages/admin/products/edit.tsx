import { Head, useForm, Link } from '@inertiajs/react';
import { BreadcrumbItem } from '@/types';
import admin from '@/routes/admin/index';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormEventHandler } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { router } from '@inertiajs/react';

export default function ProductEdit({ product }: { product: any }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'Productos', href: admin.products.index() },
        { title: 'Editar Producto', href: admin.products.edit(product.id) },
    ];

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        name: product.name || '',
        description: product.description || '',
        base_price: product.base_price || '',
        type: product.type || 'physical',
        stock: product.stock === null ? '' : product.stock,
        is_active: product.is_active,
        images: [] as File[],
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(admin.products.update(product.id));
    };

    const deleteProduct = () => {
        if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
            router.delete(admin.products.destroy(product.id));
        }
    };

    return (
        <>
            <Head title={`Editar Producto: ${product.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Editar Producto</h2>
                    <div className="flex gap-2">
                        <Button variant="destructive" onClick={deleteProduct}>
                            Eliminar
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href={admin.products.index()}>Volver</Link>
                        </Button>
                    </div>
                </div>
                
                <div className="rounded-md border p-6 bg-card">
                    <form onSubmit={submit} className="space-y-6 max-w-2xl">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre del Producto *</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Descripción</Label>
                            <textarea
                                id="description"
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                            />
                            {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="base_price">Precio Base ($) *</Label>
                                <Input
                                    id="base_price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.base_price}
                                    onChange={(e) => setData('base_price', e.target.value)}
                                    required
                                />
                                {errors.base_price && <p className="text-sm text-destructive">{errors.base_price}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="stock">Stock Inicial (Opcional)</Label>
                                <Input
                                    id="stock"
                                    type="number"
                                    min="0"
                                    value={data.stock}
                                    onChange={(e) => setData('stock', e.target.value)}
                                />
                                {errors.stock && <p className="text-sm text-destructive">{errors.stock}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="type">Tipo de Producto *</Label>
                            <Select 
                                value={data.type} 
                                onValueChange={(value) => setData('type', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona un tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="physical">Físico (Requiere envío)</SelectItem>
                                    <SelectItem value="digital">Digital (Descargable)</SelectItem>
                                    <SelectItem value="service">Servicio</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.type && <p className="text-sm text-destructive">{errors.type}</p>}
                        </div>

                        {product.images && product.images.length > 0 && (
                            <div className="space-y-2">
                                <Label>Imágenes actuales</Label>
                                <div className="flex gap-2 overflow-x-auto py-2">
                                    {product.images.map((img: any) => (
                                        <div key={img.id} className="relative h-24 w-24 shrink-0 rounded-md overflow-hidden border">
                                            <img src={img.image_url} alt="Producto" className="object-cover w-full h-full" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="images">Agregar nuevas imágenes</Label>
                            <Input
                                id="images"
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e) => setData('images', Array.from(e.target.files || []))}
                            />
                            <p className="text-xs text-muted-foreground">Si subes nuevas imágenes se agregarán a la galería actual.</p>
                            {errors.images && <p className="text-sm text-destructive">{errors.images}</p>}
                        </div>

                        <div className="flex items-center space-x-2 pt-2">
                            <Checkbox 
                                id="is_active" 
                                checked={data.is_active}
                                onCheckedChange={(checked) => setData('is_active', checked === true)}
                            />
                            <Label htmlFor="is_active" className="font-normal cursor-pointer">
                                Producto activo (visible en la tienda)
                            </Label>
                        </div>
                        {errors.is_active && <p className="text-sm text-destructive">{errors.is_active}</p>}

                        <div className="pt-4 border-t">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Guardando...' : 'Actualizar Producto'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

// Para inyectar el layout con los breadcrumbs dinámicos, lo hacemos con una función o componente en este caso
// @ts-ignore
ProductEdit.layout = (page: React.ReactNode) => {
    // We can't access `product` here easily, so we can just set basic layout breadcrumbs in the component above
    // or just pass a generic one here, and the component renders its own if needed.
    // To avoid duplication, we just return the layout without breadcrumbs since we already removed AppLayout wrapper.
    // Wait, since we removed the AppLayout wrapper from the component return, we DO need to provide the layout object!
    return page;
};

// Actually, let's just use the object format for layout and we'll use a static "Editar Producto" breadcrumb
ProductEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'Productos', href: admin.products.index() },
        { title: 'Editar Producto', href: '#' },
    ]
};
