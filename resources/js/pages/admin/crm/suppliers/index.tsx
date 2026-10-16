import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
    DollarSign, 
    Clock, 
    Edit, 
    Archive,
    CheckCircle2
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
        search?: string;
    };
}

export default function SuppliersIndex({ suppliers, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [showModal, setShowModal] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState<CrmSupplier | null>(null);

    const form = useForm({
        name: '',
        contact_name: '',
        phone: '',
        email: '',
        category: 'papel_y_sustratos',
        notes: '',
        status: 'active',
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/suppliers', { ...filters, search }, { preserveState: true });
    };

    const handleFilterStatus = (status: string) => {
        router.get('/admin/suppliers', { ...filters, status }, { preserveState: true });
    };

    const openCreateModal = () => {
        setEditingSupplier(null);
        form.setData({
            name: '',
            contact_name: '',
            phone: '',
            email: '',
            category: 'papel_y_sustratos',
            notes: '',
            status: 'active',
        });
        setShowModal(true);
    };

    const openEditModal = (supplier: CrmSupplier) => {
        setEditingSupplier(supplier);
        form.setData({
            name: supplier.name,
            contact_name: supplier.contact_name || '',
            phone: supplier.phone || '',
            email: supplier.email || '',
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

    return (
        <>
            <Head title="Directorio de Proveedores - Eladora CRM" />

            <div className="flex flex-col gap-6 p-6 w-full">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/50">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground tracking-tight">
                            Directorio de Proveedores
                        </h1>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            Gestión de talleres aliados, distribuidores de papel, maquilas y servicios especializados.
                        </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <Link href="/admin/purchases">
                            <Button variant="outline" className="gap-2">
                                <ShoppingBag className="w-4 h-4" />
                                <span>Ver Compras</span>
                            </Button>
                        </Link>
                        <Button onClick={openCreateModal} className="gap-2">
                            <Plus className="w-4 h-4" />
                            <span>Nuevo Proveedor</span>
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border/60">
                    <form onSubmit={handleSearch} className="relative w-full sm:w-80">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por nombre, contacto o categoría..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 h-9 text-xs"
                        />
                    </form>

                    <div className="flex items-center gap-1.5">
                        {['active', 'archived', 'all'].map((st) => (
                            <button
                                key={st}
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

                {/* Suppliers Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {suppliers.data.length === 0 ? (
                        <div className="col-span-full py-12 text-center text-muted-foreground bg-card rounded-xl border border-border/60">
                            <Building2 className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
                            <p className="font-medium text-foreground">No se encontraron proveedores</p>
                            <p className="text-xs mt-1">Registra proveedores para vincular compras y gastos.</p>
                        </div>
                    ) : (
                        suppliers.data.map((s) => (
                            <Card key={s.id} className="bg-card border-border/60 hover:border-primary/40 transition-colors">
                                <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between">
                                    <div>
                                        <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                                            <span>{s.name}</span>
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
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                        onClick={() => openEditModal(s)}
                                    >
                                        <Edit className="w-3.5 h-3.5" />
                                    </Button>
                                </CardHeader>
                                <CardContent className="p-4 pt-1 space-y-3">
                                    <div className="text-xs space-y-1 text-muted-foreground border-b border-border/40 pb-2.5">
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
                                            <p className="text-[11px] italic pt-1">{s.notes}</p>
                                        )}
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-2 gap-2 text-[11px]">
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

                                    <div className="pt-1">
                                        <Link href={`/admin/purchases?supplier_id=${s.id}`}>
                                            <Button variant="outline" size="sm" className="w-full text-xs h-7 gap-1.5">
                                                <ShoppingBag className="w-3 h-3" />
                                                <span>Ver Historial de Compras</span>
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                {/* MODAL: Crear / Editar Proveedor */}
                {showModal && (
                    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                        <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden p-6 animate-in fade-in zoom-in-95">
                            <h2 className="text-lg font-serif font-bold text-foreground">
                                {editingSupplier ? 'Editar Proveedor' : 'Nuevo Proveedor'}
                            </h2>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Datos de contacto y especialidad de materiales o servicios.
                            </p>

                            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
                                <div>
                                    <Label className="text-xs">Nombre o Razón Social *</Label>
                                    <Input
                                        placeholder="Ej: Papelera del Centro, Taller Foil & Co..."
                                        value={form.data.name}
                                        onChange={(e) => form.setData('name', e.target.value)}
                                        required
                                        className="mt-1 text-xs"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <Label className="text-xs">Nombre del Contacto</Label>
                                        <Input
                                            placeholder="Persona de atención"
                                            value={form.data.contact_name}
                                            onChange={(e) => form.setData('contact_name', e.target.value)}
                                            className="mt-1 text-xs"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs">Categoría *</Label>
                                        <select
                                            value={form.data.category}
                                            onChange={(e) => form.setData('category', e.target.value)}
                                            className="w-full mt-1 text-xs rounded-md border border-input bg-background px-3 py-2 text-foreground"
                                        >
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

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <Label className="text-xs">Teléfono / WhatsApp</Label>
                                        <Input
                                            placeholder="55 1234 5678"
                                            value={form.data.phone}
                                            onChange={(e) => form.setData('phone', e.target.value)}
                                            className="mt-1 text-xs"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs">Correo Electrónico</Label>
                                        <Input
                                            type="email"
                                            placeholder="contacto@proveedor.com"
                                            value={form.data.email}
                                            onChange={(e) => form.setData('email', e.target.value)}
                                            className="mt-1 text-xs"
                                        />
                                    </div>
                                </div>

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
                                    <Label className="text-xs">Notas Internas</Label>
                                    <Input
                                        placeholder="Tiempos de entrega habituales, condiciones de crédito..."
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
                                        {editingSupplier ? 'Actualizar' : 'Guardar Proveedor'}
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
    <AppLayout breadcrumbs={[{ title: 'Proveedores', href: '/admin/suppliers' }]}>
        {page}
    </AppLayout>
);
