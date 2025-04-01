import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { toast } from 'react-hot-toast';

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
    const { data, setData, post, processing, reset } = useForm<FormData>({
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
                <TextField
                    fullWidth
                    required
                    label="NIK"
                    value={data.nik}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('nik', e.target.value)}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    required
                    label="Nama Lengkap"
                    value={data.nama}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('nama', e.target.value)}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    required
                    label="Alamat"
                    value={data.alamat}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('alamat', e.target.value)}
                    margin="normal"
                    multiline
                    rows={3}
                />
            </>
        );

        switch (documentType) {
            case 'KTP':
                return (
                    <>
                        {commonFields}
                        <TextField
                            fullWidth
                            required
                            label="Tempat Lahir"
                            value={data.tempat_lahir}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('tempat_lahir', e.target.value)}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            required
                            type="date"
                            label="Tanggal Lahir"
                            value={data.tanggal_lahir}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('tanggal_lahir', e.target.value)}
                            margin="normal"
                            InputLabelProps={{ shrink: true }}
                        />
                    </>
                );
            case 'KK':
                return commonFields;
            case 'AKTA_KELAHIRAN':
                return (
                    <>
                        {commonFields}
                        <TextField
                            fullWidth
                            required
                            label="Nama Ayah"
                            value={data.nama_ayah}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('nama_ayah', e.target.value)}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            required
                            label="Nama Ibu"
                            value={data.nama_ibu}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('nama_ibu', e.target.value)}
                            margin="normal"
                        />
                    </>
                );
            case 'AKTA_KEMATIAN':
                return (
                    <>
                        {commonFields}
                        <TextField
                            fullWidth
                            required
                            label="Nama Almarhum/ah"
                            value={data.nama_almarhum}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('nama_almarhum', e.target.value)}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            required
                            type="date"
                            label="Tanggal Meninggal"
                            value={data.tanggal_meninggal}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('tanggal_meninggal', e.target.value)}
                            margin="normal"
                            InputLabelProps={{ shrink: true }}
                        />
                    </>
                );
            default:
                return commonFields;
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                Ajukan {documentType.replace('_', ' ')}
            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    {renderFields()}
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Batal</Button>
                    <Button type="submit" variant="contained" disabled={processing}>
                        Ajukan
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default DocumentRequestForm;
