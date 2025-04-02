import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { CheckCircle, Download, FileText, XCircle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manajemen Dokumen',
        href: '/admin/dokumen',
    },
];

export default function Dokumen() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Dokumen" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Total Dokumen</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">150</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Menunggu Verifikasi</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">25</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Disetujui</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">100</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Ditolak</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">25</div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Pengajuan Dokumen</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>No. Pengajuan</TableHead>
                                    <TableHead>Jenis Dokumen</TableHead>
                                    <TableHead>Nama Pemohon</TableHead>
                                    <TableHead>Tanggal Pengajuan</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {/* Sample data - replace with real data */}
                                <TableRow>
                                    <TableCell>DOC-2025-001</TableCell>
                                    <TableCell>KTP</TableCell>
                                    <TableCell>John Doe</TableCell>
                                    <TableCell>2025-04-02</TableCell>
                                    <TableCell>
                                        <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-800">
                                            Menunggu
                                        </span>
                                    </TableCell>
                                    <TableCell className="space-x-2">
                                        <Button variant="outline" size="sm">
                                            <FileText className="mr-2 h-4 w-4" />
                                            Detail
                                        </Button>
                                        <Button variant="outline" size="sm" className="text-green-600">
                                            <CheckCircle className="mr-2 h-4 w-4" />
                                            Setujui
                                        </Button>
                                        <Button variant="outline" size="sm" className="text-red-600">
                                            <XCircle className="mr-2 h-4 w-4" />
                                            Tolak
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            <Download className="mr-2 h-4 w-4" />
                                            Unduh
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
