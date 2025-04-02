import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Edit, ImagePlus, Plus, Trash2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manajemen Berita',
        href: '/admin/berita',
    },
];

export default function Berita() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Berita" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Daftar Berita</CardTitle>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah Berita
                            </Button>
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
                                {/* Sample data - replace with real data */}
                                <TableRow>
                                    <TableCell>Pembukaan Pendaftaran E-KTP</TableCell>
                                    <TableCell>
                                        <div className="relative h-16 w-24">
                                            <img
                                                src="/sample-news.jpg"
                                                alt="News thumbnail"
                                                className="absolute inset-0 h-full w-full rounded object-cover"
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell>Admin</TableCell>
                                    <TableCell>2025-04-02</TableCell>
                                    <TableCell>
                                        <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">
                                            Dipublikasi
                                        </span>
                                    </TableCell>
                                    <TableCell className="space-x-2">
                                        <Button variant="outline" size="sm">
                                            <ImagePlus className="mr-2 h-4 w-4" />
                                            Ganti Gambar
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit
                                        </Button>
                                        <Button variant="outline" size="sm" className="text-red-600">
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Hapus
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
