import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app/app-sidebar-layout';
import { BreadcrumbItem } from '@/types';
import admin from '@/routes/admin/index';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function OrderShow({ order }: { order: any }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'Órdenes', href: admin.orders.index() },
        { title: order.order_number, href: admin.orders.show(order.id) },
    ];

    const { data, setData, put, processing } = useForm({
        status: order.status,
        payment_status: order.payment_status
    });

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        put(admin.orders.update(order.id), {
            preserveScroll: true,
            onSuccess: () => toast.success('Orden actualizada exitosamente'),
            onError: () => toast.error('Hubo un error al actualizar la orden')
        });
    };

    return (
        <>
            <Head title={`Orden ${order.order_number}`} />
            
            <div className="flex flex-col gap-6 p-4 max-w-5xl">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold flex items-center gap-2">
                            Orden {order.order_number}
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            {new Date(order.created_at).toLocaleString('es-MX')}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Detalles del Cliente */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-white p-6 rounded-xl border shadow-sm">
                            <h3 className="font-semibold text-lg mb-4 border-b pb-2">Información del Cliente</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-muted-foreground">Nombre</p>
                                    <p className="font-medium">{order.customer_name}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Correo Electrónico</p>
                                    <p className="font-medium">{order.customer_email}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Teléfono</p>
                                    <p className="font-medium">{order.customer_phone}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl border shadow-sm">
                            <h3 className="font-semibold text-lg mb-4 border-b pb-2">Dirección de Envío</h3>
                            <div className="text-sm">
                                <p>{order.shipping_address}</p>
                                <p>{order.shipping_city}, {order.shipping_state}</p>
                                <p>CP: {order.shipping_zip}</p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl border shadow-sm">
                            <h3 className="font-semibold text-lg mb-4 border-b pb-2">Productos</h3>
                            <div className="space-y-4">
                                {order.items.map((item: any) => (
                                    <div key={item.id} className="flex justify-between items-center text-sm border-b pb-3 last:border-0 last:pb-0">
                                        <div className="flex-1">
                                            <p className="font-medium">{item.product?.name || 'Producto Eliminado'}</p>
                                            <p className="text-muted-foreground">Cantidad: {item.quantity} x ${parseFloat(item.unit_price).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
                                        </div>
                                        <div className="font-medium">
                                            ${parseFloat(item.subtotal).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="mt-6 border-t pt-4 space-y-2 text-sm">
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Subtotal</span>
                                    <span>${(order.total_amount - order.shipping_cost).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Costo de Envío</span>
                                    <span>${parseFloat(order.shipping_cost).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between text-lg font-semibold pt-2">
                                    <span>Total</span>
                                    <span>${parseFloat(order.total_amount).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actualizar Estados */}
                    <div>
                        <form onSubmit={handleUpdate} className="bg-white p-6 rounded-xl border shadow-sm sticky top-4">
                            <h3 className="font-semibold text-lg mb-4 border-b pb-2">Administrar Orden</h3>
                            
                            <div className="space-y-4 mb-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Estado del Pago</label>
                                    <Select value={data.payment_status} onValueChange={(v) => setData('payment_status', v)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">Pendiente</SelectItem>
                                            <SelectItem value="paid">Pagado</SelectItem>
                                            <SelectItem value="failed">Fallido</SelectItem>
                                            <SelectItem value="refunded">Reembolsado</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Estado del Envío / Orden</label>
                                    <Select value={data.status} onValueChange={(v) => setData('status', v)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">Pendiente</SelectItem>
                                            <SelectItem value="processing">Procesando</SelectItem>
                                            <SelectItem value="shipped">Enviado</SelectItem>
                                            <SelectItem value="delivered">Entregado</SelectItem>
                                            <SelectItem value="cancelled">Cancelado</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <Button type="submit" disabled={processing} className="w-full">
                                {processing ? 'Guardando...' : 'Guardar Cambios'}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

OrderShow.layout = (page: any) => {
    const breadcrumbs = [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'Órdenes', href: admin.orders.index() },
        { title: `Orden ${page.props.order.order_number}`, href: admin.orders.show(page.props.order.id) },
    ];
    return <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;
};
