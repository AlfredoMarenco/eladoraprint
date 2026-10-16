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
import { ArrowLeft, Save, Plus, Trash2, Calculator } from 'lucide-react';
import type { Universe, QuotationItem } from '@/types/crm';

interface Props {
    clients: Array<{ id: number; name: string; business_name?: string | null }>;
    selected_client_id?: number | null;
    default_advance_percent: number;
}

export default function QuotationsCreate({ clients, selected_client_id, default_advance_percent = 50 }: Props) {
    const [items, setItems] = useState<QuotationItem[]>([
        { concept: '', description: '', quantity: 1, unit_price: 0, subtotal: 0 },
    ]);
    const [discount, setDiscount] = useState<number>(0);
    const [advanceRequired, setAdvanceRequired] = useState<number | null>(null);

    const subtotal = items.reduce((sum, item) => sum + (Number(item.subtotal) || 0), 0);
    const totalAmount = Math.max(0, subtotal - discount);
    const calculatedAdvance = advanceRequired !== null ? advanceRequired : roundToTwo((totalAmount * default_advance_percent) / 100);

    function roundToTwo(num: number) {
        return Math.round((num + Number.EPSILON) * 100) / 100;
    }

    const { data, setData, post, processing, errors, transform } = useForm({
        client_id: selected_client_id ? String(selected_client_id) : (clients[0]?.id ? String(clients[0].id) : ''),
        universe: 'print' as Universe,
        project_name: '',
        description: '',
        items: items,
        discount: 0,
        advance_required: calculatedAdvance,
        payment_terms: '50% de anticipo para iniciar diseño y producción. 50% restante contra entrega.',
        estimated_delivery_time: '12 a 15 días hábiles a partir de la aprobación de pruebas.',
        expiration_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        notes: '',
    });

    const updateItem = (index: number, field: keyof QuotationItem, value: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };

        if (field === 'quantity' || field === 'unit_price') {
            const qty = field === 'quantity' ? Number(value) || 0 : Number(newItems[index].quantity) || 0;
            const price = field === 'unit_price' ? Number(value) || 0 : Number(newItems[index].unit_price) || 0;
            newItems[index].subtotal = roundToTwo(qty * price);
        }

        setItems(newItems);
        setData('items', newItems);
    };

    const addItem = () => {
        const updated = [...items, { concept: '', description: '', quantity: 1, unit_price: 0, subtotal: 0 }];
        setItems(updated);
        setData('items', updated);
    };

    const removeItem = (index: number) => {
        if (items.length <= 1) return;
        const updated = items.filter((_, i) => i !== index);
        setItems(updated);
        setData('items', updated);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        transform((currentData) => ({
            ...currentData,
            items,
            discount,
            advance_required: calculatedAdvance,
        }));
        post('/admin/quotations');
    };

    return (
        <>
            <Head title="Nueva Cotización - Eladora CRM" />

            <div className="flex flex-col gap-6 p-6 w-full">
                <div className="flex items-center justify-between pb-2 border-b border-border/50">
                    <div className="flex items-center gap-3">
                        <Link href="/admin/quotations">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-serif font-bold text-foreground tracking-tight">
                                Crear Nueva Cotización
                            </h1>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Elabora una propuesta formal para el cliente con desglose de partidas.
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* General Project Info */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold">Datos del Proyecto y Cliente</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                    <Label className="text-xs">Universo de Negocio</Label>
                                    <Select
                                        value={data.universe}
                                        onValueChange={(val) => setData('universe', val as Universe)}
                                    >
                                        <SelectTrigger className="w-full text-xs">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="print">Eladora Print (Impresión & Papelería)</SelectItem>
                                            <SelectItem value="studio">Eladora Studio (Diseño & Branding)</SelectItem>
                                            <SelectItem value="moments">Eladora Moments (Eventos & Experiencias)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="expiration_date" className="text-xs">Fecha de Vencimiento</Label>
                                    <Input
                                        id="expiration_date"
                                        type="date"
                                        value={data.expiration_date}
                                        onChange={(e) => setData('expiration_date', e.target.value)}
                                        className="text-xs"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="project_name" className="text-xs">Nombre del Proyecto <span className="text-red-500">*</span></Label>
                                <Input
                                    id="project_name"
                                    placeholder="ej. Suite de Invitaciones Finas Mariana & Alejandro"
                                    value={data.project_name}
                                    onChange={(e) => setData('project_name', e.target.value)}
                                    required
                                />
                                {errors.project_name && <p className="text-xs text-red-500">{errors.project_name}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="description" className="text-xs">Descripción del Alcance / Brief General</Label>
                                <Textarea
                                    id="description"
                                    rows={2}
                                    placeholder="Breve descripción del concepto estético, especificaciones acordadas o notas..."
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="text-xs"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Line Items Builder */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <div>
                                <CardTitle className="text-base font-semibold">Partidas y Conceptos de la Cotización</CardTitle>
                                <CardDescription>Desglose de servicios, materiales o piezas incluidas</CardDescription>
                            </div>
                            <Button type="button" variant="outline" size="sm" onClick={addItem} className="gap-1.5 h-7 text-xs">
                                <Plus className="w-3.5 h-3.5" />
                                <span>Agregar Partida</span>
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {items.map((item, idx) => (
                                <div key={idx} className="p-3 bg-muted/20 border border-border/60 rounded-xl space-y-2">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="font-bold text-xs text-muted-foreground">Partida #{idx + 1}</span>
                                        {items.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 text-red-500 hover:text-red-700"
                                                onClick={() => removeItem(idx)}
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                                        <div className="md:col-span-5 space-y-1">
                                            <Label className="text-[11px]">Concepto <span className="text-red-500">*</span></Label>
                                            <Input
                                                placeholder="ej. Invitación Principal en Algodón 350g"
                                                value={item.concept}
                                                onChange={(e) => updateItem(idx, 'concept', e.target.value)}
                                                className="text-xs h-8"
                                                required
                                            />
                                        </div>

                                        <div className="md:col-span-3 space-y-1">
                                            <Label className="text-[11px]">Detalle / Acabado</Label>
                                            <Input
                                                placeholder="ej. Foil Oro + Lacre perla"
                                                value={item.description || ''}
                                                onChange={(e) => updateItem(idx, 'description', e.target.value)}
                                                className="text-xs h-8"
                                            />
                                        </div>

                                        <div className="md:col-span-1 space-y-1">
                                            <Label className="text-[11px]">Cant.</Label>
                                            <Input
                                                type="number"
                                                min="0.01"
                                                step="any"
                                                value={item.quantity}
                                                onChange={(e) => updateItem(idx, 'quantity', e.target.value)}
                                                className="text-xs h-8"
                                                required
                                            />
                                        </div>

                                        <div className="md:col-span-1.5 space-y-1">
                                            <Label className="text-[11px]">P. Unitario ($)</Label>
                                            <Input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={item.unit_price}
                                                onChange={(e) => updateItem(idx, 'unit_price', e.target.value)}
                                                className="text-xs h-8"
                                                required
                                            />
                                        </div>

                                        <div className="md:col-span-1.5 space-y-1">
                                            <Label className="text-[11px]">Subtotal</Label>
                                            <div className="h-8 flex items-center justify-end px-2 bg-muted/40 rounded-md border text-xs font-bold text-foreground">
                                                <MoneyDisplay amount={item.subtotal} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Financial totals calculation box */}
                            <div className="flex flex-col sm:flex-row justify-end items-end gap-6 pt-4 border-t border-border/50">
                                <div className="w-full sm:w-72 space-y-2 text-sm">
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>Subtotal:</span>
                                        <span className="font-semibold text-foreground"><MoneyDisplay amount={subtotal} /></span>
                                    </div>

                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-muted-foreground text-xs">Descuento ($):</span>
                                        <Input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={discount}
                                            onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                                            className="h-7 w-28 text-right text-xs"
                                        />
                                    </div>

                                    <div className="flex justify-between text-base font-bold pt-2 border-t border-border/40 text-foreground">
                                        <span>Total Cotizado:</span>
                                        <span className="text-primary font-serif text-lg"><MoneyDisplay amount={totalAmount} /></span>
                                    </div>

                                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/20 text-xs">
                                        <span className="text-muted-foreground">Anticipo requerido:</span>
                                        <Input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={calculatedAdvance}
                                            onChange={(e) => setAdvanceRequired(Number(e.target.value) || 0)}
                                            className="h-7 w-28 text-right text-xs font-semibold"
                                        />
                                    </div>
                                    <p className="text-[10px] text-muted-foreground text-right">
                                        Calculado al {default_advance_percent}% de anticipo
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Terms & Conditions */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold">Términos Comerciales y Entregas</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="payment_terms" className="text-xs">Condiciones de Pago</Label>
                                    <Input
                                        id="payment_terms"
                                        value={data.payment_terms}
                                        onChange={(e) => setData('payment_terms', e.target.value)}
                                        className="text-xs"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="estimated_delivery_time" className="text-xs">Tiempo Estimado de Entrega</Label>
                                    <Input
                                        id="estimated_delivery_time"
                                        value={data.estimated_delivery_time}
                                        onChange={(e) => setData('estimated_delivery_time', e.target.value)}
                                        className="text-xs"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="notes" className="text-xs">Notas Adicionales en la Propuesta</Label>
                                <Textarea
                                    id="notes"
                                    rows={2}
                                    placeholder="Incluye recomendaciones de cuidado, aclaraciones sobre colores o vigencia..."
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    className="text-xs"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
                                <Link href="/admin/quotations">
                                    <Button variant="outline" type="button">Cancelar</Button>
                                </Link>
                                <Button type="submit" disabled={processing} className="gap-2">
                                    <Save className="w-4 h-4" />
                                    <span>Guardar Cotización</span>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </>
    );
}

QuotationsCreate.layout = (page: any) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Cotizaciones', href: '/admin/quotations' },
            { title: 'Nueva Cotización', href: '/admin/quotations/create' },
        ]}
    >
        {page}
    </AppLayout>
);
