import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { UniverseBadge } from '@/components/crm/universe-badge';
import { 
    Settings, 
    Building2, 
    DollarSign, 
    Clock, 
    Hash, 
    CheckCircle2, 
    Layers, 
    Save, 
    BellRing,
    Sparkles
} from 'lucide-react';
import type { Universe } from '@/types/crm';

interface Props {
    settings: Record<string, { key: string; value: string }>;
    templates: Array<{
        id: number;
        universe: Universe;
        name: string;
        description?: string;
        items: Array<{
            id: number;
            title: string;
            category: string;
            default_priority: string;
            days_offset: number;
        }>;
    }>;
}

export default function CrmSettingsIndex({ settings, templates }: Props) {
    const getSetting = (key: string, defaultValue = '') => {
        return settings[key]?.value ?? defaultValue;
    };

    const form = useForm({
        company_name: getSetting('company_name', 'Eladora'),
        company_email: getSetting('company_email', 'contacto@eladoraprint.com'),
        company_phone: getSetting('company_phone', '55 1234 5678'),
        default_currency: getSetting('default_currency', 'MXN'),
        timezone: getSetting('timezone', 'America/Mexico_City'),
        date_format: getSetting('date_format', 'Y-m-d'),
        folio_prefix_print: getSetting('folio_prefix_print', 'PRN'),
        folio_prefix_studio: getSetting('folio_prefix_studio', 'STU'),
        folio_prefix_moments: getSetting('folio_prefix_moments', 'MOM'),
        folio_prefix_quote: getSetting('folio_prefix_quote', 'COT'),
        folio_prefix_purchase: getSetting('folio_prefix_purchase', 'CMP'),
        default_advance_percent: getSetting('default_advance_percent', '50'),
        workshop_overhead_method: getSetting('workshop_overhead_method', 'percent'),
        workshop_overhead_value: getSetting('workshop_overhead_value', '10'),
        alert_upcoming_days: getSetting('alert_upcoming_days', '3'),
        alert_overdue_days: getSetting('alert_overdue_days', '1'),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/admin/crm-settings', {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Configuración Operativa y Financiera - Eladora CRM" />

            <div className="flex flex-col gap-6 p-6 w-full">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/50">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground tracking-tight">
                            Configuración del CRM
                        </h1>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            Parámetros del negocio, prefijos de folios, políticas de anticipo y plantillas operativas.
                        </p>
                    </div>

                    <Button onClick={handleSubmit} disabled={form.processing} className="gap-2 shadow-xs">
                        <Save className="w-4 h-4" />
                        <span>Guardar Cambios</span>
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* General Company Information */}
                    <Card className="bg-card border-border/60 shadow-xs">
                        <CardHeader className="p-4 pb-2 border-b border-border/40">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-primary" />
                                <span>Datos Generales del Negocio</span>
                            </CardTitle>
                            <CardDescription className="text-xs">
                                Información que aparece en cotizaciones y documentos para clientes.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <Label className="text-xs">Nombre Comercial *</Label>
                                    <Input
                                        value={form.data.company_name}
                                        onChange={(e) => form.setData('company_name', e.target.value)}
                                        required
                                        className="mt-1 text-xs"
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs">Correo Electrónico *</Label>
                                    <Input
                                        type="email"
                                        value={form.data.company_email}
                                        onChange={(e) => form.setData('company_email', e.target.value)}
                                        required
                                        className="mt-1 text-xs"
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs">Teléfono / WhatsApp</Label>
                                    <Input
                                        value={form.data.company_phone}
                                        onChange={(e) => form.setData('company_phone', e.target.value)}
                                        className="mt-1 text-xs"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <Label className="text-xs">Moneda Predeterminada *</Label>
                                    <Input
                                        value={form.data.default_currency}
                                        onChange={(e) => form.setData('default_currency', e.target.value)}
                                        required
                                        className="mt-1 text-xs"
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs">Zona Horaria *</Label>
                                    <Input
                                        value={form.data.timezone}
                                        onChange={(e) => form.setData('timezone', e.target.value)}
                                        required
                                        className="mt-1 text-xs"
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs">Formato de Fecha</Label>
                                    <Input
                                        value={form.data.date_format}
                                        onChange={(e) => form.setData('date_format', e.target.value)}
                                        required
                                        className="mt-1 text-xs"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Folio Prefixes */}
                    <Card className="bg-card border-border/60 shadow-xs">
                        <CardHeader className="p-4 pb-2 border-b border-border/40">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <Hash className="w-4 h-4 text-primary" />
                                <span>Prefijos de Folios y Secuencias</span>
                            </CardTitle>
                            <CardDescription className="text-xs">
                                Estructura de folios para mantener orden independiente entre universos y cotizaciones.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                                <div>
                                    <Label className="text-xs">Print</Label>
                                    <Input
                                        value={form.data.folio_prefix_print}
                                        onChange={(e) => form.setData('folio_prefix_print', e.target.value)}
                                        required
                                        className="mt-1 text-xs font-mono"
                                    />
                                    <span className="text-[10px] text-muted-foreground mt-0.5 block">Ej: PRN-2026-0001</span>
                                </div>
                                <div>
                                    <Label className="text-xs">Studio</Label>
                                    <Input
                                        value={form.data.folio_prefix_studio}
                                        onChange={(e) => form.setData('folio_prefix_studio', e.target.value)}
                                        required
                                        className="mt-1 text-xs font-mono"
                                    />
                                    <span className="text-[10px] text-muted-foreground mt-0.5 block">Ej: STU-2026-0001</span>
                                </div>
                                <div>
                                    <Label className="text-xs">Moments</Label>
                                    <Input
                                        value={form.data.folio_prefix_moments}
                                        onChange={(e) => form.setData('folio_prefix_moments', e.target.value)}
                                        required
                                        className="mt-1 text-xs font-mono"
                                    />
                                    <span className="text-[10px] text-muted-foreground mt-0.5 block">Ej: MOM-2026-0001</span>
                                </div>
                                <div>
                                    <Label className="text-xs">Cotizaciones</Label>
                                    <Input
                                        value={form.data.folio_prefix_quote}
                                        onChange={(e) => form.setData('folio_prefix_quote', e.target.value)}
                                        required
                                        className="mt-1 text-xs font-mono"
                                    />
                                    <span className="text-[10px] text-muted-foreground mt-0.5 block">Ej: COT-2026-0001</span>
                                </div>
                                <div>
                                    <Label className="text-xs">Compras Proveedor</Label>
                                    <Input
                                        value={form.data.folio_prefix_purchase}
                                        onChange={(e) => form.setData('folio_prefix_purchase', e.target.value)}
                                        required
                                        className="mt-1 text-xs font-mono"
                                    />
                                    <span className="text-[10px] text-muted-foreground mt-0.5 block">Ej: CMP-2026-0001</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Financial Policies & Overhead */}
                    <Card className="bg-card border-border/60 shadow-xs">
                        <CardHeader className="p-4 pb-2 border-b border-border/40">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-emerald-600" />
                                <span>Políticas Financieras y Gastos de Taller</span>
                            </CardTitle>
                            <CardDescription className="text-xs">
                                Porcentaje de anticipo solicitado por omisión y método de cálculo de overhead de taller.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <Label className="text-xs">Anticipo Requerido Predeterminado (%) *</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={form.data.default_advance_percent}
                                        onChange={(e) => form.setData('default_advance_percent', e.target.value)}
                                        required
                                        className="mt-1 text-xs font-mono"
                                    />
                                    <span className="text-[10px] text-muted-foreground mt-0.5 block">
                                        Habitual: 50% al aceptar cotización
                                    </span>
                                </div>
                                <div>
                                    <Label className="text-xs">Método de Gasto de Taller (Overhead) *</Label>
                                    <select
                                        value={form.data.workshop_overhead_method}
                                        onChange={(e) => form.setData('workshop_overhead_method', e.target.value)}
                                        className="w-full mt-1 text-xs rounded-md border border-input bg-background px-3 py-2 text-foreground"
                                    >
                                        <option value="percent">Porcentaje del Precio de Venta</option>
                                        <option value="fixed">Monto Fijo por Pedido</option>
                                        <option value="manual">Manual por Pedido</option>
                                    </select>
                                </div>
                                <div>
                                    <Label className="text-xs">Valor del Overhead (% o MXN) *</Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        value={form.data.workshop_overhead_value}
                                        onChange={(e) => form.setData('workshop_overhead_value', e.target.value)}
                                        required
                                        className="mt-1 text-xs font-mono"
                                    />
                                    <span className="text-[10px] text-muted-foreground mt-0.5 block">
                                        Cubre empaque, luz y merma de taller
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Operational Alerts */}
                    <Card className="bg-card border-border/60 shadow-xs">
                        <CardHeader className="p-4 pb-2 border-b border-border/40">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <BellRing className="w-4 h-4 text-amber-600" />
                                <span>Parámetros de Alertas y Vencimientos</span>
                            </CardTitle>
                            <CardDescription className="text-xs">
                                Umbrales de días para destacar tareas y entregas en el Dashboard y Calendario.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-xs">Días de Anticipación para "Próximas Entregas" *</Label>
                                    <Input
                                        type="number"
                                        min="1"
                                        value={form.data.alert_upcoming_days}
                                        onChange={(e) => form.setData('alert_upcoming_days', e.target.value)}
                                        required
                                        className="mt-1 text-xs font-mono"
                                    />
                                    <span className="text-[10px] text-muted-foreground mt-0.5 block">
                                        Pedidos que vencen dentro de los próximos N días
                                    </span>
                                </div>
                                <div>
                                    <Label className="text-xs">Días de Tolerancia antes de Marcar "Vencida" *</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        value={form.data.alert_overdue_days}
                                        onChange={(e) => form.setData('alert_overdue_days', e.target.value)}
                                        required
                                        className="mt-1 text-xs font-mono"
                                    />
                                    <span className="text-[10px] text-muted-foreground mt-0.5 block">
                                        Tareas no completadas al llegar a la fecha límite
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Operational Task Templates per Universe */}
                    <Card className="bg-card border-border/60 shadow-xs">
                        <CardHeader className="p-4 pb-2 border-b border-border/40">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <Layers className="w-4 h-4 text-primary" />
                                <span>Plantillas de Trabajo por Universo</span>
                            </CardTitle>
                            <CardDescription className="text-xs">
                                Tareas operativas que se inicializan automáticamente al convertir una cotización en pedido.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 space-y-6">
                            {templates.map((tpl) => (
                                <div key={tpl.id} className="border border-border/40 rounded-xl p-4 bg-muted/10 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <UniverseBadge universe={tpl.universe} size="sm" />
                                            <h3 className="font-semibold text-sm text-foreground">{tpl.name}</h3>
                                        </div>
                                        <Badge variant="outline" className="text-xs">
                                            {tpl.items.length} tareas automáticas
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{tpl.description}</p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-1">
                                        {tpl.items.map((item, index) => (
                                            <div key={item.id} className="bg-card p-2 rounded-lg border border-border/40 text-xs flex items-center gap-2">
                                                <span className="font-mono text-muted-foreground font-bold w-4 text-right">
                                                    {index + 1}.
                                                </span>
                                                <span className="font-medium text-foreground line-clamp-1 flex-1">
                                                    {item.title}
                                                </span>
                                                <Badge variant="secondary" className="text-[9px] px-1 py-0">
                                                    +{item.days_offset}d
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="submit" disabled={form.processing} className="gap-2 shadow-xs">
                            <Save className="w-4 h-4" />
                            <span>Guardar Configuración</span>
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

SettingsIndex.layout = (page: any) => (
    <AppLayout breadcrumbs={[{ title: 'Configuración del CRM', href: '/admin/crm-settings' }]}>
        {page}
    </AppLayout>
);
