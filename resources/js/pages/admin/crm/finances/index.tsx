import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MoneyDisplay } from '@/components/crm/money-display';
import { UniverseBadge } from '@/components/crm/universe-badge';
import { StatusBadge } from '@/components/crm/status-badge';
import { 
    DollarSign, 
    TrendingUp, 
    ArrowUpRight, 
    ArrowDownRight, 
    Wallet, 
    CreditCard, 
    Clock, 
    ShoppingBag, 
    Percent, 
    Calendar,
    ChevronRight,
    AlertCircle,
    CheckCircle2,
    RotateCcw
} from 'lucide-react';
import type { CrmOrder, CrmCustomerPayment, Universe } from '@/types/crm';

interface FinancialSummary {
    total_approved: number;
    total_collected: number;
    balance_due: number;
    pending_advance: number;
    supplier_debt: number;
    estimated_costs: number;
    real_costs: number;
    estimated_profit: number;
    estimated_margin_percent: number;
}

interface Props {
    summary: FinancialSummary;
    universe_summaries: {
        print: FinancialSummary;
        studio: FinancialSummary;
        moments: FinancialSummary;
    };
    recent_payments: CrmCustomerPayment[];
    orders_with_balance: CrmOrder[];
    filters: {
        universe: string;
        start_date: string;
        end_date: string;
    };
}

