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
import { Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: admin.dashboard() },
    { title: 'Órdenes', href: admin.orders.index() },
];

export default function OrderIndex({ orders }: { orders: any }) {
    
    const getStatusBadge = (status: string) => {
        switch(status) {
            case 'pending': return <Badge variant="outline" className="text-yellow-600 bg-yellow-50">Pendiente</Badge>;
            case 'processing': return <Badge variant="outline" className="text-blue-600 bg-blue-50">Procesando</Badge>;
            case 'shipped': return <Badge variant="outline" className="text-purple-600 bg-purple-50">Enviado</Badge>;
            case 'delivered': return <Badge variant="outline" className="text-green-600 bg-green-50">Entregado</Badge>;
            case 'cancelled': return <Badge variant="outline" className="text-red-600 bg-red-50">Cancelado</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <>
            <Head title="Órdenes" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Administrar Órdenes</h2>
                </div>
                
                {/* Mobile View (Cards) */}
                <div className="md:hidden flex flex-col gap-4">
                    {orders.data.length === 0 ? (
                        <div className="text-center p-8 text-muted-foreground border rounded-lg bg-white">
                            No hay órdenes registradas.
                        </div>
                    ) : (
                        orders.data.map((order: any) => (
                            <div key={order.id} className="flex flex-col p-4 bg-white border rounded-xl shadow-sm gap-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-lg text-primary">{order.order_number}</span>
                                        <span className="text-sm text-muted-foreground">{new Date(order.created_at).toLocaleDateString('es-MX')}</span>
                                    </div>
                                    {getStatusBadge(order.status)}
                                </div>
                                <div className="flex flex-col bg-muted/30 p-3 rounded-lg">
                                    <span className="font-medium">{order.customer_name}</span>
                                    <span className="text-sm text-muted-foreground">{order.customer_email}</span>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t mt-1">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-muted-foreground uppercase tracking-wider">Total</span>
                                        <span className="font-bold text-lg">${parseFloat(order.total_amount).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    <Badge variant={order.payment_status === 'paid' ? 'default' : 'secondary'} className="px-3 py-1">
                                        {order.payment_status === 'paid' ? 'Pagado' : 'Pendiente'}
                                    </Badge>
                                </div>
                                <Button variant="outline" className="w-full mt-2" asChild>
                                    <Link href={admin.orders.show(order.id)}>
                                        <Eye className="mr-2 h-4 w-4" />
                                        Ver Detalles
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
                                <TableHead className="font-semibold">Orden</TableHead>
                                <TableHead className="font-semibold">Fecha</TableHead>
                                <TableHead className="font-semibold">Cliente</TableHead>
                                <TableHead className="font-semibold">Total</TableHead>
                                <TableHead className="font-semibold">Estado</TableHead>
                                <TableHead className="font-semibold">Pago</TableHead>
                                <TableHead className="text-right font-semibold">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                                        No hay órdenes registradas.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                orders.data.map((order: any) => (
                                    <TableRow key={order.id} className="hover:bg-muted/30 transition-colors">
                                        <TableCell className="font-medium text-primary">{order.order_number}</TableCell>
                                        <TableCell className="text-muted-foreground">{new Date(order.created_at).toLocaleDateString('es-MX')}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{order.customer_name}</span>
                                                <span className="text-xs text-muted-foreground">{order.customer_email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-semibold">${parseFloat(order.total_amount).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</TableCell>
                                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                                        <TableCell>
                                            <Badge variant={order.payment_status === 'paid' ? 'default' : 'secondary'}>
                                                {order.payment_status === 'paid' ? 'Pagado' : 'Pendiente'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary" asChild>
                                                <Link href={admin.orders.show(order.id)}>
                                                    <Eye className="h-4 w-4" />
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

OrderIndex.layout = { breadcrumbs };
