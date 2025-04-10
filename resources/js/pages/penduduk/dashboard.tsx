import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Document, type DocumentType, type DocumentStatus, type DocumentTypeConfig } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
    FileText, FileCheck, FileClock, FileX, Download, Users, FileArchive, 
    AlertCircle, ChevronRight, FileInput, Eye, Calendar, ClipboardEdit,
    CheckCircle2, XCircle, HelpCircle, MoreHorizontal, RefreshCcw
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import React, { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { DocumentService } from '@/services/DocumentService';
import DocumentRequestForm from '@/components/Forms/DocumentRequestForm';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { 
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard Penduduk',
        href: '/penduduk/dashboard',
    },
];

const documentTypes: DocumentTypeConfig[] = [
    { id: 'KTP', title: 'KTP', description: 'Kartu Tanda Penduduk', icon: FileInput },
    { id: 'KK', title: 'KK', description: 'Kartu Keluarga', icon: Users },
    { id: 'AKTA_KELAHIRAN', title: 'Akta Kelahiran', description: 'Surat Keterangan Kelahiran', icon: Calendar },
    { id: 'AKTA_KEMATIAN', title: 'Akta Kematian', description: 'Surat Keterangan Kematian', icon: ClipboardEdit },
];

const statusConfig = {
    DIPROSES: { color: 'bg-yellow-100 text-yellow-800 border-yellow-300', icon: FileClock, label: 'Sedang Diproses', progress: 50 },
    SELESAI: { color: 'bg-green-100 text-green-800 border-green-300', icon: FileCheck, label: 'Disetujui', progress: 100 },
    DITOLAK: { color: 'bg-red-100 text-red-800 border-red-300', icon: FileX, label: 'Ditolak', progress: 100 },
} satisfies Record<DocumentStatus, { color: string; icon: typeof FileCheck; label: string; progress: number }>;

interface StatsCardProps {
    title: string;
    value: string | number;
    description: string;
    icon: React.ElementType;
    trend?: { value: number; label: string };
}

const StatsCard = ({ title, value, description, icon: Icon, trend }: StatsCardProps) => (
    <Card className="hover:shadow-md transition-all duration-200 relative overflow-hidden group">
        <div className="absolute right-0 top-0 w-32 h-32 transform translate-x-16 -translate-y-16 bg-primary/5 rounded-full transition-transform group-hover:scale-110 duration-300" />
        <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
            <div className="space-y-1.5">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                <div className="text-3xl font-bold tracking-tight">{value}</div>
            </div>
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary backdrop-blur-sm transition-all duration-300 group-hover:bg-primary group-hover:text-white">
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
    <Card className="group hover:shadow-md transition-all duration-200 border-primary/10 relative overflow-hidden h-full">
        <div className="absolute right-0 top-0 w-48 h-48 transform translate-x-24 -translate-y-24 bg-gradient-to-br from-primary/5 to-transparent rounded-full" />
        <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary backdrop-blur-sm transition-all duration-300 group-hover:bg-primary/20">
                    {type.icon && <type.icon className="size-6" />}
                </div>
                <Badge variant="secondary" className="font-medium">
                    Dokumen Resmi
                </Badge>
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
    onRequestDocument?: (type: DocumentType) => void;
}

