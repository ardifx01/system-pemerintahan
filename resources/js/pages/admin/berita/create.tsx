import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, FileText, Image, Calendar, AlertCircle, Upload, Eye, EyeOff, Loader2 } from 'lucide-react';
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

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manajemen Berita',
        href: '/admin/berita',
    },
    {
        title: 'Tambah Berita',
        href: '/admin/berita/create',
    },
];

export default function Create() {
    const { toast } = useToast();
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    
    // Check if viewport is mobile-sized
    useEffect(() => {
        const checkIfMobile = () => setIsMobile(window.innerWidth < 640);
        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);
        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);
    
    const { data, setData, post, processing, errors, progress } = useForm({
        judul: '',
        konten: '',
        gambar: null as File | null,
        status: 'Draf',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('admin.berita.store'), {
            onSuccess: () => {
                toast({
                    title: 'Berhasil',
                    description: 'Berita berhasil ditambahkan',
                });
            },
            forceFormData: true,
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setData('gambar', file);
            
            // Create image preview
            const reader = new FileReader();
            reader.onload = (event) => {
                setImagePreview(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Berita" />
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="flex h-full flex-1 flex-col gap-4 sm:gap-6 p-3 sm:p-6"
            >
                <div className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Tambah Berita</h1>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">Buat dan publikasikan informasi terbaru untuk masyarakat</p>
                    </div>
                    <Link href={route('admin.berita')}>
                        <Button variant="outline" className="mt-3 sm:mt-0 h-9 sm:h-10 text-xs sm:text-sm">
                            <ArrowLeft className="mr-1 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            Kembali
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                    <Card className="lg:col-span-2 border-none shadow-md">
                        <CardHeader className="bg-card pb-3 sm:pb-4 border-b px-4 sm:px-6 pt-3 sm:pt-4">
                            <div className="flex flex-row items-center gap-1.5 sm:gap-2">
                                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                                <div>
                                    <CardTitle className="text-base sm:text-lg">Konten Berita</CardTitle>
                                    <CardDescription className="text-xs sm:text-sm">Masukkan informasi berita yang akan dipublikasikan</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 sm:p-6">
                            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                                <div className="space-y-1.5 sm:space-y-2">
                                    <Label htmlFor="judul" className="text-sm sm:text-base font-medium">
                                        Judul Berita
                                    </Label>
                                    <Input
                                        id="judul"
                                        value={data.judul}
                                        onChange={(e) => setData('judul', e.target.value)}
                                        placeholder={isMobile ? "Masukkan judul berita" : "Masukkan judul berita yang menarik"}
                                        className={cn("text-sm sm:text-base h-9 sm:h-10", errors.judul ? "border-red-500 focus-visible:ring-red-500" : "")}
                                        required
                                    />
                                    {errors.judul && (
                                        <div className="flex items-center text-red-500 gap-1.5 sm:gap-2 text-xs sm:text-sm mt-1">
                                            <AlertCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                            <p>{errors.judul}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-1.5 sm:space-y-2">
                                    <Label htmlFor="konten" className="text-sm sm:text-base font-medium">
                                        Konten Berita
                                    </Label>
                                    <Textarea
                                        id="konten"
                                        rows={isMobile ? 8 : 10}
                                        value={data.konten}
                                        onChange={(e) => setData('konten', e.target.value)}
                                        placeholder={isMobile ? "Tulis konten berita" : "Tulis konten berita secara detail dan informatif"}
                                        className={cn("text-sm sm:text-base resize-y", errors.konten ? "border-red-500 focus-visible:ring-red-500" : "")}
                                        required
                                    />
                                    {errors.konten && (
                                        <div className="flex items-center text-red-500 gap-1.5 sm:gap-2 text-xs sm:text-sm mt-1">
                                            <AlertCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                            <p>{errors.konten}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-2 sm:pt-4 flex justify-end">
                                    <Button 
                                        type="submit" 
                                        disabled={processing}
                                        className="px-4 sm:px-8 h-9 sm:h-10 text-xs sm:text-sm"
                                        size={isMobile ? "default" : "lg"}
                                    >
                                        {processing ? (
                                            <>
                                                <Loader2 className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                                                Menyimpan...
                                            </>
                                        ) : (
                                            'Simpan Berita'
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        <Card className="border-none shadow-md">
                            <CardHeader className="bg-card pb-3 sm:pb-4 border-b px-4 sm:px-6 pt-3 sm:pt-4">
                                <div className="flex flex-row items-center gap-1.5 sm:gap-2">
                                    <Image className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                                    <div>
                                        <CardTitle className="text-base sm:text-lg">Gambar Berita</CardTitle>
                                        <CardDescription className="text-xs sm:text-sm">Unggah gambar untuk ilustrasi berita</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 sm:p-6">
                                <div className="space-y-3 sm:space-y-4">
                                    <div 
                                        className={cn(
                                            "border-2 border-dashed rounded-lg p-4 sm:p-6 transition-colors text-center",
                                            errors.gambar ? "border-red-300 bg-red-50" : "border-muted-foreground/25 hover:border-muted-foreground/40"
                                        )}
                                    >
                                        {imagePreview ? (
                                            <div className="space-y-3 sm:space-y-4">
                                                <div className="relative aspect-video rounded-md overflow-hidden border mx-auto">
                                                    <img 
                                                        src={imagePreview} 
                                                        alt="Preview" 
                                                        className="object-cover w-full h-full"
                                                    />
                                                </div>
                                                <div className="flex flex-col">
                                                    <p className="text-xs sm:text-sm text-muted-foreground truncate">
                                                        {data.gambar?.name}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground/70">
                                                        {data.gambar ? (data.gambar.size / 1024 / 1024).toFixed(2) + ' MB' : ''}
                                                    </p>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        setData('gambar', null);
                                                        setImagePreview(null);
                                                    }}
                                                    className="text-xs sm:text-sm h-7 sm:h-8"
                                                >
                                                    Ganti Gambar
                                                </Button>
                                            </div>
                                        ) : (
                                            <>
                                                <Upload className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-1.5 sm:mb-2 text-muted-foreground/50" />
                                                <Label htmlFor="gambar" className="cursor-pointer text-xs sm:text-sm font-medium">
                                                    {isMobile ? "Pilih gambar" : "Klik untuk memilih gambar atau"}
                                                    {!isMobile && <br />}<span className="text-primary">{isMobile ? " atau tarik file" : "tarik file kemari"}</span>
                                                </Label>
                                                <Input
                                                    id="gambar"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                />
                                                <p className="text-xs text-muted-foreground mt-1 sm:mt-2">
                                                    PNG, JPG atau JPEG (Maks. 5MB)
                                                </p>
                                            </>
                                        )}
                                    </div>
                                    
                                    {progress && (
                                        <div className="space-y-1 sm:space-y-2">
                                            <div className="flex justify-between text-xs">
                                                <span>Mengunggah</span>
                                                <span>{progress.percentage}%</span>
                                            </div>
                                            <div className="w-full bg-muted rounded-full h-1.5 sm:h-2">
                                                <div
                                                    className="bg-primary h-1.5 sm:h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${progress.percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}

                                    {errors.gambar && (
                                        <div className="flex items-center text-red-500 gap-1.5 sm:gap-2 text-xs sm:text-sm">
                                            <AlertCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                            <p>{errors.gambar}</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-md">
                            <CardHeader className="bg-card pb-3 sm:pb-4 border-b px-4 sm:px-6 pt-3 sm:pt-4">
                                <div className="flex flex-row items-center gap-1.5 sm:gap-2">
                                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                                    <div>
                                        <CardTitle className="text-base sm:text-lg">Status Publikasi</CardTitle>
                                        <CardDescription className="text-xs sm:text-sm">Tentukan kapan berita akan dipublikasikan</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 sm:p-6">
                                <div className="space-y-3 sm:space-y-4">
                                    <div className="space-y-1.5 sm:space-y-2">
                                        <Label htmlFor="status" className="text-sm sm:text-base font-medium">Status</Label>
                                        <Select
                                            value={data.status}
                                            onValueChange={(value) => setData('status', value)}
                                        >
                                            <SelectTrigger 
                                                id="status"
                                                className={cn("h-9 sm:h-10 text-xs sm:text-sm", errors.status ? "border-red-500 focus:ring-red-500" : "")}
                                            >
                                                <SelectValue placeholder="Pilih status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Draf" className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                                                    <div className="flex items-center gap-1.5 sm:gap-2">
                                                        <EyeOff className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                                        <span>Simpan sebagai Draf</span>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="Dipublikasi" className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                                                    <div className="flex items-center gap-1.5 sm:gap-2">
                                                        <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                                        <span>Publikasikan Sekarang</span>
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.status && (
                                            <div className="flex items-center text-red-500 gap-1.5 sm:gap-2 text-xs sm:text-sm mt-1">
                                                <AlertCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                                <p>{errors.status}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="pt-1 sm:pt-2">
                                        <div className={cn(
                                            "p-3 sm:p-4 rounded-lg", 
                                            data.status === 'Draf' 
                                                ? "bg-yellow-50 border border-yellow-200" 
                                                : "bg-green-50 border border-green-200"
                                        )}>
                                            <div className="flex items-start gap-2 sm:gap-3">
                                                {data.status === 'Draf' ? (
                                                    <>
                                                        <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                                                        <div>
                                                            <h4 className="font-medium text-yellow-700 text-sm sm:text-base">{isMobile ? "Draf" : "Disimpan sebagai Draf"}</h4>
                                                            <p className="text-xs sm:text-sm text-yellow-700/90 mt-0.5 sm:mt-1">
                                                                {isMobile ? "Tidak ditampilkan sampai dipublikasikan" : "Berita tidak akan ditampilkan di halaman publik sampai status diubah menjadi \"Dipublikasi\"."}  
                                                            </p>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                                        <div>
                                                            <h4 className="font-medium text-green-700 text-sm sm:text-base">{isMobile ? "Publik" : "Langsung Dipublikasikan"}</h4>
                                                            <p className="text-xs sm:text-sm text-green-700/90 mt-0.5 sm:mt-1">
                                                                {isMobile ? "Langsung tampil untuk publik" : "Berita akan langsung tampil di halaman publik setelah berhasil disimpan."}
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
                    </div>
                </div>
            </motion.div>
        </AppLayout>
    );
}
