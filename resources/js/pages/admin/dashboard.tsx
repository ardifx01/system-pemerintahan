import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Users, FileText, Newspaper, Activity, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

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

type Activity = {
    id: number;
    user: { name: string } | null;
    action: string;
    description: string;
    created_at: string;
    date: string;
};

type Document = {
    id: number;
    type: string;
    status: string;
    user: { name: string } | null;
    created_at: string;
};

interface DashboardStats {
    totalPenduduk: number;
    pendingDokumen: number;
    totalBerita: number;
    todayActivities: number;
    recentActivities: Activity[];
    recentDocuments: Document[];
}

function getDocumentTypeName(type: string): string {
    switch (type) {
        case 'KTP':
            return 'KTP';
        case 'KK':
            return 'Kartu Keluarga';
        case 'AKTA_KELAHIRAN':
            return 'Akta Kelahiran';
        case 'AKTA_KEMATIAN':
            return 'Akta Kematian';
        default:
            return type;
    }
}

function getStatusBadge(status: string) {
    switch (status) {
        case 'DIPROSES':
            return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">Diproses</Badge>;
        case 'SELESAI':
            return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Disetujui</Badge>;
        case 'DITOLAK':
            return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Ditolak</Badge>;
        default:
            return <Badge variant="outline">{status}</Badge>;
    }
}

export default function AdminDashboard({ stats }: { stats: DashboardStats }) {
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
                            {stats?.recentActivities && stats.recentActivities.length > 0 ? (
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Admin</TableHead>
                                                <TableHead>Aktivitas</TableHead>
                                                <TableHead>Waktu</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {stats.recentActivities.map((activity) => (
                                                <TableRow key={activity.id}>
                                                    <TableCell className="font-medium">
                                                        {activity.user?.name || 'System'}
                                                    </TableCell>
                                                    <TableCell>{activity.description}</TableCell>
                                                    <TableCell className="text-muted-foreground text-sm">
                                                        {activity.date}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            ) : (
                                <div className="rounded-md border">
                                    <div className="p-4 text-center">
                                        <p className="text-sm text-muted-foreground">
                                            Belum ada aktivitas
                                        </p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>Dokumen Terbaru</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {stats?.recentDocuments && stats.recentDocuments.length > 0 ? (
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Jenis</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Pemohon</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {stats.recentDocuments.map((document) => (
                                                <TableRow key={document.id}>
                                                    <TableCell>
                                                        {getDocumentTypeName(document.type)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {getStatusBadge(document.status)}
                                                    </TableCell>
                                                    <TableCell className="text-muted-foreground text-sm">
                                                        {document.user?.name || 'Unknown'}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            ) : (
                                <div className="rounded-md border">
                                    <div className="p-4 text-center">
                                        <p className="text-sm text-muted-foreground">
                                            Belum ada dokumen
                                        </p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
