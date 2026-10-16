import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Building2, Phone, Mail, MessageCircle } from 'lucide-react';

export default function ClientsCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        business_name: '',
        phone: '',
        whatsapp: '',
        email: '',
        client_type: 'direct',
        channel: 'whatsapp',
        first_contact_at: new Date().toISOString().split('T')[0],
        internal_notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/clients');
    };

    return (
        <>
            <Head title="Nuevo Cliente - Eladora CRM" />

            <div className="flex flex-col gap-6 p-6 w-full">
                <div className="flex items-center justify-between pb-2 border-b border-border/50">
                    <div className="flex items-center gap-3">
                        <Link href="/admin/clients">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-serif font-bold text-foreground tracking-tight">
                                Registrar Nuevo Cliente
                            </h1>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Crea un expediente único para prospecto, cotizaciones y pedidos.
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <Card className="shadow-xs">
                        <CardHeader>
                            <CardTitle className="text-base font-semibold">Datos Generales del Cliente</CardTitle>
                            <CardDescription>Información de contacto y procedencia comercial</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="name" className="text-xs">
                                        Nombre Completo o Razón Social <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        placeholder="ej. Mariana Valenzuela"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                    {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="business_name" className="text-xs">
                                        Nombre Comercial / Evento (Opcional)
                                    </Label>
                                    <Input
                                        id="business_name"
                                        placeholder="ej. Boda Mariana & Alejandro o Lumina Flor"
                                        value={data.business_name}
                                        onChange={(e) => setData('business_name', e.target.value)}
                                    />
                                    {errors.business_name && <p className="text-xs text-red-500">{errors.business_name}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="whatsapp" className="text-xs">
                                        WhatsApp <span className="text-muted-foreground text-[10px]">(Canal de chat)</span>
                                    </Label>
                                    <Input
                                        id="whatsapp"
                                        placeholder="+52 55 1234 5678"
                                        value={data.whatsapp}
                                        onChange={(e) => setData('whatsapp', e.target.value)}
                                    />
                                    {errors.whatsapp && <p className="text-xs text-red-500">{errors.whatsapp}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="phone" className="text-xs">
                                        Teléfono de Contacto
                                    </Label>
                                    <Input
                                        id="phone"
                                        placeholder="+52 55 1234 5678"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                    />
                                    {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="email" className="text-xs">
                                        Correo Electrónico
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="cliente@ejemplo.com"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                    />
                                    {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="first_contact_at" className="text-xs">
                                        Fecha de Primer Contacto
                                    </Label>
                                    <Input
                                        id="first_contact_at"
                                        type="date"
                                        value={data.first_contact_at}
                                        onChange={(e) => setData('first_contact_at', e.target.value)}
                                    />
                                    {errors.first_contact_at && <p className="text-xs text-red-500">{errors.first_contact_at}</p>}
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
                                <Label htmlFor="internal_notes" className="text-xs">
                                    Notas Internas y Preferencias del Cliente
                                </Label>
                                <Textarea
                                    id="internal_notes"
                                    rows={4}
                                    placeholder="Estilo estético, referencias que mencionó, requerimientos especiales o detalles a recordar..."
                                    value={data.internal_notes}
                                    onChange={(e) => setData('internal_notes', e.target.value)}
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
                                <Link href="/admin/clients">
                                    <Button variant="outline" type="button">Cancelar</Button>
                                </Link>
                                <Button type="submit" disabled={processing} className="gap-2">
                                    <Save className="w-4 h-4" />
                                    <span>Guardar Cliente</span>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </>
    );
}

ClientsCreate.layout = (page: any) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Clientes', href: '/admin/clients' },
            { title: 'Nuevo Cliente', href: '/admin/clients/create' },
        ]}
    >
        {page}
    </AppLayout>
);
