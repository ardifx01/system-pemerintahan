import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import { Edit, PlusCircle, Search, Trash2, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { Pagination } from '@/components/ui/pagination';
import debounce from 'lodash/debounce';
import type { PageProps } from '@/types';

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
    user?: {
        id: number;
        email: string;
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
    const [currentPenduduk, setCurrentPenduduk] = useState<PendudukData | null>(null);
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

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

    const { data, setData, post, processing, errors, reset } = useForm({
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
        password: '',
    });

    const { data: editData, setData: setEditData, put, processing: editProcessing, errors: editErrors, reset: resetEdit } = useForm({
        nik: '',
        nama: '',
        alamat: '',
        jenis_kelamin: '',
        tempat_lahir: '',
        tanggal_lahir: '',
        agama: '',
        status_perkawinan: '',
        pekerjaan: '',
        kewarganegaraan: '',
    });

    const debouncedSearch = debounce((value: string) => {
        router.get('/admin/penduduk', { search: value }, {
            preserveState: true,
            replace: true,
        });
    }, 300);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
        debouncedSearch(value);
    };

    const handleAddSubmit = () => {
        post('/admin/penduduk', {
            onSuccess: () => {
                reset();
                setIsAddModalOpen(false);
            },
        });
    };

    const handleEditSubmit = () => {
        if (!currentPenduduk) return;

        put(`/admin/penduduk/${currentPenduduk.id}`, {
            onSuccess: () => {
                resetEdit();
                setIsEditModalOpen(false);
                setCurrentPenduduk(null);
            },
        });
    };

    const handleDelete = () => {
        if (!currentPenduduk) return;

        router.delete(`/admin/penduduk/${currentPenduduk.id}`, {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setCurrentPenduduk(null);
            },
        });
    };

    const openEditModal = (item: PendudukData) => {
        setCurrentPenduduk(item);
        setEditData({
            nik: item.nik,
            nama: item.nama,
            alamat: item.alamat,
            jenis_kelamin: item.jenis_kelamin,
            tempat_lahir: item.tempat_lahir,
            tanggal_lahir: item.tanggal_lahir.substring(0, 10), // Format date for input
            agama: item.agama || '',
            status_perkawinan: item.status_perkawinan || '',
            pekerjaan: item.pekerjaan || '',
            kewarganegaraan: item.kewarganegaraan,
        });
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (item: PendudukData) => {
        setCurrentPenduduk(item);
        setIsDeleteModalOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Penduduk" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Data Penduduk</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center mb-4">
                            <div className="relative w-full max-w-sm">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                                <Input 
                                    type="search"
                                    placeholder="Cari Email atau Nama..."
                                    className="w-full bg-white dark:bg-gray-950 pl-8"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                />
                            </div>
                            <Button onClick={() => setIsAddModalOpen(true)}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Tambah Penduduk
                            </Button>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nama</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {penduduk.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center py-4">
                                            Tidak ada data penduduk
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    penduduk.data.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>{item.nama}</TableCell>
                                            <TableCell>{item.user?.email || '-'}</TableCell>
                                            <TableCell className="space-x-2">
                                                <Button 
                                                    variant="outline" 
                                                    size="sm"
                                                    onClick={() => openEditModal(item)}
                                                >
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </Button>
                                                <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    className="text-red-600"
                                                    onClick={() => openDeleteModal(item)}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Hapus
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>

                        {penduduk.last_page > 1 && (
                            <Pagination className="mt-4 justify-center">
                                {penduduk.links.map((link, i) => (
                                    <Button
                                        key={i}
                                        variant={link.active ? "default" : "outline"}
                                        className="mx-1"
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url)}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </Pagination>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Add Modal */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Tambah Penduduk Baru</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="nama">Nama Lengkap</Label>
                            <Input
                                id="nama"
                                placeholder="Masukkan Nama Lengkap"
                                value={data.nama}
                                onChange={(e) => setData('nama', e.target.value)}
                                className={errors.nama ? 'border-red-500' : ''}
                            />
                            {errors.nama && <p className="text-xs text-red-500">{errors.nama}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Masukkan Email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className={errors.email ? 'border-red-500' : ''}
                            />
                            {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Masukkan Password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className={errors.password ? 'border-red-500' : ''}
                            />
                            {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                        </div>

                        {/* Hidden but necessary fields */}
                        <div className="hidden">
                            <Input
                                id="nik"
                                value={data.nik || '1234567890123456'}
                                onChange={(e) => setData('nik', e.target.value)}
                            />
                            <Input
                                id="alamat"
                                value={data.alamat || 'Alamat Default'}
                                onChange={(e) => setData('alamat', e.target.value)}
                            />
                            <Input
                                id="jenis_kelamin"
                                value={data.jenis_kelamin || 'Laki-laki'}
                                onChange={(e) => setData('jenis_kelamin', e.target.value)}
                            />
                            <Input
                                id="tempat_lahir"
                                value={data.tempat_lahir || 'Tempat Lahir Default'}
                                onChange={(e) => setData('tempat_lahir', e.target.value)}
                            />
                            <Input
                                id="tanggal_lahir"
                                type="date"
                                value={data.tanggal_lahir || '2000-01-01'}
                                onChange={(e) => setData('tanggal_lahir', e.target.value)}
                            />
                            <Input
                                id="kewarganegaraan"
                                value={data.kewarganegaraan || 'Indonesia'}
                                onChange={(e) => setData('kewarganegaraan', e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                            Batal
                        </Button>
                        <Button onClick={handleAddSubmit} disabled={processing}>
                            Simpan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Edit Data Penduduk</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-nama">Nama Lengkap</Label>
                            <Input
                                id="edit-nama"
                                placeholder="Masukkan Nama Lengkap"
                                value={editData.nama}
                                onChange={(e) => setEditData('nama', e.target.value)}
                                className={editErrors.nama ? 'border-red-500' : ''}
                            />
                            {editErrors.nama && <p className="text-xs text-red-500">{editErrors.nama}</p>}
                        </div>

                        {/* Hidden but necessary fields */}
                        <div className="hidden">
                            <Input
                                id="edit-nik"
                                value={editData.nik}
                                onChange={(e) => setEditData('nik', e.target.value)}
                            />
                            <Input
                                id="edit-alamat"
                                value={editData.alamat}
                                onChange={(e) => setEditData('alamat', e.target.value)}
                            />
                            <Input
                                id="edit-jenis_kelamin"
                                value={editData.jenis_kelamin}
                                onChange={(e) => setEditData('jenis_kelamin', e.target.value)}
                            />
                            <Input
                                id="edit-tempat_lahir"
                                value={editData.tempat_lahir}
                                onChange={(e) => setEditData('tempat_lahir', e.target.value)}
                            />
                            <Input
                                id="edit-tanggal_lahir"
                                type="date"
                                value={editData.tanggal_lahir}
                                onChange={(e) => setEditData('tanggal_lahir', e.target.value)}
                            />
                            <Input
                                id="edit-agama"
                                value={editData.agama || ''}
                                onChange={(e) => setEditData('agama', e.target.value)}
                            />
                            <Input
                                id="edit-status_perkawinan"
                                value={editData.status_perkawinan || ''}
                                onChange={(e) => setEditData('status_perkawinan', e.target.value)}
                            />
                            <Input
                                id="edit-pekerjaan"
                                value={editData.pekerjaan || ''}
                                onChange={(e) => setEditData('pekerjaan', e.target.value)}
                            />
                            <Input
                                id="edit-kewarganegaraan"
                                value={editData.kewarganegaraan}
                                onChange={(e) => setEditData('kewarganegaraan', e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                            Batal
                        </Button>
                        <Button onClick={handleEditSubmit} disabled={editProcessing}>
                            Simpan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-600">
                            <Trash2 className="h-5 w-5" />
                            Konfirmasi Hapus
                        </DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p>
                            Apakah Anda yakin ingin menghapus data penduduk <strong>{currentPenduduk?.nama}</strong>? Tindakan ini tidak dapat dibatalkan.
                        </p>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                            Batal
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
