import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MoneyDisplay } from '@/components/crm/money-display';
import { ArrowLeft, Save, Sparkles } from 'lucide-react';
import type { Universe } from '@/types/crm';

interface Props {
    clients: Array<{ id: number; name: string; business_name?: string | null; phone?: string | null }>;
    users: Array<{ id: number; name: string }>;
    default_advance_percent: number;
    workshop_overhead_value: number;
}

export default function CrmOrdersCreate({ clients, users, default_advance_percent = 50, workshop_overhead_value = 15 }: Props) {
    const today = new Date().toISOString().split('T')[0];
    const twoWeeks = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const { data, setData, post, processing, errors } = useForm({
        client_id: clients[0]?.id ? String(clients[0].id) : '',
        universe: 'print' as Universe,
        project_name: '',
        service_type: 'Impresión y Papelería Fina',
        description: '',
        requested_at: today,
        start_planned_at: today,
        delivery_agreed_at: twoWeeks,
        internal_deadline_at: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        priority: 'medium',
        assigned_to: users[0]?.id ? String(users[0].id) : '',
        approved_amount: '',
        advance_required: '',
        workshop_overhead_amount: '',
        notes: '',
    });

    const handleAmountChange = (amountStr: string) => {
        const num = parseFloat(amountStr) || 0;
        setData((prev) => ({
            ...prev,
            approved_amount: amountStr,
            advance_required: String(Math.round((num * default_advance_percent) / 100)),
            workshop_overhead_amount: String(Math.round((num * workshop_overhead_value) / 100)),
        }));
    };

    const handleUniverseChange = (uni: Universe) => {
        const defaultServiceType = matchUniverseService(uni);
        setData((prev) => ({
            ...prev,
            universe: uni,
            service_type: defaultServiceType,
        }));
    };

    const matchUniverseService = (u: Universe) => {
        switch (u) {
            case 'studio':
                return 'Diseño Gráfico y Branding';
            case 'moments':
                return 'Coordinación y Experiencias de Evento';
            default:
                return 'Impresión y Papelería Fina';
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/crm-orders');
    };

    return (
        <>
            <Head title="Nuevo Pedido - Eladora CRM" />

            <div className="flex flex-col gap-6 p-6 w-full">
                <div className="flex items-center justify-between pb-2 border-b border-border/50">
                    <div className="flex items-center gap-3">
                        <Link href="/admin/crm-orders">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-serif font-bold text-foreground tracking-tight">
                                Registrar Pedido Directo
                            </h1>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Crea un pedido con sus parámetros financieros y plantilla de tareas por universo.
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* General Identification */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold">Identificación del Proyecto</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-xs">Cliente <span className="text-red-500">*</span></Label>
                                    <Select
                                        value={data.client_id}
                                        onValueChange={(val) => setData('client_id', val)}
                                    >
                                        <SelectTrigger className="w-full text-xs">
                                            <SelectValue placeholder="Seleccionar cliente..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {clients.map((c) => (
                                                <SelectItem key={c.id} value={String(c.id)}>
                                                    {c.name} {c.business_name ? `(${c.business_name})` : ''}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.client_id && <p className="text-xs text-red-500">{errors.client_id}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-xs">Universo de Negocio <span className="text-red-500">*</span></Label>
                                    <Select
                                        value={data.universe}
                                        onValueChange={(val) => handleUniverseChange(val as Universe)}
                                    >
                                        <SelectTrigger className="w-full text-xs">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="print">Eladora Print (Papelería & Impresión)</SelectItem>
                                            <SelectItem value="studio">Eladora Studio (Branding & Diseño)</SelectItem>
                                            <SelectItem value="moments">Eladora Moments (Eventos & Experiencias)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1.5 md:col-span-2">
                                    <Label htmlFor="project_name" className="text-xs">Nombre del Proyecto <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="project_name"
                                        placeholder="ej. 120 Suites de Boda Mariana & Alejandro"
                                        value={data.project_name}
                                        onChange={(e) => setData('project_name', e.target.value)}
                                        required
                                    />
                                    {errors.project_name && <p className="text-xs text-red-500">{errors.project_name}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="service_type" className="text-xs">Tipo de Servicio</Label>
                                    <Input
                                        id="service_type"
                                        value={data.service_type}
                                        onChange={(e) => setData('service_type', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-xs">Prioridad</Label>
                                    <Select
                                        value={data.priority}
                                        onValueChange={(val) => setData('priority', val as any)}
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

                            <div className="space-y-1.5">
                                <Label htmlFor="description" className="text-xs">Descripción y Especificaciones</Label>
                                <Textarea
                                    id="description"
                                    rows={2}
                                    placeholder="Detalles sobre papeles, acabados, colores, tiempos o solicitudes del cliente..."
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="text-xs"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Planning Dates */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold">Calendario y Fechas Clave</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="requested_at" className="text-xs">Fecha Solicitud</Label>
                                    <Input
                                        id="requested_at"
                                        type="date"
                                        value={data.requested_at}
                                        onChange={(e) => setData('requested_at', e.target.value)}
                                        className="text-xs"
                                        required
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="start_planned_at" className="text-xs">Inicio Previsto</Label>
                                    <Input
                                        id="start_planned_at"
                                        type="date"
                                        value={data.start_planned_at}
                                        onChange={(e) => setData('start_planned_at', e.target.value)}
                                        className="text-xs"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="internal_deadline_at" className="text-xs">Fecha Límite Taller</Label>
                                    <Input
                                        id="internal_deadline_at"
                                        type="date"
                                        value={data.internal_deadline_at}
                                        onChange={(e) => setData('internal_deadline_at', e.target.value)}
                                        className="text-xs"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="delivery_agreed_at" className="text-xs font-bold text-primary">
                                        Entrega Acordada Cliente
                                    </Label>
                                    <Input
                                        id="delivery_agreed_at"
                                        type="date"
                                        value={data.delivery_agreed_at}
                                        onChange={(e) => setData('delivery_agreed_at', e.target.value)}
                                        className="text-xs font-semibold"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Financial Terms */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold">Parámetros Financieros Aprobados</CardTitle>
                            <CardDescription>
                                Importe acordado y condiciones de anticipo para el taller
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="approved_amount" className="text-xs font-semibold">
                                        Importe Aprobado ($ MXN) <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="approved_amount"
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={data.approved_amount}
                                        onChange={(e) => handleAmountChange(e.target.value)}
                                        className="text-sm font-bold"
                                        required
                                    />
                                    {errors.approved_amount && <p className="text-xs text-red-500">{errors.approved_amount}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="advance_required" className="text-xs">
                                        Anticipo Requerido ($ MXN)
                                    </Label>
                                    <Input
                                        id="advance_required"
                                        type="number"
                                        step="0.01"
                                        value={data.advance_required}
                                        onChange={(e) => setData('advance_required', e.target.value)}
                                        className="text-sm"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="workshop_overhead_amount" className="text-xs">
                                        Gasto Operativo Taller ($ MXN)
                                    </Label>
                                    <Input
                                        id="workshop_overhead_amount"
                                        type="number"
                                        step="0.01"
                                        value={data.workshop_overhead_amount}
                                        onChange={(e) => setData('workshop_overhead_amount', e.target.value)}
                                        className="text-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="notes" className="text-xs">Notas Internas</Label>
                                <Textarea
                                    id="notes"
                                    rows={2}
                                    placeholder="Instrucciones para colaboradores, notas del cliente..."
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    className="text-xs"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
                                <Link href="/admin/crm-orders">
                                    <Button variant="outline" type="button">Cancelar</Button>
                                </Link>
                                <Button type="submit" disabled={processing} className="gap-2">
                                    <Save className="w-4 h-4" />
                                    <span>Crear Pedido y Generar Tareas</span>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </>
    );
}

OrdersCreate.layout = (page: any) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Pedidos', href: '/admin/crm-orders' },
            { title: 'Nuevo Pedido', href: '/admin/crm-orders/create' },
        ]}
    >
        {page}
    </AppLayout>
);
