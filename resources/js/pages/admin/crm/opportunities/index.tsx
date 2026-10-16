import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { UniverseSelector } from '@/components/crm/universe-selector';
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
    Target, 
    PlusCircle, 
    Kanban, 
    Table as TableIcon, 
    Calendar, 
    User, 
    ArrowRight, 
    FileText, 
    MoreHorizontal,
    Phone,
    Flame
} from 'lucide-react';
import type { Opportunity, Client, Universe } from '@/types/crm';

interface Props {
    opportunities: Opportunity[];
    stages: Record<string, string>;
    clients: Array<{ id: number; name: string; business_name?: string | null; phone?: string | null }>;
    users: Array<{ id: number; name: string }>;
    filters: {
        universe: Universe | 'all';
        stage?: string;
        priority?: string;
        view: 'kanban' | 'table';
    };
}

export default function OpportunitiesIndex({
    opportunities,
    stages,
    clients,
    users,
    filters,
}: Props) {
    const [view, setView] = useState<'kanban' | 'table'>(filters.view || 'kanban');
    const [createModalOpen, setCreateModalOpen] = useState(false);

    // New Opportunity form
    const form = useForm({
        client_id: clients[0]?.id ? String(clients[0].id) : '',
        universe: (filters.universe !== 'all' ? filters.universe : 'print') as Universe,
        title: '',
        description: '',
        contact_channel: 'whatsapp',
        entry_date: new Date().toISOString().split('T')[0],
        next_followup_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        assigned_to: users[0]?.id ? String(users[0].id) : '',
        priority: 'medium',
        estimated_amount: '',
        stage: 'nuevo_contacto',
        notes: '',
    });

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/admin/opportunities', {
            onSuccess: () => {
                setCreateModalOpen(false);
                form.reset();
            },
        });
    };

    const handleStageChange = (oppId: number, newStage: string) => {
        router.put(`/admin/opportunities/${oppId}`, { stage: newStage }, { preserveScroll: true });
    };

    const handleConvertToQuotation = (oppId: number) => {
        router.post(`/admin/opportunities/${oppId}/convert-to-quotation`);
    };

    return (
        <>
            <Head title="Embudo de Ventas (CRM) - Eladora" />

            <div className="flex flex-col gap-6 p-6 w-full">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/50">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground tracking-tight">
                                Oportunidades & Embudo
                            </h1>
                            <UniverseBadge universe={filters.universe} size="sm" />
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            Seguimiento de prospectos desde el primer contacto hasta el cierre de venta.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                        <UniverseSelector currentUniverse={filters.universe} />

                        {/* View Switcher */}
                        <div className="inline-flex rounded-lg border border-border bg-muted/40 p-0.5 text-xs">
                            <button
                                type="button"
                                onClick={() => setView('kanban')}
                                className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-colors ${
                                    view === 'kanban' ? 'bg-background shadow-2xs font-semibold' : 'text-muted-foreground'
                                }`}
                            >
                                <Kanban className="w-3.5 h-3.5" />
                                <span>Tablero</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setView('table')}
                                className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-colors ${
                                    view === 'table' ? 'bg-background shadow-2xs font-semibold' : 'text-muted-foreground'
                                }`}
                            >
                                <TableIcon className="w-3.5 h-3.5" />
                                <span>Tabla</span>
                            </button>
                        </div>

                        <Button onClick={() => setCreateModalOpen(true)} className="gap-2 shadow-xs">
                            <PlusCircle className="w-4 h-4" />
                            <span>Nueva Oportunidad</span>
                        </Button>
                    </div>
                </div>

                {/* View: Kanban */}
                {view === 'kanban' && (
                    <div className="overflow-x-auto pb-4">
                        <div className="flex gap-4 min-w-[1300px]">
                            {Object.entries(stages).map(([stageKey, stageLabel]) => {
                                const stageItems = opportunities.filter((o) => o.stage === stageKey);
                                const stageTotalAmount = stageItems.reduce((acc, curr) => acc + (Number(curr.estimated_amount) || 0), 0);

                                return (
                                    <div
                                        key={stageKey}
                                        className="flex-1 min-w-[260px] max-w-[320px] bg-muted/30 rounded-xl p-3 border border-border/50 flex flex-col"
                                    >
                                        {/* Column Header */}
                                        <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/40">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-xs tracking-tight text-foreground">
                                                    {stageLabel}
                                                </span>
                                                <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-background font-bold text-muted-foreground border">
                                                    {stageItems.length}
                                                </span>
                                            </div>
                                            {stageTotalAmount > 0 && (
                                                <span className="text-[11px] font-bold text-muted-foreground">
                                                    <MoneyDisplay amount={stageTotalAmount} />
                                                </span>
                                            )}
                                        </div>

                                        {/* Column Items */}
                                        <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[680px]">
                                            {stageItems.length === 0 ? (
                                                <div className="py-6 text-center text-[11px] text-muted-foreground/60 border border-dashed rounded-lg">
                                                    Sin oportunidades
                                                </div>
                                            ) : (
                                                stageItems.map((item) => (
                                                    <Card key={item.id} className="shadow-2xs hover:shadow-xs transition-shadow border-border/70 p-3 flex flex-col gap-2">
                                                        <div className="flex items-center justify-between">
                                                            <span className="font-mono text-[10px] text-muted-foreground font-bold">
                                                                {item.folio}
                                                            </span>
                                                            <UniverseBadge universe={item.universe} size="sm" showIcon={false} />
                                                        </div>

                                                        <div>
                                                            <h4 className="font-semibold text-xs text-foreground leading-snug">
                                                                {item.title}
                                                            </h4>
                                                            <p className="text-[11px] text-muted-foreground font-medium truncate mt-0.5">
                                                                {item.client?.name} {item.client?.business_name ? `(${item.client.business_name})` : ''}
                                                            </p>
                                                        </div>

                                                        <div className="flex items-center justify-between text-xs pt-1 border-t border-border/40">
                                                            <span className="font-bold text-primary">
                                                                <MoneyDisplay amount={item.estimated_amount || 0} />
                                                            </span>
                                                            <StatusBadge type="priority" status={item.priority} size="sm" />
                                                        </div>

                                                        {item.next_followup_date && (
                                                            <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                                <Calendar className="w-3 h-3 text-amber-600" />
                                                                <span>Seguimiento: {item.next_followup_date}</span>
                                                            </div>
                                                        )}

                                                        {/* Action shortcuts */}
                                                        <div className="flex items-center justify-between pt-1 gap-1">
                                                            {stageKey !== 'confirmado' && (
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    className="text-[10px] h-6 px-1.5 gap-1 text-primary hover:text-primary font-semibold"
                                                                    onClick={() => handleConvertToQuotation(item.id)}
                                                                >
                                                                    <FileText className="w-3 h-3" />
                                                                    <span>Cotizar</span>
                                                                </Button>
                                                            )}

                                                            <Select
                                                                value={item.stage}
                                                                onValueChange={(val) => handleStageChange(item.id, val)}
                                                            >
                                                                <SelectTrigger className="h-6 text-[10px] px-1.5 border-dashed">
                                                                    <SelectValue placeholder="Mover..." />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {Object.entries(stages).map(([stKey, stLabel]) => (
                                                                        <SelectItem key={stKey} value={stKey} className="text-xs">
                                                                            {stLabel}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </Card>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* View: Table */}
                {view === 'table' && (
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold">Todas las Oportunidades</CardTitle>
                            <CardDescription>{opportunities.length} oportunidades registradas</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm border-t border-border/50">
                                    <thead className="bg-muted/40 text-xs font-semibold text-muted-foreground uppercase">
                                        <tr>
                                            <th className="py-2.5 px-4">Folio</th>
                                            <th className="py-2.5 px-4">Universo / Título</th>
                                            <th className="py-2.5 px-4">Cliente</th>
                                            <th className="py-2.5 px-4">Etapa Comercial</th>
                                            <th className="py-2.5 px-4">Prioridad</th>
                                            <th className="py-2.5 px-4">Próx. Seguimiento</th>
                                            <th className="py-2.5 px-4 text-right">Importe Est.</th>
                                            <th className="py-2.5 px-4 text-right">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/40">
                                        {opportunities.length === 0 ? (
                                            <tr>
                                                <td colSpan={8} className="py-8 text-center text-muted-foreground">
                                                    No hay oportunidades registradas.
                                                </td>
                                            </tr>
                                        ) : (
                                            opportunities.map((opp) => (
                                                <tr key={opp.id} className="hover:bg-muted/20">
                                                    <td className="py-3 px-4 font-mono font-bold text-xs">{opp.folio}</td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center gap-1.5">
                                                            <UniverseBadge universe={opp.universe} size="sm" showIcon={false} />
                                                            <span className="font-medium text-foreground">{opp.title}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4 text-xs">
                                                        <Link href={`/admin/clients/${opp.client_id}`} className="font-semibold hover:underline">
                                                            {opp.client?.name}
                                                        </Link>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <span className="text-xs px-2 py-0.5 rounded-full bg-muted border font-medium capitalize">
                                                            {stages[opp.stage] || opp.stage}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <StatusBadge type="priority" status={opp.priority} size="sm" />
                                                    </td>
                                                    <td className="py-3 px-4 text-xs text-muted-foreground">
                                                        {opp.next_followup_date || 'Sin programar'}
                                                    </td>
                                                    <td className="py-3 px-4 text-right font-bold text-primary">
                                                        <MoneyDisplay amount={opp.estimated_amount || 0} />
                                                    </td>
                                                    <td className="py-3 px-4 text-right">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleConvertToQuotation(opp.id)}
                                                            className="text-xs h-7 gap-1"
                                                        >
                                                            <FileText className="w-3.5 h-3.5" />
                                                            <span>Cotizar</span>
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
                )}

                {/* Modal to Create Opportunity */}
                <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle className="font-serif text-lg">Registrar Nueva Oportunidad</DialogTitle>
                            <DialogDescription>
                                Añade un prospecto al embudo comercial de Eladora.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleCreateSubmit} className="space-y-3.5 pt-2">
                            <div className="space-y-1">
                                <Label className="text-xs">Cliente <span className="text-red-500">*</span></Label>
                                <Select
                                    value={form.data.client_id}
                                    onValueChange={(val) => form.setData('client_id', val)}
                                >
                                    <SelectTrigger className="w-full text-xs">
                                        <SelectValue placeholder="Selecciona un cliente..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {clients.map((c) => (
                                            <SelectItem key={c.id} value={String(c.id)}>
                                                {c.name} {c.business_name ? `(${c.business_name})` : ''}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label className="text-xs">Universo de Negocio</Label>
                                    <Select
                                        value={form.data.universe}
                                        onValueChange={(val) => form.setData('universe', val as Universe)}
                                    >
                                        <SelectTrigger className="w-full text-xs">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="print">Eladora Print</SelectItem>
                                            <SelectItem value="studio">Eladora Studio</SelectItem>
                                            <SelectItem value="moments">Eladora Moments</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-xs">Prioridad</Label>
                                    <Select
                                        value={form.data.priority}
                                        onValueChange={(val) => form.setData('priority', val as any)}
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
                                <Label htmlFor="title" className="text-xs">Servicio Solicitado / Título <span className="text-red-500">*</span></Label>
                                <Input
                                    id="title"
                                    placeholder="ej. 150 Invitaciones Finas con lacre y foil"
                                    value={form.data.title}
                                    onChange={(e) => form.setData('title', e.target.value)}
                                    className="text-xs"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label htmlFor="estimated_amount" className="text-xs">Monto Estimado ($ MXN)</Label>
                                    <Input
                                        id="estimated_amount"
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={form.data.estimated_amount}
                                        onChange={(e) => form.setData('estimated_amount', e.target.value)}
                                        className="text-xs"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <Label htmlFor="next_followup_date" className="text-xs">Próximo Seguimiento</Label>
                                    <Input
                                        id="next_followup_date"
                                        type="date"
                                        value={form.data.next_followup_date}
                                        onChange={(e) => form.setData('next_followup_date', e.target.value)}
                                        className="text-xs"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="description" className="text-xs">Descripción de la Necesidad</Label>
                                <Textarea
                                    id="description"
                                    rows={2}
                                    placeholder="Detalles sobre materiales, temática o fecha del evento..."
                                    value={form.data.description}
                                    onChange={(e) => form.setData('description', e.target.value)}
                                    className="text-xs"
                                />
                            </div>

                            <DialogFooter className="pt-2">
                                <Button type="button" variant="outline" size="sm" onClick={() => setCreateModalOpen(false)}>
                                    Cancelar
                                </Button>
                                <Button type="submit" size="sm" disabled={form.processing}>
                                    Guardar Oportunidad
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}

OpportunitiesIndex.layout = (page: any) => (
    <AppLayout breadcrumbs={[{ title: 'Oportunidades Comerciales', href: '/admin/opportunities' }]}>
        {page}
    </AppLayout>
);
