import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Document, type DocumentType, type DocumentStatus, type DocumentTypeConfig } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
    FileText, FileCheck, FileClock, FileX, Download, Users, FileArchive, 
    AlertCircle, ChevronRight, FileInput, Eye, Calendar, ClipboardEdit,
    CheckCircle2, XCircle, HelpCircle, RefreshCcw, Home, BookOpen,
    Info, CheckCircle, Construction, ArrowRight, Clock, HelpingHand
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import React, { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
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
        title: 'Beranda',
        href: '/',
    },
    {
        title: 'Layanan Dokumen',
        href: '/penduduk/dashboard',
    },
];

const documentTypes: DocumentTypeConfig[] = [
    { id: 'KTP', title: 'KTP', description: 'Kartu identitas resmi penduduk Indonesia', icon: FileInput },
    { id: 'KK', title: 'Kartu Keluarga', description: 'Kartu identitas keluarga', icon: Users },
    { id: 'AKTA_KELAHIRAN', title: 'Akta Kelahiran', description: 'Dokumen resmi kelahiran anak', icon: Calendar },
    { id: 'AKTA_KEMATIAN', title: 'Akta Kematian', description: 'Dokumen resmi kematian seseorang', icon: ClipboardEdit },
];

const statusConfig = {
    DIPROSES: { color: 'bg-amber-100 text-amber-800 border-amber-300', icon: Clock, label: 'Sedang Diproses', description: 'Dokumen Anda sedang ditinjau oleh petugas', progress: 50 },
    SELESAI: { color: 'bg-emerald-100 text-emerald-800 border-emerald-300', icon: CheckCircle, label: 'Disetujui', description: 'Dokumen Anda telah disetujui dan siap diunduh', progress: 100 },
    DITOLAK: { color: 'bg-rose-100 text-rose-800 border-rose-300', icon: XCircle, label: 'Ditolak', description: 'Dokumen Anda ditolak, mohon periksa alasannya', progress: 100 },
} satisfies Record<DocumentStatus, { color: string; icon: typeof FileCheck; label: string; description: string; progress: number }>;

interface ServiceStatusCardProps {
    title: string;
    value: string | number;
    description: string;
    icon: React.ElementType;
    status?: 'success' | 'warning' | 'error' | 'info';
    actionText?: string;
    onAction?: () => void;
}

