import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Edit, Plus, Search, Trash2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manajemen Penduduk',
        href: '/admin/penduduk',
    },
];

export default function Penduduk() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Penduduk" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Data Penduduk</CardTitle>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah Penduduk
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 flex gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Cari NIK, Nama, atau Alamat..." className="pl-8" />
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
                                {/* Sample data - replace with real data */}
                                <TableRow>
                                    <TableCell>3275012345678901</TableCell>
                                    <TableCell>John Doe</TableCell>
                                    <TableCell>Jl. Contoh No. 123</TableCell>
                                    <TableCell>Laki-laki</TableCell>
                                    <TableCell className="space-x-2">
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
