import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, router } from '@inertiajs/react';
import { AlertCircle, AlertTriangle, Calendar, Check, ChevronLeft, ChevronRight, Clock, Edit, Loader2, Pencil, PlusCircle, Search, Trash2, User, UserCheck, UserPlus, Users, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { Pagination } from '@/components/ui/pagination';
import debounce from 'lodash/debounce';
import type { PageProps } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PendudukData {
    id: number;
    nik: string;
    nama: string;
    alamat: string;
    jenis_kelamin: string;
    tempat_lahir: string;
    tanggal_lahir: string;
    agama: string | null;
    status_perkawinan: string | null;
    pekerjaan: string | null;
    kewarganegaraan: string;
    created_at: string;
    updated_at: string;
    user_id: number;
    registration_date?: string;
    registration_date_formatted?: string;
    user?: {
        id: number;
        email: string;
        role?: string;
        created_at?: string;
    };
}

interface PendudukProps extends PageProps {
    penduduk: {
        data: PendudukData[];
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
        current_page: number;
        last_page: number;
    };
    filters: {
        search: string | null;
    };
}

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    description?: string;
    color?: 'default' | 'blue' | 'green' | 'purple' | 'red';
    delay?: number;
}

function StatsCard({ title, value, icon, description, color = 'default', delay = 0 }: StatsCardProps) {
    const colorClasses = {
        default: 'bg-gradient-to-br from-zinc-100 to-zinc-50 text-zinc-700 dark:from-zinc-900/80 dark:to-zinc-900/60 dark:text-zinc-200 border-zinc-200/60 dark:border-zinc-800/60',
        blue: 'bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-700 dark:from-blue-900/30 dark:to-indigo-900/20 dark:text-blue-200 border-blue-200/60 dark:border-blue-800/60',
        green: 'bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-700 dark:from-emerald-900/30 dark:to-teal-900/20 dark:text-emerald-200 border-emerald-200/60 dark:border-emerald-800/60',
        purple: 'bg-gradient-to-br from-purple-50 to-violet-50 text-purple-700 dark:from-purple-900/30 dark:to-violet-900/20 dark:text-purple-200 border-purple-200/60 dark:border-purple-800/60',
        red: 'bg-gradient-to-br from-red-50 to-rose-50 text-red-700 dark:from-red-900/30 dark:to-rose-900/20 dark:text-red-200 border-red-200/60 dark:border-red-800/60'
    };

    const iconBgClasses = {
        default: 'bg-zinc-200/70 dark:bg-zinc-700/70',
        blue: 'bg-blue-100 dark:bg-blue-800/50',
        green: 'bg-emerald-100 dark:bg-emerald-800/50',
        purple: 'bg-purple-100 dark:bg-purple-800/50',
        red: 'bg-red-100 dark:bg-red-800/50'
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: delay * 0.1, ease: 'easeOut' }}
            className="h-full"
        >
            <Card className={cn("h-full flex flex-col shadow-sm border", colorClasses[color])}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 py-3 px-4 sm:py-4 flex-shrink-0">
                    <CardTitle className="text-xs sm:text-sm font-medium">{title}</CardTitle>
                    <div className={cn("p-1.5 rounded-full", iconBgClasses[color])}>
                        <div className="h-3.5 w-3.5 sm:h-4 sm:w-4">{icon}</div>
                    </div>
                </CardHeader>
                <CardContent className="flex flex-col justify-between flex-grow px-4 pt-0 pb-4">
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold">{value}</div>
                    {description && (
                        <div className="mt-2">
                            <p className="text-[10px] sm:text-xs opacity-80 font-medium">{description}</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manajemen Penduduk',
        href: '/admin/penduduk',
    },
];

