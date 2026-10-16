import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { UniverseBadge } from '@/components/crm/universe-badge';
import { StatusBadge } from '@/components/crm/status-badge';
import { MoneyDisplay } from '@/components/crm/money-display';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
    ArrowLeft, 
    Edit, 
    Phone, 
    Mail, 
    MessageCircle, 
    Building2, 
    FileText, 
    PlusCircle,
    Target,
    Layers
} from 'lucide-react';
import type { Client } from '@/types/crm';

interface Props {
    client: Client;
    total_paid: number;
    total_balance_due: number;
}

export default function ClientsShow({ client, total_paid = 0, total_balance_due = 0 }: Props) {
    if (!client) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] w-full p-8 text-center text-muted-foreground gap-3">
                <p>No se encontró la información del cliente o no está disponible.</p>
                <Button variant="outline" asChild>
                    <Link href="/admin/clients">Volver al Directorio</Link>
                </Button>
            </div>
        );
    }

    const orders = client.orders || [];
    const quotations = client.quotations || [];
    const payments = client.payments || [];
    const opportunities = client.opportunities || [];

    const whatsappDigits = client.whatsapp ? String(client.whatsapp).replace(/\D/g, '') : '';

    return (
        <>
            <Head title={`Ficha 360° - ${client.name || 'Cliente'} - Eladora CRM`} />

            <div className="flex flex-col gap-6 p-6 w-full">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/50">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                            <Link href="/admin/clients">
                                <ArrowLeft className="w-4 h-4" />
                            </Link>
                        </Button>
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground tracking-tight">
                                    {client.name}
                                </h1>
                                <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                                    client.status === 'active'
                                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                                        : 'bg-stone-100 text-stone-700 border-stone-200 dark:bg-stone-900 dark:text-stone-300 dark:border-stone-800'
                                }`}>
                                    {client.status === 'active' ? 'Cliente Activo' : 'Archivado'}
                                </span>
                            </div>
                            {client.business_name && (
                                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                                    <Building2 className="w-3.5 h-3.5" />
                                    <span>{client.business_name}</span>
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        <Button variant="outline" size="sm" className="gap-1.5" asChild>
                            <Link href={`/admin/clients/${client.id}/edit`}>
                                <Edit className="w-4 h-4" />
                                <span>Editar Ficha</span>
                            </Link>
                        </Button>
                        <Button size="sm" className="gap-1.5" asChild>
                            <Link href={`/admin/quotations/create?client_id=${client.id}`}>
                                <FileText className="w-4 h-4" />
                                <span>Nueva Cotización</span>
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Contact & Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Contact details */}
                    <Card className="md:col-span-2">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Canales de Comunicación
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2.5 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground flex items-center gap-1.5">
                                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                                    <span>WhatsApp:</span>
                                </span>
                                {whatsappDigits ? (
                                    <a
                                        href={`https://wa.me/${whatsappDigits}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-medium text-emerald-700 dark:text-emerald-400 hover:underline"
                                    >
                                        {String(client.whatsapp)}
                                    </a>
                                ) : (
                                    <span className="text-muted-foreground">No registrado</span>
                                )}
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground flex items-center gap-1.5">
                                    <Phone className="w-4 h-4 text-blue-600" />
                                    <span>Teléfono:</span>
                                </span>
                                <span className="font-medium">{client.phone || 'No registrado'}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground flex items-center gap-1.5">
                                    <Mail className="w-4 h-4 text-purple-600" />
                                    <span>Correo:</span>
                                </span>
                                <span className="font-medium">{client.email || 'No registrado'}</span>
                            </div>

                            <div className="flex items-center justify-between pt-1 border-t border-border/40 text-xs">
                                <span className="text-muted-foreground">Canal de procedencia:</span>
                                <span className="capitalize font-semibold">{client.channel || 'Directo'}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Financial summary for this client */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Total Cobrado
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold font-serif text-emerald-700 dark:text-emerald-400">
                                <MoneyDisplay amount={total_paid} />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {payments.length} pagos aplicados
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Saldo por Cobrar
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className={`text-2xl font-bold font-serif ${
                                (total_balance_due || 0) > 0 ? 'text-amber-700 dark:text-amber-400' : 'text-foreground'
                            }`}>
                                <MoneyDisplay amount={total_balance_due} />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                En pedidos vigentes
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Internal Notes */}
                {client.internal_notes && (
                    <Card className="bg-amber-500/5 border-amber-500/20">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                                Notas Internas y Preferencias del Cliente
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                                {client.internal_notes}
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* History Sections: Orders, Quotations, Opportunities, Payments */}
                <div className="space-y-6">
                    {/* Orders History */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <div>
                                <CardTitle className="text-base font-semibold">Pedidos Activos e Históricos</CardTitle>
                                <CardDescription>Producciones, diseño y servicios contratados ({orders.length})</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" className="h-7 text-xs gap-1" asChild>
                                <Link href="/admin/crm-orders/create">
                                    <PlusCircle className="w-3.5 h-3.5" />
                                    <span>Crear pedido</span>
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm border-t border-border/50">
                                    <thead className="bg-muted/40 text-xs font-semibold text-muted-foreground uppercase">
                                        <tr>
                                            <th className="py-2.5 px-4">Folio</th>
                                            <th className="py-2.5 px-4">Universo / Proyecto</th>
                                            <th className="py-2.5 px-4">Estado Operativo</th>
                                            <th className="py-2.5 px-4">Entrega Acordada</th>
                                            <th className="py-2.5 px-4 text-right">Aprobado</th>
                                            <th className="py-2.5 px-4 text-right">Saldo</th>
                                            <th className="py-2.5 px-4 text-right">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/40">
                                        {orders.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className="py-6 text-center text-muted-foreground">
                                                    Este cliente aún no tiene pedidos registrados.
                                                </td>
                                            </tr>
                                        ) : (
                                            orders.map((o) => (
                                                <tr key={o.id} className="hover:bg-muted/20">
                                                    <td className="py-3 px-4 font-mono font-bold text-xs">{o.folio}</td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center gap-1.5">
                                                            <UniverseBadge universe={o.universe} size="sm" showIcon={false} />
                                                            <span className="font-medium text-foreground">{o.project_name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <StatusBadge type="operating" status={o.operating_status || 'no_iniciado'} size="sm" />
                                                    </td>
                                                    <td className="py-3 px-4 text-xs font-medium text-muted-foreground">
                                                        {o.delivery_agreed_at ? String(o.delivery_agreed_at) : 'Sin fecha acordada'}
                                                    </td>
                                                    <td className="py-3 px-4 text-right font-medium">
                                                        <MoneyDisplay amount={o.approved_amount} />
                                                    </td>
                                                    <td className="py-3 px-4 text-right font-bold text-amber-600 dark:text-amber-400">
                                                        <MoneyDisplay amount={o.balance_due} />
                                                    </td>
                                                    <td className="py-3 px-4 text-right">
                                                        <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
                                                            <Link href={`/admin/crm-orders/${o.id}`}>
                                                                Ver pedido
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

                    {/* Quotations History */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <div>
                                <CardTitle className="text-base font-semibold">Cotizaciones Elaboradas</CardTitle>
                                <CardDescription>Presupuestos enviados, aceptados o en seguimiento ({quotations.length})</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" className="h-7 text-xs gap-1" asChild>
                                <Link href={`/admin/quotations/create?client_id=${client.id}`}>
                                    <PlusCircle className="w-3.5 h-3.5" />
                                    <span>Nueva cotización</span>
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm border-t border-border/50">
                                    <thead className="bg-muted/40 text-xs font-semibold text-muted-foreground uppercase">
                                        <tr>
                                            <th className="py-2.5 px-4">Folio</th>
                                            <th className="py-2.5 px-4">Proyecto</th>
                                            <th className="py-2.5 px-4">Estado</th>
                                            <th className="py-2.5 px-4">Fecha Elaboración</th>
                                            <th className="py-2.5 px-4 text-right">Total</th>
                                            <th className="py-2.5 px-4 text-right">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/40">
                                        {quotations.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="py-6 text-center text-muted-foreground">
                                                    No hay cotizaciones para este cliente.
                                                </td>
                                            </tr>
                                        ) : (
                                            quotations.map((q) => (
                                                <tr key={q.id} className="hover:bg-muted/20">
                                                    <td className="py-3 px-4 font-mono font-bold text-xs">{q.folio}</td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center gap-1.5">
                                                            <UniverseBadge universe={q.universe} size="sm" showIcon={false} />
                                                            <span className="font-medium text-foreground">{q.project_name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <span className="text-xs capitalize font-medium px-2 py-0.5 rounded-full border bg-muted">
                                                            {q.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 text-xs text-muted-foreground">
                                                        {q.creation_date ? String(q.creation_date) : '-'}
                                                    </td>
                                                    <td className="py-3 px-4 text-right font-medium">
                                                        <MoneyDisplay amount={q.total_amount} />
                                                    </td>
                                                    <td className="py-3 px-4 text-right">
                                                        <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
                                                            <Link href={`/admin/quotations/${q.id}`}>
                                                                Ver cotización
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

                    {/* Commercial Opportunities (Funnel Leads) */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <div>
                                <CardTitle className="text-base font-semibold">Oportunidades Comerciales (Funnel)</CardTitle>
                                <CardDescription>Prospectos e iniciativas comerciales registradas ({opportunities.length})</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" className="h-7 text-xs gap-1" asChild>
                                <Link href="/admin/opportunities">
                                    <PlusCircle className="w-3.5 h-3.5" />
                                    <span>Ver oportunidades</span>
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm border-t border-border/50">
                                    <thead className="bg-muted/40 text-xs font-semibold text-muted-foreground uppercase">
                                        <tr>
                                            <th className="py-2.5 px-4">Folio</th>
                                            <th className="py-2.5 px-4">Oportunidad</th>
                                            <th className="py-2.5 px-4">Etapa</th>
                                            <th className="py-2.5 px-4">Prioridad</th>
                                            <th className="py-2.5 px-4 text-right">Monto Estimado</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/40">
                                        {opportunities.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="py-6 text-center text-muted-foreground">
                                                    No hay oportunidades comerciales registradas para este cliente.
                                                </td>
                                            </tr>
                                        ) : (
                                            opportunities.map((opp) => (
                                                <tr key={opp.id} className="hover:bg-muted/20">
                                                    <td className="py-3 px-4 font-mono font-bold text-xs">{opp.folio || `#${opp.id}`}</td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center gap-1.5">
                                                            <UniverseBadge universe={opp.universe} size="sm" showIcon={false} />
                                                            <span className="font-medium text-foreground">{opp.title}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <span className="text-xs capitalize font-medium px-2 py-0.5 rounded-full border bg-muted">
                                                            {opp.stage ? opp.stage.replace(/_/g, ' ') : 'Nuevo'}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <StatusBadge type="priority" status={opp.priority || 'medium'} size="sm" />
                                                    </td>
                                                    <td className="py-3 px-4 text-right font-medium">
                                                        <MoneyDisplay amount={opp.estimated_amount} />
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Customer Payments Applied */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold">Historial de Pagos Recibidos</CardTitle>
                            <CardDescription>Anticipos, pagos parciales y liquidaciones registradas ({payments.length})</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm border-t border-border/50">
                                    <thead className="bg-muted/40 text-xs font-semibold text-muted-foreground uppercase">
                                        <tr>
                                            <th className="py-2.5 px-4">Folio Pago</th>
                                            <th className="py-2.5 px-4">Fecha</th>
                                            <th className="py-2.5 px-4">Concepto</th>
                                            <th className="py-2.5 px-4">Método</th>
                                            <th className="py-2.5 px-4">Pedido Relacionado</th>
                                            <th className="py-2.5 px-4 text-right">Monto</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/40">
                                        {payments.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="py-6 text-center text-muted-foreground">
                                                    No se han registrado pagos para este cliente aún.
                                                </td>
                                            </tr>
                                        ) : (
                                            payments.map((p) => (
                                                <tr key={p.id} className={p.is_reversal ? 'bg-red-50/40 text-red-800 dark:bg-red-950/30 dark:text-red-300' : ''}>
                                                    <td className="py-3 px-4 font-mono text-xs font-bold">{p.folio}</td>
                                                    <td className="py-3 px-4 text-xs text-muted-foreground">
                                                        {p.payment_date ? String(p.payment_date) : '-'}
                                                    </td>
                                                    <td className="py-3 px-4 capitalize text-xs font-medium">{p.concept ? String(p.concept).replace(/_/g, ' ') : '-'}</td>
                                                    <td className="py-3 px-4 capitalize text-xs">{p.payment_method ? String(p.payment_method).replace(/_/g, ' ') : '-'}</td>
                                                    <td className="py-3 px-4 text-xs font-medium">
                                                        {p.order ? (
                                                            <Link href={`/admin/crm-orders/${p.order_id}`} className="text-primary hover:underline font-mono">
                                                                {p.order.folio || `Pedido #${p.order_id}`} {p.order.project_name ? `- ${p.order.project_name}` : ''}
                                                            </Link>
                                                        ) : (
                                                            <span className="text-muted-foreground">-</span>
                                                        )}
                                                    </td>
                                                    <td className="py-3 px-4 text-right font-bold text-emerald-700 dark:text-emerald-400">
                                                        <MoneyDisplay amount={p.amount} showSign={Boolean(p.is_reversal)} />
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

ClientsShow.layout = (page: any) => {
    const client = page?.props?.client;
    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Clientes', href: '/admin/clients' },
                { title: client?.name || 'Ficha de Cliente', href: client?.id ? `/admin/clients/${client.id}` : '/admin/clients' },
            ]}
        >
            {page}
        </AppLayout>
    );
};
