// External library imports
import { useEffect, useState, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import { format, formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';

// Icons
import { 
  Calendar, User, Clock, Share2, Printer, 
  BookOpen, ChevronLeft, Eye, Facebook, 
  Twitter, Bookmark, ThumbsUp 
} from 'lucide-react';

// Layout & UI components
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Utilities
import { cn } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';

// Types
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
  // State management
  const [readingTime, setReadingTime] = useState<number>(0);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [showImageViewer, setShowImageViewer] = useState<boolean>(false);
  const [currentParagraph, setCurrentParagraph] = useState<number>(0);
  
  // References
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Breadcrumb configuration
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

  // Helper functions
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
  
  // User interaction handlers
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
        .then(() => toast({
          title: "Berhasil",
          description: "Link berita berhasil disalin!",
          variant: "default",
        }))
        .catch(() => console.error('Gagal menyalin link: '));
    }
  };
  
  const handlePrint = () => {
    window.print();
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast({
      title: !isBookmarked ? "Ditambahkan ke bookmark" : "Dihapus dari bookmark",
      description: !isBookmarked 
        ? "Berita telah disimpan ke bookmark Anda" 
        : "Berita telah dihapus dari bookmark Anda",
      variant: "default",
    });
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast({
      title: !isLiked ? "Anda menyukai berita ini" : "Batal menyukai",
      description: !isLiked 
        ? "Terima kasih atas feedback Anda" 
        : "Anda telah membatalkan like pada berita ini",
      variant: "default",
    });
  };

  const shareTo = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(berita.judul);
    let shareUrl = '';
    
    switch(platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };
  
  // Effects
  useEffect(() => {
    // Calculate reading time (average 200 words per minute)
    const wordCount = berita.konten.trim().split(/\s+/).length;
    const time = Math.ceil(wordCount / 200);
    setReadingTime(time);
    
    // Setup scroll tracking
    const handleScroll = () => {
      // Track reading progress
      const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
      
      // Track which paragraph is currently in view
      if (contentRef.current) {
        const paragraphs = contentRef.current.querySelectorAll('p');
        paragraphs.forEach((p, index) => {
          const rect = p.getBoundingClientRect();
          if (rect.top >= 0 && rect.top <= window.innerHeight * 0.5) {
            setCurrentParagraph(index);
          }
        });
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [berita.konten]);

  // Split content into paragraphs for better rendering
  const paragraphs = berita.konten.split('\n').filter(p => p.trim() !== '');

  // Component rendering
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={berita.judul} />
      
      {/* Reading progress bar - fixed at top of screen */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1.5 bg-primary z-50 print:hidden origin-left"
        style={{ width: `${scrollProgress}%` }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ ease: "easeOut" }}
      />
      
      <div className="container max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
        {/* Back button */}
        <motion.div 
          className="mb-4 sm:mb-6 md:mb-8 print:hidden"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link href={route('penduduk.berita')}>
            <Button variant="outline" size="sm" className="group transition-all duration-300 hover:bg-primary hover:text-white">
              <ChevronLeft className="mr-1 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Kembali ke Daftar Berita
            </Button>
          </Link>
        </motion.div>

        {/* Main article container */}
        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-background rounded-xl border shadow-md overflow-hidden print:shadow-none print:border-none"
        >
          {/* Article hero image or simple header */}
          {berita.gambar ? (
            <motion.div 
              className="relative w-full h-[200px] sm:h-[350px] md:h-[450px] overflow-hidden cursor-pointer"
              onClick={() => setShowImageViewer(true)}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <motion.img
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.5 }}
                src={berita.gambar}
                alt={berita.judul}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-6">
                <motion.div 
                  className="space-y-3"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <Badge variant="secondary" className="bg-primary/90 text-white border-none">
                    Berita Pemerintahan
                  </Badge>
                  <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-md leading-tight">
                    {berita.judul}
                  </h1>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <div className="py-8 px-6 bg-gradient-to-r from-primary/10 to-primary/5">
              <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-2xl sm:text-3xl md:text-4xl font-bold"
              >
                {berita.judul}
              </motion.h1>
            </div>
          )}

          <div className="p-4 sm:p-6 md:p-8">
            {/* Article title (when no image) */}
            {!berita.gambar && (
              <motion.h1 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6"
              >
                {berita.judul}
              </motion.h1>
            )}
            
            {/* Article metadata and action buttons */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 text-muted-foreground mb-4 sm:mb-6"
            >
              {/* Article metadata (date, author, reading time) */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-primary" />
                  <span>{formatDate(berita.tanggal_publikasi)}</span>
                  <span className="text-xs ml-2 text-muted-foreground">
                    ({getRelativeTime(berita.tanggal_publikasi)})
                  </span>
                </div>
                
                <div className="flex items-center">
                  <User className="mr-2 h-4 w-4 text-primary" />
                  <span>{berita.penulis}</span>
                </div>
                
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-primary" />
                  <span>{readingTime} menit baca</span>
                </div>
              </div>
              
              {/* Action buttons (bookmark, like, share, print) */}
              <div className="flex items-center gap-1 sm:gap-2 print:hidden">
                {/* Bookmark button */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleBookmark}
                        className={cn(
                          "flex items-center gap-1 transition-all",
                          isBookmarked && "bg-primary/10 text-primary border-primary"
                        )}
                      >
                        <Bookmark className={cn("h-4 w-4", isBookmarked ? "fill-primary" : "")} />
                        <span className="hidden sm:inline">Bookmark</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isBookmarked ? 'Hapus bookmark' : 'Simpan ke bookmark'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                {/* Like button */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleLike}
                        className={cn(
                          "flex items-center gap-1 transition-all",
                          isLiked && "bg-primary/10 text-primary border-primary"
                        )}
                      >
                        <ThumbsUp className={cn("h-4 w-4", isLiked ? "fill-primary" : "")} />
                        <span className="hidden sm:inline">Suka</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isLiked ? 'Batal menyukai' : 'Suka berita ini'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                {/* Share button with dropdown */}
                <div className="relative group">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleShare}
                    className="flex items-center gap-1"
                  >
                    <Share2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Bagikan</span>
                  </Button>
                  
                  <div className="absolute right-0 mt-2 bg-background rounded-md shadow-lg border p-2 hidden group-hover:block z-10">
                    <div className="flex flex-row gap-1 sm:gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => shareTo('facebook')}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Facebook className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => shareTo('twitter')}
                        className="text-sky-500 hover:text-sky-700"
                      >
                        <Twitter className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Print button */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handlePrint}
                        className="flex items-center gap-1"
                      >
                        <Printer className="h-4 w-4" />
                        <span className="hidden sm:inline">Cetak</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Cetak berita ini</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </motion.div>
            
            <Separator className="my-6" />
            
            {/* Article content and sidebar */}
            <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
              {/* Main article content */}
              <motion.div 
                ref={contentRef}
                className="prose prose-sm sm:prose-base md:prose-lg max-w-none md:w-3/4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                {paragraphs.map((paragraph, index) => (
                  <motion.p 
                    key={index} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                    }}
                    transition={{ 
                      delay: 0.1 * index,
                      duration: 0.5 
                    }}
                    className={cn(
                      "mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed",
                      // Style first paragraph with drop cap
                      index === 0 && "first-letter:text-3xl sm:first-letter:text-4xl md:first-letter:text-5xl first-letter:font-bold first-letter:mr-1 first-letter:float-left first-letter:leading-none first-letter:text-primary",
                      // Highlight current paragraph
                      currentParagraph === index && "bg-primary/5 -mx-2 px-2 py-1 rounded-md transition-colors duration-300"
                    )}
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </motion.div>
              
              {/* Sidebar with quick links */}
              <motion.div 
                className="hidden md:block md:w-1/4 print:hidden"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <div className="sticky top-16 md:top-24">
                  {/* Quick navigation links */}
                  <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Tautan Cepat</h3>
                  <ol className="space-y-2 text-sm">
                    {paragraphs.slice(0, 5).map((p, i) => (
                      <li key={i} className="truncate">
                        <Button 
                          variant="link"
                          className={cn(
                            "p-0 h-auto text-left justify-start",
                            currentParagraph === i && "text-primary font-medium"
                          )}
                          onClick={() => {
                            const el = contentRef.current?.querySelectorAll('p')[i];
                            el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          }}
                        >
                          {p.substring(0, 40)}...
                        </Button>
                      </li>
                    ))}
                  </ol>
                  
                  {/* Informational card */}
                  <Card className="mt-6 md:mt-8">
                    <CardContent className="p-3 sm:p-4">
                      <h4 className="font-medium mb-2">Berita Pemerintahan</h4>
                      <p className="text-sm text-muted-foreground">
                        Berita resmi dari pemerintah. Semua informasi yang disajikan adalah untuk kepentingan publik.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </div>
            
            <Separator className="my-6 md:my-8" />
            
            {/* Footer section */}
            <motion.div 
              className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 print:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>Berita Pemerintahan</span>
              </div>
              
              <Link href={route('penduduk.berita')}>
                <Button variant="outline" size="sm" className="group transition-all duration-300 hover:bg-primary hover:text-white">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Lihat Berita Lainnya
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.article>
      </div>
      
      {/* Image viewer modal */}
      <AnimatePresence>
        {showImageViewer && berita.gambar && (
          <motion.div 
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 print:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowImageViewer(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={berita.gambar} 
                alt={berita.judul} 
                className="max-w-full max-h-[90vh] object-contain"
              />
              <Button 
                variant="secondary"
                size="sm"
                className="absolute top-2 right-2 bg-black/50 hover:bg-black/70"
                onClick={() => setShowImageViewer(false)}
              >
                Tutup
              </Button>
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white bg-black/50">
                <h3 className="text-base sm:text-lg font-medium">{berita.judul}</h3>
                <p className="text-sm opacity-80">
                  {berita.penulis} • {formatDate(berita.tanggal_publikasi)}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
