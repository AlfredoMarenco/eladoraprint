import { router } from '@inertiajs/react';
import { BookOpen, FolderGit2, LayoutGrid, Image, Tags, FileText, MessageSquare, Briefcase, Settings, ShoppingCart, Package } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { 
    index as adminProjectsIndex,
} from '@/routes/admin/projects';
import { 
    index as adminCategoriesIndex,
} from '@/routes/admin/categories';
import { 
    index as adminPostsIndex,
} from '@/routes/admin/posts';
import { 
    index as adminServicesIndex,
} from '@/routes/admin/services';
import { 
    index as adminTestimonialsIndex,
} from '@/routes/admin/testimonials';
import { 
    index as adminSettingsIndex,
} from '@/routes/admin/settings';
import { 
    index as adminProductsIndex,
} from '@/routes/admin/products';
import { 
    index as adminOrdersIndex,
} from '@/routes/admin/orders';
import { dashboard as adminDashboard } from '@/routes/admin/index';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: adminDashboard.url(),
        icon: LayoutGrid,
    },
    {
        title: 'Órdenes',
        href: adminOrdersIndex.url(),
        icon: ShoppingCart,
    },
    {
        title: 'Productos',
        href: adminProductsIndex.url(),
        icon: Package,
    },
    {
        title: 'Proyectos',
        href: adminProjectsIndex.url(),
        icon: Image,
    },
    {
        title: 'Categorías',
        href: adminCategoriesIndex.url(),
        icon: Tags,
    },
    {
        title: 'Servicios',
        href: adminServicesIndex.url(),
        icon: Briefcase,
    },
    {
        title: 'Blog',
        href: adminPostsIndex.url(),
        icon: FileText,
    },
    {
        title: 'Testimonios',
        href: adminTestimonialsIndex.url(),
        icon: MessageSquare,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Configuración',
        href: adminSettingsIndex.url(),
        icon: Settings,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton 
                            size="lg" 
                            onClick={(e) => {
                                e.preventDefault();
                                router.visit(adminDashboard.url());
                            }}
                        >
                            <AppLogo />
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
