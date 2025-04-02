import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type DocumentType } from '@/types';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onFormSuccess: () => void;
    documentType: DocumentType;
}

type FormData = {
    type: DocumentType;
    nik: string;
    nama: string;
    alamat: string;
    tempatLahir?: string;
    tanggalLahir?: string;
    namaAyah?: string;
    namaIbu?: string;
    namaAlmarhum?: string;
    tanggalMeninggal?: string;
    [key: string]: string | undefined;
}

export default function DocumentRequestForm({ isOpen, onClose, onFormSuccess, documentType }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm<FormData>({
        type: documentType,
        nik: '',
        nama: '',
        alamat: '',
        tempatLahir: '',
        tanggalLahir: '',
        namaAyah: '',
        namaIbu: '',
        namaAlmarhum: '',
        tanggalMeninggal: '',
    });

    useEffect(() => {
        if (isOpen) {
            reset();
            setData('type', documentType);
        }
    }, [isOpen, documentType]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/api/documents', {
            onSuccess: () => {
                onClose();
                onFormSuccess();
                toast.success('Dokumen berhasil diajukan');
            },
            onError: () => {
                toast.error('Gagal mengajukan dokumen');
            },
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData(name as keyof FormData, value);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Ajukan {documentType.replace('_', ' ')}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="nik">NIK</Label>
                        <Input
                            id="nik"
                            name="nik"
                            value={data.nik}
                            onChange={handleChange}
                            required
                        />
                        {errors.nik && <p className="text-sm text-red-500">{errors.nik}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="nama">Nama Lengkap</Label>
                        <Input
                            id="nama"
                            name="nama"
                            value={data.nama}
                            onChange={handleChange}
                            required
                        />
                        {errors.nama && <p className="text-sm text-red-500">{errors.nama}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="alamat">Alamat</Label>
                        <Input
                            id="alamat"
                            name="alamat"
                            value={data.alamat}
                            onChange={handleChange}
                            required
                        />
                        {errors.alamat && <p className="text-sm text-red-500">{errors.alamat}</p>}
                    </div>

                    {documentType === 'AKTA_KELAHIRAN' && (
                        <>
                            <div className="space-y-1.5">
                                <Label htmlFor="tempatLahir">Tempat Lahir</Label>
                                <Input
                                    id="tempatLahir"
                                    name="tempatLahir"
                                    value={data.tempatLahir}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.tempatLahir && <p className="text-sm text-red-500">{errors.tempatLahir}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="tanggalLahir">Tanggal Lahir</Label>
                                <Input
                                    id="tanggalLahir"
                                    name="tanggalLahir"
                                    type="date"
                                    value={data.tanggalLahir}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.tanggalLahir && <p className="text-sm text-red-500">{errors.tanggalLahir}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="namaAyah">Nama Ayah</Label>
                                <Input
                                    id="namaAyah"
                                    name="namaAyah"
                                    value={data.namaAyah}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.namaAyah && <p className="text-sm text-red-500">{errors.namaAyah}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="namaIbu">Nama Ibu</Label>
                                <Input
                                    id="namaIbu"
                                    name="namaIbu"
                                    value={data.namaIbu}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.namaIbu && <p className="text-sm text-red-500">{errors.namaIbu}</p>}
                            </div>
                        </>
                    )}

                    {documentType === 'AKTA_KEMATIAN' && (
                        <>
                            <div className="space-y-1.5">
                                <Label htmlFor="namaAlmarhum">Nama Almarhum/Almarhumah</Label>
                                <Input
                                    id="namaAlmarhum"
                                    name="namaAlmarhum"
                                    value={data.namaAlmarhum}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.namaAlmarhum && <p className="text-sm text-red-500">{errors.namaAlmarhum}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="tanggalMeninggal">Tanggal Meninggal</Label>
                                <Input
                                    id="tanggalMeninggal"
                                    name="tanggalMeninggal"
                                    type="date"
                                    value={data.tanggalMeninggal}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.tanggalMeninggal && <p className="text-sm text-red-500">{errors.tanggalMeninggal}</p>}
                            </div>
                        </>
                    )}

                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Memproses...' : 'Ajukan'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
