import React from 'react';
import { 
    Clock, 
    CheckCircle2, 
    AlertCircle, 
    PauseCircle, 
    Truck, 
    Send, 
    FileEdit, 
    DollarSign,
    Sparkles,
    ShieldAlert,
    ShoppingBag,
    type LucideIcon
} from 'lucide-react';

interface Props {
    type: 'operating' | 'operational' | 'commercial' | 'financial' | 'priority' | 'purchase' | 'approval';
    status: string;
    size?: 'sm' | 'md';
    className?: string;
}

export function StatusBadge({ type, status, size = 'md', className = '' }: Props) {
    const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5 gap-1' : 'text-xs px-2.5 py-1 gap-1.5';

    // Operating statuses
    const operatingConfig: Record<string, { label: string; classes: string; icon: LucideIcon }> = {
        no_iniciado: { label: 'No iniciado', classes: 'bg-stone-100 text-stone-700 border-stone-200 dark:bg-stone-900 dark:text-stone-300', icon: Clock },
        pendiente_informacion: { label: 'Falta información', classes: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300', icon: AlertCircle },
        pendiente_aprobacion: { label: 'En aprobación', classes: 'bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300', icon: Send },
        pendiente_compra: { label: 'Pendiente de compra', classes: 'bg-orange-50 text-orange-800 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300', icon: Clock },
        pendiente_recepcion: { label: 'Esperando insumo', classes: 'bg-indigo-50 text-indigo-800 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300', icon: Clock },
        listo_produccion: { label: 'Listo p/ producción', classes: 'bg-teal-50 text-teal-800 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300', icon: CheckCircle2 },
        en_produccion: { label: 'En producción', classes: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 animate-pulse', icon: Sparkles },
        en_revision_interna: { label: 'Revisión interna', classes: 'bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300', icon: FileEdit },
        pendiente_aprobacion_final: { label: 'Aprobación final', classes: 'bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-950/40 dark:text-yellow-300', icon: AlertCircle },
        listo_para_entregar: { label: 'Listo para entregar', classes: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300', icon: CheckCircle2 },
        entregado: { label: 'Entregado', classes: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200', icon: Truck },
        bloqueado: { label: 'Bloqueado / Pausa', classes: 'bg-red-50 text-red-800 border-red-200 dark:bg-red-950/40 dark:text-red-300 font-semibold', icon: PauseCircle },
        cerrado: { label: 'Cerrado', classes: 'bg-stone-200 text-stone-800 border-stone-300', icon: CheckCircle2 },
    };

    // Financial statuses
    const financialConfig: Record<string, { label: string; classes: string; icon: LucideIcon }> = {
        'Sin anticipo registrado': { label: 'Sin anticipo', classes: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300', icon: AlertCircle },
        'Anticipo parcial': { label: 'Anticipo parcial', classes: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300', icon: DollarSign },
        'Anticipo cubierto': { label: 'Anticipo cubierto', classes: 'bg-teal-50 text-teal-800 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300', icon: CheckCircle2 },
        'Pago parcial': { label: 'Pago parcial', classes: 'bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300', icon: DollarSign },
        'Liquidado': { label: 'Liquidado 100%', classes: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 font-semibold', icon: CheckCircle2 },
        'Cancelado con ajuste': { label: 'Cancelado c/ ajuste', classes: 'bg-stone-100 text-stone-600 border-stone-200 dark:bg-stone-900 dark:text-stone-400', icon: ShieldAlert },
    };

    // Commercial statuses
    const commercialConfig: Record<string, { label: string; classes: string; icon: LucideIcon }> = {
        cotizado: { label: 'Cotizado', classes: 'bg-stone-100 text-stone-700 border-stone-200', icon: Clock },
        confirmado: { label: 'Confirmado', classes: 'bg-emerald-50 text-emerald-800 border-emerald-200', icon: CheckCircle2 },
        en_proceso: { label: 'En proceso', classes: 'bg-blue-50 text-blue-800 border-blue-200', icon: Sparkles },
        entregado: { label: 'Entregado', classes: 'bg-teal-50 text-teal-800 border-teal-200', icon: Truck },
        cerrado: { label: 'Cerrado', classes: 'bg-stone-200 text-stone-800 border-stone-300', icon: CheckCircle2 },
        cancelado: { label: 'Cancelado', classes: 'bg-red-50 text-red-800 border-red-200', icon: AlertCircle },
    };

    // Priority
    const priorityConfig: Record<string, { label: string; classes: string; icon: LucideIcon }> = {
        low: { label: 'Baja', classes: 'bg-stone-100 text-stone-600 border-stone-200', icon: Clock },
        medium: { label: 'Media', classes: 'bg-blue-50 text-blue-700 border-blue-200', icon: Clock },
        high: { label: 'Alta', classes: 'bg-amber-50 text-amber-800 border-amber-200 font-medium', icon: AlertCircle },
        urgent: { label: 'Urgente', classes: 'bg-rose-50 text-rose-800 border-rose-200 font-bold', icon: ShieldAlert },
    };

    // Purchase statuses
    const purchaseConfig: Record<string, { label: string; classes: string; icon: LucideIcon }> = {
        por_cotizar: { label: 'Por cotizar', classes: 'bg-stone-100 text-stone-600 border-stone-200', icon: Clock },
        solicitada: { label: 'Solicitada', classes: 'bg-blue-50 text-blue-700 border-blue-200', icon: ShoppingBag },
        confirmada: { label: 'Confirmada', classes: 'bg-teal-50 text-teal-800 border-teal-200', icon: CheckCircle2 },
        pendiente_recepcion: { label: 'Por recibir', classes: 'bg-amber-50 text-amber-800 border-amber-200', icon: Clock },
        recibida: { label: 'Recibida', classes: 'bg-emerald-50 text-emerald-800 border-emerald-200', icon: CheckCircle2 },
        cancelada: { label: 'Cancelada', classes: 'bg-rose-50 text-rose-800 border-rose-200', icon: AlertCircle },
    };

    const safeStatus = String(status || 'desconocido');
    let item: { label: string; classes: string; icon: LucideIcon } = { 
        label: safeStatus.replace(/_/g, ' '), 
        classes: 'bg-stone-100 text-stone-700 border-stone-200', 
        icon: Clock 
    };

    if (status && (type === 'operating' || type === 'operational')) item = operatingConfig[status] ?? item;
    if (status && type === 'financial') item = financialConfig[status] ?? item;
    if (status && type === 'commercial') item = commercialConfig[status] ?? item;
    if (status && type === 'priority') item = priorityConfig[status] ?? item;
    if (status && type === 'purchase') item = purchaseConfig[status] ?? item;

    const Icon = item.icon;

    return (
        <span
            className={`inline-flex items-center rounded-full border shadow-2xs font-medium transition-all ${item.classes} ${sizeClasses} ${className}`}
        >
            <Icon className={size === 'sm' ? 'w-3 h-3 shrink-0' : 'w-3.5 h-3.5 shrink-0'} />
            <span className="truncate">{item.label}</span>
        </span>
    );
}
