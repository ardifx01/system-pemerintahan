import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import { Edit, Plus, Search, Trash2, X } from 'lucide-react';
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
                            <Button onClick={() => setIsAddModalOpen(true)}>
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah Penduduk
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 flex gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    placeholder="Cari NIK, Nama, atau Alamat..." 
                                    className="pl-8" 
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                />
                            </div>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>NIK</TableHead>
                                    <TableHead>Nama</TableHead>
                                    <TableHead>Alamat</TableHead>
                                    <TableHead>Jenis Kelamin</TableHead>
                                    <TableHead>Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {penduduk.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-4">
                                            Tidak ada data penduduk
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    penduduk.data.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>{item.nik}</TableCell>
                                            <TableCell>{item.nama}</TableCell>
                                            <TableCell>{item.alamat}</TableCell>
                                            <TableCell>{item.jenis_kelamin}</TableCell>
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
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="nik">NIK</Label>
                                <Input
                                    id="nik"
                                    placeholder="Masukkan NIK"
                                    value={data.nik}
                                    onChange={(e) => setData('nik', e.target.value)}
                                    className={errors.nik ? 'border-red-500' : ''}
                                />
                                {errors.nik && <p className="text-xs text-red-500">{errors.nik}</p>}
                            </div>
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
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="alamat">Alamat</Label>
                            <Input
                                id="alamat"
                                placeholder="Masukkan Alamat"
                                value={data.alamat}
                                onChange={(e) => setData('alamat', e.target.value)}
                                className={errors.alamat ? 'border-red-500' : ''}
                            />
                            {errors.alamat && <p className="text-xs text-red-500">{errors.alamat}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="jenis_kelamin">Jenis Kelamin</Label>
                                <Select 
                                    value={data.jenis_kelamin} 
                                    onValueChange={(value) => setData('jenis_kelamin', value)}
                                >
                                    <SelectTrigger className={errors.jenis_kelamin ? 'border-red-500' : ''}>
                                        <SelectValue placeholder="Pilih Jenis Kelamin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                                        <SelectItem value="Perempuan">Perempuan</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.jenis_kelamin && <p className="text-xs text-red-500">{errors.jenis_kelamin}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="tempat_lahir">Tempat Lahir</Label>
                                <Input
                                    id="tempat_lahir"
                                    placeholder="Masukkan Tempat Lahir"
                                    value={data.tempat_lahir}
                                    onChange={(e) => setData('tempat_lahir', e.target.value)}
                                    className={errors.tempat_lahir ? 'border-red-500' : ''}
                                />
                                {errors.tempat_lahir && <p className="text-xs text-red-500">{errors.tempat_lahir}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="tanggal_lahir">Tanggal Lahir</Label>
                                <Input
                                    id="tanggal_lahir"
                                    type="date"
                                    value={data.tanggal_lahir}
                                    onChange={(e) => setData('tanggal_lahir', e.target.value)}
                                    className={errors.tanggal_lahir ? 'border-red-500' : ''}
                                />
                                {errors.tanggal_lahir && <p className="text-xs text-red-500">{errors.tanggal_lahir}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="agama">Agama</Label>
                                <Input
                                    id="agama"
                                    placeholder="Masukkan Agama"
                                    value={data.agama}
                                    onChange={(e) => setData('agama', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="status_perkawinan">Status Perkawinan</Label>
                                <Input
                                    id="status_perkawinan"
                                    placeholder="Masukkan Status Perkawinan"
                                    value={data.status_perkawinan}
                                    onChange={(e) => setData('status_perkawinan', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="pekerjaan">Pekerjaan</Label>
                                <Input
                                    id="pekerjaan"
                                    placeholder="Masukkan Pekerjaan"
                                    value={data.pekerjaan}
                                    onChange={(e) => setData('pekerjaan', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="kewarganegaraan">Kewarganegaraan</Label>
                                <Input
                                    id="kewarganegaraan"
                                    placeholder="Masukkan Kewarganegaraan"
                                    value={data.kewarganegaraan}
                                    onChange={(e) => setData('kewarganegaraan', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
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
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-nik">NIK</Label>
                                <Input
                                    id="edit-nik"
                                    placeholder="Masukkan NIK"
                                    value={editData.nik}
                                    onChange={(e) => setEditData('nik', e.target.value)}
                                    className={editErrors.nik ? 'border-red-500' : ''}
                                />
                                {editErrors.nik && <p className="text-xs text-red-500">{editErrors.nik}</p>}
                            </div>
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
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-alamat">Alamat</Label>
                            <Input
                                id="edit-alamat"
                                placeholder="Masukkan Alamat"
                                value={editData.alamat}
                                onChange={(e) => setEditData('alamat', e.target.value)}
                                className={editErrors.alamat ? 'border-red-500' : ''}
                            />
                            {editErrors.alamat && <p className="text-xs text-red-500">{editErrors.alamat}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-jenis_kelamin">Jenis Kelamin</Label>
                                <Select 
                                    value={editData.jenis_kelamin} 
                                    onValueChange={(value) => setEditData('jenis_kelamin', value)}
                                >
                                    <SelectTrigger className={editErrors.jenis_kelamin ? 'border-red-500' : ''}>
                                        <SelectValue placeholder="Pilih Jenis Kelamin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                                        <SelectItem value="Perempuan">Perempuan</SelectItem>
                                    </SelectContent>
                                </Select>
                                {editErrors.jenis_kelamin && <p className="text-xs text-red-500">{editErrors.jenis_kelamin}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-tempat_lahir">Tempat Lahir</Label>
                                <Input
                                    id="edit-tempat_lahir"
                                    placeholder="Masukkan Tempat Lahir"
                                    value={editData.tempat_lahir}
                                    onChange={(e) => setEditData('tempat_lahir', e.target.value)}
                                    className={editErrors.tempat_lahir ? 'border-red-500' : ''}
                                />
                                {editErrors.tempat_lahir && <p className="text-xs text-red-500">{editErrors.tempat_lahir}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-tanggal_lahir">Tanggal Lahir</Label>
                                <Input
                                    id="edit-tanggal_lahir"
                                    type="date"
                                    value={editData.tanggal_lahir}
                                    onChange={(e) => setEditData('tanggal_lahir', e.target.value)}
                                    className={editErrors.tanggal_lahir ? 'border-red-500' : ''}
                                />
                                {editErrors.tanggal_lahir && <p className="text-xs text-red-500">{editErrors.tanggal_lahir}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-agama">Agama</Label>
                                <Input
                                    id="edit-agama"
                                    placeholder="Masukkan Agama"
                                    value={editData.agama}
                                    onChange={(e) => setEditData('agama', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-status_perkawinan">Status Perkawinan</Label>
                                <Input
                                    id="edit-status_perkawinan"
                                    placeholder="Masukkan Status Perkawinan"
                                    value={editData.status_perkawinan}
                                    onChange={(e) => setEditData('status_perkawinan', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-pekerjaan">Pekerjaan</Label>
                                <Input
                                    id="edit-pekerjaan"
                                    placeholder="Masukkan Pekerjaan"
                                    value={editData.pekerjaan}
                                    onChange={(e) => setEditData('pekerjaan', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-kewarganegaraan">Kewarganegaraan</Label>
                                <Input
                                    id="edit-kewarganegaraan"
                                    placeholder="Masukkan Kewarganegaraan"
                                    value={editData.kewarganegaraan}
                                    onChange={(e) => setEditData('kewarganegaraan', e.target.value)}
                                />
                            </div>
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
