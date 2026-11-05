import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { MoneyDisplay } from '@/components/crm/money-display';
import { 
    Building2, 
    Plus, 
    Search, 
    Phone, 
    Mail, 
    ShoppingBag, 
    Edit,
    Trash2, 
    Globe,
    ExternalLink
} from 'lucide-react';
import type { CrmSupplier } from '@/types/crm';

interface Props {
    suppliers: {
        data: CrmSupplier[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
        total: number;
    };
    filters: {
        status?: string;
        type?: string;
        search?: string;
    };
}

export default function SuppliersIndex({ suppliers, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [showModal, setShowModal] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState<CrmSupplier | null>(null);

    const form = useForm({
        name: '',
        supplier_type: (filters.type === 'online' ? 'online' : 'traditional') as 'traditional' | 'online',
        contact_name: '',
        phone: '',
        email: '',
        website_url: '',
        category: 'papel_y_sustratos',
        notes: '',
        status: 'active' as 'active' | 'archived',
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/suppliers', { ...filters, search }, { preserveState: true });
    };

    const handleFilterStatus = (status: string) => {
        router.get('/admin/suppliers', { ...filters, status }, { preserveState: true });
    };

    const handleFilterType = (type: string) => {
        router.get('/admin/suppliers', { ...filters, type }, { preserveState: true });
    };

    const openCreateModal = (defaultType: 'traditional' | 'online' = 'traditional') => {
        setEditingSupplier(null);
        form.setData({
            name: '',
            supplier_type: defaultType,
            contact_name: '',
            phone: '',
            email: '',
            website_url: '',
            category: defaultType === 'online' ? 'compra_en_linea' : 'papel_y_sustratos',
            notes: '',
            status: 'active',
        });
        setShowModal(true);
    };

    const openEditModal = (supplier: CrmSupplier) => {
        setEditingSupplier(supplier);
        form.setData({
            name: supplier.name,
            supplier_type: supplier.supplier_type || (supplier.website_url ? 'online' : 'traditional'),
            contact_name: supplier.contact_name || '',
            phone: supplier.phone || '',
            email: supplier.email || '',
            website_url: supplier.website_url || '',
            category: supplier.category,
            notes: supplier.notes || '',
            status: supplier.status,
        });
        setShowModal(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingSupplier) {
            form.put(`/admin/suppliers/${editingSupplier.id}`, {
                onSuccess: () => {
                    setShowModal(false);
                    form.reset();
                },
            });
        } else {
            form.post('/admin/suppliers', {
                onSuccess: () => {
                    setShowModal(false);
                    form.reset();
                },
            });
        }
    };

    const currentType = filters.type || 'all';

    return (
        <>
            <Head title="Proveedores y Tiendas en Línea - Eladora CRM" />

            <div className="flex flex-col gap-6 p-6 w-full">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/50">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground tracking-tight">
                            {currentType === 'online' ? 'Páginas de Compra en Línea' : 'Directorio de Proveedores y Tiendas Online'}
                        </h1>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            {currentType === 'online'
                                ? 'Links directos a Mercado Libre, Amazon y tiendas en línea donde compras materia prima e insumos.'
                                : 'Gestión de talleres aliados, distribuidores de papel, maquilas y páginas de compra en línea (Mercado Libre, Amazon, etc.).'}
                        </p>
                    </div>

                    <div className="flex items-center gap-2.5 flex-wrap">
                        <Link href="/admin/purchases">
                            <Button variant="outline" className="gap-2">
                                <ShoppingBag className="w-4 h-4" />
                                <span>Ver Compras</span>
                            </Button>
                        </Link>
                        <Button variant="secondary" onClick={() => openCreateModal('online')} className="gap-2">
                            <Globe className="w-4 h-4" />
                            <span>+ Tienda en Línea / Link</span>
                        </Button>
                        <Button onClick={() => openCreateModal('traditional')} className="gap-2">
                            <Plus className="w-4 h-4" />
                            <span>Nuevo Proveedor</span>
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border/60">
                    <form onSubmit={handleSearch} className="relative w-full md:w-80">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Buscar proveedor, tienda online, link o insumo..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 h-9 text-xs"
                        />
                    </form>

                    <div className="flex items-center gap-2 flex-wrap">
                        {/* Type filter */}
                        <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-lg border border-border/50">
                            {[
                                { k: 'all', l: 'Todos' },
                                { k: 'traditional', l: 'Proveedores Físicos' },
                                { k: 'online', l: 'Tiendas en Línea (ML / Amazon)' },
                            ].map((t) => (
                                <button
                                    key={t.k}
                                    type="button"
                                    onClick={() => handleFilterType(t.k)}
                                    className={`px-2.5 py-1 text-xs rounded-md transition-colors font-medium ${
                                        currentType === t.k
                                            ? 'bg-background text-foreground shadow-2xs font-semibold'
                                            : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    {t.l}
                                </button>
                            ))}
                        </div>

                        {/* Status filter */}
                        <div className="flex items-center gap-1">
                            {['active', 'archived', 'all'].map((st) => (
                                <button
                                    key={st}
                                    type="button"
                                    onClick={() => handleFilterStatus(st)}
                                    className={`px-3 py-1 text-xs rounded-lg transition-colors font-medium ${
                                        (filters.status === st || (!filters.status && st === 'active'))
                                            ? 'bg-primary text-primary-foreground shadow-xs'
                                            : 'text-muted-foreground hover:bg-muted'
                                    }`}
                                >
                                    {st === 'active' ? 'Activos' : st === 'archived' ? 'Archivados' : 'Todos'}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Suppliers Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {suppliers.data.length === 0 ? (
                        <div className="col-span-full py-12 text-center text-muted-foreground bg-card rounded-xl border border-border/60">
                            <Building2 className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
                            <p className="font-medium text-foreground">No se encontraron proveedores o tiendas en línea</p>
                            <p className="text-xs mt-1">Registra tus proveedores o links de compra de Mercado Libre, Amazon y tiendas de insumos.</p>
                        </div>
                    ) : (
                        suppliers.data.map((s) => {
                            const isOnline = s.supplier_type === 'online' || Boolean(s.website_url && !s.phone && !s.contact_name);
                            return (
                                <Card key={s.id} className="bg-card border-border/60 hover:border-primary/40 transition-colors flex flex-col justify-between">
                                    <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between">
                                        <div>
                                            <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2 flex-wrap">
                                                {isOnline && <Globe className="w-4 h-4 text-primary shrink-0" />}
                                                <span>{s.name}</span>
                                                {isOnline && (
                                                    <Badge variant="default" className="text-[10px]">
                                                        Tienda Online
                                                    </Badge>
                                                )}
                                                {s.status === 'archived' && (
                                                    <Badge variant="outline" className="text-[10px] text-muted-foreground">
                                                        Archivado
                                                    </Badge>
                                                )}
                                            </CardTitle>
                                            <Badge variant="secondary" className="text-[10px] mt-1 capitalize">
                                                {s.category.replace(/_/g, ' ')}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                                onClick={() => openEditModal(s)}
                                                title="Editar proveedor"
                                            >
                                                <Edit className="w-3.5 h-3.5" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                onClick={() => {
                                                    if (confirm(`¿Estás seguro de eliminar "${s.name}"? Solo se permitirá si no tiene compras ni pagos vinculados.`)) {
                                                        router.delete(`/admin/suppliers/${s.id}`);
                                                    }
                                                }}
                                                title="Eliminar proveedor"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-1 space-y-3 flex-1 flex flex-col justify-between">
                                        <div className="text-xs space-y-1.5 text-muted-foreground border-b border-border/40 pb-2.5">
                                            {s.website_url && (
                                                <a
                                                    href={s.website_url.startsWith('http') ? s.website_url : `https://${s.website_url}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline break-all bg-primary/5 px-2.5 py-1.5 rounded-lg w-full"
                                                >
                                                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                                                    <span className="truncate">Abrir Link de Compra / Tienda</span>
                                                </a>
                                            )}
                                            {s.contact_name && (
                                                <p className="text-foreground font-medium">Contacto: {s.contact_name}</p>
                                            )}
                                            {s.phone && (
                                                <div className="flex items-center gap-1.5">
                                                    <Phone className="w-3 h-3" />
                                                    <span>{s.phone}</span>
                                                </div>
                                            )}
                                            {s.email && (
                                                <div className="flex items-center gap-1.5">
                                                    <Mail className="w-3 h-3" />
                                                    <span>{s.email}</span>
                                                </div>
                                            )}
                                            {s.notes && (
                                                <p className="text-[11px] italic pt-1 text-foreground/80">{s.notes}</p>
                                            )}
                                        </div>

                                        <div>
                                            {/* Stats */}
                                            <div className="grid grid-cols-2 gap-2 text-[11px] mb-3">
                                                <div className="bg-muted/30 p-2 rounded-lg">
                                                    <span className="text-muted-foreground block">Compras</span>
                                                    <span className="font-semibold text-foreground text-xs">
                                                        {s.purchases_count ?? 0} pedidos
                                                    </span>
                                                </div>
                                                <div className="bg-muted/30 p-2 rounded-lg">
                                                    <span className="text-muted-foreground block">Saldo Pendiente</span>
                                                    <MoneyDisplay 
                                                        amount={s.pending_balance ?? 0} 
                                                        size="sm" 
                                                        className={`font-semibold ${(s.pending_balance ?? 0) > 0 ? 'text-amber-600' : 'text-emerald-600'}`} 
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {s.website_url && (
                                                    <a
                                                        href={s.website_url.startsWith('http') ? s.website_url : `https://${s.website_url}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex-1"
                                                    >
                                                        <Button variant="default" size="sm" className="w-full text-xs h-7 gap-1.5">
                                                            <ExternalLink className="w-3 h-3" />
                                                            <span>Ir a Tienda</span>
                                                        </Button>
                                                    </a>
                                                )}
                                                <Link href={`/admin/purchases?supplier_id=${s.id}`} className="flex-1">
                                                    <Button variant="outline" size="sm" className="w-full text-xs h-7 gap-1.5">
                                                        <ShoppingBag className="w-3 h-3" />
                                                        <span>Compras</span>
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })
                    )}
                </div>

                {/* MODAL: Crear / Editar Proveedor o Tienda en Línea */}
                {showModal && (
                    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                        <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden p-6 animate-in fade-in zoom-in-95">
                            <h2 className="text-lg font-serif font-bold text-foreground">
                                {editingSupplier
                                    ? 'Editar Proveedor / Tienda en Línea'
                                    : form.data.supplier_type === 'online'
                                    ? 'Nueva Página de Compra en Línea'
                                    : 'Nuevo Proveedor'}
                            </h2>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                {form.data.supplier_type === 'online'
                                    ? 'Agrega links de Mercado Libre, Amazon o tiendas online donde compras materia prima (sin requerir teléfono ni contacto).'
                                    : 'Datos de contacto y especialidad de materiales o servicios.'}
                            </p>

                            {/* Selector de Tipo */}
                            <div className="grid grid-cols-2 gap-2 mt-4 p-1 bg-muted/50 rounded-xl border border-border/50">
                                <button
                                    type="button"
                                    onClick={() => form.setData('supplier_type', 'traditional')}
                                    className={`py-1.5 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                                        form.data.supplier_type === 'traditional'
                                            ? 'bg-background text-foreground shadow-xs font-semibold'
                                            : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    <Building2 className="w-3.5 h-3.5" />
                                    <span>Proveedor Tradicional</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        form.setData((prev) => ({
                                            ...prev,
                                            supplier_type: 'online',
                                            category: prev.category === 'papel_y_sustratos' ? 'compra_en_linea' : prev.category,
                                        }));
                                    }}
                                    className={`py-1.5 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                                        form.data.supplier_type === 'online'
                                            ? 'bg-background text-foreground shadow-xs font-semibold'
                                            : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    <Globe className="w-3.5 h-3.5" />
                                    <span>Tienda en Línea (Link)</span>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
                                <div>
                                    <Label className="text-xs">
                                        {form.data.supplier_type === 'online'
                                            ? 'Nombre de la Tienda o Materia Prima *'
                                            : 'Nombre o Razón Social *'}
                                    </Label>
                                    <Input
                                        placeholder={
                                            form.data.supplier_type === 'online'
                                                ? 'Ej: Mercado Libre - Sobres Acrílicos / Amazon - Lacre'
                                                : 'Ej: Papelera del Centro, Taller Foil & Co...'
                                        }
                                        value={form.data.name}
                                        onChange={(e) => form.setData('name', e.target.value)}
                                        required
                                        className="mt-1 text-xs"
                                    />
                                </div>

                                <div>
                                    <Label className="text-xs">
                                        {form.data.supplier_type === 'online'
                                            ? 'Link de Compra (Mercado Libre, Amazon, Sitio Web) *'
                                            : 'Sitio Web o Link de Catálogo (Opcional)'}
                                    </Label>
                                    <Input
                                        placeholder="https://articulo.mercadolibre.com.mx/... o https://amazon.com.mx/..."
                                        value={form.data.website_url}
                                        onChange={(e) => form.setData('website_url', e.target.value)}
                                        required={form.data.supplier_type === 'online'}
                                        className="mt-1 text-xs"
                                    />
                                </div>

                                <div className={form.data.supplier_type === 'online' ? 'grid grid-cols-1 gap-3' : 'grid grid-cols-2 gap-3'}>
                                    {form.data.supplier_type !== 'online' && (
                                        <div>
                                            <Label className="text-xs">Nombre del Contacto (Opcional)</Label>
                                            <Input
                                                placeholder="Persona de atención"
                                                value={form.data.contact_name}
                                                onChange={(e) => form.setData('contact_name', e.target.value)}
                                                className="mt-1 text-xs"
                                            />
                                        </div>
                                    )}
                                    <div>
                                        <Label className="text-xs">Categoría *</Label>
                                        <select
                                            value={form.data.category}
                                            onChange={(e) => form.setData('category', e.target.value)}
                                            className="w-full mt-1 text-xs rounded-md border border-input bg-background px-3 py-2 text-foreground"
                                        >
                                            <option value="compra_en_linea">Compra en Línea (Mercado Libre / Amazon)</option>
                                            <option value="papel_y_sustratos">Papel y Sustratos</option>
                                            <option value="impresion_externa">Impresión Externa / Offset</option>
                                            <option value="acabados_especiales">Acabados Especiales / Foil</option>
                                            <option value="cajas_y_empaque">Cajas y Empaque</option>
                                            <option value="maquilas">Maquilas y Armado</option>
                                            <option value="fotografia_video">Fotografía / Video</option>
                                            <option value="mobiliario_eventos">Mobiliario / Eventos</option>
                                            <option value="otro">Otro</option>
                                        </select>
                                    </div>
                                </div>

                                {form.data.supplier_type !== 'online' && (
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <Label className="text-xs">Teléfono / WhatsApp (Opcional)</Label>
                                            <Input
                                                placeholder="999 123 4567"
                                                value={form.data.phone}
                                                onChange={(e) => form.setData('phone', e.target.value)}
                                                className="mt-1 text-xs"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs">Correo Electrónico (Opcional)</Label>
                                            <Input
                                                type="email"
                                                placeholder="contacto@proveedor.com"
                                                value={form.data.email}
                                                onChange={(e) => form.setData('email', e.target.value)}
                                                className="mt-1 text-xs"
                                            />
                                        </div>
                                    </div>
                                )}

                                {editingSupplier && (
                                    <div>
                                        <Label className="text-xs">Estado</Label>
                                        <select
                                            value={form.data.status}
                                            onChange={(e) => form.setData('status', e.target.value as 'active' | 'archived')}
                                            className="w-full mt-1 text-xs rounded-md border border-input bg-background px-3 py-2 text-foreground"
                                        >
                                            <option value="active">Activo</option>
                                            <option value="archived">Archivado</option>
                                        </select>
                                    </div>
                                )}

                                <div>
                                    <Label className="text-xs">Notas / Descripción del Material</Label>
                                    <Input
                                        placeholder={
                                            form.data.supplier_type === 'online'
                                                ? 'Ej: Paquete de 50 barras de lacre dorado, llega en 2 días con Full...'
                                                : 'Tiempos de entrega habituales, condiciones de crédito...'
                                        }
                                        value={form.data.notes}
                                        onChange={(e) => form.setData('notes', e.target.value)}
                                        className="mt-1 text-xs"
                                    />
                                </div>

                                <div className="flex justify-end gap-2 pt-2 border-t border-border/50">
                                    <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                                        Cancelar
                                    </Button>
                                    <Button type="submit" disabled={form.processing}>
                                        {editingSupplier
                                            ? 'Actualizar'
                                            : form.data.supplier_type === 'online'
                                            ? 'Guardar Tienda / Link'
                                            : 'Guardar Proveedor'}
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

SuppliersIndex.layout = (page: any) => (
    <AppLayout breadcrumbs={[{ title: 'Proveedores y Tiendas Online', href: '/admin/suppliers' }]}>
        {page}
    </AppLayout>
);