export default function FinancesIndex({
    summary,
    universe_summaries,
    recent_payments,
    orders_with_balance,
    filters,
}: Props) {
    const [startDate, setStartDate] = useState(filters.start_date || '');
    const [endDate, setEndDate] = useState(filters.end_date || '');

    const handleFilterDate = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/finances', { ...filters, start_date: startDate, end_date: endDate }, { preserveState: true });
    };

    const handleUniverseFilter = (u: string) => {
        router.get('/admin/finances', { ...filters, universe: u }, { preserveState: true });
    };

    return (
        <>
            <Head title="Control Financiero y Rentabilidad - Eladora CRM" />

            <div className="flex flex-col gap-6 p-6 w-full">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/50">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground tracking-tight">
                            Centro de Control Financiero
                        </h1>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            Seguimiento de ingresos contratados, dinero cobrado, saldos por cobrar, costos de taller y rentabilidad real.
                        </p>
                    </div>

                    {/* Date range filter form */}
                    <form onSubmit={handleFilterDate} className="flex items-center gap-2">
                        <Input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="h-9 text-xs w-36"
                        />
                        <span className="text-xs text-muted-foreground">a</span>
                        <Input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="h-9 text-xs w-36"
                        />
                        <Button type="submit" size="sm" variant="outline" className="h-9 text-xs">
                            Filtrar
                        </Button>
                    </form>
                </div>

                {/* Universe Filter Tabs */}
                <div className="flex items-center gap-2">
                    {[
                        { label: 'Todos los Universos', value: 'all' },
                        { label: 'Eladora Print', value: 'print' },
                        { label: 'Eladora Studio', value: 'studio' },
                        { label: 'Eladora Moments', value: 'moments' },
                    ].map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => handleUniverseFilter(tab.value)}
                            className={`px-3 py-1.5 text-xs rounded-xl font-medium transition-all ${
                                filters.universe === tab.value
                                    ? 'bg-foreground text-background shadow-xs font-semibold'
                                    : 'bg-card border border-border/60 text-muted-foreground hover:bg-muted'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Key Financial KPIs - Row 1 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="bg-card border-border/60 shadow-xs">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Aprobado</p>
                                <div className="mt-1">
                                    <MoneyDisplay amount={summary.total_approved} size="lg" className="font-bold text-foreground" />
                                </div>
                                <p className="text-[11px] text-muted-foreground mt-0.5">Venta total contratada</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <DollarSign className="w-5 h-5" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card border-border/60 shadow-xs">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Cobrado (Efectivo)</p>
                                <div className="mt-1">
                                    <MoneyDisplay amount={summary.total_collected} size="lg" className="font-bold text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 mt-0.5">Dinero en banco / caja</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                <Wallet className="w-5 h-5" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card border-border/60 shadow-xs">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Saldos por Cobrar</p>
                                <div className="mt-1">
                                    <MoneyDisplay amount={summary.balance_due} size="lg" className="font-bold text-amber-600 dark:text-amber-400" />
                                </div>
                                <p className="text-[11px] text-muted-foreground mt-0.5">
                                    {summary.pending_advance > 0 && (
                                        <span className="text-rose-500 block">Anticipos pendientes: ${summary.pending_advance.toFixed(2)}</span>
                                    )}
                                    Pendiente de clientes
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
                                <Clock className="w-5 h-5" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card border-border/60 shadow-xs">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Deuda a Proveedores</p>
                                <div className="mt-1">
                                    <MoneyDisplay amount={summary.supplier_debt} size="lg" className="font-bold text-rose-600 dark:text-rose-400" />
                                </div>
                                <p className="text-[11px] text-muted-foreground mt-0.5">Compras y maquilas pendientes</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-600 dark:text-rose-400">
                                <ShoppingBag className="w-5 h-5" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Profit & Margin Card */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-card border-border/60 shadow-xs p-5 md:col-span-2">
                        <div className="flex items-center justify-between pb-3 border-b border-border/40">
                            <div>
                                <h3 className="font-serif font-bold text-foreground text-base">Utilidad y Rentabilidad Estimada</h3>
                                <p className="text-xs text-muted-foreground">
                                    Ventas Aprobadas menos Costos de Taller, Insumos y Servicios Externos.
                                </p>
                            </div>
                            <div className="text-right">
                                <span className="text-xs text-muted-foreground block">Margen Promedio</span>
                                <span className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                                    {summary.estimated_margin_percent}%
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mt-4 text-center">
                            <div className="bg-muted/30 p-3 rounded-xl">
                                <span className="text-[11px] text-muted-foreground block">Costos Estimados</span>
                                <MoneyDisplay amount={summary.estimated_costs} size="md" className="font-semibold text-foreground mt-1" />
                            </div>
                            <div className="bg-muted/30 p-3 rounded-xl">
                                <span className="text-[11px] text-muted-foreground block">Costos Reales Registrados</span>
                                <MoneyDisplay amount={summary.real_costs} size="md" className="font-semibold text-foreground mt-1" />
                            </div>
                            <div className="bg-emerald-500/10 p-3 rounded-xl">
                                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block font-medium">Utilidad Estimada</span>
                                <MoneyDisplay amount={summary.estimated_profit} size="md" className="font-bold text-emerald-600 dark:text-emerald-400 mt-1" />
                            </div>
                        </div>

                        <div className="mt-3 p-2.5 rounded-lg bg-muted/20 border border-border/30 text-[11px] text-muted-foreground flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-primary shrink-0" />
                            <span>
                                <strong>Regla de negocio:</strong> El saldo por cobrar NO es dinero disponible, y los anticipos cobrados NO son utilidad líquida hasta descontar insumos y servicios de producción.
                            </span>
                        </div>
                    </Card>

                    {/* Breakdown by Universe */}
                    <Card className="bg-card border-border/60 shadow-xs p-5">
                        <h3 className="font-serif font-bold text-foreground text-base pb-3 border-b border-border/40">
                            Rentabilidad por Universo
                        </h3>
                        <div className="mt-4 space-y-3.5">
                            {(['print', 'studio', 'moments'] as Universe[]).map((u) => {
                                const us = universe_summaries[u];
                                return (
                                    <div key={u} className="flex items-center justify-between text-xs pb-2 border-b border-border/20 last:border-0 last:pb-0">
                                        <div className="flex items-center gap-2">
                                            <UniverseBadge universe={u} size="sm" />
                                        </div>
                                        <div className="text-right">
                                            <MoneyDisplay amount={us.total_collected} size="sm" className="font-semibold text-foreground block" />
                                            <span className="text-[10px] text-muted-foreground">
                                                Margen: <strong className="text-emerald-600">{us.estimated_margin_percent}%</strong>
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                </div>

                {/* Two Columns: Recent Payments & Orders with Pending Balances */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Payments Received */}
                    <Card className="bg-card border-border/60 shadow-xs">
                        <CardHeader className="p-4 pb-2 border-b border-border/40 flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-base font-serif font-bold">Cobros Recientes de Clientes</CardTitle>
                                <CardDescription className="text-xs">
                                    Anticipos, abonos y liquidaciones bancarias registradas.
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-border/30">
                                {recent_payments.length === 0 ? (
                                    <div className="p-6 text-center text-xs text-muted-foreground">
                                        No hay cobros registrados en el periodo seleccionado.
                                    </div>
                                ) : (
                                    recent_payments.map((p) => (
                                        <div key={p.id} className="p-3.5 flex items-center justify-between hover:bg-muted/20 transition-colors">
                                            <div className="flex items-start gap-2.5">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${p.is_reversal ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'}`}>
                                                    {p.is_reversal ? <RotateCcw className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-semibold text-foreground">{p.client?.name}</span>
                                                        <Badge variant="outline" className="text-[10px] capitalize">
                                                            {p.concept.replace('_', ' ')}
                                                        </Badge>
                                                        {p.is_reversal && (
                                                            <Badge variant="destructive" className="text-[10px]">
                                                                Reversión
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-[11px] text-muted-foreground mt-0.5">
                                                        Pedido: <span className="font-mono text-foreground">{p.order?.folio}</span> • {p.payment_date} ({p.payment_method})
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <span className={`text-xs font-mono font-bold ${p.is_reversal ? 'text-rose-500' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                                    {p.is_reversal ? '-' : '+'}${Number(p.amount).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pending Balances / Cobranza */}
                    <Card className="bg-card border-border/60 shadow-xs">
                        <CardHeader className="p-4 pb-2 border-b border-border/40 flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-base font-serif font-bold">Seguimiento de Cobranza</CardTitle>
                                <CardDescription className="text-xs">
                                    Pedidos activos con saldos o anticipos pendientes por liquidar.
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-border/30">
                                {orders_with_balance.length === 0 ? (
                                    <div className="p-6 text-center text-xs text-muted-foreground">
                                        ¡Excelente! Todos los pedidos están 100% liquidados o al corriente.
                                    </div>
                                ) : (
                                    orders_with_balance.map((o) => (
                                        <div key={o.id} className="p-3.5 flex items-center justify-between hover:bg-muted/20 transition-colors">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <Link 
                                                        href={`/admin/crm-orders/${o.id}`}
                                                        className="text-xs font-mono font-bold text-primary hover:underline"
                                                    >
                                                        {o.folio}
                                                    </Link>
                                                    <span className="text-xs font-medium text-foreground">{o.client?.name}</span>
                                                    <UniverseBadge universe={o.universe} size="sm" />
                                                </div>
                                                <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                                                    {o.project_name}
                                                </p>
                                            </div>

                                            <div className="text-right">
                                                <MoneyDisplay amount={o.balance_due} size="sm" className="font-bold text-amber-600 block" />
                                                <span className="text-[10px] text-muted-foreground">
                                                    de ${Number(o.approved_amount).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

FinancesIndex.layout = (page: any) => (
    <AppLayout breadcrumbs={[{ title: 'Finanzas y Rentabilidad', href: '/admin/finances' }]}>
        {page}
    </AppLayout>
);
