import RoleBasedSidebarLayout from '@/layouts/app/role-based-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <RoleBasedSidebarLayout breadcrumbs={breadcrumbs} {...props}>
        {children}
    </RoleBasedSidebarLayout>
);
