import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MoneyDisplay } from '@/components/crm/money-display';
import { UniverseBadge } from '@/components/crm/universe-badge';
import { StatusBadge } from '@/components/crm/status-badge';
import { 
    BarChart3, 
    Download, 
    Calendar, 
    TrendingUp, 
    CheckCircle2, 
    Clock, 
    AlertTriangle, 
    Filter, 
    FileSpreadsheet,
    Users,
    FileText,
    ShoppingBag,
    DollarSign
} from 'lucide-react';
import type { Universe } from '@/types/crm';

interface Props {
    orders_by_universe: {
        print: number;
        studio: number;
        moments: number;
    };
    orders_by_status: Record<string, number>;
    punctuality: {
        total_delivered: number;
        on_time: number;
        late: number;
        rate: number;
    };
    funnel: {
        leads: number;
        quotes: number;
        accepted_quotes: number;
        converted_orders: number;
        conversion_rate: number;
    };
    financial_summary: {
        total_approved: number;
        total_collected: number;
        balance_due: number;
        pending_advance: number;
        supplier_debt: number;
        estimated_costs: number;
        real_costs: number;
        estimated_profit: number;
        estimated_margin_percent: number;
    };
    filters: {
        start_date: string;
        end_date: string;
    };
}

export default function ReportsIndex({
    orders_by_universe,
    orders_by_status,
    punctuality,
    funnel,
    financial_summary,
    filters,
}: Props) {
    const [startDate, setStartDate] = useState(filters.start_date || '');
    const [endDate, setEndDate] = useState(filters.end_date || '');

    const handleFilterDate = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/reports', { start_date: startDate, end_date: endDate }, { preserveState: true });
    };

    const totalOrdersUniverse = orders_by_universe.print + orders_by_universe.studio + orders_by_universe.moments;

    return (
        <>
            <Head title="Reportes y Rendimiento - Eladora CRM" />

            <div className="flex flex-col gap-6 p-6 w-full">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/50">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground tracking-tight">
                            Reportes y Rendimiento Operativo
                        </h1>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            Métricas consolidadas de conversión comercial, puntualidad de entrega y volumen por universo.
                        </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <form onSubmit={handleFilterDate} className="flex items-center gap-1.5">
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

                        <a href="/admin/reports/export-orders-csv" download>
                            <Button className="gap-2 h-9 text-xs shadow-xs">
                                <FileSpreadsheet className="w-4 h-4" />
                                <span>Exportar Pedidos CSV</span>
                            </Button>
                        </a>
                    </div>
                </div>

                {/* Funnel & Conversion Rates */}
                <Card className="bg-card border-border/60 shadow-xs p-5">
                    <div className="flex items-center justify-between pb-3 border-b border-border/40">
                        <div>
                            <h2 className="font-serif font-bold text-foreground text-base">Embudo de Conversión Comercial</h2>
                            <p className="text-xs text-muted-foreground">
                                Recorrido de prospectos desde el contacto inicial hasta el pedido en producción.
                            </p>
                        </div>
                        <Badge variant="outline" className="text-xs font-semibold text-emerald-600 border-emerald-500/30">
                            Tasa de Cierre: {funnel.conversion_rate}%
                        </Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-4">
                        <div className="bg-muted/30 p-4 rounded-xl text-center">
                            <Users className="w-5 h-5 mx-auto text-muted-foreground mb-1" />
                            <span className="text-2xl font-bold font-mono text-foreground block">{funnel.leads}</span>
                            <span className="text-xs font-medium text-muted-foreground">Oportunidades</span>
                            <span className="text-[10px] text-muted-foreground block mt-0.5">Prospectos ingresados</span>
                        </div>

                        <div className="bg-muted/30 p-4 rounded-xl text-center">
                            <FileText className="w-5 h-5 mx-auto text-muted-foreground mb-1" />
                            <span className="text-2xl font-bold font-mono text-foreground block">{funnel.quotes}</span>
                            <span className="text-xs font-medium text-muted-foreground">Cotizaciones</span>
                            <span className="text-[10px] text-muted-foreground block mt-0.5">Propuestas preparadas</span>
                        </div>

                        <div className="bg-emerald-500/10 p-4 rounded-xl text-center">
                            <CheckCircle2 className="w-5 h-5 mx-auto text-emerald-600 mb-1" />
                            <span className="text-2xl font-bold font-mono text-emerald-600 block">{funnel.accepted_quotes}</span>
                            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">Aceptadas</span>
                            <span className="text-[10px] text-muted-foreground block mt-0.5">Aprobadas por cliente</span>
                        </div>

                        <div className="bg-primary/10 p-4 rounded-xl text-center">
                            <ShoppingBag className="w-5 h-5 mx-auto text-primary mb-1" />
                            <span className="text-2xl font-bold font-mono text-primary block">{funnel.converted_orders}</span>
                            <span className="text-xs font-medium text-primary">Pedidos Generados</span>
                            <span className="text-[10px] text-muted-foreground block mt-0.5">En producción real</span>
                        </div>
                    </div>
                </Card>

                {/* Operations & Volume: Universe + Punctuality */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Volume by Universe */}
                    <Card className="bg-card border-border/60 shadow-xs p-5">
                        <h3 className="font-serif font-bold text-foreground text-base pb-3 border-b border-border/40">
                            Volumen por Universo de Negocio
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                            Distribución de pedidos contratados en el periodo ({totalOrdersUniverse} total).
                        </p>

                        <div className="mt-4 space-y-4">
                            {(['print', 'studio', 'moments'] as Universe[]).map((u) => {
                                const count = orders_by_universe[u];
                                const percent = totalOrdersUniverse > 0 ? ((count / totalOrdersUniverse) * 100).toFixed(0) : 0;
                                return (
                                    <div key={u} className="space-y-1.5">
                                        <div className="flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-2">
                                                <UniverseBadge universe={u} size="sm" />
                                            </div>
                                            <span className="font-mono font-semibold text-foreground">
                                                {count} pedidos ({percent}%)
                                            </span>
                                        </div>
                                        <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                                            <div
                                                className={`h-full ${u === 'print' ? 'bg-amber-600' : u === 'studio' ? 'bg-purple-600' : 'bg-emerald-600'}`}
                                                style={{ width: `${percent}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>

                    {/* Delivery Punctuality */}
                    <Card className="bg-card border-border/60 shadow-xs p-5">
                        <h3 className="font-serif font-bold text-foreground text-base pb-3 border-b border-border/40 flex items-center justify-between">
                            <span>Puntualidad en Entregas</span>
                            <Badge variant="outline" className={`text-xs ${punctuality.rate >= 90 ? 'text-emerald-600 border-emerald-500/30' : 'text-amber-600 border-amber-500/30'}`}>
                                {punctuality.rate}% a tiempo
                            </Badge>
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                            Evaluación contra la fecha acordada con el cliente ({punctuality.total_delivered} pedidos entregados).
                        </p>

                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <div className="bg-emerald-500/10 p-4 rounded-xl text-center">
                                <CheckCircle2 className="w-6 h-6 mx-auto text-emerald-600 mb-1" />
                                <span className="text-3xl font-bold font-mono text-emerald-600">{punctuality.on_time}</span>
                                <span className="text-xs text-emerald-700 dark:text-emerald-300 block font-medium mt-1">Entregados a Tiempo</span>
                            </div>

                            <div className="bg-rose-500/10 p-4 rounded-xl text-center">
                                <Clock className="w-6 h-6 mx-auto text-rose-500 mb-1" />
                                <span className="text-3xl font-bold font-mono text-rose-500">{punctuality.late}</span>
                                <span className="text-xs text-rose-700 dark:text-rose-300 block font-medium mt-1">Entregas con Retraso</span>
                            </div>
                        </div>

                        <div className="mt-4 p-2.5 rounded-lg bg-muted/20 border border-border/30 text-[11px] text-muted-foreground flex items-center gap-2">
                            <Clock className="w-4 h-4 text-primary shrink-0" />
                            <span>
                                La puntualidad es un factor clave en la reputación de Eladora frente a novias, agencias y empresas.
                            </span>
                        </div>
                    </Card>
                </div>

                {/* Orders by Operating Status */}
                <Card className="bg-card border-border/60 shadow-xs p-5">
                    <h3 className="font-serif font-bold text-foreground text-base pb-3 border-b border-border/40">
                        Estado Actual de la Operación en Taller
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 mt-4">
                        {Object.entries(orders_by_status).map(([status, count]) => (
                            <div key={status} className="bg-muted/30 p-3 rounded-xl text-center">
                                <StatusBadge status={status} type="operational" />
                                <span className="text-xl font-bold font-mono text-foreground block mt-2">{count}</span>
                                <span className="text-[10px] text-muted-foreground">pedidos</span>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Formulas & Definitions Footer */}
                <Card className="bg-muted/10 border-border/40 p-4 text-xs text-muted-foreground space-y-1.5">
                    <p className="font-semibold text-foreground">Definiciones y Reglas de Cálculo del Reporte:</p>
                    <p>• <strong>Total Aprobado:</strong> suma del precio de venta aprobado en pedidos activos (no cancelados).</p>
                    <p>• <strong>Total Cobrado:</strong> dinero recibido efectivamente mediante depósitos, transferencias o efectivo registrado (descontando reversiones).</p>
                    <p>• <strong>Puntualidad:</strong> porcentaje de pedidos entregados en o antes de la fecha límite acordada con el cliente.</p>
                    <p>• <strong>Tasa de Cierre:</strong> cotizaciones aprobadas divididas entre el total de cotizaciones emitidas en el periodo.</p>
                </Card>
            </div>
        </>
    );
}

ReportsIndex.layout = (page: any) => (
    <AppLayout breadcrumbs={[{ title: 'Reportes y Análisis', href: '/admin/reports' }]}>
        {page}
    </AppLayout>
);
