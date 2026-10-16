import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { formatCrmDate } from '@/lib/utils';
import { UniverseSelector } from '@/components/crm/universe-selector';
import { UniverseBadge } from '@/components/crm/universe-badge';
import { StatusBadge } from '@/components/crm/status-badge';
import { MoneyDisplay } from '@/components/crm/money-display';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
    PackageCheck, 
    Clock, 
    AlertTriangle, 
    DollarSign, 
    Calendar, 
    TrendingUp, 
    FileText, 
    ArrowUpRight, 
    CheckCircle2, 
    PauseCircle,
    UserPlus,
    PlusCircle,
    ExternalLink
} from 'lucide-react';
import type { CrmKPIs, CrmOrder, CrmTask, Quotation, CrmActivityLog, Universe } from '@/types/crm';

interface Props {
    filters: {
        universe: Universe | 'all';
        period: string;
    };
    kpis: CrmKPIs;
    upcoming_deliveries: CrmOrder[];
    priority_tasks: CrmTask[];
    blocked_orders: CrmOrder[];
    followup_quotes: Quotation[];
    universe_financials: Record<string, {
        total_approved: number;
        total_collected: number;
        total_balance_due: number;
        total_estimated_profit: number;
        estimated_margin_percent: number;
        orders_count: number;
    }>;
    recent_activities: CrmActivityLog[];
}

