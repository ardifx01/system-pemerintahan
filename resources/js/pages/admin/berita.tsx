import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Edit, ImagePlus, Plus, Trash2, Search, Calendar, User, FileText, Eye, EyeOff } from 'lucide-react';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manajemen Berita',
        href: '/admin/berita',
    },
];

interface Berita {
    id: number;
    judul: string;
    konten: string;
    gambar: string | null;
    penulis: string;
    status: 'Dipublikasi' | 'Draf';
    tanggal_publikasi: string | null;
    created_at: string;
}

interface BeritaPageProps {
    beritas: Berita[];
}

export default function Berita({ beritas }: BeritaPageProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [imageDialogOpen, setImageDialogOpen] = useState(false);
    const [selectedBerita, setSelectedBerita] = useState<Berita | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobile, setIsMobile] = useState(false);
    const { toast } = useToast();
    
    // Check if viewport is mobile-sized
    useEffect(() => {
        const checkIfMobile = () => setIsMobile(window.innerWidth < 640);
        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);
        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    const { data, setData, post, processing, reset, errors } = useForm({
        gambar: null as File | null,
    });

    const handleDeleteBerita = () => {
        if (!selectedBerita) return;
        
        router.delete(route('admin.berita.destroy', selectedBerita.id), {
            onSuccess: () => {
                toast({
                    title: 'Berhasil',
                    description: 'Berita berhasil dihapus',
                });
                setDeleteDialogOpen(false);
            },
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setData('gambar', e.target.files[0]);
        }
    };

    const handleImageSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!selectedBerita || !data.gambar) return;

        const formData = new FormData();
        formData.append('gambar', data.gambar);
        
        post(route('admin.berita.update-image', selectedBerita.id), {
            onSuccess: () => {
                toast({
                    title: 'Berhasil',
                    description: 'Gambar berita berhasil diperbarui',
                });
                setImageDialogOpen(false);
                reset();
            },
            forceFormData: true,
        });
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        return format(new Date(dateString), 'dd MMMM yyyy', { locale: id });
    };

    // Filter beritas based on search query
    const filteredBeritas = beritas.filter(berita => 
        berita.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
        berita.penulis.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Berita" />
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="flex h-full flex-1 flex-col gap-4 sm:gap-6 p-3 sm:p-6"
            >
                <div className="flex flex-col gap-1 sm:gap-2">
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Manajemen Berita</h1>
                    <p className="text-sm sm:text-base text-muted-foreground">Kelola dan publikasikan berita terbaru dari pemerintah.</p>
                </div>

                <Card className="overflow-hidden border-none shadow-md">
                    <CardHeader className="bg-card pb-4 sm:pb-6 border-b px-3 sm:px-6 pt-3 sm:pt-6">
                        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                            <div>
                                <CardTitle className="text-base sm:text-lg font-semibold">Daftar Berita</CardTitle>
                                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                                    Total {filteredBeritas.length} berita {searchQuery && 'ditemukan'}
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                                    <Input
                                        type="search"
                                        placeholder={isMobile ? "Cari berita..." : "Cari judul atau penulis..."}
                                        className="pl-8 sm:pl-9 h-9 sm:h-10 text-xs sm:text-sm w-full sm:w-64"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <Link href={route('admin.berita.create')}>
                                    <Button className="w-full sm:w-auto h-9 sm:h-10 text-xs sm:text-sm">
                                        <Plus className="mr-1 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                        Tambah Berita
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                                        <TableHead className="w-[180px] sm:w-[240px] text-xs sm:text-sm">Judul</TableHead>
                                        <TableHead className="w-[90px] sm:w-[120px] text-xs sm:text-sm">Gambar</TableHead>
                                        <TableHead className="hidden sm:table-cell w-[120px] sm:w-[150px] text-xs sm:text-sm">Penulis</TableHead>
                                        <TableHead className="hidden md:table-cell w-[120px] sm:w-[150px] text-xs sm:text-sm">Publikasi</TableHead>
                                        <TableHead className="w-[90px] sm:w-[100px] text-xs sm:text-sm">Status</TableHead>
                                        <TableHead className="text-right text-xs sm:text-sm">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredBeritas.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6}>
                                                <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center">
                                                    <FileText className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground/30 mb-2 sm:mb-3" />
                                                    {searchQuery ? (
                                                        <>
                                                            <p className="text-sm sm:text-base text-muted-foreground font-medium">Tidak ada berita ditemukan</p>
                                                            <p className="text-xs sm:text-sm text-muted-foreground/70 mt-1">
                                                                Coba dengan kata kunci lain atau reset pencarian
                                                            </p>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <p className="text-sm sm:text-base text-muted-foreground font-medium">Belum ada berita</p>
                                                            <p className="text-xs sm:text-sm text-muted-foreground/70 mt-1">
                                                                Klik tombol "Tambah Berita" untuk membuat berita baru
                                                            </p>
                                                        </>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredBeritas.map((berita, index) => (
                                            <motion.tr 
                                                key={berita.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.2, delay: index * 0.05 }}
                                                className="group hover:bg-muted/50"
                                            >
                                                <TableCell className="py-2 sm:py-4">
                                                    <div className="font-medium text-xs sm:text-sm truncate max-w-[150px] sm:max-w-[220px]" title={berita.judul}>
                                                        {berita.judul}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground mt-0.5 sm:mt-1 truncate max-w-[150px] sm:max-w-[220px]">
                                                        {isMobile && berita.konten.length > 30
                                                            ? berita.konten.substring(0, 30) + '...'
                                                            : berita.konten.length > 60 
                                                              ? berita.konten.substring(0, 60) + '...' 
                                                              : berita.konten}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-2 sm:py-4">
                                                    <div className="relative h-12 w-18 sm:h-16 sm:w-24 overflow-hidden rounded-md border bg-muted/20">
                                                        {berita.gambar ? (
                                                            <img
                                                                src={berita.gambar}
                                                                alt={berita.judul}
                                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center bg-muted/10">
                                                                <ImagePlus className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground/40" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden sm:table-cell py-2 sm:py-4">
                                                    <div className="flex items-center gap-1 sm:gap-2">
                                                        <div className="bg-primary/10 p-1 sm:p-1.5 rounded-full flex-shrink-0">
                                                            <User className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-primary" />
                                                        </div>
                                                        <span className="text-xs sm:text-sm truncate max-w-[80px] sm:max-w-full">{berita.penulis}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell py-2 sm:py-4">
                                                    <div className="flex items-center gap-1 sm:gap-2">
                                                        <div className="bg-muted p-1 sm:p-1.5 rounded-full flex-shrink-0">
                                                            <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-muted-foreground" />
                                                        </div>
                                                        <span className="text-xs sm:text-sm">{formatDate(berita.tanggal_publikasi)}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-2 sm:py-4">
                                                    <Badge 
                                                        variant="outline" 
                                                        className={cn(
                                                            "flex items-center gap-1 sm:gap-1.5 whitespace-nowrap text-xs px-1.5 sm:px-2.5 py-0 sm:py-0.5 font-normal",
                                                            berita.status === 'Dipublikasi' 
                                                                ? "bg-green-50 text-green-600 border-green-200" 
                                                                : "bg-yellow-50 text-yellow-600 border-yellow-200"
                                                        )}
                                                    >
                                                        {berita.status === 'Dipublikasi' ? (
                                                            <><Eye className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" /> {isMobile ? "Publik" : "Dipublikasi"}</>
                                                        ) : (
                                                            <><EyeOff className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" /> Draf</>
                                                        )}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right py-2 sm:py-4">
                                                    <div className="flex items-center justify-end gap-1 sm:gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => {
                                                                setSelectedBerita(berita);
                                                                setImageDialogOpen(true);
                                                            }}
                                                            className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground hover:text-foreground"
                                                            title="Ganti Gambar"
                                                        >
                                                            <ImagePlus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                                        </Button>
                                                        <Link href={route('admin.berita.edit', berita.id)}>
                                                            <Button 
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground hover:text-foreground"
                                                                title="Edit Berita"
                                                            >
                                                                <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => {
                                                                setSelectedBerita(berita);
                                                                setDeleteDialogOpen(true);
                                                            }}
                                                            className="h-7 w-7 sm:h-8 sm:w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                            title="Hapus Berita"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                                        </Button>
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

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent className="max-w-xs sm:max-w-md p-4 sm:p-6">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-base sm:text-lg">Konfirmasi Hapus Berita</AlertDialogTitle>
                        <AlertDialogDescription className="text-xs sm:text-sm">
                            Apakah Anda yakin ingin menghapus berita ini? Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2 sm:gap-3">
                        <AlertDialogCancel className="text-xs sm:text-sm h-8 sm:h-10">Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteBerita} className="bg-red-600 hover:bg-red-700 text-xs sm:text-sm h-8 sm:h-10">
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Update Image Dialog */}
            <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
                <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto p-4 sm:p-6">
                    <DialogHeader>
                        <DialogTitle className="text-center text-base sm:text-lg">Ganti Gambar Berita</DialogTitle>
                    </DialogHeader>
                    
                    {selectedBerita && (
                        <div className="text-center mb-3 sm:mb-4">
                            <h3 className="font-medium text-sm sm:text-base">{selectedBerita.judul}</h3>
                            <p className="text-xs sm:text-sm text-muted-foreground">Unggah gambar baru untuk berita ini</p>
                        </div>
                    )}
                    
                    <form onSubmit={handleImageSubmit} className="space-y-3 sm:space-y-4">
                        <div className="space-y-2">
                            <div className="border-2 border-dashed rounded-lg p-4 sm:p-6 border-muted-foreground/25 hover:border-muted-foreground/40 transition-colors text-center">
                                <ImagePlus className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-1 sm:mb-2 text-muted-foreground/50" />
                                <Label htmlFor="gambar" className="cursor-pointer text-xs sm:text-sm font-medium">
                                    Klik untuk memilih gambar atau
                                    <br /><span className="text-primary">tarik file kemari</span>
                                </Label>
                                <Input
                                    id="gambar"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    required
                                    className="hidden"
                                />
                                {data.gambar && (
                                    <p className="text-xs mt-1 sm:mt-2 text-muted-foreground">
                                        File terpilih: {data.gambar.name}
                                    </p>
                                )}
                            </div>
                            {errors.gambar && (
                                <p className="text-xs sm:text-sm text-red-500">{errors.gambar}</p>
                            )}
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setImageDialogOpen(false);
                                    reset();
                                }}
                                className="text-xs sm:text-sm h-8 sm:h-10"
                            >
                                Batal
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={processing || !data.gambar}
                                className="text-xs sm:text-sm h-8 sm:h-10"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
