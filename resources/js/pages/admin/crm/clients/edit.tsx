import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import type { Client } from '@/types/crm';

interface Props {
    client: Client;
}

export default function ClientsEdit({ client }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: client.name || '',
        business_name: client.business_name || '',
        phone: client.phone || '',
        whatsapp: client.whatsapp || '',
        email: client.email || '',
        client_type: client.client_type || 'direct',
        channel: client.channel || 'whatsapp',
        status: client.status || 'active',
        internal_notes: client.internal_notes || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/clients/${client.id}`);
    };

    return (
        <>
            <Head title={`Editar - ${client.name} - Eladora CRM`} />

            <div className="flex flex-col gap-6 p-6 w-full">
                <div className="flex items-center justify-between pb-2 border-b border-border/50">
                    <div className="flex items-center gap-3">
                        <Link href={`/admin/clients/${client.id}`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-serif font-bold text-foreground tracking-tight">
                                Editar Ficha de Cliente
                            </h1>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Actualizar datos de contacto, notas y estado de la cuenta.
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <Card className="shadow-xs">
                        <CardHeader>
                            <CardTitle className="text-base font-semibold">Información del Cliente</CardTitle>
                            <CardDescription>Modifica los campos necesarios</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="name" className="text-xs">
                                        Nombre Completo o Razón Social <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                    {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="business_name" className="text-xs">
                                        Nombre Comercial / Evento
                                    </Label>
                                    <Input
                                        id="business_name"
                                        value={data.business_name}
                                        onChange={(e) => setData('business_name', e.target.value)}
                                    />
                                    {errors.business_name && <p className="text-xs text-red-500">{errors.business_name}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="whatsapp" className="text-xs">WhatsApp</Label>
                                    <Input
                                        id="whatsapp"
                                        value={data.whatsapp}
                                        onChange={(e) => setData('whatsapp', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="phone" className="text-xs">Teléfono</Label>
                                    <Input
                                        id="phone"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="email" className="text-xs">Correo Electrónico</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-xs">Estado de la Ficha</Label>
                                    <Select
                                        value={data.status}
                                        onValueChange={(val) => setData('status', val as any)}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Activo</SelectItem>
                                            <SelectItem value="archived">Archivado</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-xs">Tipo de Cliente</Label>
                                    <Select
                                        value={data.client_type}
                                        onValueChange={(val) => setData('client_type', val as any)}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="direct">Directo / Persona Natural</SelectItem>
                                            <SelectItem value="event">Evento Social (Boda, XV, Bautizo)</SelectItem>
                                            <SelectItem value="business">Empresa / Negocio Comercial</SelectItem>
                                            <SelectItem value="agency">Agencia / Planner</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-xs">Canal de Procedencia</Label>
                                    <Select
                                        value={data.channel}
                                        onValueChange={(val) => setData('channel', val as any)}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="whatsapp">WhatsApp Directo</SelectItem>
                                            <SelectItem value="instagram">Instagram Direct</SelectItem>
                                            <SelectItem value="referral">Recomendación / Boca a boca</SelectItem>
                                            <SelectItem value="website">Página Web Eladora</SelectItem>
                                            <SelectItem value="event">Evento / Expo</SelectItem>
                                            <SelectItem value="other">Otro canal</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-1.5 pt-2">
                                <Label htmlFor="internal_notes" className="text-xs">Notas Internas</Label>
                                <Textarea
                                    id="internal_notes"
                                    rows={4}
                                    value={data.internal_notes}
                                    onChange={(e) => setData('internal_notes', e.target.value)}
                                />
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t border-border/50">
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => {
                                        if (confirm('¿Seguro que deseas archivar este cliente?')) {
                                            useForm({}).delete(`/admin/clients/${client.id}`);
                                        }
                                    }}
                                    className="gap-1.5"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    <span>Archivar</span>
                                </Button>

                                <div className="flex gap-2">
                                    <Link href={`/admin/clients/${client.id}`}>
                                        <Button variant="outline" type="button">Cancelar</Button>
                                    </Link>
                                    <Button type="submit" disabled={processing} className="gap-2">
                                        <Save className="w-4 h-4" />
                                        <span>Guardar Cambios</span>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </>
    );
}

ClientsEdit.layout = (page: any) => {
    const client = page?.props?.client ?? page?.client;
    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Clientes', href: '/admin/clients' },
                { title: client?.name || 'Cliente', href: client?.id ? `/admin/clients/${client.id}` : '/admin/clients' },
                { title: 'Editar', href: client?.id ? `/admin/clients/${client.id}/edit` : '/admin/clients' },
            ]}
        >
            {page}
        </AppLayout>
    );
};
