import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { CheckCircle, XCircle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Verifikasi Akun Penduduk',
        href: '/admin/verifikasi',
    },
];

export default function Verifikasi() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Verifikasi Akun Penduduk" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Penduduk Baru</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>NIK</TableHead>
                                    <TableHead>Nama</TableHead>
                                    <TableHead>Alamat</TableHead>
                                    <TableHead>Tanggal Daftar</TableHead>
                                    <TableHead>Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {/* Sample data - replace with real data */}
                                <TableRow>
                                    <TableCell>3275012345678901</TableCell>
                                    <TableCell>John Doe</TableCell>
                                    <TableCell>Jl. Contoh No. 123</TableCell>
                                    <TableCell>2025-04-02</TableCell>
                                    <TableCell className="space-x-2">
                                        <Button variant="outline" size="sm" className="text-green-600">
                                            <CheckCircle className="mr-2 h-4 w-4" />
                                            Terima
                                        </Button>
                                        <Button variant="outline" size="sm" className="text-red-600">
                                            <XCircle className="mr-2 h-4 w-4" />
                                            Tolak
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
