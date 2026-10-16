import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MoneyDisplay } from '@/components/crm/money-display';
import { 
    Users, 
    UserPlus, 
    Search, 
    Phone, 
    Mail, 
    MessageCircle, 
    ChevronRight,
    Building2,
    Calendar,
    ArrowUpDown
} from 'lucide-react';
import type { Client } from '@/types/crm';

interface Props {
    clients: {
        data: Client[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
        total: number;
    };
    filters: {
        search?: string;
        status?: string;
        type?: string;
    };
}

export default function ClientsIndex({ clients, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/clients', { ...filters, search }, { preserveState: true });
    };

    const handleFilterStatus = (status: string) => {
        router.get('/admin/clients', { ...filters, status }, { preserveState: true });
    };

    return (
        <>
            <Head title="Directorio de Clientes - Eladora CRM" />

            <div className="flex flex-col gap-6 p-6 w-full">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/50">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground tracking-tight">
                            Directorio de Clientes
                        </h1>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            Gestión centralizada de contactos, cotizaciones, pedidos e historial comercial.
                        </p>
                    </div>

                    <Button className="gap-2 shadow-xs" asChild>
                        <Link href="/admin/clients/create">
                            <UserPlus className="w-4 h-4" />
                            <span>Nuevo Cliente</span>
                        </Link>
                    </Button>
                </div>

                {/* Filters & Search Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border/60">
                    <form onSubmit={handleSearch} className="relative w-full sm:w-96">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por nombre, empresa, correo o teléfono..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 h-9 text-xs"
                        />
                    </form>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="inline-flex rounded-lg border border-border bg-muted/40 p-0.5 text-xs">
                            {[
                                { id: 'active', label: 'Activos' },
                                { id: 'archived', label: 'Archivados' },
                                { id: 'all', label: 'Todos' },
                            ].map((s) => (
                                <button
                                    key={s.id}
                                    type="button"
                                    onClick={() => handleFilterStatus(s.id)}
                                    className={`px-3 py-1 rounded-md transition-colors ${
                                        (filters.status || 'active') === s.id
                                            ? 'bg-background shadow-2xs font-semibold text-foreground'
                                            : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    {s.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Clients Table Card */}
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-base font-semibold">Listado de Contactos</CardTitle>
                                <CardDescription>{clients.total} clientes registrados</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm border-t border-border/50">
                                <thead className="bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    <tr>
                                        <th className="py-3 px-4">Cliente / Contacto</th>
                                        <th className="py-3 px-4">Canal / Tipo</th>
                                        <th className="py-3 px-4">Contacto</th>
                                        <th className="py-3 px-4 text-center">Pedidos</th>
                                        <th className="py-3 px-4 text-right">Saldo Pendiente</th>
                                        <th className="py-3 px-4 text-right">Acción</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/40">
                                    {clients.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="text-center py-12 text-muted-foreground">
                                                No se encontraron clientes registrados con los filtros seleccionados.
                                            </td>
                                        </tr>
                                    ) : (
                                        clients.data.map((c) => (
                                            <tr key={c.id} className="hover:bg-muted/20 transition-colors group">
                                                <td className="py-3.5 px-4">
                                                    <Link href={`/admin/clients/${c.id}`} className="font-semibold text-foreground hover:text-primary transition-colors">
                                                        {c.name}
                                                    </Link>
                                                    {c.business_name && (
                                                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                                            <Building2 className="w-3 h-3" />
                                                            <span>{c.business_name}</span>
                                                        </div>
                                                    )}
                                                </td>

                                                <td className="py-3.5 px-4">
                                                    <span className="capitalize text-xs font-medium px-2 py-0.5 rounded-full bg-muted border border-border">
                                                        {c.channel}
                                                    </span>
                                                    <div className="text-[11px] text-muted-foreground mt-0.5 capitalize">
                                                        Tipo: {c.client_type}
                                                    </div>
                                                </td>

                                                <td className="py-3.5 px-4 text-xs">
                                                    {c.whatsapp && (
                                                        <a
                                                            href={`https://wa.me/${c.whatsapp.replace(/\D/g, '')}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 hover:underline"
                                                        >
                                                            <MessageCircle className="w-3.5 h-3.5" />
                                                            <span>{c.whatsapp}</span>
                                                        </a>
                                                    )}
                                                    {c.email && (
                                                        <div className="text-muted-foreground truncate max-w-[180px] mt-0.5">
                                                            {c.email}
                                                        </div>
                                                    )}
                                                </td>

                                                <td className="py-3.5 px-4 text-center">
                                                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-xs">
                                                        {c.orders_count || 0}
                                                    </span>
                                                </td>

                                                <td className="py-3.5 px-4 text-right">
                                                    <div className="font-semibold text-foreground">
                                                        <MoneyDisplay amount={c.total_balance_due || 0} />
                                                    </div>
                                                    <div className="text-[11px] text-muted-foreground">
                                                        Pagado: <MoneyDisplay amount={c.total_paid || 0} />
                                                    </div>
                                                </td>

                                                <td className="py-3.5 px-4 text-right">
                                                    <Button variant="ghost" size="sm" className="gap-1 h-7 text-xs" asChild>
                                                        <Link href={`/admin/clients/${c.id}`}>
                                                            <span>Ver ficha</span>
                                                            <ChevronRight className="w-3.5 h-3.5" />
                                                        </Link>
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

                {/* Pagination */}
                {clients.links && clients.links.length > 3 && (
                    <div className="flex justify-center gap-1">
                        {clients.links.map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.url || '#'}
                                className={`px-3 py-1.5 rounded-md text-xs font-medium border ${
                                    link.active
                                        ? 'bg-primary text-primary-foreground border-primary'
                                        : link.url
                                        ? 'bg-background hover:bg-muted border-border'
                                        : 'opacity-40 cursor-not-allowed border-transparent'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

ClientsIndex.layout = (page: any) => (
    <AppLayout breadcrumbs={[{ title: 'Clientes', href: '/admin/clients' }]}>
        {page}
    </AppLayout>
);
