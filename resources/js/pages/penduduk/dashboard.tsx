import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Document, type DocumentType, type DocumentStatus, type DocumentTypeConfig } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, FileCheck, FileClock, FileX, Download, Users, FileArchive, AlertCircle, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { DocumentService } from '@/services/DocumentService';
import DocumentRequestForm from '@/components/Forms/DocumentRequestForm';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard Penduduk',
        href: '/penduduk/dashboard',
    },
];

const documentTypes: DocumentTypeConfig[] = [
    { id: 'KTP', title: 'KTP', description: 'Kartu Tanda Penduduk', icon: FileText },
    { id: 'KK', title: 'KK', description: 'Kartu Keluarga', icon: FileText },
    { id: 'AKTA_KELAHIRAN', title: 'Akta Kelahiran', description: 'Surat Keterangan Kelahiran', icon: FileText },
    { id: 'AKTA_KEMATIAN', title: 'Akta Kematian', description: 'Surat Keterangan Kematian', icon: FileText },
];

const statusConfig = {
    DIPROSES: { color: 'bg-yellow-100 text-yellow-800 border-yellow-300', icon: FileClock },
    SELESAI: { color: 'bg-green-100 text-green-800 border-green-300', icon: FileCheck },
    DITOLAK: { color: 'bg-red-100 text-red-800 border-red-300', icon: FileX },
} satisfies Record<DocumentStatus, { color: string; icon: typeof FileCheck }>;

interface StatsCardProps {
    title: string;
    value: string | number;
    description: string;
    icon: React.ElementType;
    trend?: { value: number; label: string };
}

const StatsCard = ({ title, value, description, icon: Icon, trend }: StatsCardProps) => (
    <Card className="hover:shadow-md transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            <Icon className="size-5 text-primary/80" />
        </CardHeader>
        <CardContent>
            <div className="text-3xl font-bold tracking-tight">{value}</div>
            <p className="text-sm text-muted-foreground mt-2">{description}</p>
            {trend && (
                <div className="mt-3 flex items-center text-xs font-medium">
                    <span className={trend.value >= 0 ? "text-green-600" : "text-red-600"}>
                        {trend.value >= 0 ? "+" : ""}{trend.value}%
                    </span>
                    <span className="ml-1.5 text-muted-foreground">{trend.label}</span>
                </div>
            )}
        </CardContent>
    </Card>
);

interface DocumentCardProps {
    type: DocumentTypeConfig;
    onRequest: (type: DocumentType) => void;
    isProcessing?: boolean;
}

const DocumentCard = ({ type, onRequest, isProcessing }: DocumentCardProps) => (
    <Card className="group hover:shadow-md transition-all duration-200 border-primary/10">
        <CardHeader>
            <div className="flex items-center justify-between">
                {type.icon && <type.icon className="size-6 text-primary/80" />}
                <Badge variant="secondary" className="text-xs font-medium">Dokumen Resmi</Badge>
            </div>
            <CardTitle className="text-xl mt-3 tracking-tight">{type.title}</CardTitle>
            <CardDescription className="text-sm mt-1.5">{type.description}</CardDescription>
        </CardHeader>
        <CardContent>
            <Button 
                onClick={() => onRequest(type.id as DocumentType)}
                className="w-full group-hover:bg-primary/90 transition-all duration-200"
                disabled={isProcessing}
            >
                {isProcessing ? (
                    <>
                        <Skeleton className="h-4 w-4 rounded-full mr-2.5" />
                        Memproses...
                    </>
                ) : (
                    <>
                        Ajukan {type.title}
                        <ChevronRight className="ml-2.5 size-4" />
                    </>
                )}
            </Button>
        </CardContent>
    </Card>
);

interface DocumentTableProps {
    documents: Document[];
    isLoading?: boolean;
}