const ServiceStatusCard = ({ title, value, description, icon: Icon, status = 'info', actionText, onAction }: ServiceStatusCardProps) => {
    const statusStyles = {
        success: "bg-emerald-50 text-emerald-700 border-emerald-200",
        warning: "bg-amber-50 text-amber-700 border-amber-200",
        error: "bg-rose-50 text-rose-700 border-rose-200",
        info: "bg-blue-50 text-blue-700 border-blue-200",
    };

    const iconStyles = {
        success: "bg-emerald-100 text-emerald-700",
        warning: "bg-amber-100 text-amber-700",
        error: "bg-rose-100 text-rose-700",
        info: "bg-blue-100 text-blue-700",
    };

    return (
        <div className={`rounded-lg border p-4 transition-all duration-200 hover:shadow-md ${statusStyles[status]}`}>
            <div className="flex items-start gap-4">
                <div className={`rounded-full p-2.5 ${iconStyles[status]}`}>
                    <Icon className="size-5" aria-hidden="true" />
                </div>
                <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium">{title}</h3>
                        <div className="text-2xl font-bold">{value}</div>
                    </div>
                    <p className="text-sm">{description}</p>
                    {actionText && onAction && (
                        <Button 
                            variant="link" 
                            className="p-0 h-auto text-sm font-medium"
                            onClick={onAction}
                        >
                            {actionText}
                            <ArrowRight className="ml-1 size-3.5" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

interface ServiceCardProps {
    type: DocumentTypeConfig;
    onRequest: (type: DocumentType) => void;
    isProcessing?: boolean;
    inProgress?: number;
    completed?: number;
}

const ServiceCard = ({ type, onRequest, isProcessing, inProgress = 0, completed = 0 }: ServiceCardProps) => {
    const hasActivity = inProgress > 0 || completed > 0;
    
    return (
        <Card className="group border-primary/10 relative overflow-hidden h-full flex flex-col">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-lg bg-primary/10 text-primary backdrop-blur-sm">
                        {type.icon && <type.icon className="size-5" aria-hidden="true" />}
                    </div>
                    {hasActivity && (
                        <Badge variant="outline" className="font-medium text-xs">
                            {inProgress > 0 ? `${inProgress} Diproses` : `${completed} Selesai`}
                        </Badge>
                    )}
                </div>
                <CardTitle className="text-lg font-medium mt-3">{type.title}</CardTitle>
                <CardDescription className="text-sm mt-1">{type.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 flex-1 flex flex-col">
                <div className="mt-2 space-y-3 flex-1 flex flex-col">
                    <div className="space-y-1.5">
                        <div className="text-xs text-muted-foreground flex items-center justify-between">
                            <span>Langkah pengajuan:</span>
                        </div>
                        <ol className="text-xs space-y-1 mt-1 pl-5 pr-2 list-decimal">
                            <li>Klik tombol "Ajukan Dokumen" di bawah</li>
                            <li>Isi formulir data dengan lengkap</li>
                            <li>Kirim dan tunggu proses persetujuan</li>
                        </ol>
                    </div>
                    
                    <div className="mt-auto pt-3">
                        <Button 
                            onClick={() => onRequest(type.id as DocumentType)}
                            className="w-full font-medium relative overflow-hidden h-10"
                            disabled={isProcessing}
                        >
                            {isProcessing ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="size-4 border-2 border-current border-t-transparent animate-spin rounded-full" />
                                    <span>Memproses...</span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-2">
                                    <FileText className="size-4" />
                                    <span>Ajukan Dokumen</span>
                                </div>
                            )}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

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

    // Group documents by month and year
    const groupedDocuments = documents.reduce((acc, doc) => {
        const date = new Date(doc.submittedAt);
        const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
        
        if (!acc[key]) {
            acc[key] = {
                monthYear: new Date(date.getFullYear(), date.getMonth(), 1),
                documents: []
            };
        }
        
        acc[key].documents.push(doc);
        return acc;
    }, {} as Record<string, { monthYear: Date, documents: Document[] }>);

    // Sort groups by date (newest first)
    const sortedGroups = Object.values(groupedDocuments).sort((a, b) => 
        b.monthYear.getTime() - a.monthYear.getTime()
    );

    return (
        <div className="rounded-xl border bg-card text-card-foreground shadow">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b bg-muted/5 px-4 sm:px-6 py-4">
                <div>
                    <h2 className="text-lg font-medium tracking-tight flex items-center gap-2">
                        <FileText className="size-4 sm:size-5 text-primary" />
                        Riwayat Pengajuan
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">Pantau status dokumen yang telah Anda ajukan</p>
                </div>
                <div className="mt-3 sm:mt-0 flex items-center gap-2">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs" 
                        onClick={() => window.location.reload()}
                    >
                        <RefreshCcw className="size-3 sm:size-3.5 mr-1 sm:mr-1.5" /> Segarkan
                    </Button>
                    <Badge variant="outline" className="font-medium text-xs">
                        {documents.length} Dokumen
                    </Badge>
                </div>
            </div>
            
            <div className="p-0">
                <ScrollArea className="h-[400px] sm:h-[450px]">
                    {isLoading ? (
                        <div className="p-4 sm:p-6 space-y-4">
                            {Array(3).fill(0).map((_, i) => (
                                <div key={i} className="space-y-2 border-b pb-4 last:border-0">
                                    <Skeleton className="h-5 w-32" />
                                    <div className="flex justify-between items-center">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-4 w-20" />
                                    </div>
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-8 w-20 ml-auto" />
                                </div>
                            ))}
                        </div>
                    ) : documents.length === 0 ? (
                        <div className="p-8 h-64">
                            <div className="flex flex-col items-center justify-center text-center h-full">
                                <div className="p-3 rounded-full bg-primary/5 mb-3">
                                    <FileArchive className="size-6 sm:size-8 text-primary" />
                                </div>
                                <p className="text-muted-foreground font-medium">Belum ada dokumen yang diajukan</p>
                                <p className="text-xs sm:text-sm text-muted-foreground mt-1">Pilih jenis dokumen di atas untuk memulai pengajuan</p>
                            </div>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {sortedGroups.map((group) => (
                                <div key={group.monthYear.toISOString()} className="px-4 sm:px-6 pb-2">
                                    <div className="sticky top-0 bg-background/95 backdrop-blur-sm py-2 z-10">
                                        <h3 className="text-xs font-medium text-muted-foreground">
                                            {group.monthYear.toLocaleDateString('id-ID', {
                                                year: 'numeric',
                                                month: 'long'
                                            })}
                                        </h3>
                                    </div>
                                    <div className="space-y-3 pb-2">
                                        {group.documents.map((doc) => {
                                            const statusInfo = statusConfig[doc.status];
                                            const StatusIcon = statusInfo.icon;
                                            return (
                                                <div key={doc.id} className="rounded-lg border p-3 sm:p-4 hover:bg-muted/10 transition-colors">
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                                                        <div className="flex items-start gap-3">
                                                            <div className="p-2 rounded-md bg-primary/10 text-primary">
                                                                {doc.type === 'KTP' ? <FileInput className="size-4" /> :
                                                                doc.type === 'KK' ? <Users className="size-4" /> :
                                                                doc.type === 'AKTA_KELAHIRAN' ? <Calendar className="size-4" /> :
                                                                <ClipboardEdit className="size-4" />}
                                                            </div>
                                                            <div>
                                                                <div className="font-medium text-sm sm:text-base flex items-center gap-2">
                                                                    {documentTypes.find(t => t.id === doc.type)?.title || doc.type.replace('_', ' ')}
                                                                    <Badge variant="outline" className={`${statusInfo.color} border text-xs font-medium`}>
                                                                        <StatusIcon className="mr-1 size-3" />
                                                                        {statusInfo.label}
                                                                    </Badge>
                                                                </div>
                                                                <p className="text-xs text-muted-foreground mt-1">
                                                                    {new Date(doc.submittedAt).toLocaleDateString('id-ID', {
                                                                        year: 'numeric',
                                                                        month: 'long',
                                                                        day: 'numeric',
                                                                        hour: '2-digit',
                                                                        minute: '2-digit'
                                                                    })}
                                                                </p>
                                                                <p className="text-xs mt-1">{statusInfo.description}</p>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="ml-auto flex items-center gap-2 mt-2 sm:mt-0">
                                                            {doc.status === 'SELESAI' ? (
                                                                <div className="flex flex-wrap gap-2 justify-end">
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="h-8 text-xs"
                                                                        onClick={() => handlePreviewDocument(doc)}
                                                                    >
                                                                        <Eye className="size-3.5 mr-1.5" />
                                                                        Pratinjau
                                                                    </Button>
                                                                    <Button
                                                                        variant="default"
                                                                        size="sm"
                                                                        className="h-8 text-xs"
                                                                        onClick={() => {
                                                                            if (doc && doc.id) {
                                                                                window.open(`/document/${doc.id}/download`, '_blank');
                                                                            }
                                                                        }}
                                                                    >
                                                                        <Download className="size-3.5 mr-1.5" />
                                                                        Unduh
                                                                    </Button>
                                                                </div>
                                                            ) : doc.status === 'DITOLAK' && doc.notes ? (
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="text-rose-600 border-rose-200 hover:bg-rose-50 h-8 text-xs"
                                                                    onClick={() => handleViewRejectionDetails(doc)}
                                                                >
                                                                    <XCircle className="size-3.5 mr-1.5" />
                                                                    Lihat Alasan Penolakan
                                                                </Button>
                                                            ) : (
                                                                <div className="inline-flex h-8 items-center rounded-md border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                                                                    <Clock className="size-3.5 mr-1.5 animate-pulse" />
                                                                    Sedang Diproses
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </div>

            {/* Rejection Details Dialog */}
            {selectedDocument && (
                <Dialog open={isRejectionDialogOpen} onOpenChange={setIsRejectionDialogOpen}>
                    <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-rose-600 flex items-center gap-2">
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
                                <h3 className="font-semibold mb-2 text-rose-600 flex items-center">
                                    <XCircle className="size-4 mr-2" />
                                    Alasan Penolakan
                                </h3>
                                <div className="p-4 bg-rose-50 border border-rose-200 rounded-md text-rose-800">
                                    {selectedDocument.notes || "Tidak ada alasan yang diberikan"}
                                </div>
                            </div>
                            <div className="bg-amber-50 p-3 rounded-md">
                                <p className="text-sm text-amber-800 flex items-start">
                                    <AlertCircle className="size-4 mr-2 mt-0.5 flex-shrink-0" />
                                    Silakan ajukan ulang dokumen dengan memperhatikan alasan penolakan di atas
                                </p>
                            </div>
                        </div>
                        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
                            <Button 
                                variant="outline" 
                                onClick={() => setIsRejectionDialogOpen(false)}
                                className="sm:order-1"
                            >
                                Tutup
                            </Button>
                            <Button 
                                variant="default"
                                onClick={() => {
                                    setIsRejectionDialogOpen(false);
                                    if (onRequestDocument) {
                                        onRequestDocument(selectedDocument.type as DocumentType);
                                    }
                                }}
                                className="sm:order-2"
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
                    <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-primary flex items-center gap-2">
                                <Eye className="size-5" />
                                Pratinjau Dokumen
                            </DialogTitle>
                            <DialogDescription>
                                {documentTypes.find(t => t.id === selectedDocument.type)?.title || selectedDocument.type}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="h-[400px] sm:h-[500px] w-full bg-muted/40 rounded-lg flex flex-col items-center justify-center">
                            {previewLoading ? (
                                <div className="flex flex-col items-center justify-center">
                                    <div className="size-10 sm:size-12 border-4 border-primary/30 border-t-primary animate-spin rounded-full mb-4"></div>
                                    <p className="text-muted-foreground">Memuat pratinjau dokumen...</p>
                                </div>
                            ) : (
                                <div className="text-center space-y-4">
                                    <div className="bg-primary/10 text-primary size-12 sm:size-16 rounded-full flex items-center justify-center mx-auto">
                                        {React.createElement(FileCheck, { className: "size-6 sm:size-8" })}
                                    </div>
                                    <div>
                                        <h3 className="text-lg sm:text-xl font-semibold">Dokumen {documentTypes.find(t => t.id === selectedDocument.type)?.title || selectedDocument.type}</h3>
                                        <p className="text-sm text-muted-foreground">Disetujui pada {new Date().toLocaleDateString('id-ID', {
                                            year: 'numeric', month: 'long', day: 'numeric'
                                        })}</p>
                                    </div>
                                    <div className="pt-4">
                                        <p className="text-sm text-muted-foreground">Dokumen tersedia untuk diunduh</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
                            <Button 
                                variant="outline" 
                                onClick={() => setIsPreviewDialogOpen(false)}
                                className="sm:order-1"
                            >
                                Tutup
                            </Button>
                            <Button 
                                variant="default"
                                onClick={() => {
                                    if (selectedDocument && selectedDocument.id) {
                                        window.open(`/document/${selectedDocument.id}/download`, '_blank');
                                    }
                                }}
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
    className?: string;
    children: React.ReactNode;
}

const Tabs: React.FC<TabsProps> = ({ className, children }) => {
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

    // Count document status
    const documentsInProcess = documents.filter(d => d.status === 'DIPROSES').length;
    const documentsApproved = documents.filter(d => d.status === 'SELESAI').length;
    const documentsRejected = documents.filter(d => d.status === 'DITOLAK').length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Layanan Dokumen Kependudukan" />
            
            <div className="space-y-6 px-4 sm:px-6 py-6 sm:py-8 max-w-[1400px] mx-auto">
                {/* Hero section with welcome message */}
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/20 via-primary/10 to-background border border-primary/10">
                    <div className="absolute bottom-0 right-0 w-64 h-64 -mb-12 -mr-12 opacity-10">
                        <FileArchive className="w-full h-full" />
                    </div>
                    <div className="relative p-5 sm:p-6 md:p-8">
                        <div className="max-w-2xl">
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                                Selamat Datang di Layanan Dokumen Online
                            </h1>
                            <p className="mt-2 text-sm sm:text-base text-muted-foreground">
                                Ajukan permohonan dokumen resmi kependudukan seperti KTP, Kartu Keluarga, dan Akta secara online dengan mudah dan cepat.
                            </p>
                            <div className="flex flex-wrap gap-3 mt-4">
                                <Button
                                    variant="default"
                                    size="sm"
                                    className="gap-2 h-9"
                                    onClick={() => {
                                        const serviceSection = document.getElementById('layanan-dokumen');
                                        if (serviceSection) {
                                            serviceSection.scrollIntoView({ behavior: 'smooth' });
                                        }
                                    }}
                                >
                                    <FileText className="size-4" />
                                    Ajukan Dokumen Baru
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2 h-9"
                                    onClick={() => {
                                        const historySection = document.getElementById('riwayat-dokumen');
                                        if (historySection) {
                                            historySection.scrollIntoView({ behavior: 'smooth' });
                                        }
                                    }}
                                >
                                    <FileArchive className="size-4" />
                                    Lihat Dokumen Saya
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Process flow */}
                <div className="bg-card rounded-xl border p-5 sm:p-6">
                    <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
                        <Info className="size-5 text-primary" />
                        Langkah Pengajuan Dokumen
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                        <div className="bg-muted/30 p-4 sm:p-5 rounded-lg border flex flex-col items-center text-center">
                            <div className="flex items-center justify-center bg-primary/10 text-primary rounded-full size-10 sm:size-12 mb-3">
                                <FileText className="size-5 sm:size-6" />
                                <span className="absolute -top-1 -right-1 flex items-center justify-center bg-primary text-primary-foreground text-xs font-bold rounded-full size-5">1</span>
                            </div>
                            <h3 className="font-medium text-base">Pilih & Ajukan Dokumen</h3>
                            <p className="text-sm text-muted-foreground mt-2">Pilih jenis dokumen yang ingin diajukan dan isi formulir data dengan lengkap</p>
                        </div>
                        <div className="bg-muted/30 p-4 sm:p-5 rounded-lg border flex flex-col items-center text-center">
                            <div className="flex items-center justify-center bg-primary/10 text-primary rounded-full size-10 sm:size-12 mb-3">
                                <Clock className="size-5 sm:size-6" />
                                <span className="absolute -top-1 -right-1 flex items-center justify-center bg-primary text-primary-foreground text-xs font-bold rounded-full size-5">2</span>
                            </div>
                            <h3 className="font-medium text-base">Tunggu Persetujuan</h3>
                            <p className="text-sm text-muted-foreground mt-2">Petugas akan memeriksa dan memproses permohonan dokumen Anda</p>
                        </div>
                        <div className="bg-muted/30 p-4 sm:p-5 rounded-lg border flex flex-col items-center text-center">
                            <div className="flex items-center justify-center bg-primary/10 text-primary rounded-full size-10 sm:size-12 mb-3">
                                <Download className="size-5 sm:size-6" />
                                <span className="absolute -top-1 -right-1 flex items-center justify-center bg-primary text-primary-foreground text-xs font-bold rounded-full size-5">3</span>
                            </div>
                            <h3 className="font-medium text-base">Unduh Dokumen</h3>
                            <p className="text-sm text-muted-foreground mt-2">Setelah disetujui, dokumen siap untuk diunduh atau dicetak</p>
                        </div>
                    </div>
                </div>

                {/* Document status overview */}
                <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    <ServiceStatusCard
                        title="Total Dokumen"
                        value={documents.length}
                        description="Jumlah dokumen yang telah Anda ajukan"
                        icon={FileArchive}
                        status="info"
                    />
                    <ServiceStatusCard
                        title="Sedang Diproses"
                        value={documentsInProcess}
                        description="Dokumen yang sedang ditinjau petugas"
                        icon={Clock}
                        status="warning"
                        actionText={documentsInProcess > 0 ? "Lihat status" : undefined}
                        onAction={documentsInProcess > 0 ? () => setActiveTab("diproses") : undefined}
                    />
                    <ServiceStatusCard
                        title="Dokumen Disetujui"
                        value={documentsApproved}
                        description="Dokumen yang siap diunduh/cetak"
                        icon={CheckCircle}
                        status="success"
                        actionText={documentsApproved > 0 ? "Lihat dokumen" : undefined}
                        onAction={documentsApproved > 0 ? () => setActiveTab("selesai") : undefined}
                    />
                    <ServiceStatusCard
                        title="Dokumen Ditolak"
                        value={documentsRejected}
                        description="Dokumen yang perlu perbaikan/pengajuan ulang"
                        icon={XCircle}
                        status="error"
                        actionText={documentsRejected > 0 ? "Lihat alasan" : undefined}
                        onAction={documentsRejected > 0 ? () => setActiveTab("ditolak") : undefined}
                    />
                </div>

                {/* Document services section */}
                <div id="layanan-dokumen" className="scroll-mt-16">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg sm:text-xl font-semibold tracking-tight flex items-center gap-2">
                            <HelpingHand className="size-5 text-primary" />
                            Layanan Dokumen
                        </h2>
                        <Badge variant="outline" className="px-2.5 py-1 text-xs">
                            {documentTypes.length} Jenis Dokumen
                        </Badge>
                    </div>
                    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                        {documentTypes.map((type) => (
                            <ServiceCard
                                key={type.id}
                                type={type}
                                onRequest={handleDocumentRequest}
                                isProcessing={processingDocumentType === type.id}
                                inProgress={documents.filter(d => d.type === type.id && d.status === 'DIPROSES').length}
                                completed={documents.filter(d => d.type === type.id && d.status === 'SELESAI').length}
                            />
                        ))}
                    </div>
                </div>

                {/* Document history section */}
                <div id="riwayat-dokumen" className="scroll-mt-16 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                        <h2 className="text-lg sm:text-xl font-semibold tracking-tight flex items-center gap-2">
                            <FileArchive className="size-5 text-primary" />
                            Riwayat Dokumen
                        </h2>
                    </div>

                    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
                        <Tabs className="w-full">
                            <TabsList className="mb-4 overflow-x-auto flex-wrap">
                                <TabsTrigger value="semua" className="flex items-center gap-1">
                                    <FileArchive className="size-3.5" /> Semua
                                    <Badge variant="secondary" className="ml-1 text-xs">{documents.length}</Badge>
                                </TabsTrigger>
                                <TabsTrigger value="diproses" className="flex items-center gap-1">
                                    <Clock className="size-3.5" /> Diproses
                                    <Badge variant="secondary" className="ml-1 text-xs">{documentsInProcess}</Badge>
                                </TabsTrigger>
                                <TabsTrigger value="selesai" className="flex items-center gap-1">
                                    <CheckCircle className="size-3.5" /> Disetujui
                                    <Badge variant="secondary" className="ml-1 text-xs">{documentsApproved}</Badge>
                                </TabsTrigger>
                                <TabsTrigger value="ditolak" className="flex items-center gap-1">
                                    <XCircle className="size-3.5" /> Ditolak
                                    <Badge variant="secondary" className="ml-1 text-xs">{documentsRejected}</Badge>
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
