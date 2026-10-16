import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { UniverseBadge } from '@/components/crm/universe-badge';
import { StatusBadge } from '@/components/crm/status-badge';
import { MoneyDisplay } from '@/components/crm/money-display';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { 
    ArrowLeft, 
    Calendar, 
    Clock, 
    CheckCircle2, 
    AlertTriangle, 
    FileText, 
    Plus, 
    DollarSign, 
    Receipt, 
    Truck, 
    Sparkles, 
    Send, 
    ShieldAlert, 
    RotateCcw,
    Layers,
    ListTodo,
    History,
    Check,
    MessageSquare,
    ExternalLink
} from 'lucide-react';
import type { CrmOrder, CrmSupplier } from '@/types/crm';

interface Props {
    order: CrmOrder;
    financial_summary: {
        approved_amount: number;
        advance_required: number;
        total_collected: number;
        balance_due: number;
        pending_advance: number;
        estimated_costs: number;
        real_costs: number;
        estimated_profit: number;
        real_profit: number;
        estimated_margin_percent: number;
        real_margin_percent: number;
        financial_status: string;
        workshop_overhead: number;
    };
    suppliers: Array<{ id: number; name: string; category: string }>;
    users: Array<{ id: number; name: string }>;
}

export default function CrmOrdersShow({ order, financial_summary, suppliers, users }: Props) {
    const [activeTab, setActiveTab] = useState<'summary' | 'tasks' | 'calendar' | 'approvals' | 'purchases' | 'finances' | 'audit'>('summary');

    // Modals state
    const [taskModalOpen, setTaskModalOpen] = useState(false);
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [reverseModalOpen, setReverseModalOpen] = useState(false);
    const [selectedPaymentId, setSelectedPaymentId] = useState<number | null>(null);
    const [approvalModalOpen, setApprovalModalOpen] = useState(false);
    const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
    const [blockedModalOpen, setBlockedModalOpen] = useState(false);
    const [blockedReasonText, setBlockedReasonText] = useState('');

    // Status change handlers
    const handleOperatingStatusChange = (status: string) => {
        if (status === 'bloqueado') {
            setBlockedModalOpen(true);
            return;
        }
        router.post(`/admin/crm-orders/${order.id}/operating-status`, {
            operating_status: status,
        });
    };

    const submitBlockedStatus = () => {
        router.post(`/admin/crm-orders/${order.id}/operating-status`, {
            operating_status: 'bloqueado',
            blocked_reason: blockedReasonText,
        }, {
            onSuccess: () => {
                setBlockedModalOpen(false);
                setBlockedReasonText('');
            },
        });
    };

    const handleCommercialStatusChange = (status: string) => {
        router.post(`/admin/crm-orders/${order.id}/commercial-status`, {
            commercial_status: status,
        });
    };

    // Task Form
    const taskForm = useForm({
        title: '',
        description: '',
        category: 'produccion',
        assigned_to: users[0]?.id ? String(users[0].id) : '',
        due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        priority: 'medium',
    });

    const submitTask = (e: React.FormEvent) => {
        e.preventDefault();
        taskForm.post(`/admin/crm-orders/${order.id}/tasks`, {
            onSuccess: () => {
                setTaskModalOpen(false);
                taskForm.reset();
            },
        });
    };

    const toggleTaskStatus = (taskId: number, currentStatus: string) => {
        const nextStatus = currentStatus === 'completed' ? 'pending' : 'completed';
        router.post(`/admin/crm-tasks/${taskId}/status`, { status: nextStatus });
    };

    // Customer Payment Form
    const paymentForm = useForm({
        amount: '',
        payment_date: new Date().toISOString().split('T')[0],
        concept: financial_summary.pending_advance > 0 ? 'anticipo' : (financial_summary.balance_due > 0 ? 'pago_parcial' : 'liquidacion'),
        payment_method: 'transferencia',
        reference: '',
        notes: '',
    });

    const submitPayment = (e: React.FormEvent) => {
        e.preventDefault();
        paymentForm.post(`/admin/crm-orders/${order.id}/payments`, {
            onSuccess: () => {
                setPaymentModalOpen(false);
                paymentForm.reset();
            },
        });
    };

    // Reverse payment form
    const reverseForm = useForm({
        reason: '',
    });

    const submitReversal = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPaymentId) return;
        reverseForm.post(`/admin/crm-payments/${selectedPaymentId}/reverse`, {
            onSuccess: () => {
                setReverseModalOpen(false);
                setSelectedPaymentId(null);
                reverseForm.reset();
            },
        });
    };

    // Approval Form
    const approvalForm = useForm({
        version_title: 'Propuesta de Diseño v' + ((order.approvals?.length || 0) + 1),
        review_type: 'design_proposal',
        deadline_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        external_url: '',
        status: 'sent',
    });

    const submitApproval = (e: React.FormEvent) => {
        e.preventDefault();
        approvalForm.post(`/admin/crm-orders/${order.id}/approvals`, {
            onSuccess: () => {
                setApprovalModalOpen(false);
                approvalForm.reset();
            },
        });
    };

    const handleApprovalResponse = (approvalId: number, status: string) => {
        const feedback = prompt('Comentarios del cliente (opcional):') ?? '';
        const name = prompt('Nombre de quien aprueba (opcional):', order.client?.name ?? '') ?? '';
        router.put(`/admin/crm-approvals/${approvalId}`, {
            status,
            client_feedback: feedback,
            approved_by_name: name,
        });
    };

    // Purchase Form
    const purchaseForm = useForm({
        supplier_id: suppliers[0]?.id ? String(suppliers[0].id) : '',
        order_id: order.id,
        concept: '',
        category: 'materiales',
        estimated_amount: '',
        real_amount: '',
        requested_date: new Date().toISOString().split('T')[0],
        expected_delivery_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        purchase_status: 'requested',
        receipt_notes: '',
    });

    const submitPurchase = (e: React.FormEvent) => {
        e.preventDefault();
        purchaseForm.post('/admin/purchases', {
            onSuccess: () => {
                setPurchaseModalOpen(false);
                purchaseForm.reset();
            },
        });
    };

    const tabs = [
        { id: 'summary', label: '1. Resumen General', icon: Layers },
        { id: 'tasks', label: `2. Tareas & Producción (${order.tasks?.length || 0})`, icon: ListTodo },
        { id: 'calendar', label: '3. Calendario & Fechas', icon: Calendar },
        { id: 'approvals', label: `4. Revisiones & Aprobaciones (${order.approvals?.length || 0})`, icon: Sparkles },
        { id: 'purchases', label: `5. Compras & Proveedores (${order.purchases?.length || 0})`, icon: Truck },
        { id: 'finances', label: '6. Finanzas & Pagos', icon: DollarSign },
        { id: 'audit', label: `7. Historial (${order.activity_logs?.length || 0})`, icon: History },
    ];

    return (
        <>
            <Head title={`Pedido ${order.folio} - Eladora CRM`} />

            <div className="flex flex-col gap-6 p-6 w-full">
                {/* Header with Folio, Client, Universe, and Quick Status Changers */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-border/50">
                    <div className="flex items-center gap-3">
                        <Link href="/admin/crm-orders">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                        </Link>
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
                                    {order.folio}
                                </h1>
                                <UniverseBadge universe={order.universe} size="sm" />
                                <StatusBadge type="operating" status={order.operating_status} size="sm" />
                                <StatusBadge type="financial" status={financial_summary.financial_status} size="sm" />
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                                <span className="font-semibold text-foreground">{order.project_name}</span>
                                <span>•</span>
                                <Link href={`/admin/clients/${order.client_id}`} className="hover:underline text-primary">
                                    {order.client?.name}
                                </Link>
                                {order.delivery_agreed_at && (
                                    <>
                                        <span>•</span>
                                        <span className="font-semibold text-foreground">Entrega: {order.delivery_agreed_at}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quick status dropdowns */}
                    <div className="flex items-center gap-2 flex-wrap">
                        {/* Operating status select */}
                        <div className="flex items-center gap-1.5">
                            <span className="text-xs text-muted-foreground">Operativo:</span>
                            <Select
                                value={order.operating_status}
                                onValueChange={handleOperatingStatusChange}
                            >
                                <SelectTrigger className="h-8 text-xs font-semibold w-40">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="no_iniciado">No iniciado</SelectItem>
                                    <SelectItem value="pendiente_informacion">Falta información</SelectItem>
                                    <SelectItem value="pendiente_aprobacion">En aprobación</SelectItem>
                                    <SelectItem value="pendiente_compra">Pendiente compra</SelectItem>
                                    <SelectItem value="pendiente_recepcion">Esperando insumos</SelectItem>
                                    <SelectItem value="listo_produccion">Listo p/ producción</SelectItem>
                                    <SelectItem value="en_produccion">En producción</SelectItem>
                                    <SelectItem value="en_revision_interna">Revisión interna</SelectItem>
                                    <SelectItem value="pendiente_aprobacion_final">Aprobación final</SelectItem>
                                    <SelectItem value="listo_para_entregar">Listo p/ entregar</SelectItem>
                                    <SelectItem value="entregado">Entregado</SelectItem>
                                    <SelectItem value="bloqueado">En pausa / Bloqueado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Commercial status select */}
                        <div className="flex items-center gap-1.5">
                            <span className="text-xs text-muted-foreground">Comercial:</span>
                            <Select
                                value={order.commercial_status}
                                onValueChange={handleCommercialStatusChange}
                            >
                                <SelectTrigger className="h-8 text-xs font-semibold w-36">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="confirmado">Confirmado</SelectItem>
                                    <SelectItem value="en_proceso">En Proceso</SelectItem>
                                    <SelectItem value="entregado">Entregado</SelectItem>
                                    <SelectItem value="cerrado">Cerrado</SelectItem>
                                    <SelectItem value="cancelado">Cancelado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Blocked Alert Banner if operating_status === 'bloqueado' */}
                {order.operating_status === 'bloqueado' && (
                    <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-900 dark:text-red-200 rounded-xl flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                        <div className="text-sm">
                            <span className="font-bold">PEDIDO BLOQUEADO / EN PAUSA: </span>
                            <span>{order.blocked_reason || 'Sin motivo especificado. Se requiere atención del taller.'}</span>
                        </div>
                    </div>
                )}

                {/* Navigation Tabs Bar (7 Pestañas Oficiales) */}
                <div className="flex items-center gap-1 border-b border-border/70 overflow-x-auto pb-1 text-xs">
                    {tabs.map((t) => {
                        const Icon = t.icon;
                        const isSelected = activeTab === t.id;
                        return (
                            <button
                                key={t.id}
                                type="button"
                                onClick={() => setActiveTab(t.id as any)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-t-lg font-medium whitespace-nowrap transition-all border-b-2 ${
                                    isSelected
                                        ? 'border-primary text-primary font-bold bg-muted/40'
                                        : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/20'
                                }`}
                            >
                                <Icon className="w-4 h-4 shrink-0" />
                                <span>{t.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* TAB 1: RESUMEN GENERAL */}
                {activeTab === 'summary' && (
                    <div className="space-y-6">
                        {/* Financial Snapshot Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Card className="shadow-2xs">
                                <CardHeader className="pb-1">
                                    <CardTitle className="text-xs text-muted-foreground uppercase">Importe Aprobado</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-serif font-bold text-foreground">
                                        <MoneyDisplay amount={financial_summary.approved_amount} />
                                    </div>
                                    <p className="text-[11px] text-muted-foreground mt-0.5">
                                        Anticipo req: <MoneyDisplay amount={financial_summary.advance_required} />
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="shadow-2xs">
                                <CardHeader className="pb-1">
                                    <CardTitle className="text-xs text-muted-foreground uppercase">Total Cobrado</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-serif font-bold text-emerald-700 dark:text-emerald-400">
                                        <MoneyDisplay amount={financial_summary.total_collected} />
                                    </div>
                                    <p className="text-[11px] text-muted-foreground mt-0.5">
                                        {order.payments?.filter(p => !p.is_reversal).length || 0} movimientos de pago
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="shadow-2xs">
                                <CardHeader className="pb-1">
                                    <CardTitle className="text-xs text-muted-foreground uppercase">Saldo por Cobrar</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className={`text-2xl font-serif font-bold ${
                                        financial_summary.balance_due > 0 ? 'text-amber-700 dark:text-amber-400' : 'text-foreground'
                                    }`}>
                                        <MoneyDisplay amount={financial_summary.balance_due} />
                                    </div>
                                    <p className="text-[11px] text-muted-foreground mt-0.5">
                                        Anticipo pendiente: <MoneyDisplay amount={financial_summary.pending_advance} />
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="shadow-2xs">
                                <CardHeader className="pb-1">
                                    <CardTitle className="text-xs text-muted-foreground uppercase">Utilidad Estimada</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-serif font-bold text-primary">
                                        <MoneyDisplay amount={financial_summary.estimated_profit} />
                                    </div>
                                    <p className="text-[11px] text-muted-foreground mt-0.5">
                                        Margen: {financial_summary.estimated_margin_percent}%
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Next Action & Critical State Card */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="md:col-span-2">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base font-semibold">¿Qué está pasando y qué sigue?</CardTitle>
                                    <CardDescription>Estado operativo actual del pedido</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4 text-sm">
                                    <div className="p-3 bg-muted/30 rounded-xl border border-border/50 flex items-center justify-between">
                                        <div>
                                            <div className="text-xs text-muted-foreground">Estado Operativo</div>
                                            <div className="text-base font-bold capitalize mt-0.5">
                                                {order.operating_status.replace(/_/g, ' ')}
                                            </div>
                                        </div>
                                        <StatusBadge type="operating" status={order.operating_status} size="md" />
                                    </div>

                                    {order.description && (
                                        <div>
                                            <span className="font-semibold text-xs text-muted-foreground block mb-1">
                                                Especificaciones / Brief:
                                            </span>
                                            <p className="text-foreground leading-relaxed bg-muted/10 p-3 rounded-lg border border-border/30 text-xs">
                                                {order.description}
                                            </p>
                                        </div>
                                    )}

                                    {order.notes && (
                                        <div>
                                            <span className="font-semibold text-xs text-muted-foreground block mb-1">
                                                Notas de Taller:
                                            </span>
                                            <p className="text-foreground leading-relaxed bg-amber-500/5 p-3 rounded-lg border border-amber-500/20 text-xs">
                                                {order.notes}
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Client & Dates Sidebar Card */}
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base font-semibold">Ficha y Contacto</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 text-xs">
                                    <div>
                                        <span className="text-muted-foreground block">Cliente:</span>
                                        <Link href={`/admin/clients/${order.client_id}`} className="font-bold text-sm text-primary hover:underline">
                                            {order.client?.name}
                                        </Link>
                                        {order.client?.business_name && (
                                            <div className="text-muted-foreground">{order.client.business_name}</div>
                                        )}
                                    </div>

                                    {order.client?.whatsapp && (
                                        <div>
                                            <span className="text-muted-foreground block">WhatsApp:</span>
                                            <a
                                                href={`https://wa.me/${order.client.whatsapp.replace(/\D/g, '')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-medium text-emerald-700 dark:text-emerald-400 hover:underline"
                                            >
                                                {order.client.whatsapp}
                                            </a>
                                        </div>
                                    )}

                                    <div className="pt-2 border-t border-border/40 space-y-1.5">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Solicitado:</span>
                                            <span className="font-semibold">{order.requested_at}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Inicio de diseño:</span>
                                            <span className="font-semibold">{order.start_planned_at || '-'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Fecha Límite Taller:</span>
                                            <span className="font-semibold">{order.internal_deadline_at || '-'}</span>
                                        </div>
                                        <div className="flex justify-between text-primary font-bold">
                                            <span>Entrega acordada:</span>
                                            <span>{order.delivery_agreed_at || 'Sin fecha acordada'}</span>
                                        </div>
                                    </div>

                                    {order.quotation && (
                                        <div className="pt-2 border-t border-border/40">
                                            <span className="text-muted-foreground block mb-0.5">Cotización origen:</span>
                                            <Link href={`/admin/quotations/${order.quotation_id}`} className="font-mono font-bold text-primary hover:underline">
                                                {order.quotation.folio}
                                            </Link>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}

                {/* TAB 2: ACTIVIDADES Y PRODUCCIÓN */}
                {activeTab === 'tasks' && (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <div>
                                <CardTitle className="text-base font-semibold">Tareas Operativas y Checklist de Producción</CardTitle>
                                <CardDescription>
                                    Flujo de trabajo oficial para {order.universe.toUpperCase()}. Marca tareas completadas conforme avance el taller.
                                </CardDescription>
                            </div>
                            <Button size="sm" onClick={() => setTaskModalOpen(true)} className="gap-1.5">
                                <Plus className="w-3.5 h-3.5" />
                                <span>Añadir Tarea</span>
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {(!order.tasks || order.tasks.length === 0) ? (
                                <div className="py-12 text-center text-sm text-muted-foreground">
                                    No hay tareas creadas para este pedido. Puedes añadir una nueva tarea.
                                </div>
                            ) : (
                                order.tasks.map((task, idx) => {
                                    const isCompleted = task.status === 'completed';
                                    const isBlocked = task.status === 'blocked';
                                    return (
                                        <div
                                            key={task.id}
                                            className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                                                isCompleted
                                                    ? 'bg-muted/30 border-border/40 opacity-70'
                                                    : isBlocked
                                                    ? 'bg-red-50/50 border-red-200 dark:bg-red-950/20'
                                                    : 'bg-card border-border/70 hover:shadow-2xs'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <button
                                                    type="button"
                                                    onClick={() => toggleTaskStatus(task.id, task.status)}
                                                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                                                        isCompleted
                                                            ? 'bg-primary border-primary text-primary-foreground'
                                                            : 'border-border hover:border-primary'
                                                    }`}
                                                >
                                                    {isCompleted && <Check className="w-3.5 h-3.5" />}
                                                </button>

                                                <div className="flex flex-col min-w-0">
                                                    <span className={`text-sm font-medium ${isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                                                        {task.title}
                                                    </span>
                                                    {task.description && (
                                                        <span className="text-xs text-muted-foreground truncate">{task.description}</span>
                                                    )}
                                                    {isBlocked && task.blocked_reason && (
                                                        <span className="text-xs font-semibold text-red-600 dark:text-red-400">
                                                            Bloqueo: {task.blocked_reason}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 shrink-0">
                                                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-muted border">
                                                    {task.category}
                                                </span>
                                                <StatusBadge type="priority" status={task.priority} size="sm" />
                                                {task.due_date && (
                                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        <span>{task.due_date}</span>
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* TAB 3: CALENDARIO Y FECHAS */}
                {activeTab === 'calendar' && (
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold">Cronograma y Fechas del Pedido</CardTitle>
                            <CardDescription>Línea de tiempo desde la solicitud hasta la entrega final</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl bg-muted/20 border border-border/50">
                                <div>
                                    <span className="text-xs text-muted-foreground block">1. Solicitud inicial</span>
                                    <div className="font-bold text-sm text-foreground mt-0.5">{order.requested_at}</div>
                                </div>
                                <div>
                                    <span className="text-xs text-muted-foreground block">2. Inicio previsto taller</span>
                                    <div className="font-bold text-sm text-foreground mt-0.5">{order.start_planned_at || 'Sin fecha'}</div>
                                </div>
                                <div>
                                    <span className="text-xs text-muted-foreground block">3. Límite interno calidad</span>
                                    <div className="font-bold text-sm text-foreground mt-0.5">{order.internal_deadline_at || 'Sin fecha'}</div>
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-primary block">4. Entrega acordada</span>
                                    <div className="font-bold text-base text-primary mt-0.5">{order.delivery_agreed_at || 'Sin fecha'}</div>
                                </div>
                            </div>

                            {/* Task deadlines list */}
                            <div className="space-y-2">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Vencimientos de Tareas de Producción
                                </h4>
                                <div className="divide-y divide-border/40 border border-border/50 rounded-xl overflow-hidden">
                                    {order.tasks?.map((t) => (
                                        <div key={t.id} className="p-3 flex items-center justify-between text-xs hover:bg-muted/20">
                                            <span className="font-medium text-foreground">{t.title}</span>
                                            <div className="flex items-center gap-3">
                                                <span className="text-muted-foreground">{t.due_date || 'Sin fecha'}</span>
                                                <StatusBadge type="operating" status={t.status === 'completed' ? 'entregado' : (t.status === 'blocked' ? 'bloqueado' : 'en_produccion')} size="sm" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* TAB 4: ARCHIVOS Y APROBACIONES */}
                {activeTab === 'approvals' && (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <div>
                                <CardTitle className="text-base font-semibold">Control de Revisiones y Aprobaciones</CardTitle>
                                <CardDescription>
                                    Pruebas de diseño, muestras de impresión y confirmaciones del cliente.
                                </CardDescription>
                            </div>
                            <Button size="sm" onClick={() => setApprovalModalOpen(true)} className="gap-1.5">
                                <Plus className="w-3.5 h-3.5" />
                                <span>Enviar Revisión</span>
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {(!order.approvals || order.approvals.length === 0) ? (
                                <div className="py-12 text-center text-sm text-muted-foreground">
                                    No hay revisiones enviadas al cliente aún.
                                </div>
                            ) : (
                                order.approvals.map((appr) => (
                                    <div key={appr.id} className="p-4 bg-muted/20 border border-border/60 rounded-xl space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-bold text-sm text-foreground">{appr.version_title}</h4>
                                                <span className="text-xs px-2 py-0.5 rounded-full bg-muted border capitalize">
                                                    {appr.review_type.replace(/_/g, ' ')}
                                                </span>
                                            </div>
                                            <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                                                appr.status === 'approved'
                                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                                    : appr.status === 'changes_requested'
                                                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                                                    : 'bg-blue-50 text-blue-800 border-blue-200'
                                            }`}>
                                                {appr.status === 'approved' ? 'Aprobada ✓' : (appr.status === 'changes_requested' ? 'Con observaciones' : 'Enviada a revisión')}
                                            </span>
                                        </div>

                                        {appr.external_url && (
                                            <div className="text-xs">
                                                <a href={appr.external_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1 font-semibold">
                                                    <span>Ver archivo o maqueta en línea</span>
                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                </a>
                                            </div>
                                        )}

                                        {appr.client_feedback && (
                                            <div className="p-2.5 bg-background rounded-lg border border-border/40 text-xs">
                                                <span className="font-semibold text-foreground block mb-0.5">Comentarios del cliente:</span>
                                                <p className="text-muted-foreground">{appr.client_feedback}</p>
                                            </div>
                                        )}

                                        {appr.approved_by_name && (
                                            <div className="text-[11px] text-emerald-700 font-medium">
                                                Aprobado formalmente por: <strong>{appr.approved_by_name}</strong> el {appr.responded_at?.slice(0, 10)}
                                            </div>
                                        )}

                                        {/* Action buttons to record response */}
                                        {appr.status === 'sent' && (
                                            <div className="flex items-center gap-2 pt-2 border-t border-border/40">
                                                <Button
                                                    size="sm"
                                                    className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs"
                                                    onClick={() => handleApprovalResponse(appr.id, 'approved')}
                                                >
                                                    Registrar Aprobación Cliente
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-xs"
                                                    onClick={() => handleApprovalResponse(appr.id, 'changes_requested')}
                                                >
                                                    Registrar Observaciones
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* TAB 5: COMPRAS Y PROVEEDORES */}
                {activeTab === 'purchases' && (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <div>
                                <CardTitle className="text-base font-semibold">Compras Externas e Insumos Asignados</CardTitle>
                                <CardDescription>
                                    Materiales, servicios de impresión externa, maquilas y mano de obra externa.
                                </CardDescription>
                            </div>
                            <Button size="sm" onClick={() => setPurchaseModalOpen(true)} className="gap-1.5">
                                <Plus className="w-3.5 h-3.5" />
                                <span>Registrar Compra</span>
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm border-t border-border/50">
                                    <thead className="bg-muted/40 text-xs font-semibold text-muted-foreground uppercase">
                                        <tr>
                                            <th className="py-2.5 px-4">Folio</th>
                                            <th className="py-2.5 px-4">Proveedor / Concepto</th>
                                            <th className="py-2.5 px-4">Categoría</th>
                                            <th className="py-2.5 px-4">Recepción</th>
                                            <th className="py-2.5 px-4 text-right">Costo Estimado</th>
                                            <th className="py-2.5 px-4 text-right">Costo Real</th>
                                            <th className="py-2.5 px-4 text-center">Pago Prov.</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/40">
                                        {(!order.purchases || order.purchases.length === 0) ? (
                                            <tr>
                                                <td colSpan={7} className="py-8 text-center text-muted-foreground">
                                                    No se han registrado compras externas para este pedido.
                                                </td>
                                            </tr>
                                        ) : (
                                            order.purchases.map((p) => (
                                                <tr key={p.id}>
                                                    <td className="py-3 px-4 font-mono font-bold text-xs">{p.folio}</td>
                                                    <td className="py-3 px-4">
                                                        <div className="font-semibold text-foreground">{p.concept}</div>
                                                        <div className="text-xs text-muted-foreground">{p.supplier?.name}</div>
                                                    </td>
                                                    <td className="py-3 px-4 capitalize text-xs">{p.category}</td>
                                                    <td className="py-3 px-4">
                                                        <span className="text-xs capitalize font-medium px-2 py-0.5 rounded-full bg-muted border">
                                                            {p.purchase_status.replace(/_/g, ' ')}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 text-right text-xs">
                                                        <MoneyDisplay amount={p.estimated_amount} />
                                                    </td>
                                                    <td className="py-3 px-4 text-right font-bold text-foreground">
                                                        <MoneyDisplay amount={p.real_amount ?? p.estimated_amount} />
                                                    </td>
                                                    <td className="py-3 px-4 text-center">
                                                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                                                            p.payment_status === 'paid'
                                                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                                                : 'bg-amber-50 text-amber-800 border-amber-200'
                                                        }`}>
                                                            {p.payment_status === 'paid' ? 'Pagado' : 'Pendiente'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* TAB 6: FINANZAS Y PAGOS */}
                {activeTab === 'finances' && (
                    <div className="space-y-6">
                        {/* Financial Ledger & Metrics Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Summary Card */}
                            <Card className="md:col-span-1">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base font-semibold">Resumen de Cobro y Saldo</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm">
                                    <div className="flex justify-between py-1 border-b border-border/40">
                                        <span className="text-muted-foreground">Precio Aprobado:</span>
                                        <span className="font-bold text-foreground"><MoneyDisplay amount={financial_summary.approved_amount} /></span>
                                    </div>
                                    <div className="flex justify-between py-1 border-b border-border/40">
                                        <span className="text-muted-foreground">Anticipo Requerido:</span>
                                        <span className="font-semibold text-foreground"><MoneyDisplay amount={financial_summary.advance_required} /></span>
                                    </div>
                                    <div className="flex justify-between py-1 border-b border-border/40 text-emerald-700 dark:text-emerald-400 font-bold">
                                        <span>Total Cobrado:</span>
                                        <span><MoneyDisplay amount={financial_summary.total_collected} /></span>
                                    </div>
                                    <div className="flex justify-between py-1 border-b border-border/40 text-amber-700 dark:text-amber-400 font-bold">
                                        <span>Saldo por Cobrar:</span>
                                        <span><MoneyDisplay amount={financial_summary.balance_due} /></span>
                                    </div>
                                    <div className="flex justify-between py-1 text-xs text-muted-foreground">
                                        <span>Anticipo pendiente:</span>
                                        <span className="font-semibold text-foreground"><MoneyDisplay amount={financial_summary.pending_advance} /></span>
                                    </div>

                                    <Button
                                        onClick={() => setPaymentModalOpen(true)}
                                        className="w-full mt-3 gap-2 shadow-xs"
                                        size="sm"
                                    >
                                        <DollarSign className="w-4 h-4" />
                                        <span>Registrar Pago de Cliente</span>
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Profitability & Cost Breakdown Card */}
                            <Card className="md:col-span-2">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base font-semibold">Estructura de Costos y Utilidad</CardTitle>
                                    <CardDescription>Cálculo estricto sin duplicar conceptos operativos de taller</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-muted/20 border border-border/50 mb-4">
                                        <div>
                                            <div className="text-xs text-muted-foreground">Costos Estimados</div>
                                            <div className="text-lg font-bold font-serif mt-0.5">
                                                <MoneyDisplay amount={financial_summary.estimated_costs} />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-muted-foreground">Costos Reales</div>
                                            <div className="text-lg font-bold font-serif mt-0.5">
                                                <MoneyDisplay amount={financial_summary.real_costs} />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-muted-foreground">Utilidad Estimada</div>
                                            <div className="text-lg font-bold font-serif text-emerald-700 dark:text-emerald-400 mt-0.5">
                                                <MoneyDisplay amount={financial_summary.estimated_profit} />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-muted-foreground">Margen Estimado</div>
                                            <div className="text-lg font-bold font-serif text-primary mt-0.5">
                                                {financial_summary.estimated_margin_percent}%
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-xs text-muted-foreground space-y-1">
                                        <p>• <strong>Gasto operativo asignado al taller:</strong> <MoneyDisplay amount={financial_summary.workshop_overhead} /></p>
                                        <p>• <strong>Compras externas y maquilas:</strong> {order.purchases?.length || 0} compras registradas.</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Customer Payments Table */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-3">
                                <div>
                                    <CardTitle className="text-base font-semibold">Pagos Registrados del Cliente</CardTitle>
                                    <CardDescription>Historial auditable con soporte de reversiones</CardDescription>
                                </div>
                                <Button size="sm" onClick={() => setPaymentModalOpen(true)} className="gap-1.5">
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Registrar Pago</span>
                                </Button>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm border-t border-border/50">
                                        <thead className="bg-muted/40 text-xs font-semibold text-muted-foreground uppercase">
                                            <tr>
                                                <th className="py-2.5 px-4">Folio</th>
                                                <th className="py-2.5 px-4">Fecha</th>
                                                <th className="py-2.5 px-4">Concepto</th>
                                                <th className="py-2.5 px-4">Método</th>
                                                <th className="py-2.5 px-4">Referencia</th>
                                                <th className="py-2.5 px-4 text-right">Monto</th>
                                                <th className="py-2.5 px-4 text-right">Acción</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border/40">
                                            {(!order.payments || order.payments.length === 0) ? (
                                                <tr>
                                                    <td colSpan={7} className="py-8 text-center text-muted-foreground">
                                                        No hay pagos registrados para este pedido.
                                                    </td>
                                                </tr>
                                            ) : (
                                                order.payments.map((p) => (
                                                    <tr key={p.id} className={p.is_reversal ? 'bg-red-50/40 text-red-800' : ''}>
                                                        <td className="py-3 px-4 font-mono font-bold text-xs">{p.folio}</td>
                                                        <td className="py-3 px-4 text-xs text-muted-foreground">{p.payment_date}</td>
                                                        <td className="py-3 px-4 capitalize text-xs font-medium">{p.concept}</td>
                                                        <td className="py-3 px-4 capitalize text-xs">{p.payment_method}</td>
                                                        <td className="py-3 px-4 text-xs text-muted-foreground">{p.reference || '-'}</td>
                                                        <td className="py-3 px-4 text-right font-bold text-emerald-700 dark:text-emerald-400">
                                                            <MoneyDisplay amount={p.amount} showSign={p.is_reversal} />
                                                        </td>
                                                        <td className="py-3 px-4 text-right">
                                                            {!p.is_reversal && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="text-red-600 hover:text-red-800 text-xs"
                                                                    onClick={() => {
                                                                        setSelectedPaymentId(p.id);
                                                                        setReverseModalOpen(true);
                                                                    }}
                                                                >
                                                                    Revertir
                                                                </Button>
                                                            )}
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
                )}

                {/* TAB 7: HISTORIAL Y AUDITORÍA */}
                {activeTab === 'audit' && (
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold">Trazabilidad y Registro de Auditoría</CardTitle>
                            <CardDescription>
                                Registro inmutable de cada cambio de estado, registro de pagos y eventos del pedido.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {(!order.activity_logs || order.activity_logs.length === 0) ? (
                                    <div className="py-12 text-center text-sm text-muted-foreground">
                                        No hay registros de actividad aún.
                                    </div>
                                ) : (
                                    order.activity_logs.map((log) => (
                                        <div key={log.id} className="flex items-start gap-3 text-xs pb-3 border-b border-border/40 last:border-none">
                                            <div className="p-1 rounded-full bg-primary/10 text-primary mt-0.5">
                                                <Clock className="w-3.5 h-3.5" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-foreground">{log.description}</p>
                                                <span className="text-[11px] text-muted-foreground">
                                                    {new Date(log.created_at).toLocaleString('es-MX')} {log.user ? `• por ${log.user.name}` : ''}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* MODAL: Nueva Tarea */}
                <Dialog open={taskModalOpen} onOpenChange={setTaskModalOpen}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle className="font-serif text-lg">Añadir Tarea Operativa</DialogTitle>
                            <DialogDescription>Añade una actividad a la producción de este pedido.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={submitTask} className="space-y-3.5 pt-2">
                            <div className="space-y-1">
                                <Label htmlFor="task_title" className="text-xs">Título de la Tarea <span className="text-red-500">*</span></Label>
                                <Input
                                    id="task_title"
                                    placeholder="ej. Armar 120 sobres con forro"
                                    value={taskForm.data.title}
                                    onChange={(e) => taskForm.setData('title', e.target.value)}
                                    className="text-xs"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label className="text-xs">Categoría</Label>
                                    <Select
                                        value={taskForm.data.category}
                                        onValueChange={(val) => taskForm.setData('category', val)}
                                    >
                                        <SelectTrigger className="w-full text-xs">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="brief">Brief / Info</SelectItem>
                                            <SelectItem value="diseno">Diseño</SelectItem>
                                            <SelectItem value="aprobacion">Aprobación</SelectItem>
                                            <SelectItem value="compras">Compras</SelectItem>
                                            <SelectItem value="produccion">Producción Taller</SelectItem>
                                            <SelectItem value="calidad">Control de Calidad</SelectItem>
                                            <SelectItem value="entrega">Entrega</SelectItem>
                                            <SelectItem value="cierre">Cierre</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-xs">Prioridad</Label>
                                    <Select
                                        value={taskForm.data.priority}
                                        onValueChange={(val) => taskForm.setData('priority', val as any)}
                                    >
                                        <SelectTrigger className="w-full text-xs">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="low">Baja</SelectItem>
                                            <SelectItem value="medium">Media</SelectItem>
                                            <SelectItem value="high">Alta</SelectItem>
                                            <SelectItem value="urgent">Urgente</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="task_due_date" className="text-xs">Fecha Límite</Label>
                                <Input
                                    id="task_due_date"
                                    type="date"
                                    value={taskForm.data.due_date}
                                    onChange={(e) => taskForm.setData('due_date', e.target.value)}
                                    className="text-xs"
                                />
                            </div>

                            <DialogFooter className="pt-2">
                                <Button type="button" variant="outline" size="sm" onClick={() => setTaskModalOpen(false)}>Cancelar</Button>
                                <Button type="submit" size="sm" disabled={taskForm.processing}>Guardar Tarea</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* MODAL: Registrar Pago de Cliente */}
                <Dialog open={paymentModalOpen} onOpenChange={setPaymentModalOpen}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle className="font-serif text-lg">Registrar Pago de Cliente</DialogTitle>
                            <DialogDescription>Aplica un anticipo o liquidación a este pedido.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={submitPayment} className="space-y-3.5 pt-2">
                            <div className="space-y-1">
                                <Label htmlFor="payment_amount" className="text-xs font-semibold">Monto del Pago ($ MXN) <span className="text-red-500">*</span></Label>
                                <Input
                                    id="payment_amount"
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    placeholder="0.00"
                                    value={paymentForm.data.amount}
                                    onChange={(e) => paymentForm.setData('amount', e.target.value)}
                                    className="text-sm font-bold"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label className="text-xs">Concepto</Label>
                                    <Select
                                        value={paymentForm.data.concept}
                                        onValueChange={(val) => paymentForm.setData('concept', val as any)}
                                    >
                                        <SelectTrigger className="w-full text-xs">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="anticipo">Anticipo</SelectItem>
                                            <SelectItem value="pago_parcial">Pago Parcial</SelectItem>
                                            <SelectItem value="liquidacion">Liquidación Total</SelectItem>
                                            <SelectItem value="ajuste">Ajuste Financiero</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-xs">Método de Pago</Label>
                                    <Select
                                        value={paymentForm.data.payment_method}
                                        onValueChange={(val) => paymentForm.setData('payment_method', val)}
                                    >
                                        <SelectTrigger className="w-full text-xs">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="transferencia">Transferencia (SPEI)</SelectItem>
                                            <SelectItem value="efectivo">Efectivo en Taller</SelectItem>
                                            <SelectItem value="tarjeta">Terminal / Tarjeta</SelectItem>
                                            <SelectItem value="mercadopago">Mercado Pago</SelectItem>
                                            <SelectItem value="otro">Otro</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label htmlFor="payment_date" className="text-xs">Fecha del Pago</Label>
                                    <Input
                                        id="payment_date"
                                        type="date"
                                        value={paymentForm.data.payment_date}
                                        onChange={(e) => paymentForm.setData('payment_date', e.target.value)}
                                        className="text-xs"
                                        required
                                    />
                                </div>

                                <div className="space-y-1">
                                    <Label htmlFor="payment_ref" className="text-xs">Referencia / Folio Banco</Label>
                                    <Input
                                        id="payment_ref"
                                        placeholder="ej. SPEI-884920"
                                        value={paymentForm.data.reference}
                                        onChange={(e) => paymentForm.setData('reference', e.target.value)}
                                        className="text-xs"
                                    />
                                </div>
                            </div>

                            <DialogFooter className="pt-2">
                                <Button type="button" variant="outline" size="sm" onClick={() => setPaymentModalOpen(false)}>Cancelar</Button>
                                <Button type="submit" size="sm" disabled={paymentForm.processing}>Registrar Pago</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* MODAL: Revertir Pago */}
                <Dialog open={reverseModalOpen} onOpenChange={setReverseModalOpen}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle className="font-serif text-lg text-red-600">Revertir Movimiento de Pago</DialogTitle>
                            <DialogDescription>
                                Esta acción genera un registro auditable de reversión sin borrar el historial.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={submitReversal} className="space-y-3.5 pt-2">
                            <div className="space-y-1">
                                <Label htmlFor="reverse_reason" className="text-xs">Motivo de la Reversión <span className="text-red-500">*</span></Label>
                                <Textarea
                                    id="reverse_reason"
                                    rows={3}
                                    placeholder="Explica por qué se revierte este pago (ej. error de captura, depósito no reflejado)..."
                                    value={reverseForm.data.reason}
                                    onChange={(e) => reverseForm.setData('reason', e.target.value)}
                                    className="text-xs"
                                    required
                                />
                            </div>
                            <DialogFooter className="pt-2">
                                <Button type="button" variant="outline" size="sm" onClick={() => setReverseModalOpen(false)}>Cancelar</Button>
                                <Button type="submit" variant="destructive" size="sm" disabled={reverseForm.processing}>Confirmar Reversión</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* MODAL: Enviar Revisión */}
                <Dialog open={approvalModalOpen} onOpenChange={setApprovalModalOpen}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle className="font-serif text-lg">Registrar Revisión para Cliente</DialogTitle>
                            <DialogDescription>Envío de propuesta, maqueta o prueba de impresión.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={submitApproval} className="space-y-3.5 pt-2">
                            <div className="space-y-1">
                                <Label htmlFor="appr_title" className="text-xs">Nombre de la Versión <span className="text-red-500">*</span></Label>
                                <Input
                                    id="appr_title"
                                    value={approvalForm.data.version_title}
                                    onChange={(e) => approvalForm.setData('version_title', e.target.value)}
                                    className="text-xs"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label className="text-xs">Tipo de Revisión</Label>
                                    <Select
                                        value={approvalForm.data.review_type}
                                        onValueChange={(val) => approvalForm.setData('review_type', val)}
                                    >
                                        <SelectTrigger className="w-full text-xs">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="design_proposal">Propuesta de Diseño</SelectItem>
                                            <SelectItem value="print_proof">Prueba de Impresión</SelectItem>
                                            <SelectItem value="copy_review">Revisión de Textos</SelectItem>
                                            <SelectItem value="final_deliverable">Entregable Final</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1">
                                    <Label htmlFor="appr_deadline" className="text-xs">Fecha Límite Respuesta</Label>
                                    <Input
                                        id="appr_deadline"
                                        type="date"
                                        value={approvalForm.data.deadline_at}
                                        onChange={(e) => approvalForm.setData('deadline_at', e.target.value)}
                                        className="text-xs"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="appr_url" className="text-xs">Enlace a Archivo / Maqueta Externa</Label>
                                <Input
                                    id="appr_url"
                                    placeholder="https://drive.google.com/... o enlace de Canva/Figma"
                                    value={approvalForm.data.external_url}
                                    onChange={(e) => approvalForm.setData('external_url', e.target.value)}
                                    className="text-xs"
                                />
                            </div>

                            <DialogFooter className="pt-2">
                                <Button type="button" variant="outline" size="sm" onClick={() => setApprovalModalOpen(false)}>Cancelar</Button>
                                <Button type="submit" size="sm" disabled={approvalForm.processing}>Registrar Envío</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* MODAL: Registrar Compra */}
                <Dialog open={purchaseModalOpen} onOpenChange={setPurchaseModalOpen}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle className="font-serif text-lg">Registrar Compra / Insumo Externo</DialogTitle>
                            <DialogDescription>Gasto o compromiso con proveedor asignado a este pedido.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={submitPurchase} className="space-y-3.5 pt-2">
                            <div className="space-y-1">
                                <Label className="text-xs">Proveedor <span className="text-red-500">*</span></Label>
                                <Select
                                    value={purchaseForm.data.supplier_id}
                                    onValueChange={(val) => purchaseForm.setData('supplier_id', val)}
                                >
                                    <SelectTrigger className="w-full text-xs">
                                        <SelectValue placeholder="Seleccionar proveedor..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {suppliers.map((s) => (
                                            <SelectItem key={s.id} value={String(s.id)}>
                                                {s.name} ({s.category})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="pur_concept" className="text-xs">Concepto / Material <span className="text-red-500">*</span></Label>
                                <Input
                                    id="pur_concept"
                                    placeholder="ej. Papel algodón 300g o Maquila Foil"
                                    value={purchaseForm.data.concept}
                                    onChange={(e) => purchaseForm.setData('concept', e.target.value)}
                                    className="text-xs"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label htmlFor="pur_est" className="text-xs">Monto Estimado ($) <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="pur_est"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={purchaseForm.data.estimated_amount}
                                        onChange={(e) => purchaseForm.setData('estimated_amount', e.target.value)}
                                        className="text-xs"
                                        required
                                    />
                                </div>

                                <div className="space-y-1">
                                    <Label htmlFor="pur_real" className="text-xs">Monto Real (Si ya se conoce)</Label>
                                    <Input
                                        id="pur_real"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={purchaseForm.data.real_amount}
                                        onChange={(e) => purchaseForm.setData('real_amount', e.target.value)}
                                        className="text-xs"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="pur_expected" className="text-xs">Fecha Prevista de Recepción</Label>
                                <Input
                                    id="pur_expected"
                                    type="date"
                                    value={purchaseForm.data.expected_delivery_date}
                                    onChange={(e) => purchaseForm.setData('expected_delivery_date', e.target.value)}
                                    className="text-xs"
                                />
                            </div>

                            <DialogFooter className="pt-2">
                                <Button type="button" variant="outline" size="sm" onClick={() => setPurchaseModalOpen(false)}>Cancelar</Button>
                                <Button type="submit" size="sm" disabled={purchaseForm.processing}>Guardar Compra</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* MODAL: Bloquear Pedido con Motivo */}
                <Dialog open={blockedModalOpen} onOpenChange={setBlockedModalOpen}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle className="font-serif text-lg text-red-600">Pausar o Bloquear Pedido</DialogTitle>
                            <DialogDescription>
                                Indica la causa del bloqueo (ej. esperando respuesta del cliente sobre textos, insumo agotado en proveedor).
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-3 pt-2">
                            <Textarea
                                rows={3}
                                placeholder="Escribe el motivo del bloqueo..."
                                value={blockedReasonText}
                                onChange={(e) => setBlockedReasonText(e.target.value)}
                                className="text-xs"
                                required
                            />
                            <DialogFooter>
                                <Button variant="outline" size="sm" onClick={() => setBlockedModalOpen(false)}>Cancelar</Button>
                                <Button variant="destructive" size="sm" onClick={submitBlockedStatus} disabled={!blockedReasonText.trim()}>
                                    Bloquear Pedido
                                </Button>
                            </DialogFooter>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}

CrmOrdersShow.layout = (page: any) => {
    const order = page?.props?.order ?? page?.order;
    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Pedidos', href: '/admin/crm-orders' },
                { title: order?.folio || 'Pedido', href: order?.id ? `/admin/crm-orders/${order.id}` : '/admin/crm-orders' },
            ]}
        >
            {page}
        </AppLayout>
    );
};
