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
    Sparkles,
    Download,
    ExternalLink
} from 'lucide-react';
import type { Quotation } from '@/types/crm';

interface Props {
    quotation: Quotation;
    company_info: {
        name: string;
        email: string;
        phone: string;
        currency: string;
        website?: string;
        address?: string;
        bank_name?: string;
        bank_account?: string;
        bank_clabe?: string;
        bank_beneficiary?: string;
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
            <Head title={`Cotización ${quotation.folio} - Eladora`}>
                <style>{`
                    @media print {
                        @page {
                            size: letter portrait;
                            margin: 12mm 15mm 15mm 15mm;
                        }
                        header, aside, nav, [data-sidebar], .print\\:hidden, #app-header {
                            display: none !important;
                        }
                        body, #app, main {
                            background: #ffffff !important;
                            color: #000000 !important;
                            padding: 0 !important;
                            margin: 0 !important;
                            width: 100% !important;
                        }
                        .print-sheet {
                            box-shadow: none !important;
                            border: none !important;
                            padding: 0 !important;
                            margin: 0 !important;
                            max-width: 100% !important;
                            width: 100% !important;
                            background: #ffffff !important;
                        }
                    }
                `}</style>
            </Head>

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

                        <a href={`/admin/quotations/${quotation.id}/pdf`} download={`Cotizacion-${quotation.folio}.pdf`}>
                            <Button size="sm" className="gap-1.5 bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-100 dark:text-stone-900">
                                <Download className="w-4 h-4" />
                                <span>Descargar PDF</span>
                            </Button>
                        </a>

                        <a href={`/admin/quotations/${quotation.id}/preview-pdf`} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm" className="gap-1.5">
                                <ExternalLink className="w-4 h-4" />
                                <span>Ver PDF</span>
                            </Button>
                        </a>

                        <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1.5">
                            <Printer className="w-4 h-4" />
                            <span>Imprimir</span>
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

                {/* Printable Formal Quotation Sheet (Letterhead / Hoja Membretada) */}
                <div className="print-sheet bg-white text-stone-900 border border-stone-200/90 shadow-2xl max-w-4xl mx-auto rounded-xl p-8 sm:p-12 space-y-8 print:shadow-none print:border-none print:p-0 print:m-0 print:max-w-none print:w-full print:rounded-none">
                    {/* Header with Eladora Brand & Logo */}
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-stone-200 pb-6">
                        <div className="space-y-1">
                            <img src="/images/logo.png" alt={company_info.name} className="h-12 sm:h-14 w-auto object-contain mb-1" />
                            <div className="font-serif text-2xl font-bold tracking-tight text-stone-950">
                                {company_info.name}
                            </div>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-[#9A7B4F]">
                                Taller de Impresión Fina • Diseño • Experiencias
                            </p>
                            <p className="text-xs text-stone-500 pt-1 leading-relaxed">
                                {company_info.email} • {company_info.phone}<br />
                                {company_info.website || 'www.eladora.mx'} • {company_info.address || 'Ciudad de México, México'}
                            </p>
                        </div>

                        <div className="text-left sm:text-right w-full sm:w-auto">
                            <div className="bg-stone-50 border border-stone-200 border-t-4 border-t-[#9A7B4F] rounded-lg p-3 sm:min-w-[220px]">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                                    Cotización Formal
                                </span>
                                <div className="font-mono text-2xl font-bold text-stone-950 mt-0.5">
                                    {quotation.folio}
                                </div>
                                <div className="mt-1.5">
                                    <UniverseBadge universe={quotation.universe} size="sm" />
                                </div>
                                <div className="text-xs text-stone-600 mt-2.5 space-y-1">
                                    <div>Fecha expedición: <strong className="text-stone-900">{quotation.creation_date}</strong></div>
                                    {quotation.expiration_date && (
                                        <div>Válida hasta: <strong className="text-stone-900">{quotation.expiration_date}</strong></div>
                                    )}
                                    <div>Versión: <strong className="text-stone-900">v{quotation.version}</strong></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Gold Hairline Divider */}
                    <div className="h-0.5 bg-gradient-to-r from-[#C5A880]/30 via-[#9A7B4F] to-[#C5A880]/30 -mt-2" />

                    {/* Client & Project Overview Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-xl bg-stone-50/80 border border-stone-200">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#9A7B4F] block mb-1">
                                Preparado Para (Cliente):
                            </span>
                            <div className="text-base font-bold text-stone-950">
                                {quotation.client?.name}
                            </div>
                            {quotation.client?.business_name && (
                                <div className="text-xs font-semibold text-stone-700 flex items-center gap-1.5 mt-0.5">
                                    <Building2 className="w-3.5 h-3.5 text-stone-500" />
                                    <span>{quotation.client.business_name}</span>
                                </div>
                            )}
                            <div className="text-xs text-stone-500 mt-1">
                                {quotation.client?.email} {quotation.client?.email && quotation.client?.whatsapp && '•'} {quotation.client?.whatsapp || quotation.client?.phone}
                            </div>
                        </div>

                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#9A7B4F] block mb-1">
                                Especificaciones del Proyecto:
                            </span>
                            <div className="text-base font-bold text-stone-950">
                                {quotation.project_name}
                            </div>
                            {quotation.description && (
                                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                                    {quotation.description}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Items Breakdown Table */}
                    <div className="space-y-2">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#9A7B4F]">
                            Detalle de Partidas y Acabados
                        </h3>
                        <div className="border border-stone-200 rounded-xl overflow-hidden shadow-2xs">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-stone-900 text-[10px] font-semibold text-white uppercase tracking-wider">
                                    <tr>
                                        <th className="py-2.5 px-4 w-12 text-center">#</th>
                                        <th className="py-2.5 px-4">Concepto y Especificaciones Técnicas</th>
                                        <th className="py-2.5 px-4 text-center w-24">Cantidad</th>
                                        <th className="py-2.5 px-4 text-right w-32">P. Unitario</th>
                                        <th className="py-2.5 px-4 text-right w-32">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-200">
                                    {(!quotation.items || quotation.items.length === 0) ? (
                                        <tr>
                                            <td colSpan={5} className="py-4 text-center text-stone-400">
                                                Sin partidas detalladas.
                                            </td>
                                        </tr>
                                    ) : (
                                        quotation.items.map((item, idx) => (
                                            <tr key={idx} className={idx % 2 === 1 ? 'bg-stone-50/60' : 'bg-white'}>
                                                <td className="py-3 px-4 text-center text-xs font-mono text-stone-500">
                                                    {idx + 1}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="font-semibold text-stone-950 text-sm">{item.concept}</div>
                                                    {item.description && (
                                                        <div className="text-xs text-stone-600 mt-0.5 leading-relaxed">{item.description}</div>
                                                    )}
                                                </td>
                                                <td className="py-3 px-4 text-center font-semibold text-stone-900">
                                                    {item.quantity}
                                                </td>
                                                <td className="py-3 px-4 text-right text-xs font-medium text-stone-700">
                                                    <MoneyDisplay amount={item.unit_price} />
                                                </td>
                                                <td className="py-3 px-4 text-right font-bold text-stone-950">
                                                    <MoneyDisplay amount={item.subtotal} />
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Commercial Terms, Bank Info & Totals */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 text-xs text-stone-700 space-y-3">
                            <div className="text-[10px] font-bold uppercase tracking-widest text-[#9A7B4F]">
                                Términos Comerciales & Forma de Pago
                            </div>
                            
                            {quotation.estimated_delivery_time && (
                                <div>
                                    <strong className="text-stone-900">Tiempo de entrega: </strong>
                                    <span>{quotation.estimated_delivery_time}</span>
                                </div>
                            )}
                            {quotation.payment_terms && (
                                <div>
                                    <strong className="text-stone-900">Condiciones de pago: </strong>
                                    <span>{quotation.payment_terms}</span>
                                </div>
                            )}
                            {quotation.notes && (
                                <div className="pt-2 border-t border-stone-200 text-stone-600 whitespace-pre-wrap">
                                    <strong className="text-stone-900 block mb-0.5">Notas de producción:</strong>
                                    <span>{quotation.notes}</span>
                                </div>
                            )}

                            {/* Bank details for deposit / SPEI */}
                            <div className="p-3 bg-white border border-stone-300 rounded-lg space-y-1">
                                <span className="font-bold text-stone-900 block text-[11px]">
                                    Datos de Depósito / Transferencia (SPEI):
                                </span>
                                <div className="text-stone-600">
                                    Banco: <strong className="text-stone-900">{company_info.bank_name || 'BBVA México'}</strong>
                                </div>
                                <div className="text-stone-600">
                                    Beneficiario: <strong className="text-stone-900">{company_info.bank_beneficiary || company_info.name}</strong>
                                </div>
                                <div className="text-stone-600">
                                    CLABE: <strong className="text-stone-900 font-mono text-[11px]">{company_info.bank_clabe || '012 180 00123456789 0'}</strong>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-stone-50 p-5 rounded-xl border border-stone-200 space-y-2.5 text-sm">
                                <div className="flex justify-between text-stone-600">
                                    <span>Subtotal:</span>
                                    <span className="font-semibold text-stone-900"><MoneyDisplay amount={quotation.subtotal} /></span>
                                </div>

                                {Number(quotation.discount) > 0 && (
                                    <div className="flex justify-between text-emerald-700">
                                        <span>Descuento aplicado:</span>
                                        <span className="font-semibold">-<MoneyDisplay amount={quotation.discount} /></span>
                                    </div>
                                )}

                                <div className="flex justify-between items-baseline text-base font-bold pt-2.5 border-t border-stone-300 text-stone-950">
                                    <span>TOTAL:</span>
                                    <span className="text-stone-950 font-serif text-2xl font-bold">
                                        <MoneyDisplay amount={quotation.total_amount} />
                                    </span>
                                </div>

                                {/* Advance Box */}
                                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg mt-2">
                                    <div className="flex justify-between items-center text-xs text-emerald-950 font-bold">
                                        <span>Anticipo para iniciar (50%):</span>
                                        <span className="text-sm font-extrabold text-emerald-800">
                                            <MoneyDisplay amount={quotation.advance_required} />
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-[11px] text-emerald-800 mt-1">
                                        <span>Saldo restante al entregar:</span>
                                        <span><MoneyDisplay amount={Math.max(0, Number(quotation.total_amount) - Number(quotation.advance_required))} /></span>
                                    </div>
                                </div>
                            </div>

                            {/* Signature acceptance block */}
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-stone-200 text-center">
                                <div className="pt-8 border-t border-stone-400">
                                    <div className="text-[10px] font-bold uppercase tracking-wider text-stone-700">Por {company_info.name}</div>
                                    <div className="text-[9px] text-stone-500">Taller & Asesoría Comercial</div>
                                </div>
                                <div className="pt-8 border-t border-stone-400">
                                    <div className="text-[10px] font-bold uppercase tracking-wider text-stone-700">Aceptación y V.B. del Cliente</div>
                                    <div className="text-[9px] text-stone-500">Firma, Nombre y Fecha</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-stone-200 pt-4 text-center text-[10px] text-stone-500">
                        Este documento constituye una propuesta formal de trabajo de <strong>{company_info.name}</strong>. Los precios cotizados están sujetos a las especificaciones aquí descritas.<br />
                        {company_info.website || 'www.eladora.mx'} • {company_info.email} • Tel: {company_info.phone}
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
    const quotation = page?.props?.quotation ?? page?.quotation;
    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Cotizaciones', href: '/admin/quotations' },
                { title: quotation?.folio || 'Cotización', href: quotation?.id ? `/admin/quotations/${quotation.id}` : '/admin/quotations' },
            ]}
        >
            {page}
        </AppLayout>
    );
};
