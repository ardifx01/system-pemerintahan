import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, FileText, Calendar, AlertCircle, Eye, EyeOff, Loader2, RefreshCw, Check } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

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

interface EditProps {
    berita: Berita;
}

export default function Edit({ berita }: EditProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Manajemen Berita',
            href: '/admin/berita',
        },
        {
            title: 'Edit Berita',
            href: `/admin/berita/${berita.id}/edit`,
        },
    ];

    const { toast } = useToast();
    const [isChanged, setIsChanged] = useState(false);
    const { data, setData, put, processing, errors } = useForm({
        judul: berita.judul,
        konten: berita.konten,
        status: berita.status,
    });

    useEffect(() => {
        const hasChanges = 
            data.judul !== berita.judul || 
            data.konten !== berita.konten || 
            data.status !== berita.status;
        
        setIsChanged(hasChanges);
    }, [data, berita]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        put(route('admin.berita.update', berita.id), {
            onSuccess: () => {
                toast({
                    title: 'Berhasil',
                    description: 'Berita berhasil diperbarui',
                });
                setIsChanged(false);
            },
        });
    };

    const resetForm = () => {
        setData({
            judul: berita.judul,
            konten: berita.konten,
            status: berita.status,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Berita" />
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="flex h-full flex-1 flex-col gap-6 p-6"
            >
                <div className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Edit Berita</h1>
                        <p className="text-muted-foreground mt-1">Perbarui informasi dan status publikasi berita</p>
                    </div>
                    <Link href={route('admin.berita')}>
                        <Button variant="outline" className="mt-4 sm:mt-0">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2 border-none shadow-md">
                        <CardHeader className="bg-card pb-4 border-b">
                            <div className="flex flex-row items-center gap-2">
                                <FileText className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <CardTitle className="text-lg">Edit Konten Berita</CardTitle>
                                    <CardDescription>Perbarui informasi berita yang telah dipublikasikan</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="judul" className="text-base font-medium">
                                        Judul Berita
                                    </Label>
                                    <Input
                                        id="judul"
                                        value={data.judul}
                                        onChange={(e) => setData('judul', e.target.value)}
                                        placeholder="Masukkan judul berita yang menarik"
                                        className={cn("text-base", errors.judul ? "border-red-500 focus-visible:ring-red-500" : "")}
                                        required
                                    />
                                    {errors.judul && (
                                        <div className="flex items-center text-red-500 gap-2 text-sm mt-1">
                                            <AlertCircle className="h-4 w-4" />
                                            <p>{errors.judul}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="konten" className="text-base font-medium">
                                        Konten Berita
                                    </Label>
                                    <Textarea
                                        id="konten"
                                        rows={10}
                                        value={data.konten}
                                        onChange={(e) => setData('konten', e.target.value)}
                                        placeholder="Tulis konten berita secara detail dan informatif"
                                        className={cn("text-base resize-y", errors.konten ? "border-red-500 focus-visible:ring-red-500" : "")}
                                        required
                                    />
                                    {errors.konten && (
                                        <div className="flex items-center text-red-500 gap-2 text-sm mt-1">
                                            <AlertCircle className="h-4 w-4" />
                                            <p>{errors.konten}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-4 flex flex-col sm:flex-row justify-between gap-3">
                                    <Button 
                                        type="button" 
                                        variant="outline"
                                        onClick={resetForm}
                                        disabled={processing || !isChanged}
                                        className="order-2 sm:order-1"
                                    >
                                        <RefreshCw className="mr-2 h-4 w-4" />
                                        Reset Perubahan
                                    </Button>
                                    
                                    <Button 
                                        type="submit" 
                                        disabled={processing || !isChanged}
                                        className="px-8 order-1 sm:order-2"
                                        size="lg"
                                    >
                                        {processing ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Menyimpan...
                                            </>
                                        ) : (
                                            <>
                                                <Check className="mr-2 h-4 w-4" />
                                                Perbarui Berita
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        <Card className="border-none shadow-md">
                            <CardHeader className="bg-card pb-4 border-b">
                                <div className="flex flex-row items-center gap-2">
                                    <Calendar className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <CardTitle className="text-lg">Status Publikasi</CardTitle>
                                        <CardDescription>Informasi publikasi dan status berita</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-6">
                                    <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                                        <div className="space-y-1">
                                            <p className="text-sm text-muted-foreground">ID Berita</p>
                                            <p className="font-medium">{berita.id}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm text-muted-foreground">Penulis</p>
                                            <p className="font-medium">{berita.penulis}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm text-muted-foreground">Tanggal Publikasi</p>
                                            <p className="font-medium">{berita.tanggal_publikasi || 'Belum dipublikasikan'}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="status" className="text-base font-medium">Status Berita</Label>
                                        <Select
                                            value={data.status}
                                            onValueChange={(value: 'Dipublikasi' | 'Draf') => setData('status', value)}
                                        >
                                            <SelectTrigger 
                                                id="status"
                                                className={cn(errors.status ? "border-red-500 focus:ring-red-500" : "")}
                                            >
                                                <SelectValue placeholder="Pilih status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Draf" className="flex items-center gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <EyeOff className="h-4 w-4" />
                                                        <span>Simpan sebagai Draf</span>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="Dipublikasi" className="flex items-center gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <Eye className="h-4 w-4" />
                                                        <span>Publikasikan Sekarang</span>
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.status && (
                                            <div className="flex items-center text-red-500 gap-2 text-sm mt-1">
                                                <AlertCircle className="h-4 w-4" />
                                                <p>{errors.status}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="pt-2">
                                        <div className={cn(
                                            "p-4 rounded-lg", 
                                            data.status === 'Draf' 
                                                ? "bg-yellow-50 border border-yellow-200" 
                                                : "bg-green-50 border border-green-200"
                                        )}>
                                            <div className="flex items-start gap-3">
                                                {data.status === 'Draf' ? (
                                                    <>
                                                        <EyeOff className="h-5 w-5 text-yellow-600 mt-0.5" />
                                                        <div>
                                                            <h4 className="font-medium text-yellow-700">Disimpan sebagai Draf</h4>
                                                            <p className="text-sm text-yellow-700/90 mt-1">
                                                                Berita tidak akan ditampilkan di halaman publik sampai status diubah menjadi "Dipublikasi".
                                                            </p>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Eye className="h-5 w-5 text-green-600 mt-0.5" />
                                                        <div>
                                                            <h4 className="font-medium text-green-700">Dipublikasikan</h4>
                                                            <p className="text-sm text-green-700/90 mt-1">
                                                                Berita akan tampil di halaman publik setelah perubahan disimpan.
                                                            </p>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {berita.gambar && (
                            <Card className="border-none shadow-md overflow-hidden">
                                <CardHeader className="bg-card pb-4 border-b">
                                    <CardTitle className="text-lg">Gambar Berita</CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="aspect-video w-full relative overflow-hidden">
                                        <img 
                                            src={berita.gambar} 
                                            alt={berita.judul}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="p-4 text-center">
                                        <p className="text-sm text-muted-foreground">
                                            Untuk mengubah gambar, gunakan tombol "Ganti Gambar" di halaman daftar berita
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </motion.div>
        </AppLayout>
    );
}
