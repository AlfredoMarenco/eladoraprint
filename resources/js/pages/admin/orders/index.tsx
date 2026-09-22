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
                
                <div className="rounded-md border bg-white">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Orden</TableHead>
                                <TableHead>Fecha</TableHead>
                                <TableHead>Cliente</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead>Pago</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                        No hay órdenes registradas.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                orders.data.map((order: any) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-medium">{order.order_number}</TableCell>
                                        <TableCell>{new Date(order.created_at).toLocaleDateString('es-MX')}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span>{order.customer_name}</span>
                                                <span className="text-xs text-muted-foreground">{order.customer_email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>${parseFloat(order.total_amount).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</TableCell>
                                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                                        <TableCell>
                                            <Badge variant={order.payment_status === 'paid' ? 'default' : 'secondary'}>
                                                {order.payment_status === 'paid' ? 'Pagado' : 'Pendiente'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" asChild>
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
