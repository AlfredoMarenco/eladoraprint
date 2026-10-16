import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { formatCrmDate } from '@/lib/utils';
import { UniverseSelector } from '@/components/crm/universe-selector';
import { UniverseBadge } from '@/components/crm/universe-badge';
import { MoneyDisplay } from '@/components/crm/money-display';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
    PlusCircle, 
    Search
} from 'lucide-react';
import type { Quotation, Universe } from '@/types/crm';

interface Props {
    quotations?: {
        data: Quotation[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
        total: number;
    };
    filters?: {
        universe?: Universe | 'all';
        status?: string;
        search?: string;
    };
}

export default function QuotationsIndex({ quotations, filters = {} }: Props) {
    const currentUniverse = filters.universe || 'all';
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/quotations', { ...filters, search }, { preserveState: true });
    };

    const handleFilterStatus = (status: string) => {
        router.get('/admin/quotations', { ...filters, status }, { preserveState: true });
    };

    const statusBadges: Record<string, { label: string; classes: string }> = {
        draft: { label: 'Borrador', classes: 'bg-stone-100 text-stone-700 border-stone-200' },
        preparing: { label: 'En Preparación', classes: 'bg-blue-50 text-blue-700 border-blue-200' },
        sent: { label: 'Enviada', classes: 'bg-amber-50 text-amber-800 border-amber-200' },
        in_followup: { label: 'En Seguimiento', classes: 'bg-purple-50 text-purple-700 border-purple-200' },
        accepted: { label: 'Aceptada', classes: 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold' },
        rejected: { label: 'Rechazada', classes: 'bg-red-50 text-red-700 border-red-200' },
        expired: { label: 'Vencida', classes: 'bg-stone-200 text-stone-600 border-stone-300' },
        cancelled: { label: 'Cancelada', classes: 'bg-stone-100 text-stone-500 border-stone-200' },
    };

    const quotationList = quotations?.data || [];
    const totalQuotations = quotations?.total ?? quotationList.length;

    return (
        <>
            <Head title="Cotizaciones - Eladora CRM" />

            <div className="flex flex-col gap-6 p-6 w-full">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/50">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground tracking-tight">
                                Registro de Cotizaciones
                            </h1>
                            <UniverseBadge universe={currentUniverse} size="sm" />
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            Presupuestos detallados, versionado histórico y conversión directa a pedidos.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                        <UniverseSelector currentUniverse={currentUniverse} />
                        <Button className="gap-2 shadow-xs" asChild>
                            <Link href="/admin/quotations/create">
                                <PlusCircle className="w-4 h-4" />
                                <span>Nueva Cotización</span>
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border/60">
                    <form onSubmit={handleSearch} className="relative w-full sm:w-80">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Buscar folio, cliente, proyecto..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 h-9 text-xs"
                        />
                    </form>

                    <div className="flex items-center gap-1.5 flex-wrap">
                        {[
                            { id: '', label: 'Todas' },
                            { id: 'draft', label: 'Borradores' },
                            { id: 'sent', label: 'Enviadas' },
                            { id: 'accepted', label: 'Aceptadas' },
                        ].map((st) => (
                            <button
                                key={st.id}
                                type="button"
                                onClick={() => handleFilterStatus(st.id)}
                                className={`px-2.5 py-1 rounded-md text-xs transition-colors border ${
                                    (filters.status || '') === st.id
                                        ? 'bg-foreground text-background font-semibold border-foreground'
                                        : 'bg-muted/40 text-muted-foreground hover:text-foreground border-border'
                                }`}
                            >
                                {st.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold">Listado de Presupuestos</CardTitle>
                        <CardDescription>{totalQuotations} cotizaciones registradas</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm border-t border-border/50">
                                <thead className="bg-muted/40 text-xs font-semibold text-muted-foreground uppercase">
                                    <tr>
                                        <th className="py-2.5 px-4">Folio</th>
                                        <th className="py-2.5 px-4">Universo / Proyecto</th>
                                        <th className="py-2.5 px-4">Cliente</th>
                                        <th className="py-2.5 px-4">Estado</th>
                                        <th className="py-2.5 px-4">Vencimiento</th>
                                        <th className="py-2.5 px-4 text-right">Importe Total</th>
                                        <th className="py-2.5 px-4 text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/40">
                                    {quotationList.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="py-8 text-center text-muted-foreground">
                                                No se encontraron cotizaciones con los criterios seleccionados.
                                            </td>
                                        </tr>
                                    ) : (
                                        quotationList.map((q) => {
                                            const badge = statusBadges[q.status || 'draft'] ?? { label: q.status || 'Borrador', classes: 'bg-stone-100 text-stone-700' };
                                            return (
                                                <tr key={q.id} className="hover:bg-muted/20">
                                                    <td className="py-3 px-4 font-mono font-bold text-xs">{q.folio}</td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center gap-1.5">
                                                            <UniverseBadge universe={q.universe} size="sm" showIcon={false} />
                                                            <Link href={`/admin/quotations/${q.id}`} className="font-semibold text-foreground hover:underline">
                                                                {q.project_name}
                                                            </Link>
                                                        </div>
                                                        {q.converted_order && (
                                                            <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium mt-0.5">
                                                                Convertido a pedido: {q.converted_order.folio}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="py-3 px-4 text-xs font-medium">
                                                        {q.client?.name || 'Cliente no asignado'}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <span className={`text-xs px-2.5 py-0.5 rounded-full border ${badge.classes}`}>
                                                            {badge.label}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 text-xs text-muted-foreground">
                                                        {formatCrmDate(q.expiration_date) || 'Sin vencimiento'}
                                                    </td>
                                                    <td className="py-3 px-4 text-right font-bold text-foreground">
                                                        <MoneyDisplay amount={q.total_amount} />
                                                    </td>
                                                    <td className="py-3 px-4 text-right">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
                                                                <Link href={`/admin/quotations/${q.id}`}>
                                                                    Ver detalle
                                                                </Link>
                                                            </Button>
                                                            {q.status === 'accepted' && !q.converted_to_order_id && (
                                                                <Button
                                                                    size="sm"
                                                                    className="bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] h-6 px-2"
                                                                    onClick={() => router.post(`/admin/quotations/${q.id}/convert-to-order`)}
                                                                >
                                                                    Convertir a Pedido
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Pagination */}
                {quotations?.links && quotations.links.length > 3 && (
                    <div className="flex justify-center gap-1">
                        {quotations.links.map((link, idx) => (
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

QuotationsIndex.layout = (page: any) => (
    <AppLayout breadcrumbs={[{ title: 'Cotizaciones', href: '/admin/quotations' }]}>
        {page}
    </AppLayout>
);
