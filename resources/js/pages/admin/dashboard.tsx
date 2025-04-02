import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Users, FileText, Newspaper, Activity } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Dashboard',
        href: '/admin/dashboard',
    },
];

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    description?: string;
}

function StatsCard({ title, value, icon, description }: StatsCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {description && (
                    <p className="text-xs text-muted-foreground">{description}</p>
                )}
            </CardContent>
        </Card>
    );
}

export default function AdminDashboard({ stats }: { stats: any }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatsCard
                        title="Total Penduduk"
                        value={stats?.totalPenduduk || 0}
                        icon={<Users className="h-4 w-4 text-muted-foreground" />}
                    />
                    <StatsCard
                        title="Dokumen Pending"
                        value={stats?.pendingDokumen || 0}
                        icon={<FileText className="h-4 w-4 text-muted-foreground" />}
                        description="Menunggu verifikasi"
                    />
                    <StatsCard
                        title="Total Berita"
                        value={stats?.totalBerita || 0}
                        icon={<Newspaper className="h-4 w-4 text-muted-foreground" />}
                    />
                    <StatsCard
                        title="Aktivitas Hari Ini"
                        value={stats?.todayActivities || 0}
                        icon={<Activity className="h-4 w-4 text-muted-foreground" />}
                    />
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Aktivitas Terbaru</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {/* Activity log table will be implemented here */}
                            <div className="rounded-md border">
                                <div className="p-4">
                                    <p className="text-sm text-muted-foreground">
                                        Belum ada aktivitas
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>Dokumen Terbaru</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {/* Recent documents list will be implemented here */}
                            <div className="rounded-md border">
                                <div className="p-4">
                                    <p className="text-sm text-muted-foreground">
                                        Belum ada dokumen
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
