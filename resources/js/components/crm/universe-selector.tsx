import React from 'react';
import { router } from '@inertiajs/react';
import { Printer, Sparkles, HeartHandshake, Layers } from 'lucide-react';
import type { Universe } from '@/types/crm';

interface Props {
    currentUniverse: Universe | 'all' | string;
    onSelect?: (universe: string) => void;
    syncUrl?: boolean;
    className?: string;
}

export function UniverseSelector({
    currentUniverse = 'all',
    onSelect,
    syncUrl = true,
    className = '',
}: Props) {
    const universes = [
        { id: 'all', label: 'Todos', icon: Layers, activeColor: 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900' },
        { id: 'print', label: 'Print', icon: Printer, activeColor: 'bg-emerald-700 text-white dark:bg-emerald-600' },
        { id: 'studio', label: 'Studio', icon: Sparkles, activeColor: 'bg-indigo-700 text-white dark:bg-indigo-600' },
        { id: 'moments', label: 'Moments', icon: HeartHandshake, activeColor: 'bg-rose-700 text-white dark:bg-rose-600' },
    ];

    const handleClick = (id: string) => {
        if (onSelect) {
            onSelect(id);
        } else if (syncUrl) {
            const url = new URL(window.location.href);
            if (id === 'all') {
                url.searchParams.delete('universe');
            } else {
                url.searchParams.set('universe', id);
            }
            router.visit(url.toString(), {
                preserveScroll: true,
                preserveState: true,
            });
        }
    };

    return (
        <div className={`inline-flex items-center gap-1 p-1 bg-muted/60 backdrop-blur-xs rounded-xl border border-border/60 ${className}`}>
            {universes.map((u) => {
                const Icon = u.icon;
                const isSelected = currentUniverse === u.id;
                return (
                    <button
                        key={u.id}
                        type="button"
                        onClick={() => handleClick(u.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            isSelected
                                ? `${u.activeColor} shadow-xs font-semibold`
                                : 'text-muted-foreground hover:text-foreground hover:bg-background/80'
                        }`}
                    >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{u.label}</span>
                    </button>
                );
            })}
        </div>
    );
}