export default function Penduduk({ penduduk, filters, flash }: PendudukProps) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [pendudukToDelete, setPendudukToDelete] = useState<PendudukData | null>(null);
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [isMobile, setIsMobile] = useState(false);

    // Check if viewport is mobile-sized
    useEffect(() => {
        const checkIfMobile = () => setIsMobile(window.innerWidth < 640);
        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);
        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    // Stats calculations
    const totalPenduduk = penduduk.data.length;
    // Data penduduk terdaftar adalah yang memiliki nama dan email (terkait akun)
    const completePenduduk = penduduk.data.filter(p => p.nama && p.user?.email).length;
    const recentRegistrations = penduduk.data.filter(p => {
        if (!p.user?.created_at) return false;
        const createdDate = new Date(p.user.created_at);
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return createdDate >= oneWeekAgo;
    }).length;

    // Display flash messages from Laravel as toast notifications
    useEffect(() => {
        if (flash?.message) {
            toast({
                title: flash.type === 'success' ? 'Sukses' : 'Error',
                description: flash.message,
                variant: flash.type === 'error' ? 'destructive' : 'default'
            });
        }
    }, [flash]);

    const { data, setData, post, processing, errors, reset } = useForm<{
        nik: string;
        nama: string;
        alamat: string;
        jenis_kelamin: string;
        tempat_lahir: string;
        tanggal_lahir: string;
        agama: string | null;
        status_perkawinan: string | null;
        pekerjaan: string | null;
        kewarganegaraan: string;
        email: string;
        password: string;
        role: string;
    }>({
        nik: '',
        nama: '',
        alamat: '',
        jenis_kelamin: 'Laki-laki',
        tempat_lahir: '',
        tanggal_lahir: new Date().toISOString().split('T')[0],
        agama: '',
        status_perkawinan: '',
        pekerjaan: '',
        kewarganegaraan: 'Indonesia',
        email: '',
        password: '',
        role: 'penduduk',
    });

    const { data: editData, setData: setEditData, put, processing: editProcessing, errors: editErrors, reset: resetEdit } = useForm({
        id: '',
        nik: '',
        nama: '',
        alamat: '',
        jenis_kelamin: 'Laki-laki',
        tempat_lahir: '',
        tanggal_lahir: '',
        agama: '',
        status_perkawinan: '',
        pekerjaan: '',
        kewarganegaraan: 'Indonesia',
        email: '',
        user_id: '',
    });

    const debouncedSearch = debounce((value: string) => {
        router.get(
            route('admin.penduduk'), 
            { search: value },
            { preserveState: true, preserveScroll: true }
        );
    }, 300);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
        debouncedSearch(value);
    };

    const handleAddSubmit = () => {
        post(route('admin.penduduk.store'), {
            onSuccess: () => {
                reset();
                setIsAddModalOpen(false);
                // Update local state for immediate UI feedback
                router.reload();
            },
        });
    };

    const openEditModal = (penduduk: PendudukData) => {
        setEditData({
            id: penduduk.id.toString(),
            nik: penduduk.nik,
            nama: penduduk.nama,
            alamat: penduduk.alamat,
            jenis_kelamin: penduduk.jenis_kelamin,
            tempat_lahir: penduduk.tempat_lahir,
            tanggal_lahir: penduduk.tanggal_lahir.split('T')[0], // Format date for input
            agama: penduduk.agama || '',
            status_perkawinan: penduduk.status_perkawinan || '',
            pekerjaan: penduduk.pekerjaan || '',
            kewarganegaraan: penduduk.kewarganegaraan,
            email: penduduk.user?.email || '',
            user_id: penduduk.user_id.toString(),
        });
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = () => {
        put(route('admin.penduduk.update', { penduduk: editData.id }), {
            onSuccess: () => {
                resetEdit();
                setIsEditModalOpen(false);
                router.reload();
            },
        });
    };

    const openDeleteModal = (penduduk: PendudukData) => {
        setPendudukToDelete(penduduk);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteSubmit = () => {
        if (!pendudukToDelete) return;

        router.delete(route('admin.penduduk.destroy', { penduduk: pendudukToDelete.id }), {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setPendudukToDelete(null);
                // No need to reload as Inertia will handle the redirect from the controller
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Penduduk" />
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="flex h-full flex-1 flex-col gap-5 sm:gap-6 p-4 sm:p-6"
            >
                <div className="flex flex-col gap-2">
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 dark:from-primary/90 dark:to-primary/60">Manajemen Penduduk</h1>
                    <p className="text-sm sm:text-base text-muted-foreground">Kelola data dan akun penduduk dalam sistem.</p>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:gap-6">
                    <StatsCard
                        title="Total Penduduk"
                        value={totalPenduduk.toLocaleString()}
                        icon={<Users className="h-full w-full" />}
                        color="blue"
                        delay={0}
                        description="Semua data penduduk"
                    />
                    <StatsCard
                        title="Data Terdaftar"
                        value={completePenduduk.toLocaleString()}
                        icon={<UserCheck className="h-full w-full" />}
                        color="green"
                        delay={1}
                        description="Penduduk dengan akun aktif"
                    />
                    <StatsCard
                        title="Registrasi Baru"
                        value={recentRegistrations.toLocaleString()}
                        icon={<UserPlus className="h-full w-full" />}
                        color="purple"
                        delay={2}
                        description="Dalam 7 hari terakhir"
                    />
                </div>

                <Card className="overflow-hidden shadow-sm border border-border/40">
                    <CardHeader className="bg-card/30 backdrop-blur-sm pb-4 sm:pb-6 border-b">
                        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                            <div>
                                <CardTitle className="flex items-center gap-2 text-base sm:text-lg font-semibold">
                                    <div className="bg-primary/10 p-1.5 rounded-md">
                                        <Users className="h-4 w-4 text-primary" />
                                    </div>
                                    Data Penduduk
                                </CardTitle>
                                <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 flex items-center">
                                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary/60 mr-1.5"></span>
                                    Total {penduduk.data.length} penduduk {searchQuery && 'ditemukan'}
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                                <div className="relative w-full sm:w-auto">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input 
                                        type="search"
                                        placeholder={isMobile ? "Cari..." : "Cari Email atau Nama..."}
                                        className="w-full pl-9 bg-background/80 border-border/50 focus-visible:ring-primary/20 sm:w-64"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                    />
                                </div>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button 
                                                onClick={() => setIsAddModalOpen(true)}
                                                className="w-full sm:w-auto bg-primary/90 hover:bg-primary shadow-sm"
                                            >
                                                <PlusCircle className="mr-2 h-4 w-4" />
                                                {isMobile ? "Tambah" : "Tambah Penduduk"}
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="bottom">
                                            <p className="text-xs">Tambah data penduduk baru</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border/50">
                                        <TableHead className="w-[160px] sm:w-[220px] text-xs sm:text-sm font-medium text-muted-foreground/90">Nama</TableHead>
                                        <TableHead className="w-[150px] sm:w-[220px] text-xs sm:text-sm font-medium text-muted-foreground/90 hidden sm:table-cell">Email</TableHead>
                                        <TableHead className="w-[130px] sm:w-[150px] text-xs sm:text-sm font-medium text-muted-foreground/90">Status Data</TableHead>
                                        <TableHead className="w-[150px] sm:w-[180px] text-xs sm:text-sm font-medium text-muted-foreground/90 hidden md:table-cell">Tanggal Registrasi</TableHead>
                                        <TableHead className="text-right text-xs sm:text-sm font-medium text-muted-foreground/90">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {penduduk.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5}>
                                                <motion.div 
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.4 }}
                                                    className="flex flex-col items-center justify-center py-10 sm:py-16 text-center"
                                                >
                                                    {searchQuery ? (
                                                        <>
                                                            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-full mb-4">
                                                                <Search className="h-8 w-8 sm:h-10 sm:w-10 text-yellow-500 dark:text-yellow-400" />
                                                            </div>
                                                            <p className="text-base text-foreground font-medium">Tidak ada penduduk ditemukan</p>
                                                            <p className="text-sm text-muted-foreground mt-1.5 max-w-md">
                                                                Coba dengan kata kunci lain atau reset pencarian
                                                            </p>
                                                            <Button 
                                                                variant="outline" 
                                                                className="mt-4" 
                                                                size="sm"
                                                                onClick={() => {
                                                                    setSearchQuery('');
                                                                    router.get(route('admin.penduduk'), {}, { preserveState: true });
                                                                }}
                                                            >
                                                                Reset Pencarian
                                                            </Button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-full mb-4">
                                                                <Users className="h-8 w-8 sm:h-10 sm:w-10 text-blue-500 dark:text-blue-400" />
                                                            </div>
                                                            <p className="text-base text-foreground font-medium">Belum ada data penduduk</p>
                                                            <p className="text-sm text-muted-foreground mt-1.5 max-w-md">
                                                                Tambahkan penduduk baru dengan menekan tombol di bawah
                                                            </p>
                                                            <Button 
                                                                className="mt-4 bg-primary/90 hover:bg-primary" 
                                                                size="sm"
                                                                onClick={() => setIsAddModalOpen(true)}
                                                            >
                                                                <PlusCircle className="mr-2 h-4 w-4" />
                                                                Tambah Penduduk
                                                            </Button>
                                                        </>
                                                    )}
                                                </motion.div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        penduduk.data.map((item, index) => (
                                            <motion.tr 
                                                key={item.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3, delay: index * 0.03, ease: 'easeOut' }}
                                                className="group hover:bg-muted/40 border-b border-border/30 last:border-0"
                                            >
                                                <TableCell className="font-medium text-xs sm:text-sm py-3 sm:py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="bg-primary/10 p-1.5 rounded-md">
                                                            <User className="h-3.5 w-3.5 text-primary" />
                                                        </div>
                                                        <span className="truncate max-w-[100px] sm:max-w-full font-medium">{item.nama}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden sm:table-cell text-xs sm:text-sm py-3 sm:py-4">
                                                    <span className="flex items-center gap-1.5">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0"></span>
                                                        <span className="truncate text-muted-foreground">{item.user?.email || '-'}</span>
                                                    </span>
                                                </TableCell>
                                                <TableCell className="py-3 sm:py-4">
                                                    {item.nama && item.user?.email ? (
                                                        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 flex items-center gap-1.5 whitespace-nowrap text-xs px-2 py-0.5 font-medium">
                                                            <span className="h-1.5 w-1.5 rounded-full bg-green-500 flex-shrink-0"></span>
                                                            Lengkap
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200 flex items-center gap-1.5 whitespace-nowrap text-xs px-2 py-0.5 font-medium">
                                                            <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
                                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                                                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-yellow-500"></span>
                                                            </span>
                                                            {isMobile ? "Belum" : "Belum Lengkap"}
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell text-xs sm:text-sm py-3 sm:py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="bg-muted/70 p-1.5 rounded-md flex-shrink-0">
                                                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-foreground/90">{item.registration_date_formatted || '-'}</span>
                                                            {item.registration_date && (
                                                                <span className="text-xs text-muted-foreground">
                                                                    {new Date(item.registration_date).toLocaleDateString('id-ID')}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right py-3 sm:py-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button 
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={() => openEditModal(item)}
                                                                        className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md"
                                                                    >
                                                                        <Edit className="h-4 w-4" />
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent side="top">
                                                                    <p className="text-xs">Edit data</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                        
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button 
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={() => openDeleteModal(item)}
                                                                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md"
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent side="top">
                                                                    <p className="text-xs">Hapus data</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    </div>
                                                </TableCell>
                                            </motion.tr>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {penduduk.last_page > 1 && (
                            <div className="px-3 sm:px-4 py-3 sm:py-4 border-t">
                                <Pagination className="justify-center">
                                    {penduduk.links.map((link, i) => (
                                        <Button
                                            key={i}
                                            variant={link.active ? "default" : "outline"}
                                            className="mx-0.5 sm:mx-1 h-7 w-7 sm:h-8 sm:w-8 p-0 text-xs sm:text-sm"
                                            disabled={!link.url}
                                            onClick={() => link.url && router.get(link.url)}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </Pagination>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>

            {/* Add Modal */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent className="sm:max-w-[550px] p-0 gap-0 overflow-hidden border-none shadow-xl">
                    <DialogHeader className="px-6 pt-6 pb-4 bg-gradient-to-b from-card to-background border-b">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary/10 p-2 rounded-md">
                                <UserPlus className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-semibold">Tambah Penduduk Baru</DialogTitle>
                                <DialogDescription className="text-muted-foreground/90 mt-1">
                                    Data dengan tanda <span className="text-primary">*</span> wajib diisi
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
                        <div className="grid gap-5">
                            <motion.div 
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2, delay: 0.1 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-5"
                            >
                                <div className="space-y-2.5">
                                    <Label htmlFor="nama" className="font-medium flex items-center">
                                        Nama Lengkap <span className="text-primary ml-1">*</span>
                                    </Label>
                                    <Input
                                        id="nama"
                                        placeholder="Masukkan Nama Lengkap"
                                        value={data.nama}
                                        onChange={(e) => setData('nama', e.target.value)}
                                        className={cn(
                                            "border-border/50 bg-background/80 focus-visible:ring-1 focus-visible:ring-primary/30",
                                            errors.nama && "border-red-400 focus-visible:ring-red-400/30"
                                        )}
                                    />
                                    {errors.nama && (
                                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1.5">
                                            <AlertCircle className="h-3 w-3" /> {errors.nama}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2.5">
                                    <Label htmlFor="email" className="font-medium flex items-center">
                                        Email <span className="text-primary ml-1">*</span>
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Masukkan Email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className={cn(
                                            "border-border/50 bg-background/80 focus-visible:ring-1 focus-visible:ring-primary/30",
                                            errors.email && "border-red-400 focus-visible:ring-red-400/30"
                                        )}
                                    />
                                    {errors.email && (
                                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1.5">
                                            <AlertCircle className="h-3 w-3" /> {errors.email}
                                        </p>
                                    )}
                                </div>
                            </motion.div>

                            <motion.div 
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2, delay: 0.2 }}
                                className="space-y-2.5"
                            >
                                <Label htmlFor="password" className="font-medium flex items-center">
                                    Password <span className="text-primary ml-1">*</span>
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Masukkan Password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className={cn(
                                        "border-border/50 bg-background/80 focus-visible:ring-1 focus-visible:ring-primary/30",
                                        errors.password && "border-red-400 focus-visible:ring-red-400/30"
                                    )}
                                />
                                {errors.password && (
                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1.5">
                                        <AlertCircle className="h-3 w-3" /> {errors.password}
                                    </p>
                                )}
                            </motion.div>

                            {/* Hidden but necessary fields */}
                            <div className="hidden">
                                <Input
                                    id="role"
                                    value={data.role}
                                    onChange={(e) => setData('role', e.target.value)}
                                />
                                <Input
                                    id="jenis_kelamin"
                                    value={data.jenis_kelamin}
                                    onChange={(e) => setData('jenis_kelamin', e.target.value)}
                                />
                                <Input
                                    id="tempat_lahir"
                                    value={data.tempat_lahir}
                                    onChange={(e) => setData('tempat_lahir', e.target.value)}
                                />
                                <Input
                                    id="tanggal_lahir"
                                    type="date" 
                                    value={data.tanggal_lahir}
                                    onChange={(e) => setData('tanggal_lahir', e.target.value)}
                                />
                                <Input
                                    id="agama"
                                    value={data.agama || ''}
                                    onChange={(e) => setData('agama', e.target.value)}
                                />
                                <Input
                                    id="status_perkawinan"
                                    value={data.status_perkawinan || ''}
                                    onChange={(e) => setData('status_perkawinan', e.target.value)}
                                />
                                <Input
                                    id="pekerjaan"
                                    value={data.pekerjaan || ''}
                                    onChange={(e) => setData('pekerjaan', e.target.value)}
                                />
                                <Input
                                    id="kewarganegaraan"
                                    value={data.kewarganegaraan}
                                    onChange={(e) => setData('kewarganegaraan', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="flex px-6 py-4 bg-muted/20 border-t gap-2 sm:gap-0">
                        <Button 
                            variant="outline" 
                            onClick={() => {
                                setIsAddModalOpen(false);
                                reset();
                            }}
                            className="border-border/50 hover:bg-background"
                        >
                            Batal
                        </Button>
                        <Button 
                            onClick={handleAddSubmit} 
                            disabled={processing}
                            className="bg-primary/90 hover:bg-primary gap-2 shadow-sm"
                        >
                            {processing && <Loader2 className="h-4 w-4 animate-spin" />}
                            Simpan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="sm:max-w-[550px] p-0 gap-0 overflow-hidden border-none shadow-xl">
                    <DialogHeader className="px-6 pt-6 pb-4 bg-gradient-to-b from-card to-background border-b">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-md">
                                <Edit className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-semibold">Edit Data Penduduk</DialogTitle>
                                <DialogDescription className="text-muted-foreground/90 mt-1">
                                    Data dengan tanda <span className="text-blue-500">*</span> wajib diisi
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
                        <div className="grid gap-5">
                            <motion.div 
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2, delay: 0.1 }}
                                className="space-y-2.5"
                            >
                                <Label htmlFor="edit-nama" className="font-medium flex items-center">
                                    Nama Lengkap <span className="text-blue-500 ml-1">*</span>
                                </Label>
                                <Input
                                    id="edit-nama"
                                    placeholder="Masukkan Nama Lengkap"
                                    value={editData.nama}
                                    onChange={(e) => setEditData('nama', e.target.value)}
                                    className={cn(
                                        "border-border/50 bg-background/80 focus-visible:ring-1 focus-visible:ring-blue-400/30",
                                        editErrors.nama && "border-red-400 focus-visible:ring-red-400/30"
                                    )}
                                />
                                {editErrors.nama && (
                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1.5">
                                        <AlertCircle className="h-3 w-3" /> {editErrors.nama}
                                    </p>
                                )}
                            </motion.div>

                            <motion.div 
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2, delay: 0.2 }}
                                className="space-y-2.5"
                            >
                                <Label htmlFor="edit-email" className="font-medium">Email (Terhubung dengan Akun)</Label>
                                <Input
                                    id="edit-email"
                                    type="email"
                                    value={editData.email}
                                    readOnly
                                    disabled
                                    className="bg-muted/50 dark:bg-muted/20 text-muted-foreground border-border/50"
                                />
                                <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1.5">
                                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-yellow-500"></span>
                                    Email tidak dapat diubah karena terhubung dengan akun pengguna
                                </p>
                            </motion.div>

                            {/* Hidden but necessary fields */}
                            <div className="hidden">
                                <Input
                                    id="edit-user_id"
                                    value={editData.user_id}
                                    onChange={(e) => setEditData('user_id', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="flex px-6 py-4 bg-muted/20 border-t gap-2 sm:gap-0">
                        <Button 
                            variant="outline" 
                            onClick={() => {
                                setIsEditModalOpen(false);
                                resetEdit();
                            }}
                            className="border-border/50 hover:bg-background"
                        >
                            Batal
                        </Button>
                        <Button 
                            onClick={handleEditSubmit} 
                            disabled={editProcessing}
                            className="bg-blue-500/90 hover:bg-blue-500 gap-2 shadow-sm text-white"
                        >
                            {editProcessing && <Loader2 className="h-4 w-4 animate-spin" />}
                            Simpan Perubahan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Modal */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent className="sm:max-w-[425px] p-0 gap-0 overflow-hidden border-none shadow-xl">
                    <DialogHeader className="px-6 pt-6 pb-4 bg-gradient-to-b from-rose-50/80 to-rose-50/30 dark:from-rose-950/20 dark:to-background border-b">
                        <div className="flex items-center gap-3">
                            <div className="bg-rose-100 dark:bg-rose-900/20 p-2 rounded-md">
                                <Trash2 className="h-5 w-5 text-rose-500 dark:text-rose-400" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-semibold text-rose-600 dark:text-rose-400">Konfirmasi Hapus</DialogTitle>
                                <DialogDescription className="text-muted-foreground/90 mt-1">
                                    Anda yakin ingin menghapus data penduduk ini?
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    <div className="px-6 py-5">
                        <motion.div 
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <p className="text-sm text-muted-foreground">
                                Data yang sudah dihapus tidak dapat dikembalikan. Tindakan ini juga akan menghapus akun pengguna yang terhubung dengan data penduduk ini.
                            </p>
                            <div className="mt-4 p-4 bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/50 rounded-lg shadow-sm">
                                <div className="flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                                    <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                                        Perhatian
                                    </p>
                                </div>
                                <p className="text-xs text-amber-600 dark:text-amber-500 mt-2 ml-6">
                                    Pengguna tidak akan bisa login lagi setelah data dihapus.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                    <DialogFooter className="flex px-6 py-4 bg-muted/20 border-t gap-2 sm:gap-0">
                        <Button 
                            variant="outline" 
                            onClick={() => {
                                setIsDeleteModalOpen(false);
                                setPendudukToDelete(null);
                            }}
                            className="border-border/50 hover:bg-background"
                        >
                            Batal
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteSubmit}
                            disabled={processing}
                            className="bg-rose-500 hover:bg-rose-600 gap-2 shadow-sm"
                        >
                            {processing && <Loader2 className="h-4 w-4 animate-spin" />}
                            Hapus Permanen
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
