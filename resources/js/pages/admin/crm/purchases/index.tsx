import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { MoneyDisplay } from '@/components/crm/money-display';
import { StatusBadge } from '@/components/crm/status-badge';
import { 
    ShoppingBag, 
    Plus, 
    Search, 
    Filter, 
    Calendar, 
    DollarSign, 
    Building2, 
    CheckCircle2, 
    AlertCircle, 
    Clock, 
    CreditCard,
    FileText,
    ExternalLink
} from 'lucide-react';
import type { CrmPurchase, CrmSupplier, CrmOrder } from '@/types/crm';

interface Props {
    purchases: {
        data: CrmPurchase[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
        total: number;
    };
    suppliers: Array<{ id: number; name: string }>;
    orders: Array<{ id: number; folio: string; project_name: string }>;
    filters: {
        status?: string;
        supplier_id?: string;
        search?: string;
    };
}

export default function PurchasesIndex({ purchases, suppliers, orders, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [showNewModal, setShowNewModal] = useState(false);
    const [selectedPurchaseForPayment, setSelectedPurchaseForPayment] = useState<CrmPurchase | null>(null);

    // Form for new purchase
    const newPurchaseForm = useForm({
        supplier_id: '',
        order_id: '',
        concept: '',
        category: 'materiales',
        estimated_amount: '',
        real_amount: '',
        requested_date: new Date().toISOString().split('T')[0],
        expected_delivery_date: '',
        payment_due_date: '',
        purchase_status: 'solicitada',
        receipt_notes: '',
    });

    // Form for recording payment to supplier
    const paymentForm = useForm({
        amount: '',
        payment_date: new Date().toISOString().split('T')[0],
        payment_method: 'transferencia',
        reference: '',
        notes: '',
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/purchases', { ...filters, search }, { preserveState: true });
    };

    const handleFilterStatus = (status: string) => {
        router.get('/admin/purchases', { ...filters, status: status === 'all' ? undefined : status }, { preserveState: true });
    };

    const handleCreatePurchase = (e: React.FormEvent) => {
        e.preventDefault();
        newPurchaseForm.post('/admin/purchases', {
            onSuccess: () => {
                setShowNewModal(false);
                newPurchaseForm.reset();
            },
        });
    };

    const handleRegisterPayment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPurchaseForPayment) return;

        paymentForm.post(`/admin/purchases/${selectedPurchaseForPayment.id}/payments`, {
            onSuccess: () => {
                setSelectedPurchaseForPayment(null);
                paymentForm.reset();
            },
        });
    };

    // Calculate quick stats from visible data
    const totalCommitted = purchases.data.reduce((sum, p) => sum + Number(p.effective_cost ?? p.estimated_amount ?? 0), 0);
    const totalPaid = purchases.data.reduce((sum, p) => sum + Number(p.paid_amount ?? 0), 0);
    const totalPending = totalCommitted - totalPaid;

    return (
        <>
            <Head title="Compras y Gastos Externos - Eladora CRM" />

            <div className="flex flex-col gap-6 p-6 w-full">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/50">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground tracking-tight">
                            Compras y Compromisos con Proveedores
                        </h1>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            Control de materiales, maquilas, servicios externos y pagos pendientes sin confundir costo con desembolso.
                        </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <Link href="/admin/suppliers">
                            <Button variant="outline" className="gap-2">
                                <Building2 className="w-4 h-4" />
                                <span>Ver Proveedores</span>
                            </Button>
                        </Link>
                        <Button onClick={() => setShowNewModal(true)} className="gap-2">
                            <Plus className="w-4 h-4" />
                            <span>Registrar Compra</span>
                        </Button>
                    </div>
                </div>

                {/* Quick Financial Summary of Purchases */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card className="bg-card border-border/60">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Costo Comprometido</p>
                                <div className="mt-1">
                                    <MoneyDisplay amount={totalCommitted} size="lg" className="font-bold text-foreground" />
                                </div>
                                <p className="text-[11px] text-muted-foreground mt-0.5">Partidas registradas en este listado</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <ShoppingBag className="w-5 h-5" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card border-border/60">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Pagado</p>
                                <div className="mt-1">
                                    <MoneyDisplay amount={totalPaid} size="lg" className="font-bold text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <p className="text-[11px] text-muted-foreground mt-0.5">Desembolsos confirmados</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 className="w-5 h-5" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card border-border/60">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Cuentas por Pagar</p>
                                <div className="mt-1">
                                    <MoneyDisplay amount={Math.max(0, totalPending)} size="lg" className="font-bold text-amber-600 dark:text-amber-400" />
                                </div>
                                <p className="text-[11px] text-muted-foreground mt-0.5">Saldos pendientes a proveedores</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
                                <Clock className="w-5 h-5" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border/60">
                    <form onSubmit={handleSearch} className="relative w-full sm:w-80">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por folio, concepto o proveedor..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 h-9 text-xs"
                        />
                    </form>

                    {/* Status Tabs */}
                    <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                        {[
                            { label: 'Todas', value: 'all' },
                            { label: 'Solicitadas', value: 'solicitada' },
                            { label: 'Confirmadas', value: 'confirmada' },
                            { label: 'Por Recibir', value: 'pendiente_recepcion' },
                            { label: 'Recibidas', value: 'recibida' },
                        ].map((tab) => (
                            <button
                                key={tab.value}
                                onClick={() => handleFilterStatus(tab.value)}
                                className={`px-2.5 py-1 text-xs rounded-lg transition-colors font-medium whitespace-nowrap ${
                                    (filters.status === tab.value || (!filters.status && tab.value === 'all'))
                                        ? 'bg-primary text-primary-foreground shadow-xs'
                                        : 'text-muted-foreground hover:bg-muted'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Purchases Table */}
                <div className="bg-card rounded-xl border border-border/60 overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr className="border-b border-border/60 bg-muted/40 font-medium text-muted-foreground">
                                    <th className="py-3 px-4">Folio / Fecha</th>
                                    <th className="py-3 px-4">Proveedor</th>
                                    <th className="py-3 px-4">Concepto / Categoría</th>
                                    <th className="py-3 px-4">Pedido Relacionado</th>
                                    <th className="py-3 px-4">Estado Compra</th>
                                    <th className="py-3 px-4 text-right">Importe</th>
                                    <th className="py-3 px-4 text-right">Pagado</th>
                                    <th className="py-3 px-4 text-right">Saldo</th>
                                    <th className="py-3 px-4 text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40">
                                {purchases.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="py-12 text-center text-muted-foreground">
                                            <ShoppingBag className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
                                            <p className="font-medium text-foreground">No se encontraron compras ni gastos externos</p>
                                            <p className="text-[11px] mt-1">Registra una compra para vincular insumos o maquilas a un pedido.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    purchases.data.map((p) => {
                                        const effective = Number(p.real_amount ?? p.estimated_amount ?? 0);
                                        const paid = Number(p.paid_amount ?? 0);
                                        const pending = Math.max(0, effective - paid);

                                        return (
                                            <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                                                <td className="py-3 px-4">
                                                    <span className="font-mono font-semibold text-foreground block">{p.folio}</span>
                                                    <span className="text-[11px] text-muted-foreground">{p.requested_date}</span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className="font-medium text-foreground block">{p.supplier?.name}</span>
                                                    <span className="text-[11px] text-muted-foreground">{p.supplier?.category}</span>
                                                </td>
                                                <td className="py-3 px-4 max-w-[200px]">
                                                    <span className="font-medium text-foreground line-clamp-1">{p.concept}</span>
                                                    <Badge variant="outline" className="text-[10px] mt-0.5 capitalize">
                                                        {p.category}
                                                    </Badge>
                                                </td>
                                                <td className="py-3 px-4">
                                                    {p.order ? (
                                                        <Link 
                                                            href={`/admin/crm-orders/${p.order.id}`}
                                                            className="text-primary hover:underline font-mono text-[11px] flex items-center gap-1"
                                                        >
                                                            <span>{p.order.folio}</span>
                                                            <ExternalLink className="w-3 h-3" />
                                                        </Link>
                                                    ) : (
                                                        <span className="text-muted-foreground text-[11px]">Gasto general</span>
                                                    )}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <StatusBadge status={p.purchase_status} type="operational" />
                                                </td>
                                                <td className="py-3 px-4 text-right">
                                                    <MoneyDisplay amount={effective} size="sm" className="font-semibold text-foreground" />
                                                    {p.real_amount ? (
                                                        <span className="text-[10px] text-emerald-600 block">Real</span>
                                                    ) : (
                                                        <span className="text-[10px] text-muted-foreground block">Estimado</span>
                                                    )}
                                                </td>
                                                <td className="py-3 px-4 text-right text-emerald-600 font-medium">
                                                    <MoneyDisplay amount={paid} size="sm" />
                                                </td>
                                                <td className="py-3 px-4 text-right">
                                                    <span className={pending > 0 ? 'text-amber-600 font-semibold' : 'text-muted-foreground'}>
                                                        <MoneyDisplay amount={pending} size="sm" />
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <div className="flex items-center justify-center gap-1.5">
                                                        {pending > 0 && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="h-7 px-2 text-[11px] gap-1 border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10"
                                                                onClick={() => {
                                                                    setSelectedPurchaseForPayment(p);
                                                                    paymentForm.setData('amount', pending.toString());
                                                                }}
                                                            >
                                                                <CreditCard className="w-3 h-3" />
                                                                <span>Pagar</span>
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
                </div>

                {/* MODAL: Nueva Compra */}
                {showNewModal && (
                    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                        <div className="bg-card border border-border w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden p-6 animate-in fade-in zoom-in-95">
                            <h2 className="text-lg font-serif font-bold text-foreground">Registrar Compra Externa</h2>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Insumos, papelería, impresiones terceras o servicios de producción contratados.
                            </p>

                            <form onSubmit={handleCreatePurchase} className="mt-4 space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <Label className="text-xs">Proveedor *</Label>
                                        <select
                                            value={newPurchaseForm.data.supplier_id}
                                            onChange={(e) => newPurchaseForm.setData('supplier_id', e.target.value)}
                                            className="w-full mt-1 text-xs rounded-md border border-input bg-background px-3 py-2 text-foreground"
                                            required
                                        >
                                            <option value="">Selecciona proveedor</option>
                                            {suppliers.map((s) => (
                                                <option key={s.id} value={s.id}>{s.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <Label className="text-xs">Pedido Relacionado (Opcional)</Label>
                                        <select
                                            value={newPurchaseForm.data.order_id}
                                            onChange={(e) => newPurchaseForm.setData('order_id', e.target.value)}
                                            className="w-full mt-1 text-xs rounded-md border border-input bg-background px-3 py-2 text-foreground"
                                        >
                                            <option value="">Gasto general / Taller</option>
                                            {orders.map((o) => (
                                                <option key={o.id} value={o.id}>{o.folio} - {o.project_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-xs">Concepto de la Compra *</Label>
                                    <Input
                                        placeholder="Ej: 500 hojas papel algodón 300g, laminado mate..."
                                        value={newPurchaseForm.data.concept}
                                        onChange={(e) => newPurchaseForm.setData('concept', e.target.value)}
                                        required
                                        className="mt-1 text-xs"
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <Label className="text-xs">Categoría *</Label>
                                        <select
                                            value={newPurchaseForm.data.category}
                                            onChange={(e) => newPurchaseForm.setData('category', e.target.value)}
                                            className="w-full mt-1 text-xs rounded-md border border-input bg-background px-3 py-2 text-foreground"
                                        >
                                            <option value="materiales">Materiales</option>
                                            <option value="impresion_externa">Impresión Externa</option>
                                            <option value="acabados">Acabados</option>
                                            <option value="mano_obra">Mano de Obra</option>
                                            <option value="empaque">Empaque</option>
                                            <option value="logistica">Logística</option>
                                            <option value="otro">Otro</option>
                                        </select>
                                    </div>
                                    <div>
                                        <Label className="text-xs">Costo Estimado *</Label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={newPurchaseForm.data.estimated_amount}
                                            onChange={(e) => newPurchaseForm.setData('estimated_amount', e.target.value)}
                                            required
                                            className="mt-1 text-xs font-mono"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs">Costo Real (si ya se sabe)</Label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={newPurchaseForm.data.real_amount}
                                            onChange={(e) => newPurchaseForm.setData('real_amount', e.target.value)}
                                            className="mt-1 text-xs font-mono"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <Label className="text-xs">Fecha Solicitud *</Label>
                                        <Input
                                            type="date"
                                            value={newPurchaseForm.data.requested_date}
                                            onChange={(e) => newPurchaseForm.setData('requested_date', e.target.value)}
                                            required
                                            className="mt-1 text-xs"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs">Fecha Entrega Prevista</Label>
                                        <Input
                                            type="date"
                                            value={newPurchaseForm.data.expected_delivery_date}
                                            onChange={(e) => newPurchaseForm.setData('expected_delivery_date', e.target.value)}
                                            className="mt-1 text-xs"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs">Fecha Límite Pago</Label>
                                        <Input
                                            type="date"
                                            value={newPurchaseForm.data.payment_due_date}
                                            onChange={(e) => newPurchaseForm.setData('payment_due_date', e.target.value)}
                                            className="mt-1 text-xs"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-xs">Estado de Compra *</Label>
                                    <select
                                        value={newPurchaseForm.data.purchase_status}
                                        onChange={(e) => newPurchaseForm.setData('purchase_status', e.target.value)}
                                        className="w-full mt-1 text-xs rounded-md border border-input bg-background px-3 py-2 text-foreground"
                                    >
                                        <option value="por_cotizar">Por Cotizar</option>
                                        <option value="solicitada">Solicitada</option>
                                        <option value="confirmada">Confirmada</option>
                                        <option value="pendiente_recepcion">Pendiente de Recepción</option>
                                        <option value="recibida">Recibida en Taller</option>
                                    </select>
                                </div>

                                <div className="flex justify-end gap-2 pt-2 border-t border-border/50">
                                    <Button type="button" variant="outline" onClick={() => setShowNewModal(false)}>
                                        Cancelar
                                    </Button>
                                    <Button type="submit" disabled={newPurchaseForm.processing}>
                                        Guardar Compra
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* MODAL: Registrar Pago a Proveedor */}
                {selectedPurchaseForPayment && (
                    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                        <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden p-6 animate-in fade-in zoom-in-95">
                            <h2 className="text-lg font-serif font-bold text-foreground">Registrar Pago a Proveedor</h2>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Compra: <span className="font-semibold text-foreground">{selectedPurchaseForPayment.folio}</span> ({selectedPurchaseForPayment.supplier?.name})
                            </p>

                            <form onSubmit={handleRegisterPayment} className="mt-4 space-y-4">
                                <div>
                                    <Label className="text-xs">Monto a Pagar (MXN) *</Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        value={paymentForm.data.amount}
                                        onChange={(e) => paymentForm.setData('amount', e.target.value)}
                                        required
                                        className="mt-1 text-sm font-mono font-semibold"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <Label className="text-xs">Fecha del Pago *</Label>
                                        <Input
                                            type="date"
                                            value={paymentForm.data.payment_date}
                                            onChange={(e) => paymentForm.setData('payment_date', e.target.value)}
                                            required
                                            className="mt-1 text-xs"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs">Método de Pago *</Label>
                                        <select
                                            value={paymentForm.data.payment_method}
                                            onChange={(e) => paymentForm.setData('payment_method', e.target.value)}
                                            className="w-full mt-1 text-xs rounded-md border border-input bg-background px-3 py-2 text-foreground"
                                        >
                                            <option value="transferencia">Transferencia SPEI</option>
                                            <option value="efectivo">Efectivo</option>
                                            <option value="tarjeta">Tarjeta Taller</option>
                                            <option value="otro">Otro</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-xs">Referencia / Folio Transferencia</Label>
                                    <Input
                                        placeholder="Ej: Rastreo SPEI #984321..."
                                        value={paymentForm.data.reference}
                                        onChange={(e) => paymentForm.setData('reference', e.target.value)}
                                        className="mt-1 text-xs"
                                    />
                                </div>

                                <div>
                                    <Label className="text-xs">Notas del Pago</Label>
                                    <Input
                                        placeholder="Observaciones adicionales..."
                                        value={paymentForm.data.notes}
                                        onChange={(e) => paymentForm.setData('notes', e.target.value)}
                                        className="mt-1 text-xs"
                                    />
                                </div>

                                <div className="flex justify-end gap-2 pt-2 border-t border-border/50">
                                    <Button type="button" variant="outline" onClick={() => setSelectedPurchaseForPayment(null)}>
                                        Cancelar
                                    </Button>
                                    <Button type="submit" disabled={paymentForm.processing} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                        Confirmar Pago
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

PurchasesIndex.layout = (page: any) => (
    <AppLayout breadcrumbs={[{ title: 'Compras a Proveedores', href: '/admin/purchases' }]}>
        {page}
    </AppLayout>
);
