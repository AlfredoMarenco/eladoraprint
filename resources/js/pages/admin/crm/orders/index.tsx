import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { formatCrmDate } from '@/lib/utils';
import { UniverseSelector } from '@/components/crm/universe-selector';
import { UniverseBadge } from '@/components/crm/universe-badge';
import { StatusBadge } from '@/components/crm/status-badge';
import { MoneyDisplay } from '@/components/crm/money-display';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
    PlusCircle, 
    Search, 
    Calendar, 
    ChevronRight
} from 'lucide-react';
import type { CrmOrder, Universe } from '@/types/crm';

interface Props {
    orders?: {
        data: CrmOrder[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
        total: number;
    };
    filters?: {
        universe?: Universe | 'all';
        operating_status?: string;
        commercial_status?: string;
        priority?: string;
        search?: string;
    };
    operating_statuses?: Record<string, string>;
}

export default function CrmOrdersIndex({ orders, filters = {}, operating_statuses = {} }: Props) {
    const currentUniverse = filters.universe || 'all';
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/crm-orders', { ...filters, search }, { preserveState: true });
    };

    const handleOperatingStatusFilter = (st: string) => {
        router.get('/admin/crm-orders', { ...filters, operating_status: st === 'all' ? '' : st }, { preserveState: true });
    };

    const orderList = orders?.data || [];
    const totalOrders = orders?.total ?? orderList.length;

