import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { format, formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import { Calendar, User, Clock, Share2, Printer, BookOpen, ChevronLeft, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface Berita {
    id: number;
    judul: string;
    konten: string;
    gambar: string | null;
    penulis: string;
    tanggal_publikasi: string | null;
}

interface BeritaDetailProps {
    berita: Berita;
}

export default function BeritaDetail({ berita }: BeritaDetailProps) {
    const [readingTime, setReadingTime] = useState<number>(0);
    const [scrollProgress, setScrollProgress] = useState<number>(0);
    
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Berita Pemerintahan',
            href: '/penduduk/berita',
        },
        {
            title: berita.judul,
            href: `/penduduk/berita/${berita.id}`,
        },
    ];

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        return format(new Date(dateString), 'dd MMMM yyyy', { locale: id });
    };
    
    const getRelativeTime = (dateString: string | null) => {
        if (!dateString) return '-';
        try {
            return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: id });
        } catch {
            return '-';
        }
    };
    
    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: berita.judul,
                text: 'Lihat berita ini dari Pemerintahan!',
                url: window.location.href,
            })
            .catch(() => console.log('Error sharing:'));
        } else {
            // Fallback - copy to clipboard
            navigator.clipboard.writeText(window.location.href)
                .then(() => alert('Link berita berhasil disalin!'))
                .catch(() => console.error('Gagal menyalin link: '));
        }
    };
    
    const handlePrint = () => {
        window.print();
    };
    
    useEffect(() => {
        // Calculate reading time (average 200 words per minute)
        const wordCount = berita.konten.trim().split(/\s+/).length;
        const time = Math.ceil(wordCount / 200);
        setReadingTime(time);
        
        // Scroll progress
        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const progress = (window.scrollY / totalHeight) * 100;
            setScrollProgress(progress);
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [berita.konten]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={berita.judul} />
            
            {/* Reading progress bar */}
            <div 
                className="fixed top-0 left-0 right-0 h-1 bg-primary z-50 print:hidden"
                style={{ width: `${scrollProgress}%` }}
            />
            
            <div className="container max-w-4xl mx-auto px-4 py-8">
                <div className="mb-8 print:hidden">
                    <Link href={route('penduduk.berita')}>
                        <Button variant="outline" size="sm" className="group transition-all duration-300 hover:bg-primary hover:text-white">
                            <ChevronLeft className="mr-1 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                            Kembali ke Daftar Berita
                        </Button>
                    </Link>
                </div>

                <motion.article 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-background rounded-xl border shadow-md overflow-hidden print:shadow-none print:border-none"
                >
                    {berita.gambar ? (
                        <div className="relative w-full h-[250px] sm:h-[350px] md:h-[450px] overflow-hidden">
                            <motion.img
                                initial={{ scale: 1.1 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 1.5 }}
                                src={berita.gambar}
                                alt={berita.judul}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-6">
                                <div className="space-y-2">
                                    <Badge variant="secondary" className="bg-primary/90 text-white border-none">
                                        Berita Pemerintahan
                                    </Badge>
                                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white drop-shadow-md">
                                        {berita.judul}
                                    </h1>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="py-8 px-6">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">{berita.judul}</h1>
                        </div>
                    )}

                    <div className="p-6 md:p-8">
                        {!berita.gambar && (
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">{berita.judul}</h1>
                        )}
                        
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-muted-foreground mb-6">
                            <div className="flex flex-wrap items-center gap-4">
                                <div className="flex items-center">
                                    <Calendar className="mr-2 h-4 w-4" />
                                    <span>{formatDate(berita.tanggal_publikasi)}</span>
                                    <span className="text-xs ml-2 text-muted-foreground">({getRelativeTime(berita.tanggal_publikasi)})</span>
                                </div>
                                <div className="flex items-center">
                                    <User className="mr-2 h-4 w-4" />
                                    <span>{berita.penulis}</span>
                                </div>
                                <div className="flex items-center">
                                    <Clock className="mr-2 h-4 w-4" />
                                    <span>{readingTime} menit baca</span>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2 print:hidden">
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={handleShare}
                                    className="flex items-center gap-1"
                                >
                                    <Share2 className="h-4 w-4" />
                                    <span className="hidden sm:inline">Bagikan</span>
                                </Button>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={handlePrint}
                                    className="flex items-center gap-1"
                                >
                                    <Printer className="h-4 w-4" />
                                    <span className="hidden sm:inline">Cetak</span>
                                </Button>
                            </div>
                        </div>
                        
                        <Separator className="my-6" />
                        
                        <div className="prose prose-lg max-w-none">
                            {berita.konten.split('\n').map((paragraph, index) => (
                                paragraph.trim() === '' ? (
                                    <div key={index} className="h-4" />
                                ) : (
                                    <p key={index} className={cn(
                                        "mb-6 text-base leading-relaxed",
                                        index === 0 && "first-letter:text-4xl first-letter:font-bold first-letter:mr-1 first-letter:float-left first-letter:leading-none"
                                    )}>
                                        {paragraph}
                                    </p>
                                )
                            ))}
                        </div>
                        
                        <Separator className="my-8" />
                        
                        <div className="flex justify-between items-center print:hidden">
                            <div className="text-sm text-muted-foreground flex items-center gap-2">
                                <Eye className="h-4 w-4" />
                                <span>Berita Pemerintahan</span>
                            </div>
                            
                            <Link href={route('penduduk.berita')}>
                                <Button variant="outline" size="sm" className="group transition-all duration-300">
                                    <BookOpen className="mr-2 h-4 w-4" />
                                    Lihat Berita Lainnya
                                </Button>
                            </Link>
                        </div>
                    </div>
                </motion.article>
            </div>
        </AppLayout>
    );
}
