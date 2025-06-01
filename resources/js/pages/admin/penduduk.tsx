import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, router } from '@inertiajs/react';
import { Edit, PlusCircle, Search, Trash2, Users, UserCheck, UserX, Calendar, Clock, Loader2, User } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { Pagination } from '@/components/ui/pagination';
import debounce from 'lodash/debounce';
import type { PageProps } from '@/types';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

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
    color?: 'default' | 'blue' | 'green' | 'orange' | 'purple' | 'red';
    delay?: number;
}

function StatsCard({ title, value, icon, description, color = 'default', delay = 0 }: StatsCardProps) {
    const colorClasses = {
        default: 'from-zinc-500/20 to-zinc-500/5 text-zinc-600 dark:from-zinc-400/10 dark:to-zinc-400/5 dark:text-zinc-200',
        blue: 'from-blue-500/20 to-blue-500/5 text-blue-600 dark:from-blue-400/10 dark:to-blue-400/5 dark:text-blue-200',
        green: 'from-emerald-500/20 to-emerald-500/5 text-emerald-600 dark:from-emerald-400/10 dark:to-emerald-400/5 dark:text-emerald-200',
        orange: 'from-orange-500/20 to-orange-500/5 text-orange-600 dark:from-orange-400/10 dark:to-orange-400/5 dark:text-orange-200',
        purple: 'from-purple-500/20 to-purple-500/5 text-purple-600 dark:from-purple-400/10 dark:to-purple-400/5 dark:text-purple-200',
        red: 'from-red-500/20 to-red-500/5 text-red-600 dark:from-red-400/10 dark:to-red-400/5 dark:text-red-200',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: delay * 0.1 }}
            className="h-full"
        >
            <Card className={cn("bg-gradient-to-br h-full flex flex-col", colorClasses[color])}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 py-2 px-3 sm:px-4 sm:py-3 flex-shrink-0">
                    <CardTitle className="text-xs sm:text-sm font-semibold">{title}</CardTitle>
                    <div className={cn("p-1.5 rounded-full bg-white/20", colorClasses[color])}>
                        <div className="h-3.5 w-3.5 sm:h-4 sm:w-4">{icon}</div>
                    </div>
                </CardHeader>
                <CardContent className="flex flex-col justify-between flex-grow px-3 sm:px-4 pt-0 pb-3">
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">{value}</div>
                    <div className="mt-1 sm:mt-2">
                        {description && (
                            <p className="text-[10px] sm:text-xs text-current/80 font-medium">{description}</p>
                        )}
                    </div>
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
                transition={{ duration: 0.3 }}
                className="flex h-full flex-1 flex-col gap-4 sm:gap-6 p-4 sm:p-6"
            >
                <div className="flex flex-col gap-2">
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Manajemen Penduduk</h1>
                    <p className="text-sm sm:text-base text-muted-foreground">Kelola data dan akun penduduk dalam sistem.</p>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:gap-6">
                    <StatsCard
                        title="Total Penduduk"
                        value={totalPenduduk.toLocaleString()}
                        icon={<Users className="h-full w-full" />}
                        color="blue"
                        delay={0}
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
                        icon={<Calendar className="h-full w-full" />}
                        color="purple"
                        delay={2}
                        description="Dalam 7 hari terakhir"
                    />
                </div>

                <Card className="overflow-hidden border-none shadow-md">
                    <CardHeader className="bg-card pb-4 sm:pb-6 border-b">
                        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                            <div>
                                <CardTitle className="flex items-center gap-2 text-base sm:text-lg font-semibold">
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                    Data Penduduk
                                </CardTitle>
                                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                                    Total {penduduk.data.length} penduduk {searchQuery && 'ditemukan'}
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                                <div className="relative w-full sm:w-auto">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input 
                                        type="search"
                                        placeholder={isMobile ? "Cari..." : "Cari Email atau Nama..."}
                                        className="w-full pl-9 bg-background sm:w-64"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                    />
                                </div>
                                <Button 
                                    onClick={() => setIsAddModalOpen(true)}
                                    className="w-full sm:w-auto"
                                >
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    {isMobile ? "Tambah" : "Tambah Penduduk"}
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                                        <TableHead className="w-[160px] sm:w-[220px] text-xs sm:text-sm">Nama</TableHead>
                                        <TableHead className="w-[150px] sm:w-[220px] text-xs sm:text-sm hidden sm:table-cell">Email</TableHead>
                                        <TableHead className="w-[130px] sm:w-[150px] text-xs sm:text-sm">Status Data</TableHead>
                                        <TableHead className="w-[150px] sm:w-[180px] text-xs sm:text-sm hidden md:table-cell">Tanggal Registrasi</TableHead>
                                        <TableHead className="text-right text-xs sm:text-sm">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {penduduk.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5}>
                                                <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center">
                                                    <Users className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground/30 mb-3" />
                                                    {searchQuery ? (
                                                        <>
                                                            <p className="text-sm text-muted-foreground font-medium">Tidak ada penduduk ditemukan</p>
                                                            <p className="text-xs sm:text-sm text-muted-foreground/70 mt-1">
                                                                Coba dengan kata kunci lain atau reset pencarian
                                                            </p>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <p className="text-sm text-muted-foreground font-medium">Belum ada data penduduk</p>
                                                            <p className="text-xs sm:text-sm text-muted-foreground/70 mt-1">
                                                                Tambahkan penduduk baru dengan menekan tombol "Tambah"
                                                            </p>
                                                        </>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        penduduk.data.map((item, index) => (
                                            <motion.tr 
                                                key={item.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.2, delay: index * 0.05 }}
                                                className="group hover:bg-muted/50"
                                            >
                                                <TableCell className="font-medium text-xs sm:text-sm py-2 sm:py-4">
                                                    <div className="flex items-center gap-1 sm:gap-2">
                                                        <div className="bg-primary/10 p-1 sm:p-1.5 rounded-full">
                                                            <User className="h-3 w-3 text-primary" />
                                                        </div>
                                                        <span className="truncate max-w-[100px] sm:max-w-full">{item.nama}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden sm:table-cell text-xs sm:text-sm py-2 sm:py-4">
                                                    <span className="flex items-center gap-1 sm:gap-1.5">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0"></span>
                                                        <span className="truncate">{item.user?.email || '-'}</span>
                                                    </span>
                                                </TableCell>
                                                <TableCell className="py-2 sm:py-4">
                                                    {item.nama && item.user?.email ? (
                                                        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 flex items-center gap-1 whitespace-nowrap text-xs px-1.5 sm:px-2.5 py-0 sm:py-0.5 sm:text-xs sm:gap-1.5">
                                                            <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-green-500 flex-shrink-0"></span>
                                                            Lengkap
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200 flex items-center gap-1 whitespace-nowrap text-xs px-1.5 sm:px-2.5 py-0 sm:py-0.5 sm:text-xs sm:gap-1.5">
                                                            <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2 flex-shrink-0">
                                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                                                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-yellow-500"></span>
                                                            </span>
                                                            {isMobile ? "Belum" : "Belum Lengkap"}
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell text-xs sm:text-sm py-2 sm:py-4">
                                                    <div className="flex items-center gap-1 sm:gap-2">
                                                        <div className="bg-muted p-1 sm:p-1.5 rounded-full flex-shrink-0">
                                                            <Calendar className="h-3 w-3 text-muted-foreground" />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span>{item.registration_date_formatted || '-'}</span>
                                                            <span className="text-xs text-muted-foreground">
                                                                {item.registration_date ? new Date(item.registration_date).toLocaleDateString('id-ID') : ''}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right py-2 sm:py-4">
                                                    <div className="flex items-center justify-end gap-1 sm:gap-2">
                                                        <Button 
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => openEditModal(item)}
                                                            className="h-7 w-7 sm:h-8 sm:w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                                                            title="Edit Data"
                                                        >
                                                            <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                                        </Button>
                                                        <Button 
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => openDeleteModal(item)}
                                                            className="h-7 w-7 sm:h-8 sm:w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                            title="Hapus Data"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                                        </Button>
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
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader className="pb-4 border-b">
                        <DialogTitle className="text-xl">Tambah Penduduk Baru</DialogTitle>
                        <DialogDescription className="text-muted-foreground mt-1">
                            Tambahkan penduduk baru ke dalam sistem. Data dengan tanda <span className="text-red-500">*</span> wajib diisi.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-5 py-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <Label htmlFor="nama" className="font-medium">
                                    Nama Lengkap <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="nama"
                                    placeholder="Masukkan Nama Lengkap"
                                    value={data.nama}
                                    onChange={(e) => setData('nama', e.target.value)}
                                    className={cn(
                                        "bg-background focus:ring-2 focus:ring-primary/20",
                                        errors.nama && "border-red-500 focus:ring-red-500/20"
                                    )}
                                />
                                {errors.nama && <p className="text-xs text-red-500 mt-1">{errors.nama}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="font-medium">
                                    Email <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Masukkan Email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className={cn(
                                        "bg-background focus:ring-2 focus:ring-primary/20",
                                        errors.email && "border-red-500 focus:ring-red-500/20"
                                    )}
                                />
                                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="font-medium">
                                Password <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Masukkan Password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className={cn(
                                    "bg-background focus:ring-2 focus:ring-primary/20",
                                    errors.password && "border-red-500 focus:ring-red-500/20"
                                )}
                            />
                            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                        </div>



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
                    <DialogFooter className="gap-2 sm:gap-0 pt-4 border-t">
                        <Button variant="outline" onClick={() => {
                            setIsAddModalOpen(false);
                            reset();
                        }}>
                            Batal
                        </Button>
                        <Button 
                            onClick={handleAddSubmit} 
                            disabled={processing}
                            className="gap-1"
                        >
                            {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Simpan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader className="pb-4 border-b">
                        <DialogTitle className="text-xl">Edit Data Penduduk</DialogTitle>
                        <DialogDescription className="text-muted-foreground mt-1">
                            Perbarui informasi penduduk. Data dengan tanda <span className="text-red-500">*</span> wajib diisi.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-5 py-5">
                        <div className="space-y-2">
                            <Label htmlFor="edit-nama" className="font-medium">
                                Nama Lengkap <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="edit-nama"
                                placeholder="Masukkan Nama Lengkap"
                                value={editData.nama}
                                onChange={(e) => setEditData('nama', e.target.value)}
                                className={cn(
                                    "bg-background focus:ring-2 focus:ring-primary/20",
                                    editErrors.nama && "border-red-500 focus:ring-red-500/20"
                                )}
                            />
                            {editErrors.nama && <p className="text-xs text-red-500 mt-1">{editErrors.nama}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-email" className="font-medium">Email (Terhubung dengan Akun)</Label>
                            <Input
                                id="edit-email"
                                type="email"
                                value={editData.email}
                                readOnly
                                disabled
                                className="bg-gray-100 dark:bg-gray-800"
                            />
                            <p className="text-xs text-muted-foreground">Email tidak dapat diubah karena terhubung dengan akun pengguna</p>
                        </div>

                        {/* Data Kependudukan telah dihapus - hanya menggunakan nama dan email */}

                        {/* Hidden but necessary fields */}
                        <div className="hidden">
                            <Input
                                id="edit-user_id"
                                value={editData.user_id}
                                onChange={(e) => setEditData('user_id', e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter className="gap-2 sm:gap-0 pt-4 border-t">
                        <Button variant="outline" onClick={() => {
                            setIsEditModalOpen(false);
                            resetEdit();
                        }}>
                            Batal
                        </Button>
                        <Button 
                            onClick={handleEditSubmit} 
                            disabled={editProcessing}
                            className="gap-1"
                        >
                            {editProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Simpan Perubahan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl flex items-center gap-2">
                            <Trash2 className="h-5 w-5 text-red-500" />
                            Konfirmasi Hapus Data
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground mt-1">
                            Tindakan ini tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 flex flex-col gap-3">
                        <div className="bg-red-50 dark:bg-red-950/30 rounded-lg p-4 border border-red-200 dark:border-red-900">
                            <p className="text-red-800 dark:text-red-300">
                                Anda akan menghapus data penduduk:
                            </p>
                            <div className="mt-3 flex items-center gap-2">
                                <div className="bg-red-100 dark:bg-red-900/50 p-2 rounded-full">
                                    <User className="h-4 w-4 text-red-600 dark:text-red-400" />
                                </div>
                                <p className="font-medium text-lg text-red-900 dark:text-red-200">
                                    {pendudukToDelete?.nama}
                                </p>
                            </div>
                            {pendudukToDelete?.user?.email && (
                                <p className="text-sm text-red-700 dark:text-red-400 mt-2 flex items-center gap-2">
                                    <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                                    {pendudukToDelete?.user?.email}
                                </p>
                            )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Menghapus data penduduk juga akan menghapus akun terkait dan semua dokumen yang telah diajukan. Apakah Anda yakin ingin melanjutkan?
                        </p>
                    </div>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => {
                            setIsDeleteModalOpen(false);
                            setPendudukToDelete(null);
                        }}>
                            Batal
                        </Button>
                        <Button 
                            variant="destructive" 
                            onClick={handleDeleteSubmit}
                            disabled={processing}
                            className="gap-1"
                        >
                            {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus Data
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
