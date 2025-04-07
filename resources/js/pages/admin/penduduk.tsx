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
    const [pendudukToDelete, setPendudukToDelete] = useState<PendudukData | null>(null);
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
                                    <TableHead>Status Data</TableHead>
                                    <TableHead>Tanggal Registrasi</TableHead>
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
                                            <TableCell>{item.nama}</TableCell>
                                            <TableCell>{item.user?.email || '-'}</TableCell>
                                            <TableCell>
                                                {item.nik ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        Lengkap
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                        Belum Lengkap
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell>{item.user?.created_at ? new Date(item.user.created_at).toLocaleDateString('id-ID') : '-'}</TableCell>
                                            <TableCell className="space-x-2">
                                                <Button 
                                                    variant="outline" 
                                                    size="sm"
                                                    onClick={() => openEditModal(item)}
                                                >
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    {item.nik ? 'Edit' : 'Lengkapi Data'}
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="nama">Nama Lengkap <span className="text-red-500">*</span></Label>
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
                                <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
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
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                            <h3 className="text-lg font-medium col-span-2 border-b pb-2">Data Kependudukan (Opsional)</h3>
                            <div className="space-y-2">
                                <Label htmlFor="nik">NIK</Label>
                                <Input
                                    id="nik"
                                    placeholder="Masukkan NIK (16 Digit)"
                                    value={data.nik}
                                    onChange={(e) => setData('nik', e.target.value)}
                                    className={errors.nik ? 'border-red-500' : ''}
                                    maxLength={16}
                                />
                                {errors.nik && <p className="text-xs text-red-500">{errors.nik}</p>}
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
                            <Label htmlFor="edit-nama">Nama Lengkap <span className="text-red-500">*</span></Label>
                            <Input
                                id="edit-nama"
                                placeholder="Masukkan Nama Lengkap"
                                value={editData.nama}
                                onChange={(e) => setEditData('nama', e.target.value)}
                                className={editErrors.nama ? 'border-red-500' : ''}
                            />
                            {editErrors.nama && <p className="text-xs text-red-500">{editErrors.nama}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-email">Email (Terhubung dengan Akun)</Label>
                            <Input
                                id="edit-email"
                                type="email"
                                value={editData.email}
                                readOnly
                                disabled
                                className="bg-gray-100 dark:bg-gray-800"
                            />
                            <p className="text-xs text-gray-500">Email tidak dapat diubah karena terhubung dengan akun pengguna</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                            <h3 className="text-lg font-medium col-span-2 border-b pb-2">Data Kependudukan</h3>
                            <div className="space-y-2">
                                <Label htmlFor="edit-nik">NIK <span className="text-red-500">*</span></Label>
                                <Input
                                    id="edit-nik"
                                    placeholder="Masukkan NIK (16 Digit)"
                                    value={editData.nik}
                                    onChange={(e) => setEditData('nik', e.target.value)}
                                    className={editErrors.nik ? 'border-red-500' : ''}
                                    maxLength={16}
                                />
                                {editErrors.nik && <p className="text-xs text-red-500">{editErrors.nik}</p>}
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
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-jenis_kelamin">Jenis Kelamin</Label>
                                <Select 
                                    value={editData.jenis_kelamin} 
                                    onValueChange={(value) => setEditData('jenis_kelamin', value)}
                                >
                                    <SelectTrigger id="edit-jenis_kelamin">
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                <Select 
                                    value={editData.agama || ''} 
                                    onValueChange={(value) => setEditData('agama', value)}
                                >
                                    <SelectTrigger id="edit-agama">
                                        <SelectValue placeholder="Pilih Agama" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Islam">Islam</SelectItem>
                                        <SelectItem value="Kristen">Kristen</SelectItem>
                                        <SelectItem value="Katolik">Katolik</SelectItem>
                                        <SelectItem value="Hindu">Hindu</SelectItem>
                                        <SelectItem value="Buddha">Buddha</SelectItem>
                                        <SelectItem value="Konghucu">Konghucu</SelectItem>
                                    </SelectContent>
                                </Select>
                                {editErrors.agama && <p className="text-xs text-red-500">{editErrors.agama}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-status_perkawinan">Status Perkawinan</Label>
                                <Select 
                                    value={editData.status_perkawinan || ''} 
                                    onValueChange={(value) => setEditData('status_perkawinan', value)}
                                >
                                    <SelectTrigger id="edit-status_perkawinan">
                                        <SelectValue placeholder="Pilih Status Perkawinan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Belum Kawin">Belum Kawin</SelectItem>
                                        <SelectItem value="Kawin">Kawin</SelectItem>
                                        <SelectItem value="Cerai Hidup">Cerai Hidup</SelectItem>
                                        <SelectItem value="Cerai Mati">Cerai Mati</SelectItem>
                                    </SelectContent>
                                </Select>
                                {editErrors.status_perkawinan && <p className="text-xs text-red-500">{editErrors.status_perkawinan}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-pekerjaan">Pekerjaan</Label>
                                <Input
                                    id="edit-pekerjaan"
                                    placeholder="Masukkan Pekerjaan"
                                    value={editData.pekerjaan || ''}
                                    onChange={(e) => setEditData('pekerjaan', e.target.value)}
                                    className={editErrors.pekerjaan ? 'border-red-500' : ''}
                                />
                                {editErrors.pekerjaan && <p className="text-xs text-red-500">{editErrors.pekerjaan}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-kewarganegaraan">Kewarganegaraan</Label>
                            <Input
                                id="edit-kewarganegaraan"
                                placeholder="Masukkan Kewarganegaraan"
                                value={editData.kewarganegaraan}
                                onChange={(e) => setEditData('kewarganegaraan', e.target.value)}
                                className={editErrors.kewarganegaraan ? 'border-red-500' : ''}
                            />
                            {editErrors.kewarganegaraan && <p className="text-xs text-red-500">{editErrors.kewarganegaraan}</p>}
                        </div>

                        {/* Hidden but necessary fields */}
                        <div className="hidden">
                            <Input
                                id="edit-user_id"
                                value={editData.user_id}
                                onChange={(e) => setEditData('user_id', e.target.value)}
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
                        <DialogTitle>Konfirmasi Hapus Data</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p>
                            Apakah Anda yakin ingin menghapus data penduduk <strong>{pendudukToDelete?.nama}</strong>? Tindakan ini tidak dapat dibatalkan.
                        </p>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => {
                            setIsDeleteModalOpen(false);
                            setPendudukToDelete(null);
                        }}>
                            Batal
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteSubmit}>
                            Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
