import { Link } from '@inertiajs/react';
import { BookOpen, FolderGit2, LayoutGrid, Image, Tags, FileText, MessageSquare, Briefcase, Settings } from 'lucide-react';
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
import { dashboard as adminDashboard } from '@/routes/admin/index';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: adminDashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Proyectos',
        href: adminProjectsIndex(),
        icon: Image,
    },
    {
        title: 'Categorías',
        href: adminCategoriesIndex(),
        icon: Tags,
    },
    {
        title: 'Servicios',
        href: adminServicesIndex(),
        icon: Briefcase,
    },
    {
        title: 'Blog',
        href: adminPostsIndex(),
        icon: FileText,
    },
    {
        title: 'Testimonios',
        href: adminTestimonialsIndex(),
        icon: MessageSquare,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Configuración',
        href: adminSettingsIndex(),
        icon: Settings,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={adminDashboard()} prefetch>
                                <AppLogo />
                            </Link>
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
