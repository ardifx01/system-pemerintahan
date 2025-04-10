import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, DocumentType } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { CheckCircle, Download, FileText, XCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

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

export default function Dokumen({ stats, documents }: Props) {
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
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

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'DIPROSES':
                return 'bg-yellow-100 text-yellow-800';
            case 'SELESAI':
                return 'bg-green-100 text-green-800';
            case 'DITOLAK':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'DIPROSES':
                return 'Menunggu';
            case 'SELESAI':
                return 'Disetujui';
            case 'DITOLAK':
                return 'Ditolak';
            default:
                return status;
        }
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
                            <div className="text-2xl font-bold">{stats.total}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Menunggu Verifikasi</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.pending}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Disetujui</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.approved}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Ditolak</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.rejected}</div>
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
                                {documents.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                                            Belum ada pengajuan dokumen
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    documents.map((document) => (
                                        <TableRow key={document.id}>
                                            <TableCell>{document.document_number}</TableCell>
                                            <TableCell>{formatDocumentType(document.type)}</TableCell>
                                            <TableCell>{document.user_name}</TableCell>
                                            <TableCell>{document.submitted_at}</TableCell>
                                            <TableCell>
                                                <span className={`rounded-full px-2 py-1 text-xs ${getStatusBadgeClass(document.status)}`}>
                                                    {getStatusText(document.status)}
                                                </span>
                                            </TableCell>
                                            <TableCell className="space-x-2">
                                                <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    onClick={() => handleViewDocument(document)}
                                                >
                                                    <FileText className="mr-2 h-4 w-4" />
                                                    Detail
                                                </Button>
                                                
                                                {document.status === 'DIPROSES' && (
                                                    <>
                                                        <Button 
                                                            variant="outline" 
                                                            size="sm" 
                                                            className="text-green-600"
                                                            onClick={() => handleApprove(document)}
                                                        >
                                                            <CheckCircle className="mr-2 h-4 w-4" />
                                                            Setujui
                                                        </Button>
                                                        <Button 
                                                            variant="outline" 
                                                            size="sm" 
                                                            className="text-red-600"
                                                            onClick={() => handleReject(document)}
                                                        >
                                                            <XCircle className="mr-2 h-4 w-4" />
                                                            Tolak
                                                        </Button>
                                                    </>
                                                )}
                                                
                                                {document.can_download && (
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm"
                                                        onClick={() => window.location.href = `/admin/dokumen/${document.id}/download`}
                                                    >
                                                        <Download className="mr-2 h-4 w-4" />
                                                        Unduh
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* Document Detail Dialog */}
            {documentDetails && (
                <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Detail Dokumen: {formatDocumentType(documentDetails.type)}</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="font-bold">No. Pengajuan</Label>
                                <p>{selectedDocument?.document_number}</p>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="font-bold">Status</Label>
                                <p>
                                    <span className={`rounded-full px-2 py-1 text-xs ${selectedDocument ? getStatusBadgeClass(selectedDocument.status) : ''}`}>
                                        {selectedDocument ? getStatusText(selectedDocument.status) : ''}
                                    </span>
                                </p>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="font-bold">NIK</Label>
                                <p>{documentDetails.nik}</p>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="font-bold">Nama Lengkap</Label>
                                <p>{documentDetails.nama}</p>
                            </div>
                            <div className="space-y-1.5 col-span-2">
                                <Label className="font-bold">Alamat</Label>
                                <p>{documentDetails.alamat}</p>
                            </div>

                            {(documentDetails.type === 'KTP' || documentDetails.type === 'AKTA_KELAHIRAN') && (
                                <>
                                    <div className="space-y-1.5">
                                        <Label className="font-bold">Tempat Lahir</Label>
                                        <p>{documentDetails.tempat_lahir ?? '-'}</p>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="font-bold">Tanggal Lahir</Label>
                                        <p>{documentDetails.tanggal_lahir ?? '-'}</p>
                                    </div>
                                </>
                            )}

                            {documentDetails.type === 'AKTA_KELAHIRAN' && (
                                <>
                                    <div className="space-y-1.5">
                                        <Label className="font-bold">Nama Ayah</Label>
                                        <p>{documentDetails.nama_ayah ?? '-'}</p>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="font-bold">Nama Ibu</Label>
                                        <p>{documentDetails.nama_ibu ?? '-'}</p>
                                    </div>
                                </>
                            )}

                            {documentDetails.type === 'AKTA_KEMATIAN' && (
                                <>
                                    <div className="space-y-1.5">
                                        <Label className="font-bold">Nama Almarhum</Label>
                                        <p>{documentDetails.nama_almarhum ?? '-'}</p>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="font-bold">Tanggal Meninggal</Label>
                                        <p>{documentDetails.tanggal_meninggal ?? '-'}</p>
                                    </div>
                                </>
                            )}

                            <div className="space-y-1.5 col-span-2">
                                <Label className="font-bold">Tanggal Pengajuan</Label>
                                <p>{documentDetails.submitted_at ?? '-'}</p>
                            </div>

                            {documentDetails.notes && (
                                <div className="space-y-1.5 col-span-2">
                                    <Label className="font-bold">Catatan</Label>
                                    <p>{documentDetails.notes}</p>
                                </div>
                            )}
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                                Tutup
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {/* Reject Dialog */}
            <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Tolak Pengajuan Dokumen</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="reject-notes">Alasan Penolakan</Label>
                            <Textarea
                                id="reject-notes"
                                value={rejectForm.data.notes}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => rejectForm.setData('notes', e.target.value)}
                                placeholder="Masukkan alasan penolakan dokumen"
                                rows={4}
                                required
                            />
                            {rejectForm.errors.notes && (
                                <p className="text-sm text-red-500">{rejectForm.errors.notes}</p>
                            )}
                        </div>
                    </div>
                    <DialogFooter className="flex justify-end gap-3 mt-4">
                        <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
                            Batal
                        </Button>
                        <Button 
                            variant="destructive"
                            onClick={submitReject}
                            disabled={rejectForm.processing}
                        >
                            {rejectForm.processing ? (
                                <>
                                    <Loader2 className="mr-2 size-4 animate-spin" />
                                    Memproses...
                                </>
                            ) : (
                                'Tolak Dokumen'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
