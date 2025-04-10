import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, DocumentType } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { CheckCircle, Download, FileText, XCircle, Files, Clock, CheckCheck, AlertTriangle, Search, Calendar, User } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

type Document = {
    id: number;
    document_number: string;
    type: DocumentType;
    user_name: string;
    submitted_at: string;
    status: 'DIPROSES' | 'SELESAI' | 'DITOLAK';
    notes?: string | null;
    can_download: boolean;
};

type Stats = {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
};

interface Props {
    stats: Stats;
    documents: Document[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manajemen Dokumen',
        href: '/admin/dokumen',
    },
];

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    description?: string;
    color?: 'default' | 'blue' | 'green' | 'orange' | 'red';
    delay?: number;
}

function StatsCard({ title, value, icon, description, color = 'default', delay = 0 }: StatsCardProps) {
    const colorClasses = {
        default: 'from-zinc-500/20 to-zinc-500/5 text-zinc-600 dark:from-zinc-400/10 dark:to-zinc-400/5 dark:text-zinc-200',
        blue: 'from-blue-500/20 to-blue-500/5 text-blue-600 dark:from-blue-400/10 dark:to-blue-400/5 dark:text-blue-200',
        green: 'from-emerald-500/20 to-emerald-500/5 text-emerald-600 dark:from-emerald-400/10 dark:to-emerald-400/5 dark:text-emerald-200',
        orange: 'from-orange-500/20 to-orange-500/5 text-orange-600 dark:from-orange-400/10 dark:to-orange-400/5 dark:text-orange-200',
        red: 'from-red-500/20 to-red-500/5 text-red-600 dark:from-red-400/10 dark:to-red-400/5 dark:text-red-200',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: delay * 0.1 }}
            className="h-full"
        >
            <Card className={cn("bg-gradient-to-br h-full flex flex-col", colorClasses[color])}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 flex-shrink-0">
                    <CardTitle className="text-sm font-medium">{title}</CardTitle>
                    <div className={cn("p-2 rounded-full bg-white/20", colorClasses[color])}>
                        {icon}
                    </div>
                </CardHeader>
                <CardContent className="flex flex-col justify-between flex-grow">
                    <div className="text-3xl font-bold tracking-tight">{value}</div>
                    <div className="h-4">
                        {description && (
                            <p className="text-xs text-current/70 mt-1 font-medium">{description}</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

export default function Dokumen({ stats, documents }: Props) {
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [documentDetails, setDocumentDetails] = useState<{
        type: DocumentType;
        nik: string;
        nama: string;
        alamat: string;
        tempat_lahir?: string;
        tanggal_lahir?: string;
        nama_ayah?: string;
        nama_ibu?: string;
        nama_almarhum?: string;
        tanggal_meninggal?: string;
        submitted_at?: string;
        notes?: string;
    }>({
        type: 'KTP',
        nik: '',
        nama: '',
        alamat: ''
    });
    
    const rejectForm = useForm({
        notes: '',
    });

    const approveForm = useForm({
        notes: '',
    });

    const handleViewDocument = async (document: Document) => {
        try {
            const response = await fetch(`/admin/dokumen/${document.id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch document details');
            }
            const data = await response.json();
            setSelectedDocument(document);
            setDocumentDetails(data);
            setIsViewDialogOpen(true);
        } catch (error) {
            console.error('Error fetching document details:', error);
            toast.error('Gagal memuat detail dokumen');
        }
    };

    const handleApprove = (document: Document) => {
        approveForm.post(`/admin/dokumen/${document.id}/approve`, {
            onSuccess: () => {
                toast.success('Dokumen berhasil disetujui');
                router.reload();
            },
            onError: () => {
                toast.error('Gagal menyetujui dokumen');
            },
        });
    };

    const handleReject = (document: Document) => {
        setSelectedDocument(document);
        setIsRejectDialogOpen(true);
    };

    const submitReject = () => {
        if (!selectedDocument) return;
        
        rejectForm.post(`/admin/dokumen/${selectedDocument.id}/reject`, {
            onSuccess: () => {
                setIsRejectDialogOpen(false);
                toast.success('Dokumen berhasil ditolak');
                rejectForm.reset();
                router.reload();
            },
            onError: () => {
                toast.error('Gagal menolak dokumen');
            },
        });
    };

    const formatDocumentType = (type: DocumentType) => {
        switch (type) {
            case 'KTP':
                return 'KTP';
            case 'KK':
                return 'Kartu Keluarga';
            case 'AKTA_KELAHIRAN':
                return 'Akta Kelahiran';
            case 'AKTA_KEMATIAN':
                return 'Akta Kematian';
            default:
                return type;
        }
    };

    // Filter documents based on search query
    const filteredDocuments = documents.filter(doc => 
        doc.document_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        formatDocumentType(doc.type).toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Dokumen" />
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="flex h-full flex-1 flex-col gap-6 p-6"
            >
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold tracking-tight">Manajemen Dokumen</h1>
                    <p className="text-muted-foreground">Kelola dan verifikasi pengajuan dokumen dari penduduk.</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <StatsCard
                        title="Total Dokumen"
                        value={stats.total.toLocaleString()}
                        icon={<Files className="h-5 w-5" />}
                        color="blue"
                        delay={0}
                    />
                    <StatsCard
                        title="Menunggu Verifikasi"
                        value={stats.pending.toLocaleString()}
                        icon={<Clock className="h-5 w-5" />}
                        color="orange"
                        delay={1}
                        description="Perlu diproses"
                    />
                    <StatsCard
                        title="Disetujui"
                        value={stats.approved.toLocaleString()}
                        icon={<CheckCheck className="h-5 w-5" />}
                        color="green"
                        delay={2}
                        description="Dokumen selesai"
                    />
                    <StatsCard
                        title="Ditolak"
                        value={stats.rejected.toLocaleString()}
                        icon={<AlertTriangle className="h-5 w-5" />}
                        color="red"
                        delay={3}
                        description="Tidak memenuhi syarat"
                    />
                </div>

                <Card className="overflow-hidden border-none shadow-md">
                    <CardHeader className="bg-card pb-6 border-b">
                        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                            <div>
                                <CardTitle className="text-lg font-semibold">Daftar Pengajuan Dokumen</CardTitle>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Total {filteredDocuments.length} dokumen {searchQuery && 'ditemukan'}
                                </p>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Cari no. pengajuan, nama, atau jenis..."
                                    className="pl-9 w-full sm:w-64"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                                        <TableHead className="w-[130px]">No. Pengajuan</TableHead>
                                        <TableHead className="w-[150px]">Jenis Dokumen</TableHead>
                                        <TableHead className="w-[180px]">Nama Pemohon</TableHead>
                                        <TableHead className="w-[150px]">Tanggal</TableHead>
                                        <TableHead className="w-[110px]">Status</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredDocuments.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6}>
                                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                                    <FileText className="h-12 w-12 text-muted-foreground/30 mb-3" />
                                                    {searchQuery ? (
                                                        <>
                                                            <p className="text-muted-foreground font-medium">Tidak ada dokumen ditemukan</p>
                                                            <p className="text-sm text-muted-foreground/70 mt-1">
                                                                Coba dengan kata kunci lain atau reset pencarian
                                                            </p>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <p className="text-muted-foreground font-medium">Belum ada pengajuan dokumen</p>
                                                            <p className="text-sm text-muted-foreground/70 mt-1">
                                                                Pengajuan dokumen dari penduduk akan muncul di sini
                                                            </p>
                                                        </>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredDocuments.map((document, index) => (
                                            <motion.tr 
                                                key={document.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.2, delay: index * 0.05 }}
                                                className="group hover:bg-muted/50"
                                            >
                                                <TableCell className="font-medium">{document.document_number}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <div className="bg-primary/10 p-1.5 rounded-full">
                                                            <FileText className="h-3 w-3 text-primary" />
                                                        </div>
                                                        <span>{formatDocumentType(document.type)}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <div className="bg-muted p-1.5 rounded-full">
                                                            <User className="h-3 w-3 text-muted-foreground" />
                                                        </div>
                                                        <span>{document.user_name}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <div className="bg-muted p-1.5 rounded-full">
                                                            <Calendar className="h-3 w-3 text-muted-foreground" />
                                                        </div>
                                                        <span>{document.submitted_at}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge 
                                                        variant="outline" 
                                                        className={cn(
                                                            document.status === 'DIPROSES' 
                                                                ? "bg-yellow-50 text-yellow-600 border-yellow-200" 
                                                                : document.status === 'SELESAI'
                                                                ? "bg-green-50 text-green-600 border-green-200"
                                                                : "bg-red-50 text-red-600 border-red-200"
                                                        )}
                                                    >
                                                        {document.status === 'DIPROSES' ? (
                                                            <>
                                                                <span className="relative flex h-2 w-2">
                                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                                                                </span>
                                                                Menunggu
                                                            </>
                                                        ) : document.status === 'SELESAI' ? (
                                                            <>
                                                                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                                                Disetujui
                                                            </>
                                                        ) : (
                                                            <>
                                                                <span className="h-2 w-2 rounded-full bg-red-500"></span>
                                                                Ditolak
                                                            </>
                                                        )}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button 
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleViewDocument(document)}
                                                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                                            title="Detail Dokumen"
                                                        >
                                                            <FileText className="h-4 w-4" />
                                                        </Button>
                                                        
                                                        {document.status === 'DIPROSES' && (
                                                            <>
                                                                <Button 
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => handleApprove(document)}
                                                                    className="h-8 w-8 text-green-500 hover:text-green-700 hover:bg-green-50"
                                                                    title="Setujui Dokumen"
                                                                >
                                                                    <CheckCircle className="h-4 w-4" />
                                                                </Button>
                                                                <Button 
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => handleReject(document)}
                                                                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                                    title="Tolak Dokumen"
                                                                >
                                                                    <XCircle className="h-4 w-4" />
                                                                </Button>
                                                            </>
                                                        )}
                                                        
                                                        {document.can_download && (
                                                            <Button 
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => window.location.href = `/admin/dokumen/${document.id}/download`}
                                                                className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                                                                title="Unduh Dokumen"
                                                            >
                                                                <Download className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </motion.tr>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Document Detail Dialog */}
            {documentDetails && (
                <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-xl flex items-center gap-2">
                                <FileText className="h-5 w-5 text-primary" />
                                Detail Dokumen: {formatDocumentType(documentDetails.type)}
                            </DialogTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                Informasi lengkap pengajuan dokumen dari penduduk
                            </p>
                        </DialogHeader>
                        
                        <div className="bg-muted/30 rounded-md p-3 flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-primary/10 p-2.5 rounded-full">
                                    <FileText className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-medium">{selectedDocument?.document_number}</h4>
                                    <p className="text-xs text-muted-foreground">Nomor Pengajuan</p>
                                </div>
                            </div>
                            <Badge 
                                variant="outline" 
                                className={cn(
                                    selectedDocument?.status === 'DIPROSES' 
                                        ? "bg-yellow-50 text-yellow-600 border-yellow-200" 
                                        : selectedDocument?.status === 'SELESAI'
                                        ? "bg-green-50 text-green-600 border-green-200"
                                        : "bg-red-50 text-red-600 border-red-200"
                                )}
                            >
                                {selectedDocument?.status === 'DIPROSES' ? (
                                    <>
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                                        </span>
                                        Menunggu
                                    </>
                                ) : selectedDocument?.status === 'SELESAI' ? (
                                    <>
                                        <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                        Disetujui
                                    </>
                                ) : (
                                    <>
                                        <span className="h-2 w-2 rounded-full bg-red-500"></span>
                                        Ditolak
                                    </>
                                )}
                            </Badge>
                        </div>

                        <div className="border rounded-md divide-y">
                            <div className="p-4">
                                <h3 className="text-sm font-medium text-muted-foreground mb-3">Data Pemohon</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label className="text-xs text-muted-foreground">NIK</Label>
                                        <p className="font-medium">{documentDetails.nik}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs text-muted-foreground">Nama Lengkap</Label>
                                        <p className="font-medium">{documentDetails.nama}</p>
                                    </div>
                                    <div className="space-y-1 col-span-2">
                                        <Label className="text-xs text-muted-foreground">Alamat</Label>
                                        <p className="font-medium">{documentDetails.alamat}</p>
                                    </div>
                                </div>
                            </div>

                            {(documentDetails.type === 'KTP' || documentDetails.type === 'AKTA_KELAHIRAN') && (
                                <div className="p-4">
                                    <h3 className="text-sm font-medium text-muted-foreground mb-3">Data Kelahiran</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <Label className="text-xs text-muted-foreground">Tempat Lahir</Label>
                                            <p className="font-medium">{documentDetails.tempat_lahir ?? '-'}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs text-muted-foreground">Tanggal Lahir</Label>
                                            <p className="font-medium">{documentDetails.tanggal_lahir ?? '-'}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {documentDetails.type === 'AKTA_KELAHIRAN' && (
                                <div className="p-4">
                                    <h3 className="text-sm font-medium text-muted-foreground mb-3">Data Orangtua</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <Label className="text-xs text-muted-foreground">Nama Ayah</Label>
                                            <p className="font-medium">{documentDetails.nama_ayah ?? '-'}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs text-muted-foreground">Nama Ibu</Label>
                                            <p className="font-medium">{documentDetails.nama_ibu ?? '-'}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {documentDetails.type === 'AKTA_KEMATIAN' && (
                                <div className="p-4">
                                    <h3 className="text-sm font-medium text-muted-foreground mb-3">Data Kematian</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <Label className="text-xs text-muted-foreground">Nama Almarhum</Label>
                                            <p className="font-medium">{documentDetails.nama_almarhum ?? '-'}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs text-muted-foreground">Tanggal Meninggal</Label>
                                            <p className="font-medium">{documentDetails.tanggal_meninggal ?? '-'}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="p-4">
                                <h3 className="text-sm font-medium text-muted-foreground mb-3">Informasi Tambahan</h3>
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground">Tanggal Pengajuan</Label>
                                    <p className="font-medium flex items-center gap-2">
                                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                        {documentDetails.submitted_at ?? '-'}
                                    </p>
                                </div>

                                {documentDetails.notes && (
                                    <div className="mt-3 p-3 bg-muted/30 rounded-md space-y-1">
                                        <Label className="text-xs text-muted-foreground">Catatan</Label>
                                        <p className="text-sm">{documentDetails.notes}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <DialogFooter className="gap-2 mt-4">
                            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                                Tutup
                            </Button>
                            {selectedDocument?.status === 'DIPROSES' && (
                                <>
                                    <Button 
                                        variant="destructive" 
                                        onClick={() => {
                                            setIsViewDialogOpen(false);
                                            handleReject(selectedDocument);
                                        }}
                                    >
                                        <XCircle className="mr-2 h-4 w-4" />
                                        Tolak
                                    </Button>
                                    <Button 
                                        onClick={() => {
                                            setIsViewDialogOpen(false);
                                            handleApprove(selectedDocument);
                                        }}
                                    >
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Setujui
                                    </Button>
                                </>
                            )}
                            {selectedDocument?.can_download && (
                                <Button 
                                    variant="outline"
                                    className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 hover:text-blue-700"
                                    onClick={() => window.location.href = `/admin/dokumen/${selectedDocument.id}/download`}
                                >
                                    <Download className="mr-2 h-4 w-4" />
                                    Unduh Dokumen
                                </Button>
                            )}
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {/* Reject Dialog */}
            <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl flex items-center gap-2">
                            <XCircle className="h-5 w-5 text-red-500" />
                            Tolak Pengajuan Dokumen
                        </DialogTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                            Berikan alasan mengapa dokumen ini ditolak
                        </p>
                    </DialogHeader>
                    
                    {selectedDocument && (
                        <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-md mb-4">
                            <div className="bg-primary/10 p-2 rounded-full mt-0.5">
                                <FileText className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <div className="font-medium">{selectedDocument.document_number}</div>
                                <div className="text-sm">{formatDocumentType(selectedDocument.type)}</div>
                                <div className="text-xs text-muted-foreground mt-0.5">{selectedDocument.user_name}</div>
                            </div>
                        </div>
                    )}
                    
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="reject-notes" className="text-base font-medium">
                                Alasan Penolakan
                            </Label>
                            <Textarea
                                id="reject-notes"
                                value={rejectForm.data.notes}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => rejectForm.setData('notes', e.target.value)}
                                placeholder="Masukkan alasan penolakan dokumen secara detail agar pemohon dapat memahami"
                                className={cn(
                                    "min-h-[120px]",
                                    rejectForm.errors.notes ? "border-red-500 focus-visible:ring-red-500" : ""
                                )}
                                required
                            />
                            {rejectForm.errors.notes && (
                                <div className="flex items-center text-red-500 gap-2 text-sm mt-1">
                                    <AlertTriangle className="h-4 w-4" />
                                    <p>{rejectForm.errors.notes}</p>
                                </div>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">
                                Alasan ini akan ditampilkan kepada pemohon sebagai penjelasan mengapa dokumen ditolak
                            </p>
                        </div>
                    </div>
                    <DialogFooter className="flex justify-end gap-3 mt-4">
                        <Button 
                            variant="outline" 
                            onClick={() => setIsRejectDialogOpen(false)}
                        >
                            Batal
                        </Button>
                        <Button 
                            variant="destructive"
                            onClick={submitReject}
                            disabled={rejectForm.processing || !rejectForm.data.notes.trim()}
                        >
                            {rejectForm.processing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Memproses...
                                </>
                            ) : (
                                <>
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Tolak Dokumen
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
