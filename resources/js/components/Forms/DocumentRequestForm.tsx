import React from 'react';
import { useForm } from '@inertiajs/react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';
import { LoaderCircle, X } from 'lucide-react';
import InputError from '@/components/input-error';

interface DocumentRequestFormProps {
    isOpen: boolean;
    onClose: () => void;
    documentType: string;
    onSuccess?: () => void;
}

type FormData = {
    type: string;
    nik: string;
    nama: string;
    alamat: string;
    tempat_lahir?: string;
    tanggal_lahir?: string;
    nama_ayah?: string;
    nama_ibu?: string;
    nama_almarhum?: string;
    tanggal_meninggal?: string;
    [key: string]: string | undefined;
}

const DocumentRequestForm: React.FC<DocumentRequestFormProps> = ({ isOpen, onClose, documentType, onSuccess }) => {
    const { data, setData, post, processing, errors, reset } = useForm<FormData>({
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

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post('/documents', {
            onSuccess: () => {
                toast.success('Dokumen berhasil diajukan');
                reset();
                onClose();
                onSuccess?.();
            },
            onError: () => {
                toast.error('Gagal mengajukan dokumen');
            },
        });
    };

    const renderFields = () => {
        const commonFields = (
            <>
                <div className="space-y-1.5">
                    <Label htmlFor="nik" className="text-sm font-medium text-zinc-200">NIK</Label>
                    <Input
                        id="nik"
                        required
                        value={data.nik}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('nik', e.target.value)}
                        placeholder="Masukkan NIK"
                        autoFocus
                        className="h-10 border-zinc-700/50 bg-zinc-800/50 text-sm text-zinc-100 placeholder:text-zinc-400 focus-visible:ring-1 focus-visible:ring-zinc-400"
                    />
                    <InputError message={errors.nik} />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="nama" className="text-sm font-medium text-zinc-200">Nama Lengkap</Label>
                    <Input
                        id="nama"
                        required
                        value={data.nama}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('nama', e.target.value)}
                        placeholder="Masukkan nama lengkap"
                        className="h-10 border-zinc-700/50 bg-zinc-800/50 text-sm text-zinc-100 placeholder:text-zinc-400 focus-visible:ring-1 focus-visible:ring-zinc-400"
                    />
                    <InputError message={errors.nama} />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="alamat" className="text-sm font-medium text-zinc-200">Alamat</Label>
                    <textarea
                        id="alamat"
                        required
                        value={data.alamat}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('alamat', e.target.value)}
                        placeholder="Masukkan alamat lengkap"
                        className="min-h-[100px] w-full rounded-md border border-zinc-700/50 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400"
                        rows={4}
                    />
                    <InputError message={errors.alamat} />
                </div>
            </>
        );

        switch (documentType) {
            case 'KTP':
                return (
                    <>
                        {commonFields}
                        <div className="space-y-1.5">
                            <Label htmlFor="tempat_lahir" className="text-sm font-medium text-zinc-200">Tempat Lahir</Label>
                            <Input
                                id="tempat_lahir"
                                required
                                value={data.tempat_lahir}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('tempat_lahir', e.target.value)}
                                placeholder="Masukkan tempat lahir"
                                className="h-10 border-zinc-700/50 bg-zinc-800/50 text-sm text-zinc-100 placeholder:text-zinc-400 focus-visible:ring-1 focus-visible:ring-zinc-400"
                            />
                            <InputError message={errors.tempat_lahir} />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="tanggal_lahir" className="text-sm font-medium text-zinc-200">Tanggal Lahir</Label>
                            <Input
                                id="tanggal_lahir"
                                type="date"
                                required
                                value={data.tanggal_lahir}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('tanggal_lahir', e.target.value)}
                                className="h-10 border-zinc-700/50 bg-zinc-800/50 text-sm text-zinc-100 placeholder:text-zinc-400 focus-visible:ring-1 focus-visible:ring-zinc-400 [color-scheme:dark]"
                            />
                            <InputError message={errors.tanggal_lahir} />
                        </div>
                    </>
                );
            case 'KK':
                return commonFields;
            case 'AKTA_KELAHIRAN':
                return (
                    <>
                        {commonFields}
                        <div className="space-y-1.5">
                            <Label htmlFor="nama_ayah" className="text-sm font-medium text-zinc-200">Nama Ayah</Label>
                            <Input
                                id="nama_ayah"
                                required
                                value={data.nama_ayah}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('nama_ayah', e.target.value)}
                                placeholder="Masukkan nama ayah"
                                className="h-10 border-zinc-700/50 bg-zinc-800/50 text-sm text-zinc-100 placeholder:text-zinc-400 focus-visible:ring-1 focus-visible:ring-zinc-400"
                            />
                            <InputError message={errors.nama_ayah} />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="nama_ibu" className="text-sm font-medium text-zinc-200">Nama Ibu</Label>
                            <Input
                                id="nama_ibu"
                                required
                                value={data.nama_ibu}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('nama_ibu', e.target.value)}
                                placeholder="Masukkan nama ibu"
                                className="h-10 border-zinc-700/50 bg-zinc-800/50 text-sm text-zinc-100 placeholder:text-zinc-400 focus-visible:ring-1 focus-visible:ring-zinc-400"
                            />
                            <InputError message={errors.nama_ibu} />
                        </div>
                    </>
                );
            case 'AKTA_KEMATIAN':
                return (
                    <>
                        {commonFields}
                        <div className="space-y-1.5">
                            <Label htmlFor="nama_almarhum" className="text-sm font-medium text-zinc-200">Nama Almarhum/ah</Label>
                            <Input
                                id="nama_almarhum"
                                required
                                value={data.nama_almarhum}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('nama_almarhum', e.target.value)}
                                placeholder="Masukkan nama almarhum/ah"
                                className="h-10 border-zinc-700/50 bg-zinc-800/50 text-sm text-zinc-100 placeholder:text-zinc-400 focus-visible:ring-1 focus-visible:ring-zinc-400"
                            />
                            <InputError message={errors.nama_almarhum} />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="tanggal_meninggal" className="text-sm font-medium text-zinc-200">Tanggal Meninggal</Label>
                            <Input
                                id="tanggal_meninggal"
                                type="date"
                                required
                                value={data.tanggal_meninggal}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('tanggal_meninggal', e.target.value)}
                                className="h-10 border-zinc-700/50 bg-zinc-800/50 text-sm text-zinc-100 placeholder:text-zinc-400 focus-visible:ring-1 focus-visible:ring-zinc-400 [color-scheme:dark]"
                            />
                            <InputError message={errors.tanggal_meninggal} />
                        </div>
                    </>
                );
            default:
                return commonFields;
        }
    };

    return (
        <Dialog open={isOpen}>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                <div 
                    className="fixed inset-0 bg-black/90" 
                    onClick={onClose} 
                    aria-hidden="true"
                />
                <div className="relative w-full max-w-lg overflow-hidden rounded-xl bg-gradient-to-b from-zinc-900 to-zinc-950 shadow-2xl ring-1 ring-zinc-800">
                    <div className="flex items-center justify-between border-b border-zinc-800/70 bg-zinc-900/50 px-6 py-4">
                        <div>
                            <h3 className="text-lg font-semibold text-zinc-100">
                                Ajukan {documentType.replace('_', ' ')}
                            </h3>
                            <p className="mt-1 text-sm text-zinc-400">
                                Silakan lengkapi form berikut untuk mengajukan {documentType.replace('_', ' ').toLowerCase()}
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="h-8 w-8 rounded-full text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                            disabled={processing}
                        >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                        </Button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4 px-6 py-5">
                            {renderFields()}
                        </div>
                        <div className="flex items-center justify-end gap-3 border-t border-zinc-800/70 bg-zinc-900/50 px-6 py-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={processing}
                                className="border-zinc-700/50 bg-transparent text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800/50 hover:text-zinc-200"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-blue-600 text-white hover:bg-blue-500 disabled:bg-blue-600/50"
                            >
                                {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                Ajukan Dokumen
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </Dialog>
    );
};

export default DocumentRequestForm;
