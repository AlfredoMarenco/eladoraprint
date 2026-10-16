import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { UniverseBadge } from '@/components/crm/universe-badge';
import { MoneyDisplay } from '@/components/crm/money-display';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
    ArrowLeft, 
    Printer, 
    CheckCircle2, 
    Send, 
    Copy, 
    FileText, 
    History, 
    Building2, 
    Calendar, 
    Edit,
    ArrowUpRight,
    Sparkles
} from 'lucide-react';
import type { Quotation } from '@/types/crm';

interface Props {
    quotation: Quotation;
    company_info: {
        name: string;
        email: string;
        phone: string;
        currency: string;
    };
}

export default function QuotationsShow({ quotation, company_info }: Props) {
    const handleStatusChange = (status: string) => {
        router.post(`/admin/quotations/${quotation.id}/status`, { status });
    };

    const handleConvertToOrder = () => {
        if (confirm('¿Deseas convertir esta cotización aprobada en un pedido activo de Eladora? Se generarán automáticamente las tareas operativas de su universo.')) {
            router.post(`/admin/quotations/${quotation.id}/convert-to-order`);
        }
    };

    const handleDuplicate = () => {
        router.post(`/admin/quotations/${quotation.id}/duplicate`);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            <Head title={`Cotización ${quotation.folio} - Eladora`} />

            <div className="flex flex-col gap-6 p-6 w-full print:p-0">
                {/* Screen Header (Hidden on Print) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/50 print:hidden">
                    <div className="flex items-center gap-3">
                        <Link href="/admin/quotations">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                        </Link>
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-2xl font-serif font-bold text-foreground">
                                    {quotation.folio}
                                </h1>
                                <UniverseBadge universe={quotation.universe} size="sm" />
                                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold capitalize bg-muted border">
                                    {quotation.status}
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Versión {quotation.version} • Creada el {quotation.creation_date}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        {/* Status selector */}
                        <Select
                            value={quotation.status}
                            onValueChange={handleStatusChange}
                            disabled={!!quotation.converted_to_order_id}
                        >
                            <SelectTrigger className="h-8 text-xs w-36">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="draft">Borrador</SelectItem>
                                <SelectItem value="preparing">En Preparación</SelectItem>
                                <SelectItem value="sent">Enviada</SelectItem>
                                <SelectItem value="in_followup">En Seguimiento</SelectItem>
                                <SelectItem value="accepted">Aceptada</SelectItem>
                                <SelectItem value="rejected">Rechazada</SelectItem>
                                <SelectItem value="cancelled">Cancelada</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1.5">
                            <Printer className="w-4 h-4" />
                            <span>Imprimir / PDF</span>
                        </Button>

                        <Button variant="outline" size="sm" onClick={handleDuplicate} className="gap-1.5">
                            <Copy className="w-4 h-4" />
                            <span>Duplicar</span>
                        </Button>

                        {!quotation.converted_to_order_id && quotation.status !== 'accepted' && (
                            <Link href={`/admin/quotations/${quotation.id}/edit`}>
                                <Button variant="outline" size="sm" className="gap-1.5">
                                    <Edit className="w-4 h-4" />
                                    <span>Editar</span>
                                </Button>
                            </Link>
                        )}

                        {/* Convert to Order Action */}
                        {!quotation.converted_to_order_id && (
                            <Button
                                size="sm"
                                onClick={handleConvertToOrder}
                                className="gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold"
                            >
                                <Sparkles className="w-4 h-4" />
                                <span>Convertir en Pedido</span>
                            </Button>
                        )}

                        {quotation.converted_order && (
                            <Link href={`/admin/crm-orders/${quotation.converted_order.id}`}>
                                <Button size="sm" className="gap-1.5 bg-primary text-primary-foreground">
                                    <span>Ver Pedido {quotation.converted_order.folio}</span>
                                    <ArrowUpRight className="w-4 h-4" />
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Converted Alert */}
                {quotation.converted_order && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-900 dark:text-emerald-200 rounded-xl flex items-center justify-between text-xs print:hidden">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Esta cotización fue aceptada y convertida en el pedido <strong>{quotation.converted_order.folio}</strong> el {quotation.converted_at?.slice(0, 10)}. Su versión aprobada se encuentra protegida.</span>
                        </div>
                        <Link href={`/admin/crm-orders/${quotation.converted_order.id}`} className="font-bold underline">
                            Ir al pedido
                        </Link>
                    </div>
                )}

                {/* Printable Formal Quotation Sheet */}
                <div className="bg-card border border-border/70 rounded-2xl p-8 sm:p-12 shadow-sm space-y-8 print:border-none print:shadow-none print:p-0">
                    {/* Header with Eladora Brand */}
                    <div className="flex justify-between items-start border-b border-border/60 pb-6">
                        <div>
                            <div className="font-serif text-3xl font-bold tracking-tight text-foreground">
                                {company_info.name}
                            </div>
                            <p className="text-xs uppercase tracking-widest text-muted-foreground mt-0.5">
                                Impresión Fina • Diseño • Experiencias
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                                {company_info.email} • {company_info.phone}
                            </p>
                        </div>

                        <div className="text-right">
                            <div className="font-mono text-xl font-bold text-primary">
                                {quotation.folio}
                            </div>
                            <div className="mt-1">
                                <UniverseBadge universe={quotation.universe} size="sm" />
                            </div>
                            <div className="text-xs text-muted-foreground mt-2 space-y-0.5">
                                <div>Fecha: <span className="font-semibold text-foreground">{quotation.creation_date}</span></div>
                                {quotation.expiration_date && (
                                    <div>Válida hasta: <span className="font-semibold text-foreground">{quotation.expiration_date}</span></div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Client & Project Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-xl bg-muted/20 border border-border/40">
                        <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                                Preparado Para:
                            </span>
                            <div className="text-base font-bold text-foreground mt-0.5">
                                {quotation.client?.name}
                            </div>
                            {quotation.client?.business_name && (
                                <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                    <Building2 className="w-3.5 h-3.5" />
                                    <span>{quotation.client.business_name}</span>
                                </div>
                            )}
                            <div className="text-xs text-muted-foreground mt-1">
                                {quotation.client?.email || quotation.client?.whatsapp || ''}
                            </div>
                        </div>

                        <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                                Proyecto:
                            </span>
                            <div className="text-base font-bold text-foreground mt-0.5">
                                {quotation.project_name}
                            </div>
                            {quotation.description && (
                                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                    {quotation.description}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Items Breakdown Table */}
                    <div className="space-y-2">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Detalle de Partidas
                        </h3>
                        <div className="border border-border/60 rounded-xl overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-muted/40 text-xs font-semibold text-muted-foreground uppercase">
                                    <tr>
                                        <th className="py-2.5 px-4 w-12 text-center">#</th>
                                        <th className="py-2.5 px-4">Concepto y Especificaciones</th>
                                        <th className="py-2.5 px-4 text-center w-24">Cantidad</th>
                                        <th className="py-2.5 px-4 text-right w-32">P. Unitario</th>
                                        <th className="py-2.5 px-4 text-right w-32">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/40">
                                    {(!quotation.items || quotation.items.length === 0) ? (
                                        <tr>
                                            <td colSpan={5} className="py-4 text-center text-muted-foreground">
                                                Sin partidas detalladas.
                                            </td>
                                        </tr>
                                    ) : (
                                        quotation.items.map((item, idx) => (
                                            <tr key={idx}>
                                                <td className="py-3 px-4 text-center text-xs font-mono text-muted-foreground">
                                                    {idx + 1}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="font-semibold text-foreground">{item.concept}</div>
                                                    {item.description && (
                                                        <div className="text-xs text-muted-foreground mt-0.5">{item.description}</div>
                                                    )}
                                                </td>
                                                <td className="py-3 px-4 text-center font-medium">
                                                    {item.quantity}
                                                </td>
                                                <td className="py-3 px-4 text-right text-xs">
                                                    <MoneyDisplay amount={item.unit_price} />
                                                </td>
                                                <td className="py-3 px-4 text-right font-bold text-foreground">
                                                    <MoneyDisplay amount={item.subtotal} />
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Totals Section */}
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-2">
                        <div className="text-xs text-muted-foreground space-y-2 max-w-md">
                            {quotation.estimated_delivery_time && (
                                <div>
                                    <span className="font-semibold text-foreground">Tiempo de entrega: </span>
                                    <span>{quotation.estimated_delivery_time}</span>
                                </div>
                            )}
                            {quotation.payment_terms && (
                                <div>
                                    <span className="font-semibold text-foreground">Condiciones de pago: </span>
                                    <span>{quotation.payment_terms}</span>
                                </div>
                            )}
                            {quotation.notes && (
                                <div className="mt-2 p-2.5 bg-muted/30 rounded-lg border border-border/40 whitespace-pre-wrap">
                                    <span className="font-semibold text-foreground block mb-0.5">Notas adicionales:</span>
                                    <span>{quotation.notes}</span>
                                </div>
                            )}
                        </div>

                        <div className="w-full sm:w-72 bg-muted/20 p-4 rounded-xl border border-border/50 space-y-2 text-sm">
                            <div className="flex justify-between text-muted-foreground">
                                <span>Subtotal:</span>
                                <span className="font-semibold text-foreground"><MoneyDisplay amount={quotation.subtotal} /></span>
                            </div>

                            {Number(quotation.discount) > 0 && (
                                <div className="flex justify-between text-emerald-700 dark:text-emerald-400">
                                    <span>Descuento aplicado:</span>
                                    <span>-<MoneyDisplay amount={quotation.discount} /></span>
                                </div>
                            )}

                            <div className="flex justify-between text-base font-bold pt-2 border-t border-border/50 text-foreground">
                                <span>Total:</span>
                                <span className="text-primary font-serif text-xl"><MoneyDisplay amount={quotation.total_amount} /></span>
                            </div>

                            <div className="flex justify-between text-xs pt-2 border-t border-border/30 text-muted-foreground">
                                <span>Anticipo para iniciar:</span>
                                <span className="font-bold text-foreground"><MoneyDisplay amount={quotation.advance_required} /></span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Version History (Hidden on Print) */}
                {quotation.versions && quotation.versions.length > 0 && (
                    <Card className="print:hidden">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <History className="w-4 h-4 text-primary" />
                                <span>Historial de Versiones y Snapshots</span>
                            </CardTitle>
                            <CardDescription>
                                Registro inmutable de cada versión generada y enviada al cliente.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2.5">
                                {quotation.versions.map((ver) => (
                                    <div
                                        key={ver.id}
                                        className="flex items-center justify-between p-3 rounded-lg border border-border/40 bg-muted/10 text-xs"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                                v{ver.version_number}
                                            </span>
                                            <div>
                                                <div className="font-semibold text-foreground">{ver.reason || 'Snapshot registrado'}</div>
                                                <div className="text-muted-foreground text-[11px] mt-0.5">
                                                    {new Date(ver.created_at).toLocaleString('es-MX')}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="font-mono text-muted-foreground">
                                            Importe: <MoneyDisplay amount={(ver.snapshot_data as any)?.total_amount ?? 0} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    );
}

QuotationsShow.layout = (page: any) => {
    const quotation = page.props.quotation;
    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Cotizaciones', href: '/admin/quotations' },
                { title: quotation?.folio || 'Cotización', href: `/admin/quotations/${quotation?.id}` },
            ]}
        >
            {page}
        </AppLayout>
    );
};
