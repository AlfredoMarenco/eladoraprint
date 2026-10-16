import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { MoneyDisplay } from '@/components/crm/money-display';
import { UniverseBadge } from '@/components/crm/universe-badge';
import { 
    Calculator, 
    Plus, 
    Copy, 
    Trash2, 
    FileCheck2, 
    TrendingUp, 
    RefreshCw, 
    Columns, 
    DollarSign,
    Sparkles,
    AlertCircle,
    ArrowRight
} from 'lucide-react';
import type { CrmSimulationScenario, Universe } from '@/types/crm';

interface Props {
    scenarios: CrmSimulationScenario[];
    clients: Array<{ id: number; name: string }>;
}

export default function SimulationsIndex({ scenarios, clients }: Props) {
    const [selectedScenarioForQuotation, setSelectedScenarioForQuotation] = useState<CrmSimulationScenario | null>(null);
    const [selectedClientId, setSelectedClientId] = useState('');
    const [comparingScenarioIds, setComparingScenarioIds] = useState<number[]>([]);

    // Live Simulator State
    const [name, setName] = useState('Nuevo Escenario');
    const [universe, setUniverse] = useState<Universe>('print');
    const [serviceType, setServiceType] = useState('Papelería Corporativa');
    const [quantity, setQuantity] = useState(100);
    const [salePrice, setSalePrice] = useState(3500);
    const [workshopOverhead, setWorkshopOverhead] = useState(350);
    const [notes, setNotes] = useState('');

    const [costItems, setCostItems] = useState([
        { category: 'materiales', concept: 'Papel y cartulina especial', amount: 800 },
        { category: 'impresion_externa', concept: 'Offset / Laminado', amount: 500 },
        { category: 'acabados', concept: 'Hot Stamping Foil oro', amount: 450 },
        { category: 'empaque', concept: 'Cajas personalizadas', amount: 200 },
    ]);

    // Live calculations
    const itemsTotal = costItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const totalCosts = itemsTotal + (Number(workshopOverhead) || 0);
    const estimatedProfit = Number(salePrice) - totalCosts;
    const marginPercent = Number(salePrice) > 0 ? ((estimatedProfit / Number(salePrice)) * 100).toFixed(1) : '0';
    const unitPrice = quantity > 0 ? (Number(salePrice) / quantity).toFixed(2) : '0';
    const unitCost = quantity > 0 ? (totalCosts / quantity).toFixed(2) : '0';

    const addCostItem = () => {
        setCostItems([...costItems, { category: 'materiales', concept: 'Partida adicional', amount: 0 }]);
    };

    const updateCostItem = (index: number, field: string, value: string | number) => {
        const next = [...costItems];
        next[index] = { ...next[index], [field]: value };
        setCostItems(next);
    };

    const removeCostItem = (index: number) => {
        setCostItems(costItems.filter((_, i) => i !== index));
    };

    const handleSaveScenario = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/admin/simulations', {
            name,
            universe,
            service_type: serviceType,
            quantity,
            proposed_sale_price: salePrice,
            workshop_overhead_amount: workshopOverhead,
            notes,
            cost_items: costItems,
        }, {
            onSuccess: () => {
                // Keep values, alert
            },
        });
    };

    const handleDuplicate = (id: number) => {
        router.post(`/admin/simulations/${id}/duplicate`);
    };

    const handleDelete = (id: number) => {
        if (confirm('¿Eliminar este escenario guardado?')) {
            router.delete(`/admin/simulations/${id}`);
        }
    };

    const handleConvertToQuotation = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedScenarioForQuotation || !selectedClientId) return;

        router.post(`/admin/simulations/${selectedScenarioForQuotation.id}/convert-to-quotation`, {
            client_id: selectedClientId,
        });
    };

    const toggleCompare = (id: number) => {
        if (comparingScenarioIds.includes(id)) {
            setComparingScenarioIds(comparingScenarioIds.filter(i => i !== id));
        } else {
            if (comparingScenarioIds.length >= 3) {
                alert('Puedes comparar hasta 3 escenarios simultáneamente.');
                return;
            }
            setComparingScenarioIds([...comparingScenarioIds, id]);
        }
    };

    const loadScenarioIntoSimulator = (s: CrmSimulationScenario) => {
        setName(s.name);
        setUniverse(s.universe);
        setServiceType(s.service_type || '');
        setQuantity(s.quantity);
        setSalePrice(s.proposed_sale_price);
        setWorkshopOverhead(s.workshop_overhead_amount);
        setNotes(s.notes || '');
        if (s.cost_items && s.cost_items.length > 0) {
            setCostItems(s.cost_items.map(i => ({ category: i.category, concept: i.concept, amount: Number(i.amount) })));
        }
    };

    const resetSimulator = () => {
        setName('Nuevo Escenario');
        setUniverse('print');
        setServiceType('');
        setQuantity(100);
        setSalePrice(3000);
        setWorkshopOverhead(300);
        setCostItems([
            { category: 'materiales', concept: 'Papel y sustrato', amount: 600 },
        ]);
        setNotes('');
    };

    return (
        <>
            <Head title="Simulador de Precios y Escenarios - Eladora CRM" />

            <div className="flex flex-col gap-6 p-6 w-full">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/50">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground tracking-tight flex items-center gap-2">
                            <span>Simulador de Cotizaciones</span>
                            <Badge variant="secondary" className="text-xs">Sandbox Experimental</Badge>
                        </h1>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            Experimenta con precios de venta, costos de taller y márgenes sin alterar la base de datos real.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={resetSimulator} className="gap-1.5 text-xs">
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Restablecer</span>
                        </Button>
                    </div>
                </div>

                {/* Main Simulator Card */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Form: Inputs & Costs (7 cols) */}
                    <div className="lg:col-span-7 space-y-4">
                        <Card className="bg-card border-border/60 shadow-xs">
                            <CardHeader className="p-4 pb-2 border-b border-border/40">
                                <CardTitle className="text-sm font-semibold flex items-center justify-between">
                                    <span>Parámetros del Escenario</span>
                                    <div className="flex items-center gap-1">
                                        {(['print', 'studio', 'moments'] as Universe[]).map((u) => (
                                            <button
                                                key={u}
                                                type="button"
                                                onClick={() => setUniverse(u)}
                                                className={`px-2 py-0.5 text-[11px] rounded font-medium capitalize transition-colors ${
                                                    universe === u ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
                                                }`}
                                            >
                                                {u}
                                            </button>
                                        ))}
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <Label className="text-xs">Nombre del Escenario</Label>
                                        <Input
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="mt-1 text-xs"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs">Tipo de Servicio / Producto</Label>
                                        <Input
                                            value={serviceType}
                                            onChange={(e) => setServiceType(e.target.value)}
                                            placeholder="Ej: Invitaciones de Boda, Branding..."
                                            className="mt-1 text-xs"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <Label className="text-xs">Cantidad / Unidades</Label>
                                        <Input
                                            type="number"
                                            min="1"
                                            value={quantity}
                                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                            className="mt-1 text-xs font-mono"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs">Precio de Venta Propuesto *</Label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={salePrice}
                                            onChange={(e) => setSalePrice(parseFloat(e.target.value) || 0)}
                                            className="mt-1 text-xs font-mono font-semibold"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs">Gasto Operativo Taller (Overhead)</Label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={workshopOverhead}
                                            onChange={(e) => setWorkshopOverhead(parseFloat(e.target.value) || 0)}
                                            className="mt-1 text-xs font-mono"
                                        />
                                    </div>
                                </div>

                                {/* Cost items table */}
                                <div className="space-y-2 pt-2 border-t border-border/40">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-foreground">Desglose de Costos de Producción</span>
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="outline"
                                            onClick={addCostItem}
                                            className="h-7 text-[11px] gap-1"
                                        >
                                            <Plus className="w-3 h-3" />
                                            <span>Añadir Partida</span>
                                        </Button>
                                    </div>

                                    <div className="space-y-2">
                                        {costItems.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-2 bg-muted/20 p-2 rounded-lg border border-border/30">
                                                <select
                                                    value={item.category}
                                                    onChange={(e) => updateCostItem(idx, 'category', e.target.value)}
                                                    className="w-32 text-[11px] rounded border border-input bg-background px-2 py-1 text-foreground"
                                                >
                                                    <option value="materiales">Materiales</option>
                                                    <option value="impresion_externa">Impresión Externa</option>
                                                    <option value="acabados">Acabados</option>
                                                    <option value="mano_obra">Mano de Obra</option>
                                                    <option value="empaque">Empaque</option>
                                                    <option value="logistica">Logística</option>
                                                    <option value="otro">Otro</option>
                                                </select>
                                                <Input
                                                    value={item.concept}
                                                    onChange={(e) => updateCostItem(idx, 'concept', e.target.value)}
                                                    placeholder="Concepto..."
                                                    className="text-xs h-7 flex-1"
                                                />
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    value={item.amount}
                                                    onChange={(e) => updateCostItem(idx, 'amount', parseFloat(e.target.value) || 0)}
                                                    placeholder="$0.00"
                                                    className="w-24 text-xs h-7 font-mono text-right"
                                                />
                                                <Button
                                                    type="button"
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() => removeCostItem(idx)}
                                                    className="h-7 w-7 text-muted-foreground hover:text-rose-500"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <Label className="text-xs">Notas del Escenario</Label>
                                    <Input
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Supuestos de volumen, proveedor alternativo, etc."
                                        className="mt-1 text-xs"
                                    />
                                </div>

                                <div className="flex justify-end gap-2 pt-2 border-t border-border/40">
                                    <Button onClick={handleSaveScenario} className="gap-2">
                                        <Sparkles className="w-4 h-4" />
                                        <span>Guardar este Escenario</span>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Panel: Live Financial Gauges & Indicators (5 cols) */}
                    <div className="lg:col-span-5 space-y-4">
                        <Card className="bg-card border-border/60 shadow-xs p-5">
                            <h3 className="font-serif font-bold text-foreground text-base pb-3 border-b border-border/40 flex items-center justify-between">
                                <span>Resultados en Tiempo Real</span>
                                <Badge 
                                    className={`text-xs ${Number(marginPercent) >= 40 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' : Number(marginPercent) > 20 ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'}`}
                                >
                                    Margen: {marginPercent}%
                                </Badge>
                            </h3>

                            <div className="space-y-4 mt-4">
                                <div className="grid grid-cols-2 gap-3 text-center">
                                    <div className="bg-muted/30 p-3 rounded-xl">
                                        <span className="text-[11px] text-muted-foreground block">Precio Venta Total</span>
                                        <MoneyDisplay amount={salePrice} size="lg" className="font-bold text-foreground mt-1" />
                                        <span className="text-[10px] text-muted-foreground block mt-0.5">
                                            ${unitPrice} por unidad
                                        </span>
                                    </div>
                                    <div className="bg-muted/30 p-3 rounded-xl">
                                        <span className="text-[11px] text-muted-foreground block">Costo Total</span>
                                        <MoneyDisplay amount={totalCosts} size="lg" className="font-bold text-foreground mt-1" />
                                        <span className="text-[10px] text-muted-foreground block mt-0.5">
                                            ${unitCost} por unidad
                                        </span>
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                                    <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 block">
                                        Utilidad Bruta Estimada
                                    </span>
                                    <MoneyDisplay 
                                        amount={estimatedProfit} 
                                        size="xl" 
                                        className={`font-black mt-1 ${estimatedProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'}`} 
                                    />
                                    <span className="text-[11px] text-muted-foreground mt-1 block">
                                        {Number(marginPercent) >= 50 ? 'Margen excelente para producciones creativas.' : Number(marginPercent) >= 30 ? 'Margen saludable y viable.' : 'Margen ajustado, evalúa reducir costos o ajustar precio.'}
                                    </span>
                                </div>

                                {/* Cost Breakdown Bar */}
                                <div>
                                    <span className="text-xs font-medium text-muted-foreground block mb-1">
                                        Distribución del Precio
                                    </span>
                                    <div className="w-full h-4 rounded-full overflow-hidden flex bg-muted">
                                        <div 
                                            style={{ width: `${Math.min(100, Math.max(0, (itemsTotal / salePrice) * 100))}%` }} 
                                            className="bg-primary h-full transition-all"
                                            title="Insumos y servicios"
                                        />
                                        <div 
                                            style={{ width: `${Math.min(100, Math.max(0, (workshopOverhead / salePrice) * 100))}%` }} 
                                            className="bg-amber-500 h-full transition-all"
                                            title="Overhead taller"
                                        />
                                        <div 
                                            style={{ width: `${Math.min(100, Math.max(0, (estimatedProfit / salePrice) * 100))}%` }} 
                                            className="bg-emerald-500 h-full transition-all"
                                            title="Utilidad estimada"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-1.5">
                                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary inline-block" /> Insumos</span>
                                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Taller</span>
                                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Utilidad</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Saved Scenarios & Comparisons */}
                <div className="space-y-4 pt-4 border-t border-border/50">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-serif font-bold text-foreground">Escenarios Guardados</h2>
                            <p className="text-xs text-muted-foreground">
                                Carga, compara o convierte directamente un escenario aprobado a una cotización formal para el cliente.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {scenarios.length === 0 ? (
                            <div className="col-span-full py-8 text-center text-xs text-muted-foreground bg-card rounded-xl border border-border/60">
                                No hay escenarios guardados aún. Guarda tu primera simulación arriba.
                            </div>
                        ) : (
                            scenarios.map((s) => (
                                <Card key={s.id} className="bg-card border-border/60 hover:border-primary/40 transition-colors">
                                    <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between">
                                        <div>
                                            <div className="flex items-center gap-1.5">
                                                <UniverseBadge universe={s.universe} size="sm" />
                                                <CardTitle className="text-sm font-semibold text-foreground">
                                                    {s.name}
                                                </CardTitle>
                                            </div>
                                            <p className="text-[11px] text-muted-foreground mt-0.5">
                                                {s.service_type || 'General'} • {s.quantity} unidades
                                            </p>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-1 space-y-3">
                                        <div className="grid grid-cols-3 gap-2 bg-muted/20 p-2.5 rounded-lg text-center text-[11px]">
                                            <div>
                                                <span className="text-muted-foreground block text-[10px]">Venta</span>
                                                <span className="font-semibold text-foreground">${Number(s.proposed_sale_price).toFixed(2)}</span>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground block text-[10px]">Costo</span>
                                                <span className="font-semibold text-foreground">${Number(s.total_costs ?? 0).toFixed(2)}</span>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground block text-[10px]">Margen</span>
                                                <span className="font-bold text-emerald-600">{s.estimated_margin_percent}%</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between gap-1.5 pt-1">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="text-[11px] h-7 gap-1"
                                                onClick={() => loadScenarioIntoSimulator(s)}
                                            >
                                                <span>Cargar</span>
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="text-[11px] h-7 gap-1"
                                                onClick={() => handleDuplicate(s.id)}
                                            >
                                                <Copy className="w-3 h-3" />
                                                <span>Duplicar</span>
                                            </Button>
                                            <Button
                                                size="sm"
                                                className="text-[11px] h-7 gap-1 bg-primary text-primary-foreground"
                                                onClick={() => setSelectedScenarioForQuotation(s)}
                                            >
                                                <FileCheck2 className="w-3 h-3" />
                                                <span>Cotizar</span>
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-7 w-7 text-muted-foreground hover:text-rose-500"
                                                onClick={() => handleDelete(s.id)}
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </div>

                {/* MODAL: Convertir a Cotización */}
                {selectedScenarioForQuotation && (
                    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                        <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden p-6 animate-in fade-in zoom-in-95">
                            <h2 className="text-lg font-serif font-bold text-foreground">Crear Cotización desde Simulación</h2>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Escenario: <strong className="text-foreground">{selectedScenarioForQuotation.name}</strong> (${selectedScenarioForQuotation.proposed_sale_price})
                            </p>

                            <form onSubmit={handleConvertToQuotation} className="mt-4 space-y-4">
                                <div>
                                    <Label className="text-xs">Selecciona el Cliente *</Label>
                                    <select
                                        value={selectedClientId}
                                        onChange={(e) => setSelectedClientId(e.target.value)}
                                        required
                                        className="w-full mt-1 text-xs rounded-md border border-input bg-background px-3 py-2 text-foreground"
                                    >
                                        <option value="">Selecciona cliente destinatario</option>
                                        {clients.map((c) => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="p-3 bg-muted/30 rounded-lg text-xs space-y-1 text-muted-foreground">
                                    <p>• Se generará una cotización en borrador con el folio correspondiente a <strong>{selectedScenarioForQuotation.universe}</strong>.</p>
                                    <p>• Los importes se copiarán automáticamente y podrás ajustar detalles antes de enviarla.</p>
                                </div>

                                <div className="flex justify-end gap-2 pt-2 border-t border-border/50">
                                    <Button type="button" variant="outline" onClick={() => setSelectedScenarioForQuotation(null)}>
                                        Cancelar
                                    </Button>
                                    <Button type="submit" className="gap-2">
                                        <span>Generar Cotización</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
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

SimulationsIndex.layout = (page: any) => (
    <AppLayout breadcrumbs={[{ title: 'Simulador de Cotizaciones', href: '/admin/simulations' }]}>
        {page}
    </AppLayout>
);
