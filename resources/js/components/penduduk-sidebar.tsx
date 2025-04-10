import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Newspaper, LayoutGrid } from 'lucide-react';
import AppLogo from './app-logo';

export function PendudukSidebar() {
    usePage<PageProps>();
    const dashboardPath = '/penduduk/dashboard';

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/penduduk/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'Berita',
            href: '/penduduk/berita',
            icon: Newspaper,
        },
    ];
    
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboardPath} prefetch>
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
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
