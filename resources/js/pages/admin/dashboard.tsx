import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Users, FileText, Newspaper, Activity, Clock, User, FileCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

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
    color?: 'default' | 'blue' | 'green' | 'orange' | 'purple';
    delay?: number;
}

function StatsCard({ title, value, icon, description, color = 'default', delay = 0 }: StatsCardProps) {
    const colorClasses = {
        default: 'from-zinc-500/20 to-zinc-500/5 text-zinc-600 dark:from-zinc-400/10 dark:to-zinc-400/5 dark:text-zinc-200',
        blue: 'from-blue-500/20 to-blue-500/5 text-blue-600 dark:from-blue-400/10 dark:to-blue-400/5 dark:text-blue-200',
        green: 'from-emerald-500/20 to-emerald-500/5 text-emerald-600 dark:from-emerald-400/10 dark:to-emerald-400/5 dark:text-emerald-200',
        orange: 'from-orange-500/20 to-orange-500/5 text-orange-600 dark:from-orange-400/10 dark:to-orange-400/5 dark:text-orange-200',
        purple: 'from-purple-500/20 to-purple-500/5 text-purple-600 dark:from-purple-400/10 dark:to-purple-400/5 dark:text-purple-200',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: delay * 0.1 }}
            className="h-full"
        >
            <Card className={cn("bg-gradient-to-br h-full flex flex-col", colorClasses[color])}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 flex-shrink-0">
                    <CardTitle className="text-sm font-medium">{title}</CardTitle>
                    <div className={cn("p-2 rounded-full bg-white/20", colorClasses[color])}>
                        {icon}
                    </div>
                </CardHeader>
                <CardContent className="flex flex-col justify-between flex-grow">
                    <div className="text-3xl font-bold tracking-tight">{value}</div>
                    <div className="h-4">
                        {description && (
                            <p className="text-xs text-current/70 mt-1 font-medium">{description}</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
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

function getDocumentIcon(type: string) {
    switch (type) {
        case 'KTP':
            return <User className="h-3 w-3" />;
        case 'KK':
            return <Users className="h-3 w-3" />;
        case 'AKTA_KELAHIRAN':
        case 'AKTA_KEMATIAN':
            return <FileCheck className="h-3 w-3" />;
        default:
            return <FileText className="h-3 w-3" />;
    }
}

function getStatusBadge(status: string) {
    switch (status) {
        case 'DIPROSES':
            return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200 flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                </span>
                Diproses
            </Badge>;
        case 'SELESAI':
            return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                Disetujui
            </Badge>;
        case 'DITOLAK':
            return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-red-500"></span>
                Ditolak
            </Badge>;
        default:
            return <Badge variant="outline">{status}</Badge>;
    }
}

export default function AdminDashboard({ stats }: { stats: DashboardStats }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col gap-2"
                >
                    <h1 className="text-2xl font-bold tracking-tight">Dashboard Admin</h1>
                    <p className="text-muted-foreground">Selamat datang kembali. Ini adalah ringkasan aktivitas sistem.</p>
                </motion.div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <StatsCard
                        title="Total Penduduk"
                        value={stats?.totalPenduduk.toLocaleString() || 0}
                        icon={<Users className="h-5 w-5" />}
                        color="blue"
                        delay={0}
                    />
                    <StatsCard
                        title="Dokumen Pending"
                        value={stats?.pendingDokumen.toLocaleString() || 0}
                        icon={<FileText className="h-5 w-5" />}
                        description="Menunggu verifikasi"
                        color="orange"
                        delay={1}
                    />
                    <StatsCard
                        title="Total Berita"
                        value={stats?.totalBerita.toLocaleString() || 0}
                        icon={<Newspaper className="h-5 w-5" />}
                        description=" "
                        color="green"
                        delay={2}
                    />
                    <StatsCard
                        title="Aktivitas Hari Ini"
                        value={stats?.todayActivities.toLocaleString() || 0}
                        icon={<Activity className="h-5 w-5" />}
                        description=" "
                        color="purple"
                        delay={3}
                    />
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="col-span-4"
                    >
                        <Card className="h-full">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <div className="space-y-1">
                                    <CardTitle className="flex items-center gap-2">
                                        <Activity className="h-4 w-4 text-muted-foreground" />
                                        Aktivitas Terbaru
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground">Log aktivitas admin dalam sistem</p>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {stats?.recentActivities && stats.recentActivities.length > 0 ? (
                                    <div className="rounded-md border">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-[120px]">Admin</TableHead>
                                                    <TableHead>Aktivitas</TableHead>
                                                    <TableHead className="w-[120px]">Waktu</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {stats.recentActivities.map((activity, index) => (
                                                    <motion.tr 
                                                        key={activity.id}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                                        className="border-b last:border-0"
                                                    >
                                                        <TableCell className="font-medium flex items-center gap-2">
                                                            <div className="bg-primary/10 p-1.5 rounded-full">
                                                                <User className="h-3 w-3 text-primary" />
                                                            </div>
                                                            {activity.user?.name || 'System'}
                                                        </TableCell>
                                                        <TableCell>{activity.description}</TableCell>
                                                        <TableCell className="text-muted-foreground text-sm flex items-center gap-1.5">
                                                            <Clock className="h-3 w-3" />
                                                            {activity.date}
                                                        </TableCell>
                                                    </motion.tr>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                ) : (
                                    <div className="rounded-md border">
                                        <div className="p-8 text-center">
                                            <Activity className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                                            <p className="text-muted-foreground font-medium">
                                                Belum ada aktivitas
                                            </p>
                                            <p className="text-xs text-muted-foreground/70 mt-1">
                                                Aktivitas admin akan muncul di sini
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="col-span-3"
                    >
                        <Card className="h-full">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <div className="space-y-1">
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                        Dokumen Terbaru
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground">Permintaan dokumen dari penduduk</p>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {stats?.recentDocuments && stats.recentDocuments.length > 0 ? (
                                    <div className="rounded-md border">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-[140px]">Jenis</TableHead>
                                                    <TableHead className="w-[120px]">Status</TableHead>
                                                    <TableHead>Pemohon</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {stats.recentDocuments.map((document, index) => (
                                                    <motion.tr 
                                                        key={document.id}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                                        className="border-b last:border-0"
                                                    >
                                                        <TableCell>
                                                            <div className="flex items-center gap-2">
                                                                <div className="bg-primary/10 p-1.5 rounded-full">
                                                                    {getDocumentIcon(document.type)}
                                                                </div>
                                                                <span>{getDocumentTypeName(document.type)}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            {getStatusBadge(document.status)}
                                                        </TableCell>
                                                        <TableCell className="text-sm flex items-center gap-1.5">
                                                            <div className="bg-zinc-100 dark:bg-zinc-800 p-1 rounded-full">
                                                                <User className="h-3 w-3 text-muted-foreground" />
                                                            </div>
                                                            {document.user?.name || 'Unknown'}
                                                        </TableCell>
                                                    </motion.tr>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                ) : (
                                    <div className="rounded-md border">
                                        <div className="p-8 text-center">
                                            <FileText className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                                            <p className="text-muted-foreground font-medium">
                                                Belum ada dokumen
                                            </p>
                                            <p className="text-xs text-muted-foreground/70 mt-1">
                                                Dokumen yang diajukan akan muncul di sini
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
                
            </div>
        </AppLayout>
    );
}
