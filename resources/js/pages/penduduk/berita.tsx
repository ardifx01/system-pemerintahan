import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Calendar, User, Search, Newspaper, ArrowRight, ChevronRight, Clock, BookOpen, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Berita Pemerintahan',
        href: '/penduduk/berita',
    },
];

interface Berita {
    id: number;
    judul: string;
    konten: string;
    gambar: string | null;
    penulis: string;
    tanggal_publikasi: string | null;
}

interface BeritaPageProps {
    beritas: Berita[];
}

export default function Berita({ beritas }: BeritaPageProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredBeritas, setFilteredBeritas] = useState<Berita[]>(beritas);
    const [displayCount, setDisplayCount] = useState(6);
    const [showLoadMore, setShowLoadMore] = useState(beritas.length > 6);

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        return format(new Date(dateString), 'dd MMMM yyyy', { locale: id });
    };

    const getRelativeTime = (dateString: string | null) => {
        if (!dateString) return '-';
        
        const now = new Date();
        const date = new Date(dateString);
        const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffInDays === 0) return 'Hari ini';
        if (diffInDays === 1) return 'Kemarin';
        if (diffInDays < 7) return `${diffInDays} hari yang lalu`;
        if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} minggu yang lalu`;
        if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} bulan yang lalu`;
        return `${Math.floor(diffInDays / 365)} tahun yang lalu`;
    };

    useEffect(() => {
        const filtered = beritas.filter(berita => 
            berita.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
            berita.penulis.toLowerCase().includes(searchQuery.toLowerCase()) ||
            berita.konten.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredBeritas(filtered);
        setShowLoadMore(filtered.length > displayCount);
    }, [searchQuery, beritas, displayCount]);

    const loadMore = () => {
        setDisplayCount(prev => prev + 6);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Berita Pemerintahan" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-700 to-blue-900 p-8 text-white">
                    <div className="absolute inset-0 bg-[url('/assets/pattern-bg.png')] opacity-10"></div>
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="relative z-10 max-w-2xl"
                    >
                        <h1 className="text-3xl font-bold tracking-tight mb-3">Berita Pemerintahan</h1>
                        <p className="text-blue-100 text-lg">Informasi terbaru dari pemerintah untuk masyarakat.</p>
                    </motion.div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-auto md:min-w-[320px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Cari berita..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="text-sm text-muted-foreground w-full md:w-auto text-center md:text-right">
                        Menampilkan {Math.min(displayCount, filteredBeritas.length)} dari {filteredBeritas.length} berita
                    </div>
                </div>

                {filteredBeritas.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-center py-16 bg-muted/30 rounded-lg"
                    >
                        {searchQuery ? (
                            <>
                                <AlertTriangle className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                                <h3 className="text-lg font-medium">Tidak ada berita ditemukan</h3>
                                <p className="text-muted-foreground mt-2">
                                    Tidak ditemukan berita dengan kata kunci "{searchQuery}". <br />
                                    Coba dengan kata kunci lain atau kosongkan pencarian.
                                </p>
                            </>
                        ) : (
                            <>
                                <Newspaper className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                                <h3 className="text-lg font-medium">Belum ada berita</h3>
                                <p className="text-muted-foreground mt-2">Silakan kunjungi halaman ini di lain waktu untuk melihat berita terbaru.</p>
                            </>
                        )}
                    </motion.div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {filteredBeritas.slice(0, displayCount).map((berita, index) => (
                            <motion.div
                                key={berita.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Card className="overflow-hidden flex flex-col h-full group hover:shadow-md transition-all duration-300 border-muted/60">
                                    {berita.gambar ? (
                                        <div className="aspect-video w-full overflow-hidden relative">
                                            <img
                                                src={berita.gambar}
                                                alt={berita.judul}
                                                className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                                            />
                                            <div className="absolute bottom-0 right-0 m-3">
                                                <Badge variant="outline" className="bg-black/50 backdrop-blur-sm text-white border-none px-2 py-1 text-xs">
                                                    <Clock className="mr-1 h-3 w-3" />
                                                    {getRelativeTime(berita.tanggal_publikasi)}
                                                </Badge>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="aspect-video w-full bg-muted/30 flex items-center justify-center">
                                            <Newspaper className="h-8 w-8 text-muted-foreground/40" />
                                        </div>
                                    )}
                                    <CardHeader className="pb-2">
                                        <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors duration-200">
                                            {berita.judul}
                                        </CardTitle>
                                        <CardDescription className="flex items-center space-x-4 mt-2">
                                            <span className="flex items-center text-xs">
                                                <Calendar className="mr-1 h-3 w-3" />
                                                {formatDate(berita.tanggal_publikasi)}
                                            </span>
                                            <span className="flex items-center text-xs">
                                                <User className="mr-1 h-3 w-3" />
                                                {berita.penulis}
                                            </span>
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-grow pb-2">
                                        <div className="line-clamp-3 text-sm text-muted-foreground">
                                            {berita.konten}
                                        </div>
                                    </CardContent>
                                    <CardFooter className="pt-2">
                                        <Link href={route('penduduk.berita.show', berita.id)} className="w-full">
                                            <Button 
                                                variant="outline" 
                                                className="w-full group-hover:bg-primary group-hover:text-white transition-colors duration-200 flex items-center justify-center gap-1"
                                            >
                                                <BookOpen className="h-4 w-4 mr-1" />
                                                Baca Selengkapnya
                                                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        </Link>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {showLoadMore && (
                    <div className="flex justify-center mt-6">
                        <Button 
                            variant="outline" 
                            onClick={loadMore} 
                            className="min-w-[200px]"
                        >
                            <ArrowRight className="mr-2 h-4 w-4" />
                            Muat Berita Lainnya
                        </Button>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}