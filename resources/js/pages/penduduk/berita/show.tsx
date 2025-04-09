import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={berita.judul} />
            <div className="container mx-auto px-4 py-8">
                <div className="mb-6">
                    <Link href={route('penduduk.berita')}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali ke Daftar Berita
                        </Button>
                    </Link>
                </div>

                <article className="bg-background rounded-lg border shadow-sm overflow-hidden">
                    {berita.gambar && (
                        <div className="w-full h-[300px] md:h-[400px] overflow-hidden">
                            <img
                                src={berita.gambar}
                                alt={berita.judul}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    <div className="p-6">
                        <h1 className="text-3xl font-bold mb-4">{berita.judul}</h1>
                        
                        <div className="flex items-center gap-4 text-muted-foreground mb-8">
                            <div className="flex items-center">
                                <Calendar className="mr-2 h-4 w-4" />
                                <span>{formatDate(berita.tanggal_publikasi)}</span>
                            </div>
                            <div className="flex items-center">
                                <User className="mr-2 h-4 w-4" />
                                <span>{berita.penulis}</span>
                            </div>
                        </div>

                        <div className="prose max-w-none">
                            {berita.konten.split('\n').map((paragraph, index) => (
                                <p key={index} className="mb-4 text-base leading-relaxed">
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </div>
                </article>
            </div>
        </AppLayout>
    );
}
