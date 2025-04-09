import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        return format(new Date(dateString), 'dd MMMM yyyy', { locale: id });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Berita Pemerintahan" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold tracking-tight">Berita Pemerintahan</h1>
                <p className="text-muted-foreground">Informasi terbaru dari pemerintah untuk masyarakat.</p>

                {beritas.length === 0 ? (
                    <div className="text-center py-12">
                        <h3 className="text-lg font-medium">Belum ada berita</h3>
                        <p className="text-muted-foreground mt-2">Silakan kunjungi halaman ini di lain waktu untuk melihat berita terbaru.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                        {beritas.map((berita) => (
                            <Card key={berita.id} className="overflow-hidden flex flex-col h-full">
                                {berita.gambar && (
                                    <div className="aspect-video w-full overflow-hidden">
                                        <img
                                            src={berita.gambar}
                                            alt={berita.judul}
                                            className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                                        />
                                    </div>
                                )}
                                <CardHeader>
                                    <CardTitle className="line-clamp-2">{berita.judul}</CardTitle>
                                    <CardDescription className="flex items-center space-x-4">
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
                                <CardContent className="flex-grow">
                                    <div className="line-clamp-4 text-sm text-muted-foreground">
                                        {berita.konten}
                                    </div>
                                </CardContent>
                                <CardFooter className="pt-2">
                                    <Link href={route('penduduk.berita.show', berita.id)}>
                                        <Button variant="link" className="p-0 h-auto font-medium">
                                            Baca Selengkapnya
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}