export default function CrmDashboard({
    filters,
    kpis,
    upcoming_deliveries,
    priority_tasks,
    blocked_orders,
    followup_quotes,
    universe_financials,
    recent_activities,
}: Props) {
    const handlePeriodChange = (period: string) => {
        const url = new URL(window.location.href);
        url.searchParams.set('period', period);
        router.visit(url.toString(), { preserveScroll: true, preserveState: true });
    };

    return (
        <>
            <Head title="Centro de Operaciones - Eladora CRM" />

            <div className="flex flex-col gap-6 p-6 w-full">
                {/* Header & Global Universe Filter */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/50">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground tracking-tight">
                                Centro de Control Eladora
                            </h1>
                            <UniverseBadge universe={filters.universe} size="sm" />
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            Gestión integral de pedidos, cotizaciones, entregas y finanzas en tiempo real.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                        <UniverseSelector currentUniverse={filters.universe} />

                        {/* Period selector */}
                        <div className="inline-flex rounded-lg border border-border bg-muted/40 p-0.5 text-xs">
                            {[
                                { id: 'month', label: 'Mes' },
                                { id: 'quarter', label: 'Trimestre' },
                                { id: 'year', label: 'Año' },
                                { id: 'all', label: 'Histórico' },
                            ].map((p) => (
                                <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => handlePeriodChange(p.id)}
                                    className={`px-2.5 py-1 rounded-md transition-colors ${
                                        filters.period === p.id
                                            ? 'bg-background shadow-2xs font-semibold text-foreground'
                                            : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>

                        <Button size="sm" className="gap-1.5 shadow-xs" asChild>
                            <Link href="/admin/crm-orders/create">
                                <PlusCircle className="w-4 h-4" />
                                <span>Nuevo Pedido</span>
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Critical Alerts Banner (if any blocked orders or overdue tasks) */}
                {(kpis.blocked_orders > 0 || kpis.overdue_tasks > 0) && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 gap-3">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                            <div className="text-sm">
                                <span className="font-semibold">Atención requerida: </span>
                                {kpis.blocked_orders > 0 && `${kpis.blocked_orders} pedido(s) en pausa/bloqueado. `}
                                {kpis.overdue_tasks > 0 && `${kpis.overdue_tasks} tarea(s) vencida(s) de producción.`}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {kpis.blocked_orders > 0 && (
                                <Link href="/admin/crm-orders?operating_status=bloqueado">
                                    <Button size="sm" variant="outline" className="border-amber-500/40 text-xs h-7">
                                        Ver bloqueados
                                    </Button>
                                </Link>
                            )}
                            {kpis.overdue_tasks > 0 && (
                                <Link href="/admin/calendar">
                                    <Button size="sm" variant="outline" className="border-amber-500/40 text-xs h-7">
                                        Ver agenda
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                )}

                {/* Primary KPIs Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="shadow-xs hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Pedidos Activos
                            </CardTitle>
                            <PackageCheck className="h-4 w-4 text-emerald-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold font-serif">{kpis.active_orders}</div>
                            <p className="text-xs text-muted-foreground mt-0.5">En producción y entrega</p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-xs hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Entregas Próximas
                            </CardTitle>
                            <Calendar className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold font-serif">{kpis.upcoming_deliveries}</div>
                            <p className="text-xs text-muted-foreground mt-0.5">Dentro de los próximos 7 días</p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-xs hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Total Cobrado
                            </CardTitle>
                            <DollarSign className="h-4 w-4 text-emerald-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold font-serif text-emerald-700 dark:text-emerald-400">
                                <MoneyDisplay amount={kpis.total_collected} />
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">Recibido en el periodo</p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-xs hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Saldo por Cobrar
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-amber-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold font-serif text-amber-700 dark:text-amber-400">
                                <MoneyDisplay amount={kpis.balance_due} />
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">Anticipo pte: <MoneyDisplay amount={kpis.pending_advance} /></p>
                        </CardContent>
                    </Card>
                </div>

                {/* Secondary Metrics Row */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    <div className="p-3 bg-card border border-border/60 rounded-xl">
                        <div className="text-xs text-muted-foreground">Contactos Nuevos</div>
                        <div className="text-lg font-bold mt-0.5">{kpis.new_contacts}</div>
                        <Link href="/admin/opportunities" className="text-[11px] text-primary hover:underline">Ver funnel</Link>
                    </div>

                    <div className="p-3 bg-card border border-border/60 rounded-xl">
                        <div className="text-xs text-muted-foreground">Por Cotizar</div>
                        <div className="text-lg font-bold mt-0.5">{kpis.quotes_pending_prep}</div>
                        <Link href="/admin/opportunities" className="text-[11px] text-primary hover:underline">Preparar</Link>
                    </div>

                    <div className="p-3 bg-card border border-border/60 rounded-xl">
                        <div className="text-xs text-muted-foreground">Cotizaciones Enviadas</div>
                        <div className="text-lg font-bold mt-0.5">{kpis.quotes_sent}</div>
                        <Link href="/admin/quotations" className="text-[11px] text-primary hover:underline">Seguimiento</Link>
                    </div>

                    <div className="p-3 bg-card border border-border/60 rounded-xl">
                        <div className="text-xs text-muted-foreground">Aprobaciones Ptes.</div>
                        <div className="text-lg font-bold mt-0.5">{kpis.pending_approvals}</div>
                        <span className="text-[11px] text-muted-foreground">Pruebas en revisión</span>
                    </div>

                    <div className="p-3 bg-card border border-border/60 rounded-xl">
                        <div className="text-xs text-muted-foreground">Utilidad Estimada</div>
                        <div className="text-lg font-bold text-emerald-600 mt-0.5">
                            <MoneyDisplay amount={kpis.estimated_profit} />
                        </div>
                        <span className="text-[11px] text-muted-foreground">{kpis.estimated_margin_percent}% margen</span>
                    </div>

                    <div className="p-3 bg-card border border-border/60 rounded-xl">
                        <div className="text-xs text-muted-foreground">Deuda Proveedores</div>
                        <div className="text-lg font-bold text-red-600 dark:text-red-400 mt-0.5">
                            <MoneyDisplay amount={kpis.supplier_debt} />
                        </div>
                        <Link href="/admin/purchases" className="text-[11px] text-primary hover:underline">Ver compras</Link>
                    </div>
                </div>

                {/* 2-Column Core Operational Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left: Próximas Entregas & Pedidos Críticos */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <div>
                                <CardTitle className="text-base font-semibold">Próximas Entregas de Pedidos</CardTitle>
                                <CardDescription>Compromisos agendados con clientes</CardDescription>
                            </div>
                            <Link href="/admin/crm-orders">
                                <Button variant="ghost" size="sm" className="gap-1 h-7 text-xs">
                                    <span>Ver todos</span>
                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {upcoming_deliveries.length === 0 ? (
                                <div className="text-center py-8 text-sm text-muted-foreground">
                                    No hay entregas programadas en los próximos 7 días.
                                </div>
                            ) : (
                                upcoming_deliveries.map((order) => (
                                    <div
                                        key={order.id}
                                        className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors"
                                    >
                                        <div className="flex flex-col min-w-0 pr-2">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-xs font-bold text-foreground">
                                                    {order.folio}
                                                </span>
                                                <UniverseBadge universe={order.universe} size="sm" showIcon={false} />
                                            </div>
                                            <span className="font-medium text-sm truncate mt-0.5">{order.project_name}</span>
                                            <span className="text-xs text-muted-foreground truncate">{order.client?.name}</span>
                                        </div>

                                        <div className="flex flex-col items-end shrink-0 gap-1">
                                            <span className="text-xs font-semibold text-primary">
                                                {formatCrmDate(order.delivery_agreed_at)}
                                            </span>
                                            <StatusBadge type="operating" status={order.operating_status} size="sm" />
                                        </div>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    {/* Right: Tareas Prioritarias de Taller */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <div>
                                <CardTitle className="text-base font-semibold">Tareas Prioritarias & Vencidas</CardTitle>
                                <CardDescription>Actividades operativas urgentes</CardDescription>
                            </div>
                            <Link href="/admin/calendar">
                                <Button variant="ghost" size="sm" className="gap-1 h-7 text-xs">
                                    <span>Ver calendario</span>
                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {priority_tasks.length === 0 ? (
                                <div className="text-center py-8 text-sm text-muted-foreground">
                                    ¡Excelente! No tienes tareas vencidas ni urgentes en este momento.
                                </div>
                            ) : (
                                priority_tasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors"
                                    >
                                        <div className="flex flex-col min-w-0 pr-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-medium text-muted-foreground">
                                                    {task.order?.folio}
                                                </span>
                                                <StatusBadge type="priority" status={task.priority} size="sm" />
                                            </div>
                                            <span className="font-medium text-sm truncate mt-0.5">{task.title}</span>
                                            <span className="text-xs text-muted-foreground">{task.order?.client?.name}</span>
                                        </div>

                                        <div className="flex flex-col items-end shrink-0 gap-1">
                                            <span className="text-xs font-bold text-red-600 dark:text-red-400">
                                                Vence: {formatCrmDate(task.due_date)}
                                            </span>
                                            <Link href={`/admin/crm-orders/${task.order_id}`}>
                                                <Button size="sm" variant="outline" className="text-[11px] h-6 px-2">
                                                    Ir al pedido
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Financial Summary per Universe */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold">Resumen por Universo de Negocio</CardTitle>
                        <CardDescription>Rendimiento comercial y rentabilidad estimada en el periodo</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Print */}
                            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 dark:bg-emerald-950/20 dark:border-emerald-800 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between">
                                        <UniverseBadge universe="print" size="sm" />
                                        <span className="text-xs text-muted-foreground">{universe_financials.print?.orders_count || 0} pedidos</span>
                                    </div>
                                    <div className="mt-3">
                                        <div className="text-xs text-muted-foreground">Total Aprobado</div>
                                        <div className="text-xl font-bold font-serif text-emerald-900 dark:text-emerald-100">
                                            <MoneyDisplay amount={universe_financials.print?.total_approved} />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 pt-3 border-t border-emerald-200/60 dark:border-emerald-800/60 text-xs flex justify-between">
                                    <span className="text-muted-foreground">Cobrado: <MoneyDisplay amount={universe_financials.print?.total_collected} /></span>
                                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                                        Utilidad: <MoneyDisplay amount={universe_financials.print?.total_estimated_profit} />
                                    </span>
                                </div>
                            </div>

                            {/* Studio */}
                            <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/40 dark:bg-indigo-950/20 dark:border-indigo-800 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between">
                                        <UniverseBadge universe="studio" size="sm" />
                                        <span className="text-xs text-muted-foreground">{universe_financials.studio?.orders_count || 0} pedidos</span>
                                    </div>
                                    <div className="mt-3">
                                        <div className="text-xs text-muted-foreground">Total Aprobado</div>
                                        <div className="text-xl font-bold font-serif text-indigo-900 dark:text-indigo-100">
                                            <MoneyDisplay amount={universe_financials.studio?.total_approved} />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 pt-3 border-t border-indigo-200/60 dark:border-indigo-800/60 text-xs flex justify-between">
                                    <span className="text-muted-foreground">Cobrado: <MoneyDisplay amount={universe_financials.studio?.total_collected} /></span>
                                    <span className="font-semibold text-indigo-700 dark:text-indigo-400">
                                        Utilidad: <MoneyDisplay amount={universe_financials.studio?.total_estimated_profit} />
                                    </span>
                                </div>
                            </div>

                            {/* Moments */}
                            <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 dark:bg-rose-950/20 dark:border-rose-800 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between">
                                        <UniverseBadge universe="moments" size="sm" />
                                        <span className="text-xs text-muted-foreground">{universe_financials.moments?.orders_count || 0} pedidos</span>
                                    </div>
                                    <div className="mt-3">
                                        <div className="text-xs text-muted-foreground">Total Aprobado</div>
                                        <div className="text-xl font-bold font-serif text-rose-900 dark:text-rose-100">
                                            <MoneyDisplay amount={universe_financials.moments?.total_approved} />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 pt-3 border-t border-rose-200/60 dark:border-rose-800/60 text-xs flex justify-between">
                                    <span className="text-muted-foreground">Cobrado: <MoneyDisplay amount={universe_financials.moments?.total_collected} /></span>
                                    <span className="font-semibold text-rose-700 dark:text-rose-400">
                                        Utilidad: <MoneyDisplay amount={universe_financials.moments?.total_estimated_profit} />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activities & Quick Access */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Activity Feed */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-semibold">Trazabilidad y Actividad Reciente</CardTitle>
                                <CardDescription>Movimientos comerciales, operativos y financieros auditados</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {recent_activities.length === 0 ? (
                                        <div className="text-sm text-muted-foreground text-center py-6">
                                            No hay actividad registrada aún.
                                        </div>
                                    ) : (
                                        recent_activities.map((act) => (
                                            <div key={act.id} className="flex items-start gap-3 text-sm pb-2.5 border-b border-border/40 last:border-none">
                                                <div className="p-1.5 rounded-full bg-primary/10 text-primary mt-0.5">
                                                    <Clock className="w-3.5 h-3.5" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-foreground leading-snug">{act.description}</p>
                                                    <span className="text-[11px] text-muted-foreground">
                                                        {new Date(act.created_at).toLocaleString('es-MX', {
                                                            day: '2-digit',
                                                            month: 'short',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Shortcuts */}
                    <div>
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-semibold">Accesos Rápidos</CardTitle>
                                <CardDescription>Herramientas de uso frecuente</CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-2">
                                <Button variant="outline" className="w-full justify-start gap-2 text-xs" asChild>
                                    <Link href="/admin/crm-orders/create">
                                        <PlusCircle className="w-4 h-4 text-emerald-600" />
                                        <span>Registrar nuevo pedido</span>
                                    </Link>
                                </Button>
                                <Button variant="outline" className="w-full justify-start gap-2 text-xs" asChild>
                                    <Link href="/admin/clients/create">
                                        <UserPlus className="w-4 h-4 text-blue-600" />
                                        <span>Alta de nuevo cliente</span>
                                    </Link>
                                </Button>
                                <Button variant="outline" className="w-full justify-start gap-2 text-xs" asChild>
                                    <Link href="/admin/quotations/create">
                                        <FileText className="w-4 h-4 text-purple-600" />
                                        <span>Crear cotización formal</span>
                                    </Link>
                                </Button>
                                <Button variant="outline" className="w-full justify-start gap-2 text-xs" asChild>
                                    <Link href="/admin/simulations">
                                        <TrendingUp className="w-4 h-4 text-amber-600" />
                                        <span>Simulador de costos y márgenes</span>
                                    </Link>
                                </Button>
                                <Button variant="outline" className="w-full justify-start gap-2 text-xs" asChild>
                                    <Link href="/admin/calendar">
                                        <Calendar className="w-4 h-4 text-indigo-600" />
                                        <span>Agenda y entregas del taller</span>
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

CrmDashboard.layout = (page: any) => (
    <AppLayout breadcrumbs={[{ title: 'Dashboard Ejecutivo', href: '/admin' }]}>
        {page}
    </AppLayout>
);