const DocumentTable = ({ documents, isLoading, onRequestDocument }: DocumentTableProps) => {
    const [isRejectionDialogOpen, setIsRejectionDialogOpen] = useState(false);
    const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
    const [previewLoading, setPreviewLoading] = useState(false);

    const handleViewRejectionDetails = (doc: Document) => {
        setSelectedDocument(doc);
        setIsRejectionDialogOpen(true);
    };

    const handlePreviewDocument = (doc: Document) => {
        setSelectedDocument(doc);
        setIsPreviewDialogOpen(true);
        setPreviewLoading(true);
        
        // Simulate preview loading
        setTimeout(() => {
            setPreviewLoading(false);
        }, 1000);
    };

    return (
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b bg-muted/5 px-6 py-4">
                <div>
                    <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2">
                        <FileText className="size-5 text-primary" />
                        Riwayat Pengajuan
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">Pantau status dokumen yang telah Anda ajukan</p>
                </div>
                <div className="mt-3 sm:mt-0 flex items-center gap-2">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs" 
                        onClick={() => window.location.reload()}
                    >
                        <RefreshCcw className="size-3.5 mr-1.5" /> Segarkan
                    </Button>
                    <Badge variant="outline" className="font-medium">
                        {documents.length} Dokumen
                    </Badge>
                </div>
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
                                    const statusInfo = statusConfig[doc.status];
                                    const StatusIcon = statusInfo.icon;
                                    return (
                                        <TableRow key={doc.id} className="hover:bg-muted/30">
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    {doc.type === 'KTP' ? <FileInput className="size-4 text-primary" /> :
                                                     doc.type === 'KK' ? <Users className="size-4 text-primary" /> :
                                                     doc.type === 'AKTA_KELAHIRAN' ? <Calendar className="size-4 text-primary" /> :
                                                     <ClipboardEdit className="size-4 text-primary" />}
                                                    {documentTypes.find(t => t.id === doc.type)?.title || doc.type.replace('_', ' ')}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1.5">
                                                    <Badge variant="outline" className={`${statusInfo.color} border font-medium`}>
                                                        <StatusIcon className="mr-1.5 size-3.5" />
                                                        {statusInfo.label}
                                                    </Badge>
                                                    <div className="w-full">
                                                        <Progress value={statusInfo.progress} className="h-1 w-full" />
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">{new Date(doc.submittedAt).toLocaleDateString('id-ID', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}</TableCell>
                                            <TableCell className="text-right">
                                                {doc.status === 'SELESAI' ? (
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="hover:bg-primary hover:text-white transition-colors font-medium group"
                                                            >
                                                                <CheckCircle2 className="size-3.5 mr-1.5 text-green-600 group-hover:text-white" />
                                                                Aksi
                                                                <ChevronRight className="size-3.5 ml-1.5" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => handlePreviewDocument(doc)}>
                                                                <Eye className="mr-2 size-4" />
                                                                Pratinjau Dokumen
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => DocumentService.downloadDocument(doc.id)}>
                                                                <Download className="mr-2 size-4" />
                                                                Unduh Dokumen
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                ) : doc.status === 'DITOLAK' && doc.notes ? (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50 font-medium group"
                                                        onClick={() => handleViewRejectionDetails(doc)}
                                                    >
                                                        <XCircle className="size-3.5 mr-1.5 group-hover:animate-pulse" />
                                                        Detail Penolakan
                                                    </Button>
                                                ) : (
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger>
                                                                <div className="flex items-center text-yellow-600 bg-yellow-50 px-2 py-1 rounded text-xs font-medium">
                                                                    <HelpCircle className="size-3.5 mr-1.5 animate-pulse" />
                                                                    Menunggu Proses
                                                                </div>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>Dokumen sedang diproses oleh admin</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
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

            {/* Rejection Details Dialog */}
            {selectedDocument && (
                <Dialog open={isRejectionDialogOpen} onOpenChange={setIsRejectionDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="text-red-600 flex items-center gap-2">
                                <AlertCircle className="size-5" />
                                Detail Penolakan Dokumen
                            </DialogTitle>
                            <DialogDescription>
                                Dokumen Anda ditolak dengan alasan berikut
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="bg-muted p-4 rounded-lg space-y-3">
                                <div>
                                    <h3 className="font-semibold mb-1 text-sm">Jenis Dokumen</h3>
                                    <div className="flex items-center">
                                        {selectedDocument.type === 'KTP' ? <FileInput className="size-4 text-primary mr-2" /> :
                                         selectedDocument.type === 'KK' ? <Users className="size-4 text-primary mr-2" /> :
                                         selectedDocument.type === 'AKTA_KELAHIRAN' ? <Calendar className="size-4 text-primary mr-2" /> :
                                         <ClipboardEdit className="size-4 text-primary mr-2" />}
                                        <p className="font-medium">{documentTypes.find(t => t.id === selectedDocument.type)?.title || selectedDocument.type.replace('_', ' ')}</p>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1 text-sm">Tanggal Pengajuan</h3>
                                    <p>{new Date(selectedDocument.submittedAt).toLocaleDateString('id-ID', {
                                        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                    })}</p>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2 text-red-600 flex items-center">
                                    <XCircle className="size-4 mr-2" />
                                    Alasan Penolakan
                                </h3>
                                <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-800">
                                    {selectedDocument.notes || "Tidak ada alasan yang diberikan"}
                                </div>
                            </div>
                            <div className="bg-yellow-50 p-3 rounded-md">
                                <p className="text-sm text-yellow-800 flex items-start">
                                    <AlertCircle className="size-4 mr-2 mt-0.5 flex-shrink-0" />
                                    Silakan ajukan ulang dokumen dengan memperhatikan alasan penolakan di atas
                                </p>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button 
                                variant="outline" 
                                onClick={() => setIsRejectionDialogOpen(false)}
                            >
                                Tutup
                            </Button>
                            <Button 
                                variant="default"
                                onClick={() => {
                                    setIsRejectionDialogOpen(false);
                                    onRequestDocument && onRequestDocument(selectedDocument.type as DocumentType);
                                }}
                            >
                                Ajukan Ulang
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {/* Document Preview Dialog */}
            {selectedDocument && (
                <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
                    <DialogContent className="sm:max-w-[700px]">
                        <DialogHeader>
                            <DialogTitle className="text-primary flex items-center gap-2">
                                <Eye className="size-5" />
                                Pratinjau Dokumen
                            </DialogTitle>
                            <DialogDescription>
                                {documentTypes.find(t => t.id === selectedDocument.type)?.title || selectedDocument.type}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="h-[500px] w-full bg-muted/40 rounded-lg flex flex-col items-center justify-center">
                            {previewLoading ? (
                                <div className="flex flex-col items-center justify-center">
                                    <div className="size-12 border-4 border-primary/30 border-t-primary animate-spin rounded-full mb-4"></div>
                                    <p className="text-muted-foreground">Memuat pratinjau dokumen...</p>
                                </div>
                            ) : (
                                <div className="text-center space-y-4">
                                    <div className="bg-primary/10 text-primary size-16 rounded-full flex items-center justify-center mx-auto">
                                        <FileCheck className="size-8" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold">Dokumen {documentTypes.find(t => t.id === selectedDocument.type)?.title || selectedDocument.type}</h3>
                                        <p className="text-muted-foreground">Disetujui pada {new Date().toLocaleDateString('id-ID', {
                                            year: 'numeric', month: 'long', day: 'numeric'
                                        })}</p>
                                    </div>
                                    <div className="pt-4">
                                        <p className="text-sm text-muted-foreground">Dokumen tersedia untuk diunduh</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        <DialogFooter className="flex flex-col sm:flex-row gap-2">
                            <Button 
                                variant="outline" 
                                onClick={() => setIsPreviewDialogOpen(false)}
                                className="sm:order-1"
                            >
                                Tutup
                            </Button>
                            <Button 
                                variant="default"
                                onClick={() => DocumentService.downloadDocument(selectedDocument.id)}
                                disabled={previewLoading}
                                className="sm:order-2"
                            >
                                <Download className="size-4 mr-2" />
                                Unduh Dokumen
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};

// Simple Tab Components
interface TabsProps {
    defaultValue: string;
    value: string;
    onValueChange: (value: string) => void;
    className?: string;
    children: React.ReactNode;
}

const Tabs: React.FC<TabsProps> = ({ defaultValue, value, onValueChange, className, children }) => {
    return (
        <div className={className}>
            {children}
        </div>
    );
};

interface TabsListProps {
    className?: string;
    children: React.ReactNode;
}

const TabsList: React.FC<TabsListProps> = ({ className, children }) => {
    return (
        <div className={`inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground ${className || ''}`}>
            {children}
        </div>
    );
};

interface TabsTriggerProps {
    value: string;
    className?: string;
    children: React.ReactNode;
    onClick?: () => void;
}

const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, className, children, onClick }) => {
    const { activeTab, setActiveTab } = useTabs();
    const isActive = activeTab === value;
    
    return (
        <button
            type="button"
            role="tab"
            aria-selected={isActive}
            data-state={isActive ? 'active' : 'inactive'}
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 ${isActive ? 'bg-background text-foreground shadow-sm' : ''} ${className || ''}`}
            onClick={() => {
                setActiveTab(value);
                onClick?.();
            }}
        >
            {children}
        </button>
    );
};

interface TabsContentProps {
    value: string;
    className?: string;
    children: React.ReactNode;
}

const TabsContent: React.FC<TabsContentProps> = ({ value, className, children }) => {
    const { activeTab } = useTabs();
    const isActive = activeTab === value;
    
    if (!isActive) return null;
    
    return (
        <div
            role="tabpanel"
            data-state={isActive ? 'active' : 'inactive'}
            className={`mt-2 ${className || ''}`}
        >
            {children}
        </div>
    );
};

// Context
interface TabsContextType {
    activeTab: string;
    setActiveTab: (value: string) => void;
}

const TabsContext = createContext<TabsContextType>({
    activeTab: '',
    setActiveTab: () => {}
});

const useTabs = () => useContext(TabsContext);

const PendudukDashboard = () => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDocumentType, setSelectedDocumentType] = useState<DocumentType | null>(null);
    const [isRequestFormOpen, setIsRequestFormOpen] = useState(false);
    const [processingDocumentType, setProcessingDocumentType] = useState<DocumentType | null>(null);
    const [activeTab, setActiveTab] = useState("semua");
    
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
        toast.success("Dokumen berhasil diajukan!");
    };

    // Filter documents based on active tab
    const filteredDocuments = documents.filter(doc => {
        if (activeTab === "semua") return true;
        if (activeTab === "diproses") return doc.status === "DIPROSES";
        if (activeTab === "selesai") return doc.status === "SELESAI";
        if (activeTab === "ditolak") return doc.status === "DITOLAK";
        return true;
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Penduduk" />
            
            <div className="space-y-8 px-4 sm:px-8 py-6 sm:py-8 max-w-[1600px] mx-auto">
                <div className="relative rounded-2xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent" />
                    <div className="relative p-4 sm:p-6 rounded-2xl">
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1 sm:mb-2">Selamat Datang di Dashboard Penduduk</h1>
                        <p className="text-muted-foreground">Ajukan dan kelola dokumen kependudukan Anda dengan mudah dan cepat</p>
                    </div>
                </div>

                <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
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
                        title="Dokumen Disetujui"
                        value={documents.filter(d => d.status === 'SELESAI').length}
                        description="Dokumen yang telah disetujui"
                        icon={FileCheck}
                    />
                    <StatsCard
                        title="Dokumen Ditolak"
                        value={documents.filter(d => d.status === 'DITOLAK').length}
                        description="Dokumen yang perlu perbaikan"
                        icon={AlertCircle}
                    />
                </div>

                <div>
                    <h2 className="text-xl sm:text-2xl font-semibold tracking-tight mb-4 flex items-center gap-2">
                        <ClipboardEdit className="size-5 text-primary" />
                        Ajukan Dokumen Baru
                    </h2>
                    <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
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

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight flex items-center gap-2">
                            <FileText className="size-5 text-primary" />
                            Riwayat Dokumen
                        </h2>
                    </div>

                    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
                        <Tabs defaultValue="semua" value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="mb-4">
                                <TabsTrigger value="semua" className="flex items-center gap-1">
                                    <FileArchive className="size-4" /> Semua
                                    <Badge variant="secondary" className="ml-1 text-xs">{documents.length}</Badge>
                                </TabsTrigger>
                                <TabsTrigger value="diproses" className="flex items-center gap-1">
                                    <FileClock className="size-4" /> Diproses
                                    <Badge variant="secondary" className="ml-1 text-xs">{documents.filter(d => d.status === 'DIPROSES').length}</Badge>
                                </TabsTrigger>
                                <TabsTrigger value="selesai" className="flex items-center gap-1">
                                    <FileCheck className="size-4" /> Disetujui
                                    <Badge variant="secondary" className="ml-1 text-xs">{documents.filter(d => d.status === 'SELESAI').length}</Badge>
                                </TabsTrigger>
                                <TabsTrigger value="ditolak" className="flex items-center gap-1">
                                    <FileX className="size-4" /> Ditolak
                                    <Badge variant="secondary" className="ml-1 text-xs">{documents.filter(d => d.status === 'DITOLAK').length}</Badge>
                                </TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value={activeTab}>
                                <DocumentTable 
                                    documents={filteredDocuments} 
                                    isLoading={isLoading}
                                    onRequestDocument={handleDocumentRequest}
                                />
                            </TabsContent>
                        </Tabs>
                    </TabsContext.Provider>
                </div>
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
