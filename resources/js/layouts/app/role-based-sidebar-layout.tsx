import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AdminSidebar } from '@/components/admin-sidebar';
import { PendudukSidebar } from '@/components/penduduk-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { type BreadcrumbItem, type PageProps } from '@/types';
import { type PropsWithChildren } from 'react';
import { usePage } from '@inertiajs/react';

export default function RoleBasedSidebarLayout({ 
    children, 
    breadcrumbs = [] 
}: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    const { auth } = usePage<PageProps>().props;
    const isAdmin = auth.user?.role?.toLowerCase() === 'admin';

    return (
        <AppShell variant="sidebar">
            {isAdmin ? <AdminSidebar /> : <PendudukSidebar />}
            <AppContent variant="sidebar">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
        </AppShell>
    );
}