const DocumentTable = ({ documents, isLoading }: DocumentTableProps) => (
    <Card>
        <CardHeader>
            <CardTitle>Riwayat Pengajuan Dokumen</CardTitle>
            <CardDescription>Daftar dokumen yang telah diajukan dan statusnya</CardDescription>
        </CardHeader>
        <CardContent>
            <ScrollArea className="h-[400px]">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Jenis Dokumen</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Tanggal Pengajuan</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array(3).fill(0).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : documents.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8">
                                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                        <FileArchive className="size-8" />
                                        <p>Belum ada dokumen yang diajukan</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            documents.map((doc) => {
                                const StatusIcon = statusConfig[doc.status].icon;
                                return (
                                    <TableRow key={doc.id}>
                                        <TableCell className="font-medium">{doc.type.replace('_', ' ')}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={`${statusConfig[doc.status].color} border`}>
                                                <StatusIcon className="mr-1 size-3" />
                                                {doc.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{new Date(doc.submittedAt).toLocaleDateString('id-ID', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}</TableCell>
                                        <TableCell className="text-right">
                                            {doc.status === 'SELESAI' && doc.filePath ? (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => DocumentService.downloadDocument(doc.id)}
                                                    className="hover:bg-primary hover:text-white transition-colors"
                                                >
                                                    <Download className="size-3 mr-1" />
                                                    Unduh
                                                </Button>
                                            ) : doc.status === 'DITOLAK' && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <AlertCircle className="size-3 mr-1" />
                                                    Lihat Alasan
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </ScrollArea>
        </CardContent>
    </Card>
);

const PendudukDashboard = () => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDocumentType, setSelectedDocumentType] = useState<DocumentType | null>(null);
    const [isRequestFormOpen, setIsRequestFormOpen] = useState(false);
    const [processingDocumentType, setProcessingDocumentType] = useState<DocumentType | null>(null);

    const fetchDocuments = async () => {
        try {
            const response = await axios.get('/penduduk/documents');
            setDocuments(response.data);
        } catch (error) {
            console.error('Error fetching documents:', error);
            toast.error('Gagal memuat daftar dokumen');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const handleDocumentRequest = (type: DocumentType) => {
        setSelectedDocumentType(type);
        setIsRequestFormOpen(true);
        setProcessingDocumentType(type);
    };

    const handleRequestFormClose = () => {
        setIsRequestFormOpen(false);
        setSelectedDocumentType(null);
        setProcessingDocumentType(null);
    };

    const handleRequestFormSuccess = () => {
        fetchDocuments();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Penduduk" />
            
            <div className="space-y-8 px-6 py-6 max-w-[1600px] mx-auto">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard Penduduk</h1>
                    <p className="text-muted-foreground">Kelola dan ajukan dokumen kependudukan Anda</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <StatsCard
                        title="Total Dokumen"
                        value={documents.length}
                        description="Total dokumen yang telah diajukan"
                        icon={FileArchive}
                    />
                    <StatsCard
                        title="Dokumen Diproses"
                        value={documents.filter(d => d.status === 'DIPROSES').length}
                        description="Dokumen dalam proses verifikasi"
                        icon={FileClock}
                    />
                    <StatsCard
                        title="Dokumen Selesai"
                        value={documents.filter(d => d.status === 'SELESAI').length}
                        description="Dokumen yang telah selesai diproses"
                        icon={FileCheck}
                    />
                    <StatsCard
                        title="Dokumen Ditolak"
                        value={documents.filter(d => d.status === 'DITOLAK').length}
                        description="Dokumen yang ditolak"
                        icon={AlertCircle}
                    />
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {documentTypes.map((type) => (
                        <DocumentCard
                            key={type.id}
                            type={type}
                            onRequest={handleDocumentRequest}
                            isProcessing={processingDocumentType === type.id}
                        />
                    ))}
                </div>

                <Card className="shadow-sm">
                    <CardHeader className="border-b bg-muted/5">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl tracking-tight">Riwayat Pengajuan Dokumen</CardTitle>
                                <CardDescription className="mt-1.5">
                                    Daftar dokumen yang telah diajukan dan statusnya
                                </CardDescription>
                            </div>
                            <Users className="size-5 text-primary/80" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <DocumentTable documents={documents} isLoading={isLoading} />
                    </CardContent>
                </Card>
            </div>

            {selectedDocumentType && (
                <DocumentRequestForm
                    isOpen={isRequestFormOpen}
                    onClose={handleRequestFormClose}
                    onFormSuccess={handleRequestFormSuccess}
                    documentType={selectedDocumentType}
                />
            )}
        </AppLayout>
    );
};

export default PendudukDashboard;
