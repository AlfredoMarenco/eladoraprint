import React from 'react';
import { Printer, Sparkles, HeartHandshake, Layers } from 'lucide-react';
import type { Universe } from '@/types/crm';

interface Props {
    universe?: Universe | 'all' | string | null;
    showIcon?: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function UniverseBadge({ universe, showIcon = true, size = 'md', className = '' }: Props) {
    const config = {
        print: {
            label: 'Eladora Print',
            short: 'Print',
            icon: Printer,
            classes: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
        },
        studio: {
            label: 'Eladora Studio',
            short: 'Studio',
            icon: Sparkles,
            classes: 'bg-indigo-50 text-indigo-800 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800',
        },
        moments: {
            label: 'Eladora Moments',
            short: 'Moments',
            icon: HeartHandshake,
            classes: 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
        },
        all: {
            label: 'Todos los Universos',
            short: 'Todos',
            icon: Layers,
            classes: 'bg-stone-100 text-stone-700 border-stone-200 dark:bg-stone-900 dark:text-stone-300 dark:border-stone-700',
        },
    };

    const current = config[(universe as keyof typeof config) || 'all'] ?? config.all;
    const Icon = current.icon;

    const sizeClasses = {
        sm: 'text-xs px-2 py-0.5 gap-1 font-medium',
        md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
        lg: 'text-sm px-3 py-1.5 gap-2 font-semibold',
    }[size];

    return (
        <span
            className={`inline-flex items-center rounded-full border transition-all shadow-xs ${current.classes} ${sizeClasses} ${className}`}
        >
            {showIcon && <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />}
            <span>{current.label}</span>
        </span>
    );
}
