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
    <Card className="hover:shadow-md transition-all duration-200 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 transform translate-x-16 -translate-y-16 bg-primary/5 rounded-full" />
        <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
            <div className="space-y-1.5">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                <div className="text-3xl font-bold tracking-tight">{value}</div>
            </div>
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary backdrop-blur-sm">
                <Icon className="size-6" />
            </div>
        </CardHeader>
        <CardContent className="relative">
            <p className="text-sm text-muted-foreground">{description}</p>
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
    <Card className="group hover:shadow-md transition-all duration-200 border-primary/10 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-48 h-48 transform translate-x-24 -translate-y-24 bg-gradient-to-br from-primary/5 to-transparent rounded-full" />
        <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary backdrop-blur-sm">
                    {type.icon && <type.icon className="size-6" />}
                </div>
                <Badge variant="secondary" className="text-xs font-medium bg-secondary/80 backdrop-blur-sm">Dokumen Resmi</Badge>
            </div>
            <CardTitle className="text-xl mt-4 tracking-tight font-semibold">{type.title}</CardTitle>
            <CardDescription className="text-sm mt-1.5 line-clamp-2">{type.description}</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
            <Button 
                onClick={() => onRequest(type.id as DocumentType)}
                className="w-full group-hover:bg-primary/90 transition-all duration-200 font-medium relative overflow-hidden"
                disabled={isProcessing}
            >
                {isProcessing ? (
                    <div className="flex items-center justify-center space-x-2">
                        <div className="size-4 border-2 border-current border-t-transparent animate-spin rounded-full" />
                        <span>Memproses...</span>
                    </div>
                ) : (
                    <div className="flex items-center justify-center space-x-2">
                        <span>Ajukan {type.title}</span>
                        <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
                    </div>
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
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="flex items-center justify-between border-b bg-muted/5 px-6 py-4">
            <div>
                <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2">
                    <FileText className="size-5 text-primary" />
                    Riwayat Pengajuan
                </h2>
                <p className="text-sm text-muted-foreground mt-1">Pantau status dokumen yang telah Anda ajukan</p>
            </div>
            <Badge variant="outline" className="font-medium">
                {documents.length} Dokumen
            </Badge>
        </div>
        <div className="p-0">
            <ScrollArea className="h-[400px]">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="w-[25%]">Jenis Dokumen</TableHead>
                            <TableHead className="w-[20%]">Status</TableHead>
                            <TableHead className="w-[35%]">Tanggal Pengajuan</TableHead>
                            <TableHead className="text-right w-[20%]">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array(3).fill(0).map((_, i) => (
                                <TableRow key={i} className="hover:bg-muted/30">
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : documents.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-32">
                                    <div className="flex flex-col items-center justify-center text-center">
                                        <div className="p-3 rounded-full bg-primary/5 mb-3">
                                            <FileArchive className="size-8 text-primary" />
                                        </div>
                                        <p className="text-muted-foreground font-medium">Belum ada dokumen yang diajukan</p>
                                        <p className="text-sm text-muted-foreground mt-1">Pilih jenis dokumen di atas untuk memulai pengajuan</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            documents.map((doc) => {
                                const StatusIcon = statusConfig[doc.status].icon;
                                return (
                                    <TableRow key={doc.id} className="hover:bg-muted/30">
                                        <TableCell className="font-medium">
                                            {documentTypes.find(t => t.id === doc.type)?.title || doc.type.replace('_', ' ')}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={`${statusConfig[doc.status].color} border font-medium`}>
                                                <StatusIcon className="mr-1.5 size-3.5" />
                                                {doc.status === 'DIPROSES' ? 'Sedang Diproses' : doc.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">{new Date(doc.submittedAt).toLocaleDateString('id-ID', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}</TableCell>
                                        <TableCell className="text-right">
                                            {doc.status === 'SELESAI' && doc.filePath ? (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => DocumentService.downloadDocument(doc.id)}
                                                    className="hover:bg-primary hover:text-white transition-colors font-medium group"
                                                >
                                                    <Download className="size-3.5 mr-1.5 group-hover:-translate-y-0.5 transition-transform" />
                                                    Unduh Dokumen
                                                </Button>
                                            ) : doc.status === 'DITOLAK' && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 font-medium group"
                                                >
                                                    <AlertCircle className="size-3.5 mr-1.5 group-hover:animate-pulse" />
                                                    Detail Penolakan
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
        </div>
    </div>
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
            
            <div className="space-y-8 px-8 py-8 max-w-[1600px] mx-auto">
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/3 to-transparent rounded-2xl" />
                    <div className="relative p-6 rounded-2xl">
                        <h1 className="text-3xl font-bold tracking-tight mb-2">Selamat Datang di Dashboard Penduduk</h1>
                        <p className="text-muted-foreground">Ajukan dan kelola dokumen kependudukan Anda dengan mudah dan cepat</p>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <StatsCard
                        title="Total Dokumen"
                        value={documents.length}
                        description="Total dokumen yang telah diajukan"
                        icon={FileArchive}
                    />
                    <StatsCard
                        title="Sedang Diproses"
                        value={documents.filter(d => d.status === 'DIPROSES').length}
                        description="Dokumen dalam proses verifikasi"
                        icon={FileClock}
                    />
                    <StatsCard
                        title="Selesai Diproses"
                        value={documents.filter(d => d.status === 'SELESAI').length}
                        description="Dokumen yang telah selesai"
                        icon={FileCheck}
                        trend={{ value: 12, label: "dari bulan lalu" }}
                    />
                    <StatsCard
                        title="Dokumen Ditolak"
                        value={documents.filter(d => d.status === 'DITOLAK').length}
                        description="Dokumen yang perlu perbaikan"
                        icon={AlertCircle}
                    />
                </div>

                <div>
                    <h2 className="text-2xl font-semibold tracking-tight mb-4">Ajukan Dokumen Baru</h2>
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
                </div>

                <DocumentTable documents={documents} isLoading={isLoading} />
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
