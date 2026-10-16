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
    Globe
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

    const controlItems: NavItem[] = [
        { title: 'Dashboard', href: '/admin', icon: LayoutGrid },
        { title: 'Calendario', href: '/admin/calendar', icon: Calendar },
    ];

    const commercialItems: NavItem[] = [
        { title: 'Clientes', href: '/admin/clients', icon: Users },
        { title: 'Oportunidades', href: '/admin/opportunities', icon: Target },
        { title: 'Cotizaciones', href: '/admin/quotations', icon: FileText },
    ];

    const operationsItems: NavItem[] = [
        { title: 'Pedidos', href: '/admin/crm-orders', icon: PackageCheck },
        { title: 'Proveedores', href: '/admin/suppliers', icon: Truck },
        { title: 'Compras Externas', href: '/admin/purchases', icon: Receipt },
    ];

    const financeItems: NavItem[] = [
        { title: 'Finanzas Globales', href: '/admin/finances', icon: DollarSign },
        { title: 'Simulador Costeo', href: '/admin/simulations', icon: Calculator },
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
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
