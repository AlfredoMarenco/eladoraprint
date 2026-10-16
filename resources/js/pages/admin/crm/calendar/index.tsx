import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { UniverseSelector } from '@/components/crm/universe-selector';
import { UniverseBadge } from '@/components/crm/universe-badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
    Calendar as CalendarIcon, 
    ChevronLeft, 
    ChevronRight, 
    Truck, 
    CheckCircle2, 
    Clock, 
    Layers,
    AlertCircle,
    ArrowUpRight
} from 'lucide-react';
import type { Universe } from '@/types/crm';

interface CalendarEvent {
    id: string;
    title: string;
    date: string;
    type: 'delivery' | 'task' | 'purchase' | 'followup';
    universe: Universe;
    status: string;
    priority?: string;
    client_name?: string;
    url: string;
}

interface Props {
    events: CalendarEvent[];
    filters: {
        universe: Universe | 'all';
        month: string;
        view: 'month' | 'week' | 'agenda';
    };
}

export default function CrmCalendarIndex({ events, filters }: Props) {
    const [view, setView] = useState<'month' | 'agenda'>(filters.view === 'agenda' ? 'agenda' : 'month');
    const [currentMonth, setCurrentMonth] = useState(filters.month || new Date().toISOString().slice(0, 7));

    const changeMonth = (offset: number) => {
        const [y, m] = currentMonth.split('-').map(Number);
        const date = new Date(y, m - 1 + offset, 1);
        const nextMonthStr = date.toISOString().slice(0, 7);
        setCurrentMonth(nextMonthStr);

        const url = new URL(window.location.href);
        url.searchParams.set('month', nextMonthStr);
        router.visit(url.toString(), { preserveScroll: true, preserveState: true });
    };

    // Calculate grid days for the month
    const [yearNum, monthNum] = currentMonth.split('-').map(Number);
    const firstDayIndex = new Date(yearNum, monthNum - 1, 1).getDay(); // 0 is Sun
    const totalDays = new Date(yearNum, monthNum, 0).getDate();

    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const typeBadges = {
        delivery: { label: 'Entrega', classes: 'bg-emerald-500 text-white' },
        task: { label: 'Tarea Taller', classes: 'bg-indigo-500 text-white' },
        purchase: { label: 'Compra Insumo', classes: 'bg-amber-500 text-white' },
        followup: { label: 'Seguimiento', classes: 'bg-purple-500 text-white' },
    };

    return (
        <>
            <Head title="Calendario de Taller y Entregas - Eladora CRM" />

            <div className="flex flex-col gap-6 p-6 w-full">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/50">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground tracking-tight">
                                Calendario de Operaciones
                            </h1>
                            <UniverseBadge universe={filters.universe} size="sm" />
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            Fechas de entrega comprometidas, tareas operativas, recepciones de compras y seguimientos.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                        <UniverseSelector currentUniverse={filters.universe} />

                        {/* View selector */}
                        <div className="inline-flex rounded-lg border border-border bg-muted/40 p-0.5 text-xs">
                            <button
                                type="button"
                                onClick={() => setView('month')}
                                className={`px-2.5 py-1 rounded-md transition-colors ${
                                    view === 'month' ? 'bg-background shadow-2xs font-semibold' : 'text-muted-foreground'
                                }`}
                            >
                                Mes
                            </button>
                            <button
                                type="button"
                                onClick={() => setView('agenda')}
                                className={`px-2.5 py-1 rounded-md transition-colors ${
                                    view === 'agenda' ? 'bg-background shadow-2xs font-semibold' : 'text-muted-foreground'
                                }`}
                            >
                                Agenda
                            </button>
                        </div>
                    </div>
                </div>

                {/* Calendar Navigation Bar */}
                <div className="flex items-center justify-between bg-card p-3 rounded-xl border border-border/60">
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => changeMonth(-1)}>
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <h2 className="text-base sm:text-lg font-serif font-bold text-foreground px-2">
                            {monthNames[monthNum - 1]} {yearNum}
                        </h2>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => changeMonth(1)}>
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Legend */}
                    <div className="hidden sm:flex items-center gap-3 text-xs">
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                            <span>Entregas Cliente</span>
                        </span>
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                            <span>Tareas Taller</span>
                        </span>
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                            <span>Insumos</span>
                        </span>
                    </div>
                </div>

                {/* Month View Grid */}
                {view === 'month' && (
                    <Card className="overflow-hidden shadow-2xs">
                        <div className="grid grid-cols-7 border-b border-border/60 bg-muted/40 text-center py-2 text-xs font-semibold text-muted-foreground uppercase">
                            <span>Dom</span>
                            <span>Lun</span>
                            <span>Mar</span>
                            <span>Mié</span>
                            <span>Jue</span>
                            <span>Vie</span>
                            <span>Sáb</span>
                        </div>

                        <div className="grid grid-cols-7 divide-x divide-y divide-border/40">
                            {/* Empty days before 1st of month */}
                            {Array.from({ length: firstDayIndex }).map((_, i) => (
                                <div key={`empty-${i}`} className="min-h-[110px] bg-muted/10 p-1.5" />
                            ))}

                            {/* Actual month days */}
                            {Array.from({ length: totalDays }).map((_, i) => {
                                const dayNum = i + 1;
                                const dateStr = `${currentMonth}-${String(dayNum).padStart(2, '0')}`;
                                const dayEvents = events.filter((e) => e.date === dateStr);
                                const isToday = dateStr === new Date().toISOString().slice(0, 10);

                                return (
                                    <div
                                        key={`day-${dayNum}`}
                                        className={`min-h-[110px] p-1.5 flex flex-col justify-between transition-colors ${
                                            isToday ? 'bg-primary/5 font-bold' : 'hover:bg-muted/15'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between pb-1">
                                            <span
                                                className={`text-xs w-6 h-6 flex items-center justify-center rounded-full ${
                                                    isToday ? 'bg-primary text-primary-foreground font-bold' : 'text-foreground'
                                                }`}
                                            >
                                                {dayNum}
                                            </span>
                                            {dayEvents.length > 0 && (
                                                <span className="text-[10px] text-muted-foreground font-semibold">
                                                    {dayEvents.length}
                                                </span>
                                            )}
                                        </div>

                                        <div className="space-y-1 overflow-y-auto max-h-[85px]">
                                            {dayEvents.slice(0, 3).map((ev) => {
                                                const badge = typeBadges[ev.type] ?? typeBadges.delivery;
                                                return (
                                                    <a
                                                        key={ev.id}
                                                        href={ev.url}
                                                        className={`block truncate text-[11px] px-1.5 py-0.5 rounded shadow-2xs font-medium transition-transform hover:scale-[1.02] ${badge.classes}`}
                                                        title={`${ev.title} (${ev.type})`}
                                                    >
                                                        {ev.title}
                                                    </a>
                                                );
                                            })}
                                            {dayEvents.length > 3 && (
                                                <div className="text-[10px] text-muted-foreground text-center font-bold">
                                                    +{dayEvents.length - 3} más
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                )}

                {/* Agenda View List */}
                {view === 'agenda' && (
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold">Agenda de Compromisos del Periodo</CardTitle>
                            <CardDescription>Eventos ordenados cronológicamente</CardDescription>
                        </CardHeader>
                        <CardContent className="divide-y divide-border/40 p-0">
                            {events.length === 0 ? (
                                <div className="py-12 text-center text-sm text-muted-foreground">
                                    No hay eventos registrados en este periodo.
                                </div>
                            ) : (
                                events.map((ev) => {
                                    const badge = typeBadges[ev.type] ?? typeBadges.delivery;
                                    return (
                                        <div key={ev.id} className="p-4 flex items-center justify-between hover:bg-muted/20 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${badge.classes}`}>
                                                    {badge.label}
                                                </span>
                                                <div>
                                                    <a href={ev.url} className="text-sm font-semibold text-foreground hover:underline">
                                                        {ev.title}
                                                    </a>
                                                    {ev.client_name && (
                                                        <div className="text-xs text-muted-foreground">Cliente: {ev.client_name}</div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <span className="text-xs font-mono font-bold text-foreground">{ev.date}</span>
                                                <a href={ev.url}>
                                                    <Button variant="ghost" size="icon" className="h-7 w-7">
                                                        <ArrowUpRight className="w-4 h-4" />
                                                    </Button>
                                                </a>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    );
}

CrmCalendarIndex.layout = (page: any) => (
    <AppLayout breadcrumbs={[{ title: 'Calendario y Agenda', href: '/admin/calendar' }]}>
        {page}
    </AppLayout>
);
