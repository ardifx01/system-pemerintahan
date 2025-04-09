import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';

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
    const { data, setData, put, processing, errors } = useForm({
        judul: berita.judul,
        konten: berita.konten,
        status: berita.status,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        put(route('admin.berita.update', berita.id), {
            onSuccess: () => {
                toast({
                    title: 'Berhasil',
                    description: 'Berita berhasil diperbarui',
                });
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Berita" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight">Edit Berita</h1>
                    <Link href={route('admin.berita')}>
                        <Button variant="outline">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Edit Berita</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-3">
                                <Label htmlFor="judul">Judul Berita</Label>
                                <Input
                                    id="judul"
                                    value={data.judul}
                                    onChange={(e) => setData('judul', e.target.value)}
                                    required
                                />
                                {errors.judul && (
                                    <p className="text-sm text-red-500">{errors.judul}</p>
                                )}
                            </div>

                            <div className="grid gap-3">
                                <Label htmlFor="konten">Konten Berita</Label>
                                <Textarea
                                    id="konten"
                                    rows={8}
                                    value={data.konten}
                                    onChange={(e) => setData('konten', e.target.value)}
                                    required
                                />
                                {errors.konten && (
                                    <p className="text-sm text-red-500">{errors.konten}</p>
                                )}
                            </div>

                            <div className="grid gap-3">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={data.status}
                                    onValueChange={(value: 'Dipublikasi' | 'Draf') => setData('status', value)}
                                >
                                    <SelectTrigger id="status">
                                        <SelectValue placeholder="Pilih status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Draf">Draf</SelectItem>
                                        <SelectItem value="Dipublikasi">Publikasikan</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.status && (
                                    <p className="text-sm text-red-500">{errors.status}</p>
                                )}
                            </div>

                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    Perbarui Berita
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