    return (
        <>
            <Head title="Centro de Pedidos - Eladora CRM" />

            <div className="flex flex-col gap-6 p-6 w-full">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/50">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground tracking-tight">
                                Centro de Pedidos
                            </h1>
                            <UniverseBadge universe={currentUniverse} size="sm" />
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            Seguimiento de producción, entregas acordadas, compras y balances por universo.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                        <UniverseSelector currentUniverse={currentUniverse} />
                        <Button className="gap-2 shadow-xs" asChild>
                            <Link href="/admin/crm-orders/create">
                                <PlusCircle className="w-4 h-4" />
                                <span>Nuevo Pedido</span>
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Search & Quick Status Filters */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border/60">
                    <form onSubmit={handleSearch} className="relative w-full md:w-80">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Buscar folio, cliente o proyecto..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 h-9 text-xs"
                        />
                    </form>

                    <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                        <button
                            type="button"
                            onClick={() => handleOperatingStatusFilter('all')}
                            className={`px-2.5 py-1 rounded-md text-xs whitespace-nowrap transition-colors border ${
                                !filters.operating_status
                                    ? 'bg-foreground text-background font-semibold border-foreground'
                                    : 'bg-muted/40 text-muted-foreground hover:text-foreground border-border'
                            }`}
                        >
                            Todos
                        </button>
                        {['en_produccion', 'listo_produccion', 'listo_para_entregar', 'bloqueado', 'entregado'].map((stKey) => (
                            <button
                                key={stKey}
                                type="button"
                                onClick={() => handleOperatingStatusFilter(stKey)}
                                className={`px-2.5 py-1 rounded-md text-xs whitespace-nowrap transition-colors border ${
                                    filters.operating_status === stKey
                                        ? 'bg-foreground text-background font-semibold border-foreground'
                                        : 'bg-muted/40 text-muted-foreground hover:text-foreground border-border'
                                }`}
                            >
                                {operating_statuses[stKey] || stKey.replace(/_/g, ' ')}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Orders List Table Card */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold">Listado de Pedidos</CardTitle>
                        <CardDescription>{totalOrders} pedidos registrados</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm border-t border-border/50">
                                <thead className="bg-muted/40 text-xs font-semibold text-muted-foreground uppercase">
                                    <tr>
                                        <th className="py-2.5 px-4">Folio</th>
                                        <th className="py-2.5 px-4">Universo / Proyecto</th>
                                        <th className="py-2.5 px-4">Cliente</th>
                                        <th className="py-2.5 px-4">Estado Operativo</th>
                                        <th className="py-2.5 px-4">Estado Financiero</th>
                                        <th className="py-2.5 px-4">Entrega Acordada</th>
                                        <th className="py-2.5 px-4 text-right">Aprobado</th>
                                        <th className="py-2.5 px-4 text-right">Saldo Pte.</th>
                                        <th className="py-2.5 px-4 text-right">Acción</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/40">
                                    {orderList.length === 0 ? (
                                        <tr>
                                            <td colSpan={9} className="py-10 text-center text-muted-foreground">
                                                No se encontraron pedidos con los filtros aplicados.
                                            </td>
                                        </tr>
                                    ) : (
                                        orderList.map((order) => (
                                            <tr key={order.id} className="hover:bg-muted/20 transition-colors">
                                                <td className="py-3 px-4 font-mono font-bold text-xs">
                                                    {order.folio}
                                                </td>

                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-1.5">
                                                        <UniverseBadge universe={order.universe} size="sm" showIcon={false} />
                                                        <Link
                                                            href={`/admin/crm-orders/${order.id}`}
                                                            className="font-semibold text-foreground hover:text-primary transition-colors"
                                                        >
                                                            {order.project_name}
                                                        </Link>
                                                    </div>
                                                    {order.service_type && (
                                                        <div className="text-[11px] text-muted-foreground mt-0.5">
                                                            {order.service_type}
                                                        </div>
                                                    )}
                                                </td>

                                                <td className="py-3 px-4 text-xs">
                                                    <Link href={`/admin/clients/${order.client_id}`} className="font-semibold hover:underline">
                                                        {order.client?.name || 'Cliente no asignado'}
                                                    </Link>
                                                    {order.client?.business_name && (
                                                        <div className="text-[11px] text-muted-foreground">
                                                            {order.client.business_name}
                                                        </div>
                                                    )}
                                                </td>

                                                <td className="py-3 px-4">
                                                    <StatusBadge type="operating" status={order.operating_status || 'no_iniciado'} size="sm" />
                                                </td>

                                                <td className="py-3 px-4">
                                                    <StatusBadge type="financial" status={order.financial_status || 'Sin anticipo registrado'} size="sm" />
                                                </td>

                                                <td className="py-3 px-4 text-xs font-semibold text-foreground">
                                                    {order.delivery_agreed_at ? (
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="w-3 h-3 text-muted-foreground" />
                                                            <span>{formatCrmDate(order.delivery_agreed_at)}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted-foreground font-normal">Sin fecha fijada</span>
                                                    )}
                                                </td>

                                                <td className="py-3 px-4 text-right font-medium">
                                                    <MoneyDisplay amount={order.approved_amount} />
                                                </td>

                                                <td className="py-3 px-4 text-right">
                                                    <span className={`font-bold text-xs ${
                                                        (order.balance_due || 0) > 0 ? 'text-amber-700 dark:text-amber-400' : 'text-emerald-700'
                                                    }`}>
                                                        <MoneyDisplay amount={order.balance_due} />
                                                    </span>
                                                </td>

                                                <td className="py-3 px-4 text-right">
                                                    <Button variant="ghost" size="sm" className="gap-1 font-semibold h-7 text-xs" asChild>
                                                        <Link href={`/admin/crm-orders/${order.id}`}>
                                                            <span>Ficha</span>
                                                            <ChevronRight className="w-3.5 h-3.5" />
                                                        </Link>
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Pagination */}
                {orders?.links && orders.links.length > 3 && (
                    <div className="flex justify-center gap-1">
                        {orders.links.map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.url || '#'}
                                className={`px-3 py-1.5 rounded-md text-xs font-medium border ${
                                    link.active
                                        ? 'bg-primary text-primary-foreground border-primary'
                                        : link.url
                                        ? 'bg-background hover:bg-muted border-border'
                                        : 'opacity-40 cursor-not-allowed border-transparent'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

CrmOrdersIndex.layout = (page: any) => (
    <AppLayout breadcrumbs={[{ title: 'Pedidos', href: '/admin/crm-orders' }]}>
        {page}
    </AppLayout>
);
