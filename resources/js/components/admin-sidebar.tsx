import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Users, FileText, Newspaper, LayoutGrid, Activity, ShieldCheck } from 'lucide-react';
import AppLogo from './app-logo';

export function AdminSidebar() {
    const { auth } = usePage<PageProps>().props;
    const dashboardPath = '/admin/dashboard';

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/admin/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'Manajemen Penduduk',
            href: '/admin/penduduk',
            icon: Users,
        },
        {
            title: 'Manajemen Dokumen',
            href: '/admin/dokumen',
            icon: FileText,
        },
        {
            title: 'Manajemen Berita',
            href: '/admin/berita',
            icon: Newspaper,
        },
        {
            title: 'Verifikasi Akun Penduduk',
            href: '/admin/verifikasi',
            icon: ShieldCheck,
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
