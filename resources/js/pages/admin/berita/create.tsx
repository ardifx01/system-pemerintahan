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
import { useState } from 'react';

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
                className="flex h-full flex-1 flex-col gap-6 p-6"
            >
                <div className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Tambah Berita</h1>
                        <p className="text-muted-foreground mt-1">Buat dan publikasikan informasi terbaru untuk masyarakat</p>
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
                                    <CardTitle className="text-lg">Konten Berita</CardTitle>
                                    <CardDescription>Masukkan informasi berita yang akan dipublikasikan</CardDescription>
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

                                <div className="pt-4 flex justify-end">
                                    <Button 
                                        type="submit" 
                                        disabled={processing}
                                        className="px-8"
                                        size="lg"
                                    >
                                        {processing ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
                            <CardHeader className="bg-card pb-4 border-b">
                                <div className="flex flex-row items-center gap-2">
                                    <Image className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <CardTitle className="text-lg">Gambar Berita</CardTitle>
                                        <CardDescription>Unggah gambar untuk ilustrasi berita</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    <div 
                                        className={cn(
                                            "border-2 border-dashed rounded-lg p-6 transition-colors text-center",
                                            errors.gambar ? "border-red-300 bg-red-50" : "border-muted-foreground/25 hover:border-muted-foreground/40"
                                        )}
                                    >
                                        {imagePreview ? (
                                            <div className="space-y-4">
                                                <div className="relative aspect-video rounded-md overflow-hidden border mx-auto">
                                                    <img 
                                                        src={imagePreview} 
                                                        alt="Preview" 
                                                        className="object-cover w-full h-full"
                                                    />
                                                </div>
                                                <div className="flex flex-col">
                                                    <p className="text-sm text-muted-foreground truncate">
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
                                                >
                                                    Ganti Gambar
                                                </Button>
                                            </div>
                                        ) : (
                                            <>
                                                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                                                <Label htmlFor="gambar" className="cursor-pointer text-sm font-medium">
                                                    Klik untuk memilih gambar atau
                                                    <br /><span className="text-primary">tarik file kemari</span>
                                                </Label>
                                                <Input
                                                    id="gambar"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                />
                                                <p className="text-xs text-muted-foreground mt-2">
                                                    PNG, JPG atau JPEG (Maks. 5MB)
                                                </p>
                                            </>
                                        )}
                                    </div>
                                    
                                    {progress && (
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs">
                                                <span>Mengunggah</span>
                                                <span>{progress.percentage}%</span>
                                            </div>
                                            <div className="w-full bg-muted rounded-full h-2">
                                                <div
                                                    className="bg-primary h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${progress.percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}

                                    {errors.gambar && (
                                        <div className="flex items-center text-red-500 gap-2 text-sm">
                                            <AlertCircle className="h-4 w-4" />
                                            <p>{errors.gambar}</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-md">
                            <CardHeader className="bg-card pb-4 border-b">
                                <div className="flex flex-row items-center gap-2">
                                    <Calendar className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <CardTitle className="text-lg">Status Publikasi</CardTitle>
                                        <CardDescription>Tentukan kapan berita akan dipublikasikan</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="status" className="text-base font-medium">Status</Label>
                                        <Select
                                            value={data.status}
                                            onValueChange={(value) => setData('status', value)}
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
                                                            <h4 className="font-medium text-green-700">Langsung Dipublikasikan</h4>
                                                            <p className="text-sm text-green-700/90 mt-1">
                                                                Berita akan langsung tampil di halaman publik setelah berhasil disimpan.
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
