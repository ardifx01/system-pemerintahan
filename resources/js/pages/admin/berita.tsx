import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Edit, ImagePlus, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manajemen Berita',
        href: '/admin/berita',
    },
];

interface Berita {
    id: number;
    judul: string;
    konten: string;
    gambar: string | null;
    penulis: string;
    status: 'Dipublikasi' | 'Draf';
    tanggal_publikasi: string | null;
    created_at: string;
}

interface BeritaPageProps {
    beritas: Berita[];
}

export default function Berita({ beritas }: BeritaPageProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [imageDialogOpen, setImageDialogOpen] = useState(false);
    const [selectedBerita, setSelectedBerita] = useState<Berita | null>(null);
    const { toast } = useToast();

    const { data, setData, post, processing, reset, errors } = useForm({
        gambar: null as File | null,
    });

    const handleDeleteBerita = () => {
        if (!selectedBerita) return;
        
        router.delete(route('admin.berita.destroy', selectedBerita.id), {
            onSuccess: () => {
                toast({
                    title: 'Berhasil',
                    description: 'Berita berhasil dihapus',
                });
                setDeleteDialogOpen(false);
            },
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setData('gambar', e.target.files[0]);
        }
    };

    const handleImageSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!selectedBerita || !data.gambar) return;

        const formData = new FormData();
        formData.append('gambar', data.gambar);
        
        post(route('admin.berita.update-image', selectedBerita.id), {
            onSuccess: () => {
                toast({
                    title: 'Berhasil',
                    description: 'Gambar berita berhasil diperbarui',
                });
                setImageDialogOpen(false);
                reset();
            },
            forceFormData: true,
        });
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        return format(new Date(dateString), 'dd MMMM yyyy', { locale: id });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Berita" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Daftar Berita</CardTitle>
                            <Link href={route('admin.berita.create')}>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Tambah Berita
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Judul</TableHead>
                                    <TableHead>Gambar</TableHead>
                                    <TableHead>Penulis</TableHead>
                                    <TableHead>Tanggal Publikasi</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {beritas.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-4">
                                            Belum ada berita
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    beritas.map((berita) => (
                                        <TableRow key={berita.id}>
                                            <TableCell className="font-medium">{berita.judul}</TableCell>
                                            <TableCell>
                                                <div className="relative h-16 w-24">
                                                    {berita.gambar ? (
                                                        <img
                                                            src={berita.gambar}
                                                            alt={berita.judul}
                                                            className="absolute inset-0 h-full w-full rounded object-cover"
                                                        />
                                                    ) : (
                                                        <div className="absolute inset-0 flex items-center justify-center rounded bg-gray-100">
                                                            <span className="text-xs text-gray-500">No Image</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>{berita.penulis}</TableCell>
                                            <TableCell>{formatDate(berita.tanggal_publikasi)}</TableCell>
                                            <TableCell>
                                                <span
                                                    className={`rounded-full px-2 py-1 text-xs ${
                                                        berita.status === 'Dipublikasi'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                    }`}
                                                >
                                                    {berita.status}
                                                </span>
                                            </TableCell>
                                            <TableCell className="space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedBerita(berita);
                                                        setImageDialogOpen(true);
                                                    }}
                                                >
                                                    <ImagePlus className="mr-2 h-4 w-4" />
                                                    Ganti Gambar
                                                </Button>
                                                <Link href={route('admin.berita.edit', berita.id)}>
                                                    <Button 
                                                        variant="outline"
                                                        size="sm"
                                                    >
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-red-600"
                                                    onClick={() => {
                                                        setSelectedBerita(berita);
                                                        setDeleteDialogOpen(true);
                                                    }}
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
                    </CardContent>
                </Card>
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Konfirmasi Hapus Berita</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus berita ini? Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteBerita} className="bg-red-600 hover:bg-red-700">
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Update Image Dialog */}
            <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Ganti Gambar Berita</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleImageSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="gambar">Upload Gambar Baru</Label>
                            <Input
                                id="gambar"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                required
                            />
                            {errors.gambar && (
                                <p className="text-sm text-red-500">{errors.gambar}</p>
                            )}
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setImageDialogOpen(false)}
                            >
                                Batal
                            </Button>
                            <Button type="submit" disabled={processing || !data.gambar}>
                                Simpan
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
