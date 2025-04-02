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
    <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            <Icon className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
            {trend && (
                <div className="mt-2 flex items-center text-xs">
                    <span className={trend.value >= 0 ? "text-green-600" : "text-red-600"}>
                        {trend.value >= 0 ? "+" : ""}{trend.value}%
                    </span>
                    <span className="ml-1 text-muted-foreground">{trend.label}</span>
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
    <Card className="group hover:shadow-md transition-all duration-200">
        <CardHeader>
            <div className="flex items-center justify-between">
                {type.icon && <type.icon className="size-5 text-primary" />}
                <Badge variant="secondary" className="text-xs">Dokumen Resmi</Badge>
            </div>
            <CardTitle className="text-lg mt-2">{type.title}</CardTitle>
            <CardDescription className="text-sm">{type.description}</CardDescription>
        </CardHeader>
        <CardContent>
            <Button 
                onClick={() => onRequest(type.id as DocumentType)}
                className="w-full group-hover:bg-primary/90"
                disabled={isProcessing}
            >
                {isProcessing ? (
                    <>
                        <Skeleton className="h-4 w-4 rounded-full mr-2" />
                        Memproses...
                    </>
                ) : (
                    <>
                        Ajukan {type.title}
                        <ChevronRight className="ml-2 size-4" />
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

export default function PendudukDashboard() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [selectedType, setSelectedType] = useState<DocumentType | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        loadDocuments();
    }, []);

    const loadDocuments = async () => {
        setIsLoading(true);
        try {
            const docs = await DocumentService.getDocuments();
            setDocuments(docs);
        } catch (error) {
            console.error('Error loading documents:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRequestDocument = (type: DocumentType) => {
        setIsProcessing(true);
        setSelectedType(type);
        setIsFormOpen(true);
    };

    const handleFormClose = () => {
        setIsFormOpen(false);
        setSelectedType(null);
        setIsProcessing(false);
    };

    const handleFormSuccess = () => {
        handleFormClose();
        loadDocuments();
    };

    const stats = [
        {
            title: 'Total Dokumen',
            value: documents.length,
            description: 'Total dokumen yang telah diajukan',
            icon: FileArchive,
            trend: { value: 12, label: 'vs bulan lalu' }
        },
        {
            title: 'Dokumen Diproses',
            value: documents.filter(d => d.status === 'DIPROSES').length,
            description: 'Dokumen dalam proses verifikasi',
            icon: FileClock
        },
        {
            title: 'Dokumen Selesai',
            value: documents.filter(d => d.status === 'SELESAI').length,
            description: 'Dokumen yang telah selesai diproses',
            icon: FileCheck,
            trend: { value: 8, label: 'vs bulan lalu' }
        }
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Penduduk" />

            <div className="p-6 md:p-8 lg:p-10 max-w-7xl mx-auto">
                <div className="grid gap-8">
                    {/* Statistics Section */}
                    <div className="grid gap-6 md:grid-cols-3">
                        {stats.map((stat, index) => (
                            <StatsCard key={index} {...stat} />
                        ))}
                    </div>

                    {/* Document Request Section */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-semibold">Ajukan Dokumen Baru</h2>
                        </div>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {documentTypes.map((type) => (
                                <DocumentCard
                                    key={type.id}
                                    type={type}
                                    onRequest={handleRequestDocument}
                                    isProcessing={isProcessing && selectedType === type.id}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Document History Table */}
                    <div className="space-y-6">
                        <DocumentTable documents={documents} isLoading={isLoading} />
                    </div>
                </div>
            </div>

            {selectedType && (
                <DocumentRequestForm
                    isOpen={isFormOpen}
                    onClose={handleFormClose}
                    onFormSuccess={handleFormSuccess}
                    documentType={selectedType}
                />
            )}
        </AppLayout>
    );
}
