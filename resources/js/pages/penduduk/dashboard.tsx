import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, FileCheck, FileClock, FileX, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

interface Document {
    id: string;
    type: 'KTP' | 'KK' | 'AKTA_KELAHIRAN' | 'AKTA_KEMATIAN';
    status: 'DIPROSES' | 'SELESAI' | 'DITOLAK';
    submittedAt: string;
    notes?: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard Penduduk',
        href: '/penduduk/dashboard',
    },
];

const documentTypes = [
    { id: 'ktp', title: 'KTP', description: 'Kartu Tanda Penduduk', icon: FileText },
    { id: 'kk', title: 'KK', description: 'Kartu Keluarga', icon: FileText },
    { id: 'akta_kelahiran', title: 'Akta Kelahiran', description: 'Surat Keterangan Kelahiran', icon: FileText },
    { id: 'akta_kematian', title: 'Akta Kematian', description: 'Surat Keterangan Kematian', icon: FileText },
];

export default function PendudukDashboard() {
    const [documents, setDocuments] = useState<Document[]>([]);

    const handleRequestDocument = async (type: string) => {
        try {
            const response = await fetch('/api/documents/request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ type }),
            });
            if (response.ok) {
                // Refresh documents list
                fetchDocuments();
            }
        } catch (error) {
            console.error('Error requesting document:', error);
        }
    };

    const fetchDocuments = async () => {
        try {
            const response = await fetch('/api/documents');
            if (response.ok) {
                const data = await response.json();
                setDocuments(data);
            }
        } catch (error) {
            console.error('Error fetching documents:', error);
        }
    };

    const getStatusBadge = (status: Document['status']) => {
        const statusConfig = {
            DIPROSES: { color: 'bg-yellow-100 text-yellow-800', icon: FileClock },
            SELESAI: { color: 'bg-green-100 text-green-800', icon: FileCheck },
            DITOLAK: { color: 'bg-red-100 text-red-800', icon: FileX },
        };

        const config = statusConfig[status];
        const Icon = config.icon;

        return (
            <Badge className={config.color}>
                <Icon className="mr-1 size-3" />
                {status}
            </Badge>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Penduduk" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="grid gap-4 md:grid-cols-4">
                    {documentTypes.map((doc) => (
                        <Card key={doc.id}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <doc.icon className="size-5" />
                                    {doc.title}
                                </CardTitle>
                                <CardDescription>{doc.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button 
                                    onClick={() => handleRequestDocument(doc.id)}
                                    className="w-full"
                                >
                                    Ajukan Dokumen
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card className="flex-1">
                    <CardHeader>
                        <CardTitle>Riwayat Dokumen</CardTitle>
                        <CardDescription>Daftar pengajuan dokumen Anda</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Jenis Dokumen</TableHead>
                                    <TableHead>Tanggal Pengajuan</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {documents.map((doc) => (
                                    <TableRow key={doc.id}>
                                        <TableCell>{doc.type.replace('_', ' ')}</TableCell>
                                        <TableCell>{new Date(doc.submittedAt).toLocaleDateString('id-ID')}</TableCell>
                                        <TableCell>{getStatusBadge(doc.status)}</TableCell>
                                        <TableCell>
                                            {doc.status === 'SELESAI' && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => window.open(`/api/documents/${doc.id}/download`, '_blank')}
                                                >
                                                    <Download className="mr-1 size-4" />
                                                    Unduh PDF
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
