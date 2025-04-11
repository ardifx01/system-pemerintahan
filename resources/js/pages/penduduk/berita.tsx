import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Calendar, User, Search, Newspaper, ArrowRight, ChevronRight, Clock, BookOpen, AlertTriangle, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

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
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('semua');

    // Format functions
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

    // Get latest news
    const getLatestNews = () => {
        return [...beritas].sort((a, b) => {
            const dateA = a.tanggal_publikasi ? new Date(a.tanggal_publikasi).getTime() : 0;
            const dateB = b.tanggal_publikasi ? new Date(b.tanggal_publikasi).getTime() : 0;
            return dateB - dateA;
        });
    };

    // Filter news based on search and active tab
    useEffect(() => {
        setIsLoading(true);
        
        // Apply base filtering based on search query
        let filtered = beritas.filter(berita => 
            berita.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
            berita.penulis.toLowerCase().includes(searchQuery.toLowerCase()) ||
            berita.konten.toLowerCase().includes(searchQuery.toLowerCase())
        );

        // Apply tab filtering
        if (activeTab === 'terbaru') {
            filtered = [...filtered].sort((a, b) => {
                const dateA = a.tanggal_publikasi ? new Date(a.tanggal_publikasi).getTime() : 0;
                const dateB = b.tanggal_publikasi ? new Date(b.tanggal_publikasi).getTime() : 0;
                return dateB - dateA;
            }).slice(0, 10);
        }
        
        setFilteredBeritas(filtered);
        setShowLoadMore(filtered.length > displayCount);
        
        // Simulate loading state for better UX
        setTimeout(() => {
            setIsLoading(false);
        }, 300);
    }, [searchQuery, beritas, displayCount, activeTab]);

    const loadMore = () => {
        setIsLoading(true);
        setTimeout(() => {
            setDisplayCount(prev => prev + 6);
            setIsLoading(false);
        }, 300);
    };

    // Get featured news (first item if available)
    const featuredNews = beritas.length > 0 ? getLatestNews()[0] : null;

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    function renderNewsContent() {
        if (isLoading) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, index) => (
                        <Card key={index} className="overflow-hidden flex flex-col h-full">
                            <div className="aspect-video w-full bg-muted/50 animate-pulse" />
                            <CardHeader className="pb-2">
                                <Skeleton className="h-6 w-3/4 mb-2" />
                                <Skeleton className="h-4 w-1/2" />
                            </CardHeader>
                            <CardContent className="pb-2">
                                <Skeleton className="h-4 w-full mb-2" />
                                <Skeleton className="h-4 w-full mb-2" />
                                <Skeleton className="h-4 w-3/4" />
                            </CardContent>
                            <CardFooter>
                                <Skeleton className="h-10 w-full" />
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            );
        }

        if (filteredBeritas.length === 0) {
            return (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center py-16 bg-muted/30 rounded-lg"
                >
                    {searchQuery ? (
                        <>
                            <AlertTriangle className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                            <h3 className="text-lg font-medium">Tidak ada berita ditemukan</h3>
                            <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
                                Tidak ditemukan berita dengan kata kunci "<span className="font-medium">{searchQuery}</span>". <br />
                                Coba dengan kata kunci lain atau <Button variant="link" onClick={() => setSearchQuery('')} className="p-0 h-auto font-medium">kosongkan pencarian</Button>.
                            </p>
                        </>
                    ) : (
                        <>
                            <Newspaper className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                            <h3 className="text-lg font-medium">Belum ada berita</h3>
                            <p className="text-muted-foreground mt-2">Silakan kunjungi halaman ini di lain waktu untuk melihat berita terbaru.</p>
                        </>
                    )}
                </motion.div>
            );
        }

        return (
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                {filteredBeritas.slice(0, displayCount).map((berita) => (
                    <motion.div
                        key={berita.id}
                        variants={itemVariants}
                        className="h-full"
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
                                <div className="aspect-video w-full bg-muted/30 flex items-center justify-center relative">
                                    <Newspaper className="h-8 w-8 text-muted-foreground/40" />
                                    <div className="absolute bottom-0 right-0 m-3">
                                        <Badge variant="outline" className="bg-black/50 backdrop-blur-sm text-white border-none px-2 py-1 text-xs">
                                            <Clock className="mr-1 h-3 w-3" />
                                            {getRelativeTime(berita.tanggal_publikasi)}
                                        </Badge>
                                    </div>
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
                                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 flex items-center justify-center gap-1 overflow-hidden relative"
                                    >
                                        <BookOpen className="h-4 w-4 mr-1 group-hover:scale-110 transition-transform duration-300 relative z-10" />
                                        <span className="relative z-10">Baca Selengkapnya</span>
                                        <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300 ease-in-out relative z-10" />
                                        <span className="absolute inset-0 bg-primary scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 -z-0"></span>
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Berita Pemerintahan" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Hero Section with Featured News */}
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-800 to-blue-950 shadow-lg">
                    <div className="absolute inset-0 bg-[url('/assets/pattern-bg.png')] opacity-10"></div>
                    
                    <div className="relative flex flex-col lg:flex-row gap-6 p-6 md:p-8">
                        {/* Hero Text */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="relative z-10 lg:w-1/2 lg:pr-6"
                        >
                            <div className="inline-flex items-center mb-4 px-3 py-1 rounded-full bg-blue-700/40 text-blue-100 text-sm">
                                <Newspaper className="h-4 w-4 mr-2" />
                                <span>Portal Berita Resmi</span>
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight mb-3 text-white">Berita Pemerintahan</h1>
                            <p className="text-blue-100 text-lg mb-6">
                                Dapatkan informasi terbaru dari pemerintah untuk masyarakat. Tetap terinformasi dengan berita terkini tentang kebijakan, program, dan kegiatan pemerintah.
                            </p>
                            <div className="relative max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Cari berita berdasarkan judul, penulis, atau konten..."
                                    className="pl-10 bg-white/10 text-white placeholder:text-blue-200/70 border-blue-700/30 focus:border-blue-400"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </motion.div>

                        {/* Featured News Card */}
                        {featuredNews && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="relative z-10 lg:w-1/2 self-center"
                            >
                                <div className="flex flex-col md:flex-row bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-blue-700/20 h-full">
                                    {featuredNews.gambar ? (
                                        <div className="md:w-2/5 overflow-hidden">
                                            <img
                                                src={featuredNews.gambar}
                                                alt={featuredNews.judul}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="md:w-2/5 bg-blue-900/50 flex items-center justify-center p-6">
                                            <Newspaper className="h-12 w-12 text-blue-300/70" />
                                        </div>
                                    )}
                                    <div className="md:w-3/5 p-5 flex flex-col justify-between">
                                        <div>
                                            <Badge variant="outline" className="bg-blue-700/40 text-blue-100 border-none mb-3">
                                                Berita Terbaru
                                            </Badge>
                                            <h3 className="text-xl font-semibold text-white mb-2 line-clamp-2">
                                                {featuredNews.judul}
                                            </h3>
                                            <p className="text-blue-100 line-clamp-2 mb-3 text-sm">
                                                {featuredNews.konten}
                                            </p>
                                        </div>
                                        <div>
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="flex items-center text-xs text-blue-200">
                                                    <Calendar className="mr-1 h-3 w-3" />
                                                    {formatDate(featuredNews.tanggal_publikasi)}
                                                </span>
                                                <span className="flex items-center text-xs text-blue-200">
                                                    <User className="mr-1 h-3 w-3" />
                                                    {featuredNews.penulis}
                                                </span>
                                            </div>
                                            <Link href={route('penduduk.berita.show', featuredNews.id)} className="w-full">
                                                <Button 
                                                    className="w-full bg-blue-700 hover:bg-blue-600 text-white dark:text-primary-foreground transition-all duration-300 flex items-center justify-center gap-1 relative overflow-hidden group"
                                                >
                                                    <BookOpen className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300 relative z-10" />
                                                    <span className="relative z-10">Baca Selengkapnya</span>
                                                    <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 ease-in-out relative z-10" />
                                                    <span className="absolute inset-0 bg-blue-600 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 -z-0"></span>
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* News Filtering & Categories */}
                <div className="flex flex-col space-y-4">
                    <Tabs defaultValue="semua" onValueChange={setActiveTab} className="w-full">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                            <TabsList className="bg-blue-50 p-1 border border-blue-200">
                                <TabsTrigger 
                                    value="semua" 
                                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:text-blue-700 data-[state=inactive]:bg-transparent"
                                >
                                    <Newspaper className="h-4 w-4 mr-2" />
                                    Semua Berita
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="terbaru"
                                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:text-blue-700 data-[state=inactive]:bg-transparent"
                                >
                                    <Clock className="h-4 w-4 mr-2" />
                                    Terbaru
                                </TabsTrigger>
                            </TabsList>
                            
                            <div className="text-sm text-muted-foreground w-full sm:w-auto text-center sm:text-right">
                                {!isLoading ? (
                                    <span>Menampilkan {Math.min(displayCount, filteredBeritas.length)} dari {filteredBeritas.length} berita</span>
                                ) : (
                                    <span>Memuat berita...</span>
                                )}
                            </div>
                        </div>

                        <TabsContent value="semua" className="m-0">
                            {renderNewsContent()}
                        </TabsContent>
                        
                        <TabsContent value="terbaru" className="m-0">
                            {renderNewsContent()}
                        </TabsContent>
                    </Tabs>
                </div>

                {showLoadMore && (
                    <div className="flex justify-center mt-6">
                        <Button 
                            variant="outline" 
                            onClick={loadMore} 
                            className="min-w-[200px]"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                    Memuat...
                                </>
                            ) : (
                                <>
                                    <ArrowRight className="mr-2 h-4 w-4" />
                                    Muat Berita Lainnya
                                </>
                            )}
                        </Button>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}