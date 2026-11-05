import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { 
    LayoutGrid, 
    Calendar,
    Users, 
    Target, 
    FileText, 
    PackageCheck, 
    Truck, 
    Receipt, 
    DollarSign, 
    Calculator, 
    BarChart3, 
    Settings, 
    LayoutTemplate, 
    Image, 
    Package, 
    Globe,
    Download,
    Laptop,
    X
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarGroup,
    SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';

export function AppSidebar() {
    const { isCurrentUrl } = useCurrentUrl();
    const [showInstallHelp, setShowInstallHelp] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);

    useEffect(() => {
        const standalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
        setIsStandalone(standalone);
    }, []);

    const handleInstallClick = async () => {
        const deferredPrompt = (window as any).__deferredPwaPrompt;
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                (window as any).__deferredPwaPrompt = null;
            }
        } else {
            setShowInstallHelp(true);
        }
    };

    const controlItems: NavItem[] = [
        { title: 'Dashboard', href: '/admin', icon: LayoutGrid },
        { title: 'Calendario', href: '/admin/calendar', icon: Calendar },
        { title: 'Clientes', href: '/admin/clients', icon: Users },
        { title: 'Proveedores', href: '/admin/suppliers', icon: Truck },
    ];

    const commercialItems: NavItem[] = [
        { title: 'Simulador de Costeos', href: '/admin/simulations', icon: Calculator },
        { title: 'Oportunidades', href: '/admin/opportunities', icon: Target },
        { title: 'Cotizaciones', href: '/admin/quotations', icon: FileText },
        { title: 'Pedidos', href: '/admin/crm-orders', icon: PackageCheck },
    ];

    const operationsItems: NavItem[] = [
        { title: 'Compras Externas', href: '/admin/purchases', icon: Receipt },
        { title: 'Tiendas en Línea', href: '/admin/suppliers?type=online', icon: Globe },
    ];

    const financeItems: NavItem[] = [
        { title: 'Finanzas Globales', href: '/admin/finances', icon: DollarSign },
        { title: 'Reportes y Métricas', href: '/admin/reports', icon: BarChart3 },
    ];

    const cmsItems: NavItem[] = [
        { title: 'Páginas (Builder)', href: '/admin/pages', icon: LayoutTemplate },
        { title: 'Proyectos Portafolio', href: '/admin/projects', icon: Image },
        { title: 'Productos Tienda', href: '/admin/products', icon: Package },
    ];

    const footerNavItems: NavItem[] = [
        { title: 'Configuración CRM', href: '/admin/crm-settings', icon: Settings },
    ];

    const renderNavGroup = (label: string, items: NavItem[]) => (
        <SidebarGroup className="px-2 py-1">
            <SidebarGroupLabel className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground/80">
                {label}
            </SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    const active = isCurrentUrl(item.href);
                    const Icon = item.icon;
                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                isActive={active}
                                tooltip={{ children: item.title }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    router.visit(item.href);
                                }}
                                className={active ? 'font-semibold text-primary' : ''}
                            >
                                {Icon && <Icon className="w-4 h-4 shrink-0" />}
                                <span>{item.title}</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );

    return (
        <>
            <Sidebar collapsible="icon" variant="inset">
                <SidebarHeader className="border-b border-border/50 pb-3">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton 
                                size="lg" 
                                onClick={(e) => {
                                    e.preventDefault();
                                    router.visit('/admin');
                                }}
                            >
                                <AppLogo />
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-serif font-bold text-base tracking-tight">Eladora</span>
                                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-sans">Operations CRM</span>
                                </div>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>

                <SidebarContent className="space-y-1">
                    {renderNavGroup('Control', controlItems)}
                    {renderNavGroup('Comercial', commercialItems)}
                    {renderNavGroup('Operaciones', operationsItems)}
                    {renderNavGroup('Finanzas', financeItems)}
                    {renderNavGroup('Sitio Web CMS', cmsItems)}
                </SidebarContent>

                <SidebarFooter>
                    {!isStandalone && (
                        <SidebarMenu className="px-2 pb-1">
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    tooltip={{ children: 'Instalar App en Laptop o Tablet' }}
                                    onClick={handleInstallClick}
                                    className="bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary font-semibold text-xs"
                                >
                                    <Download className="w-4 h-4 shrink-0" />
                                    <span>Instalar App (Lap / Tablet)</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    )}
                    <NavFooter items={footerNavItems} className="mt-auto" />
                    <NavUser />
                </SidebarFooter>
            </Sidebar>

            {showInstallHelp && (
                <div
                    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
                    onClick={() => setShowInstallHelp(false)}
                >
                    <div
                        className="bg-card border border-border w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-4 relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={() => setShowInstallHelp(false)}
                            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                <Laptop className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-serif font-bold text-base text-foreground">
                                    Instalar Eladora CRM como App
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    Úsala con ícono directo en tu Laptop, iPad o Tablet.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3 text-xs text-foreground/90">
                            <div className="p-3 rounded-xl bg-muted/40 border border-border/50">
                                <p className="font-semibold text-foreground mb-1">💻 En Laptop (Chrome o Edge):</p>
                                <p className="text-muted-foreground leading-relaxed">
                                    Haz clic en el ícono de <strong>Instalar Eladora CRM</strong> (computadora con flecha hacia abajo) que aparece a la derecha de la barra de direcciones arriba, o abre el menú <strong>⋮ → Guardar y compartir → Instalar Eladora CRM</strong>.
                                </p>
                            </div>

                            <div className="p-3 rounded-xl bg-muted/40 border border-border/50">
                                <p className="font-semibold text-foreground mb-1">📱 En iPad / Tablet (Safari o Chrome):</p>
                                <p className="text-muted-foreground leading-relaxed">
                                    Toca el botón <strong>Compartir</strong> (cuadro con flecha hacia arriba) o el menú <strong>⋮</strong> y selecciona <strong>“Agregar a pantalla de inicio”</strong> / <strong>“Instalar aplicación”</strong>.
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                type="button"
                                onClick={() => setShowInstallHelp(false)}
                                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold"
                            >
                                ¡Entendido!
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
