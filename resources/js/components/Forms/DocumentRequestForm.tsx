import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type DocumentType } from '@/types';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

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
    tempat_lahir?: string;
    tanggal_lahir?: string;
    nama_ayah?: string;
    nama_ibu?: string;
    nama_almarhum?: string;
    tanggal_meninggal?: string;
}

export default function DocumentRequestForm({ isOpen, onClose, onFormSuccess, documentType }: Props) {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm<FormData>({
        type: documentType,
        nik: '',
        nama: '',
        alamat: '',
        tempat_lahir: '',
        tanggal_lahir: '',
        nama_ayah: '',
        nama_ibu: '',
        nama_almarhum: '',
        tanggal_meninggal: '',
    });

    useEffect(() => {
        if (isOpen) {
            reset();
            clearErrors();
            setData('type', documentType);
        }
    }, [isOpen, documentType]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/penduduk/documents', {
            onSuccess: () => {
                onClose();
                onFormSuccess();
                toast.success('Dokumen berhasil diajukan');
            },
            onError: (errors) => {
                console.error('Form errors:', errors);
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
                            maxLength={16}
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

                    {(documentType === 'KTP' || documentType === 'AKTA_KELAHIRAN') && (
                        <>
                            <div className="space-y-1.5">
                                <Label htmlFor="tempat_lahir">Tempat Lahir</Label>
                                <Input
                                    id="tempat_lahir"
                                    name="tempat_lahir"
                                    value={data.tempat_lahir}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.tempat_lahir && <p className="text-sm text-red-500">{errors.tempat_lahir}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="tanggal_lahir">Tanggal Lahir</Label>
                                <Input
                                    id="tanggal_lahir"
                                    name="tanggal_lahir"
                                    type="date"
                                    value={data.tanggal_lahir}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.tanggal_lahir && <p className="text-sm text-red-500">{errors.tanggal_lahir}</p>}
                            </div>
                        </>
                    )}

                    {documentType === 'AKTA_KELAHIRAN' && (
                        <>
                            <div className="space-y-1.5">
                                <Label htmlFor="nama_ayah">Nama Ayah</Label>
                                <Input
                                    id="nama_ayah"
                                    name="nama_ayah"
                                    value={data.nama_ayah}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.nama_ayah && <p className="text-sm text-red-500">{errors.nama_ayah}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="nama_ibu">Nama Ibu</Label>
                                <Input
                                    id="nama_ibu"
                                    name="nama_ibu"
                                    value={data.nama_ibu}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.nama_ibu && <p className="text-sm text-red-500">{errors.nama_ibu}</p>}
                            </div>
                        </>
                    )}

                    {documentType === 'AKTA_KEMATIAN' && (
                        <>
                            <div className="space-y-1.5">
                                <Label htmlFor="nama_almarhum">Nama Almarhum</Label>
                                <Input
                                    id="nama_almarhum"
                                    name="nama_almarhum"
                                    value={data.nama_almarhum}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.nama_almarhum && <p className="text-sm text-red-500">{errors.nama_almarhum}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="tanggal_meninggal">Tanggal Meninggal</Label>
                                <Input
                                    id="tanggal_meninggal"
                                    name="tanggal_meninggal"
                                    type="date"
                                    value={data.tanggal_meninggal}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.tanggal_meninggal && <p className="text-sm text-red-500">{errors.tanggal_meninggal}</p>}
                            </div>
                        </>
                    )}

                    <div className="flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? (
                                <>
                                    <Loader2 className="mr-2 size-4 animate-spin" />
                                    Memproses...
                                </>
                            ) : (
                                'Ajukan'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
