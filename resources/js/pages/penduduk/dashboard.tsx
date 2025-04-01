import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Document, type DocumentType, type DocumentStatus } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, FileCheck, FileClock, FileX, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { DocumentService } from '@/services';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard Penduduk',
        href: '/penduduk/dashboard',
    },
];

const documentTypes: DocumentType[] = [
    { id: 'ktp', title: 'KTP', description: 'Kartu Tanda Penduduk', icon: FileText },
    { id: 'kk', title: 'KK', description: 'Kartu Keluarga', icon: FileText },
    { id: 'akta_kelahiran', title: 'Akta Kelahiran', description: 'Surat Keterangan Kelahiran', icon: FileText },
    { id: 'akta_kematian', title: 'Akta Kematian', description: 'Surat Keterangan Kematian', icon: FileText },
];

const statusConfig: Record<DocumentStatus, { color: string; icon: typeof FileCheck }> = {
    DIPROSES: { color: 'bg-yellow-100 text-yellow-800', icon: FileClock },
    SELESAI: { color: 'bg-green-100 text-green-800', icon: FileCheck },
    DITOLAK: { color: 'bg-red-100 text-red-800', icon: FileX },
} as const;

interface DocumentCardProps {
    type: DocumentType;
    onRequest: (id: string) => void;
}

const DocumentCard = ({ type, onRequest }: DocumentCardProps) => (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <type.icon className="size-5" />
                {type.title}
            </CardTitle>
            <CardDescription>{type.description}</CardDescription>
        </CardHeader>
        <CardContent>
            <Button 
                onClick={() => onRequest(type.id)}
                className="w-full"
            >
                Ajukan Dokumen
            </Button>
        </CardContent>
    </Card>
);

interface DocumentTableProps {
    documents: Document[];
}

const DocumentTable = ({ documents }: DocumentTableProps) => {
    const renderStatusBadge = (status: DocumentStatus) => {
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
                        <TableCell>{renderStatusBadge(doc.status)}</TableCell>
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
    );
};

export default function PendudukDashboard() {
    const [documents, setDocuments] = useState<Document[]>([]);

    useEffect(() => {
        DocumentService.getDocuments().then(setDocuments);
    }, []);

    const handleRequestDocument = async (type: string) => {
        try {
            await DocumentService.requestDocument(type);
            const updatedDocuments = await DocumentService.getDocuments();
            setDocuments(updatedDocuments);
        } catch (error) {
            console.error('Error requesting document:', error);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Penduduk" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="grid gap-4 md:grid-cols-4">
                    {documentTypes.map((type) => (
                        <DocumentCard 
                            key={type.id} 
                            type={type} 
                            onRequest={handleRequestDocument} 
                        />
                    ))}
                </div>

                <Card className="flex-1">
                    <CardHeader>
                        <CardTitle>Riwayat Dokumen</CardTitle>
                        <CardDescription>Daftar pengajuan dokumen Anda</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <DocumentTable documents={documents} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
