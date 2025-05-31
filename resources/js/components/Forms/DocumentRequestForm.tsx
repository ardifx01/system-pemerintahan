import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type DocumentType } from '@/types';
import { useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onFormSuccess: () => void;
    documentType: DocumentType;
}

// Form data type with clear field grouping for better organization

type FormData = {
    // Common fields for all document types
    type: DocumentType;
    nik: string;
    nama: string;
    alamat: string;
    
    // Digital verification fields (Indonesia 2025)
    email: string;
    no_telp: string;
    persetujuan_data: boolean;
    
    // KTP & Akta Kelahiran fields
    tempat_lahir?: string;
    tanggal_lahir?: string;
    jenis_kelamin?: string;
    
    // KTP-specific fields
    jenis_permohonan_ktp?: string;
    agama?: string;
    status_perkawinan?: string;
    pekerjaan?: string;
    kewarganegaraan?: string;
    scan_ktp?: string;
    
    // Family-related fields (KTP & Akta Kelahiran)
    nama_ayah?: string;
    nama_ibu?: string;
    
    // Akta Kematian fields
    nama_almarhum?: string;
    tanggal_meninggal?: string;
    
    // Kartu Keluarga fields
    no_kk?: string;
    hubungan_keluarga?: string;
    pendidikan?: string;
    golongan_darah?: string;
    nama_kepala_keluarga?: string;
    anggota_keluarga?: string;
}

export default function DocumentRequestForm({ isOpen, onClose, onFormSuccess, documentType }: Props) {
    // Single state for file uploads
    const [fileUploads, setFileUploads] = useState({
        ktpFile: null as File | null
    });
    
    // Initialize form with default values
    const getInitialFormData = () => ({
        // Common fields
        type: documentType,
        nik: '',
        nama: '',
        alamat: '',
        
        // Digital verification fields
        email: '',
        no_telp: '',
        persetujuan_data: false,
        
        // Set default values for other fields based on document type
        ...(documentType === 'KTP' || documentType === 'AKTA_KELAHIRAN' ? {
            tempat_lahir: '',
            tanggal_lahir: '',
            jenis_kelamin: 'Laki-laki',
            nama_ayah: '',
            nama_ibu: ''
        } : {}),
        
        ...(documentType === 'KTP' ? {
            jenis_permohonan_ktp: 'BARU',
            agama: '',
            status_perkawinan: '',
            pekerjaan: '',
            kewarganegaraan: 'Indonesia',
            scan_ktp: ''
        } : {}),
        
        ...(documentType === 'AKTA_KEMATIAN' ? {
            nama_almarhum: '',
            tanggal_meninggal: ''
        } : {}),
        
        ...(documentType === 'KK' ? {
            no_kk: '',
            hubungan_keluarga: '',
            pendidikan: '',
            golongan_darah: 'O',
            nama_kepala_keluarga: '',
            anggota_keluarga: ''
        } : {})
    });
    
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm<FormData>(getInitialFormData());
    
    // Track form submission attempt to improve user feedback
    const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // Reset form data and clear errors when dialog opens
            reset();
            setData(getInitialFormData());
            clearErrors();
            // Reset file uploads
            setFileUploads({
                ktpFile: null
            });
        }
    }, [isOpen, documentType, reset, clearErrors, setData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        clearErrors();
        setHasAttemptedSubmit(true);

        // Debug the current form data
        console.log('Form data to be submitted:', data);
        
        // Validation for all document types
        const commonFieldValidation = () => {
            let isValid = true;
            
            // Check required common fields
            if (!data.nama) {
                setData('nama', '');
                toast.error('Nama lengkap wajib diisi');
                isValid = false;
            }
            
            if (!data.alamat) {
                setData('alamat', '');
                toast.error('Alamat wajib diisi');
                isValid = false;
            }
            
            // Digital verification fields
            if (!data.email) {
                setData('email', '');
                toast.error('Email wajib diisi untuk verifikasi digital');
                isValid = false;
            } else if (!/^\S+@\S+\.\S+$/.test(data.email)) {
                toast.error('Format email tidak valid');
                isValid = false;
            }
            
            if (!data.no_telp) {
                setData('no_telp', '');
                toast.error('Nomor telepon wajib diisi untuk verifikasi digital');
                isValid = false;
            }
            
            if (!data.persetujuan_data) {
                toast.error('Anda harus menyetujui ketentuan penggunaan data');
                isValid = false;
            }
            
            return isValid;
        };
        
        // Type-specific validation
        const typeSpecificValidation = () => {
            let isValid = true;
            
            switch (documentType) {
                case 'KTP':
                    // Validate KTP fields
                    if (!data.jenis_permohonan_ktp) {
                        toast.error('Jenis permohonan KTP wajib dipilih');
                        isValid = false;
                    }
                    
                    // NIK validation for renewal/replacement
                    if ((data.jenis_permohonan_ktp === 'PERPANJANGAN' || data.jenis_permohonan_ktp === 'PENGGANTIAN')) {
                        if (!data.nik) {
                            toast.error('NIK wajib diisi untuk perpanjangan/penggantian KTP');
                            isValid = false;
                        } else if (data.nik.length !== 16) {
                            toast.error('NIK harus terdiri dari 16 digit');
                            isValid = false;
                        }
                    }
                    
                    // Required KTP fields
                    if (!data.tempat_lahir) {
                        toast.error('Tempat lahir wajib diisi');
                        isValid = false;
                    }
                    
                    if (!data.tanggal_lahir) {
                        toast.error('Tanggal lahir wajib diisi');
                        isValid = false;
                    }
                    
                    // Scan KTP validation for renewal
                    if (data.jenis_permohonan_ktp === 'PERPANJANGAN' && !fileUploads.ktpFile && !data.scan_ktp) {
                        toast.error('Untuk perpanjangan KTP, scan KTP lama wajib diunggah');
                        isValid = false;
                    }
                    break;
                    
                case 'AKTA_KELAHIRAN':
                    // Required fields for birth certificate
                    if (!data.nik || data.nik.length !== 16) {
                        toast.error('NIK harus terdiri dari 16 digit');
                        isValid = false;
                    }
                    if (!data.tempat_lahir) {
                        toast.error('Tempat lahir wajib diisi');
                        isValid = false;
                    }
                    if (!data.tanggal_lahir) {
                        toast.error('Tanggal lahir wajib diisi');
                        isValid = false;
                    }
                    if (!data.nama_ayah) {
                        toast.error('Nama ayah wajib diisi');
                        isValid = false;
                    }
                    if (!data.nama_ibu) {
                        toast.error('Nama ibu wajib diisi');
                        isValid = false;
                    }
                    break;
                    
                case 'AKTA_KEMATIAN':
                    // Required fields for death certificate
                    if (!data.nik || data.nik.length !== 16) {
                        toast.error('NIK harus terdiri dari 16 digit');
                        isValid = false;
                    }
                    if (!data.nama_almarhum) {
                        toast.error('Nama almarhum wajib diisi');
                        isValid = false;
                    }
                    if (!data.tanggal_meninggal) {
                        toast.error('Tanggal meninggal wajib diisi');
                        isValid = false;
                    }
                    break;
                    
                case 'KK':
                    // Required fields for family card
                    if (!data.nik || data.nik.length !== 16) {
                        toast.error('NIK harus terdiri dari 16 digit');
                        isValid = false;
                    }
                    if (!data.nama_kepala_keluarga) {
                        toast.error('Nama kepala keluarga wajib diisi');
                        isValid = false;
                    }
                    break;
            }
            
            return isValid;
        };
        
        // Run all validations
        if (!commonFieldValidation() || !typeSpecificValidation()) {
            return;
        }

        // Make sure persetujuan_data is a proper boolean before submission
        setData('persetujuan_data', Boolean(data.persetujuan_data));
        
        // For KTP renewals, set the scan_ktp field to the file name when a file is uploaded
        if (fileUploads.ktpFile && documentType === 'KTP' && data.jenis_permohonan_ktp === 'PERPANJANGAN') {
            // In a real implementation with file uploads, we would need to handle the file separately
            // For now, just set the name in the data
            setData('scan_ktp', fileUploads.ktpFile.name);
        }
        
        // Show loading state with modern design for digital verification
        toast.loading('Melakukan verifikasi digital...', {
            style: {
                background: '#1f2937',
                color: 'white',
                borderRadius: '0.5rem',
                border: '1px solid #4f46e5',
            },
        });
        
        // Submit the form with proper error handling
        setTimeout(() => {
            toast.dismiss();
            
            // Submit using Inertia useForm's post method
            post('/penduduk/documents', {
                onSuccess: () => {
                    // Close form and notify user
                    onClose();
                    onFormSuccess();
                    
                    // Display styled success notification
                    toast.success('Dokumen berhasil diajukan', {
                        style: {
                            background: 'linear-gradient(to right, #4f46e5, #06b6d4)',
                            color: 'white',
                            borderRadius: '0.5rem',
                        },
                        duration: 4000,
                    });
                    
                    // Send verification SMS/email notification with enhanced styling
                    setTimeout(() => {
                        toast.success(`Notifikasi verifikasi telah dikirim ke ${data.email} dan ${data.no_telp}`, {
                            style: {
                                background: 'linear-gradient(to right, #06b6d4, #ec4899)',
                                color: 'white',
                                borderRadius: '0.5rem',
                            },
                            duration: 5000,
                        });
                    }, 1000);
                },
                onError: (errors: Record<string, string>) => {
                    console.error('Form submission errors:', errors);
                    
                    // Display specific error messages if available, or a general message
                    if (Object.keys(errors).length > 0) {
                        // Show the first error message
                        const firstErrorKey = Object.keys(errors)[0];
                        toast.error(`Error: ${errors[firstErrorKey]}`, {
                            style: {
                                borderLeft: '4px solid #ef4444',
                                borderRadius: '0.25rem',
                            },
                        });
                    } else {
                        toast.error('Gagal mengajukan dokumen. Silakan periksa data yang dimasukkan', {
                            style: {
                                borderLeft: '4px solid #ef4444',
                                borderRadius: '0.25rem',
                            },
                        });
                    }
                }
            });
        }, 1500);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData(name as keyof FormData, value);
        
        // Clear specific error when user fixes a field
        if (hasAttemptedSubmit && errors[name as keyof typeof errors]) {
            clearErrors(name as keyof typeof errors);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md mx-auto w-full max-h-[90vh] overflow-y-auto sm:max-h-[85vh] p-4 sm:p-6">
                <DialogHeader className="pb-4">
                    <DialogTitle className="text-lg sm:text-xl font-semibold text-center">
                        Ajukan {documentType === 'KK' ? 'Kartu Keluarga' : documentType.replace('_', ' ')}
                    </DialogTitle>
                    <p className="text-xs sm:text-sm text-muted-foreground text-center mt-1">Lengkapi data untuk pengajuan dokumen</p>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                    {documentType === 'KTP' && (
                        <div className="space-y-1 sm:space-y-1.5 mb-3">
                            <Label htmlFor="jenis_permohonan_ktp" className="text-xs sm:text-sm font-medium">Jenis Permohonan</Label>
                            <select 
                                id="jenis_permohonan_ktp"
                                name="jenis_permohonan_ktp"
                                className="flex h-9 sm:h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-xs sm:text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={data.jenis_permohonan_ktp}
                                onChange={(e) => setData('jenis_permohonan_ktp', e.target.value)}
                                required
                            >
                                <option value="BARU">Pembuatan Baru</option>
                                <option value="PERPANJANGAN">Perpanjangan</option>
                                <option value="PENGGANTIAN">Penggantian (Hilang/Rusak)</option>
                            </select>
                            {errors.jenis_permohonan_ktp && <p className="text-xs sm:text-sm text-red-500 mt-1">{errors.jenis_permohonan_ktp}</p>}
                        </div>
                    )}
                    
                    <div className="md:grid md:grid-cols-2 md:gap-4">
                        {/* NIK field - hide for new KTP requests */}
                        {!(documentType === 'KTP' && data.jenis_permohonan_ktp === 'BARU') && (
                            <div className="space-y-1 sm:space-y-1.5 mb-3 md:mb-0">
                                <Label htmlFor="nik" className="text-xs sm:text-sm font-medium">NIK</Label>
                                <Input
                                    id="nik"
                                    name="nik"
                                    value={data.nik}
                                    onChange={handleChange}
                                    maxLength={16}
                                    required
                                    className="h-9 sm:h-10 text-xs sm:text-sm px-3"
                                    placeholder="Masukkan NIK (16 Digit)"
                                />
                                {errors.nik && <p className="text-xs sm:text-sm text-red-500 mt-1">{errors.nik}</p>}
                            </div>
                        )}

                        <div className="space-y-1 sm:space-y-1.5">
                            <Label htmlFor="nama" className="text-xs sm:text-sm font-medium">Nama Lengkap</Label>
                            <Input
                                id="nama"
                                name="nama"
                                value={data.nama}
                                onChange={handleChange}
                                required
                                className="h-9 sm:h-10 text-xs sm:text-sm px-3"
                                placeholder="Masukkan Nama Lengkap"
                            />
                            {errors.nama && <p className="text-xs sm:text-sm text-red-500 mt-1">{errors.nama}</p>}
                        </div>
                    </div>

                    <div className="space-y-1 sm:space-y-1.5">
                        <Label htmlFor="alamat" className="text-xs sm:text-sm font-medium">Alamat</Label>
                        <Input
                            id="alamat"
                            name="alamat"
                            value={data.alamat}
                            onChange={handleChange}
                            required
                            className="h-9 sm:h-10 text-xs sm:text-sm px-3"
                            placeholder="Masukkan Alamat"
                        />
                        {errors.alamat && <p className="text-xs sm:text-sm text-red-500 mt-1">{errors.alamat}</p>}
                    </div>

                    {(documentType === 'KTP' || documentType === 'AKTA_KELAHIRAN') && (
                        <div className="md:grid md:grid-cols-2 md:gap-4">
                            <div className="space-y-1 sm:space-y-1.5 mb-3 md:mb-0">
                                <Label htmlFor="tempat_lahir" className="text-xs sm:text-sm font-medium">Tempat Lahir</Label>
                                <Input
                                    id="tempat_lahir"
                                    name="tempat_lahir"
                                    value={data.tempat_lahir}
                                    onChange={handleChange}
                                    required
                                    className="h-9 sm:h-10 text-xs sm:text-sm px-3"
                                    placeholder="Masukkan Tempat Lahir"
                                />
                                {errors.tempat_lahir && <p className="text-xs sm:text-sm text-red-500 mt-1">{errors.tempat_lahir}</p>}
                            </div>

                            <div className="space-y-1 sm:space-y-1.5">
                                <Label htmlFor="tanggal_lahir" className="text-xs sm:text-sm font-medium">Tanggal Lahir</Label>
                                <Input
                                    id="tanggal_lahir"
                                    name="tanggal_lahir"
                                    type="date"
                                    value={data.tanggal_lahir}
                                    onChange={handleChange}
                                    required
                                    className="h-9 sm:h-10 text-xs sm:text-sm px-3"
                                />
                                {errors.tanggal_lahir && <p className="text-xs sm:text-sm text-red-500 mt-1">{errors.tanggal_lahir}</p>}
                            </div>
                        </div>
                    )}
                    
                    {documentType === 'KTP' && (
                        <>
                            <div className="md:grid md:grid-cols-2 md:gap-4">
                                <div className="space-y-1 sm:space-y-1.5 mb-3 md:mb-0">
                                    <Label htmlFor="jenis_kelamin" className="text-xs sm:text-sm font-medium">Jenis Kelamin</Label>
                                    <select 
                                        id="jenis_kelamin"
                                        name="jenis_kelamin"
                                        className="flex h-9 sm:h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-xs sm:text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={data.jenis_kelamin}
                                        onChange={(e) => setData('jenis_kelamin', e.target.value)}
                                        required
                                    >
                                        <option value="">Pilih Jenis Kelamin</option>
                                        <option value="Laki-laki">Laki-laki</option>
                                        <option value="Perempuan">Perempuan</option>
                                    </select>
                                    {errors.jenis_kelamin && <p className="text-xs sm:text-sm text-red-500 mt-1">{errors.jenis_kelamin}</p>}
                                </div>

                                <div className="space-y-1 sm:space-y-1.5">
                                    <Label htmlFor="agama" className="text-xs sm:text-sm font-medium">Agama</Label>
                                    <select 
                                        id="agama"
                                        name="agama"
                                        className="flex h-9 sm:h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-xs sm:text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={data.agama}
                                        onChange={(e) => setData('agama', e.target.value)}
                                        required
                                    >
                                        <option value="">Pilih Agama</option>
                                        <option value="Islam">Islam</option>
                                        <option value="Kristen">Kristen</option>
                                        <option value="Katolik">Katolik</option>
                                        <option value="Hindu">Hindu</option>
                                        <option value="Buddha">Buddha</option>
                                        <option value="Konghucu">Konghucu</option>
                                        <option value="Lainnya">Lainnya</option>
                                    </select>
                                    {errors.agama && <p className="text-xs sm:text-sm text-red-500 mt-1">{errors.agama}</p>}
                                </div>
                            </div>

                            <div className="md:grid md:grid-cols-2 md:gap-4">
                                <div className="space-y-1 sm:space-y-1.5 mb-3 md:mb-0">
                                    <Label htmlFor="status_perkawinan" className="text-xs sm:text-sm font-medium">Status Perkawinan</Label>
                                    <select 
                                        id="status_perkawinan"
                                        name="status_perkawinan"
                                        className="flex h-9 sm:h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-xs sm:text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={data.status_perkawinan}
                                        onChange={(e) => setData('status_perkawinan', e.target.value)}
                                        required
                                    >
                                        <option value="">Pilih Status Perkawinan</option>
                                        <option value="Belum Kawin">Belum Kawin</option>
                                        <option value="Kawin">Kawin</option>
                                        <option value="Cerai Hidup">Cerai Hidup</option>
                                        <option value="Cerai Mati">Cerai Mati</option>
                                    </select>
                                    {errors.status_perkawinan && <p className="text-xs sm:text-sm text-red-500 mt-1">{errors.status_perkawinan}</p>}
                                </div>

                                <div className="space-y-1 sm:space-y-1.5">
                                    <Label htmlFor="pekerjaan" className="text-xs sm:text-sm font-medium">Pekerjaan</Label>
                                    <Input
                                        id="pekerjaan"
                                        name="pekerjaan"
                                        value={data.pekerjaan}
                                        onChange={handleChange}
                                        placeholder="Masukkan Pekerjaan"
                                        required
                                        className="h-9 sm:h-10 text-xs sm:text-sm px-3"
                                    />
                                    {errors.pekerjaan && <p className="text-xs sm:text-sm text-red-500 mt-1">{errors.pekerjaan}</p>}
                                </div>
                            </div>

                            <div className="space-y-1 sm:space-y-1.5">
                                <Label htmlFor="kewarganegaraan" className="text-xs sm:text-sm font-medium">Kewarganegaraan</Label>
                                <Input
                                    id="kewarganegaraan"
                                    name="kewarganegaraan"
                                    value={data.kewarganegaraan}
                                    onChange={handleChange}
                                    defaultValue="Indonesia"
                                    required
                                    className="h-9 sm:h-10 text-xs sm:text-sm px-3"
                                />
                                {errors.kewarganegaraan && <p className="text-xs sm:text-sm text-red-500 mt-1">{errors.kewarganegaraan}</p>}
                            </div>

                            {/* Unggah Scan KTP - hanya tampilkan untuk perpanjangan */}
                            {documentType === 'KTP' && data.jenis_permohonan_ktp === 'PERPANJANGAN' && (
                                <div className="space-y-1 sm:space-y-1.5">
                                    <Label htmlFor="scan_ktp" className="text-xs sm:text-sm font-medium">Unggah Scan KTP Lama</Label>
                                    <div className="flex items-center justify-center w-full">
                                        <label htmlFor="scan_ktp" className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer bg-background border-border hover:bg-muted/50">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <svg className="w-8 h-8 mb-2 text-muted-foreground" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                                </svg>
                                                <p className="mb-1 text-xs sm:text-sm text-muted-foreground">Unggah scan KTP lama</p>
                                                <p className="text-xs text-muted-foreground">JPG, JPEG atau PNG (Maks. 2MB)</p>
                                            </div>
                                            <input 
                                                id="scan_ktp" 
                                                name="scan_ktp"
                                                type="file" 
                                                className="hidden" 
                                                accept=".jpg,.jpeg,.png"
                                                onChange={(e) => {
                                                    if (e.target.files && e.target.files[0]) {
                                                        setFileUploads(prev => ({
                                                            ...prev,
                                                            ktpFile: e.target.files?.[0] || null
                                                        }));
                                                        setData('scan_ktp', e.target.files[0].name);
                                                    }
                                                }}
                                            />
                                        </label>
                                    </div>
                                    {errors.scan_ktp && <p className="text-xs sm:text-sm text-red-500 mt-1">{errors.scan_ktp}</p>}
                                    {data.scan_ktp && <p className="text-xs text-muted-foreground mt-1">File dipilih: {data.scan_ktp}</p>}
                                </div>
                            )}
                        </>
                    )}

                    {documentType === 'AKTA_KELAHIRAN' && (
                        <>
                            <div className="md:grid md:grid-cols-2 md:gap-4">
                                <div className="space-y-1 sm:space-y-1.5 mb-3 md:mb-0">
                                    <Label htmlFor="nama_ayah" className="text-xs sm:text-sm font-medium">Nama Ayah</Label>
                                    <Input
                                        id="nama_ayah"
                                        name="nama_ayah"
                                        value={data.nama_ayah}
                                        onChange={handleChange}
                                        required
                                        className="h-9 sm:h-10 text-xs sm:text-sm px-3"
                                        placeholder="Masukkan Nama Ayah"
                                    />
                                    {errors.nama_ayah && <p className="text-xs sm:text-sm text-red-500 mt-1">{errors.nama_ayah}</p>}
                                </div>

                                <div className="space-y-1 sm:space-y-1.5">
                                    <Label htmlFor="nama_ibu" className="text-xs sm:text-sm font-medium">Nama Ibu</Label>
                                    <Input
                                        id="nama_ibu"
                                        name="nama_ibu"
                                        value={data.nama_ibu}
                                        onChange={handleChange}
                                        required
                                        className="h-9 sm:h-10 text-xs sm:text-sm px-3"
                                        placeholder="Masukkan Nama Ibu"
                                    />
                                    {errors.nama_ibu && <p className="text-xs sm:text-sm text-red-500 mt-1">{errors.nama_ibu}</p>}
                                </div>
                            </div>
                        </>
                    )}

                    {documentType === 'AKTA_KEMATIAN' && (
                        <>
                            <div className="space-y-1 sm:space-y-1.5">
                                <Label htmlFor="nama_almarhum" className="text-xs sm:text-sm font-medium">Nama Almarhum</Label>
                                <Input
                                    id="nama_almarhum"
                                    name="nama_almarhum"
                                    value={data.nama_almarhum}
                                    onChange={handleChange}
                                    required
                                    className="h-9 sm:h-10 text-xs sm:text-sm px-3"
                                    placeholder="Masukkan Nama Almarhum"
                                />
                                {errors.nama_almarhum && <p className="text-xs sm:text-sm text-red-500 mt-1">{errors.nama_almarhum}</p>}
                            </div>

                            <div className="space-y-1 sm:space-y-1.5">
                                <Label htmlFor="tanggal_meninggal" className="text-xs sm:text-sm font-medium">Tanggal Meninggal</Label>
                                <Input
                                    id="tanggal_meninggal"
                                    name="tanggal_meninggal"
                                    type="date"
                                    value={data.tanggal_meninggal}
                                    onChange={handleChange}
                                    required
                                    className="h-9 sm:h-10 text-xs sm:text-sm px-3"
                                />
                                {errors.tanggal_meninggal && <p className="text-xs sm:text-sm text-red-500 mt-1">{errors.tanggal_meninggal}</p>}
                            </div>
                        </>
                    )}

                    {documentType === 'KK' && (
                        <>
                            <div className="space-y-1 sm:space-y-1.5">
                                <Label htmlFor="no_kk" className="text-xs sm:text-sm font-medium">Nomor KK (Jika Perubahan/Pembaruan)</Label>
                                <Input
                                    id="no_kk"
                                    name="no_kk"
                                    value={data.no_kk}
                                    onChange={handleChange}
                                    maxLength={16}
                                    className="h-9 sm:h-10 text-xs sm:text-sm px-3"
                                    placeholder="Masukkan Nomor KK (Opsional untuk pembaruan)"
                                />
                                {errors.no_kk && <p className="text-xs sm:text-sm text-red-500 mt-1">{errors.no_kk}</p>}
                            </div>

                            <div className="space-y-1 sm:space-y-1.5">
                                <Label htmlFor="nama_kepala_keluarga" className="text-xs sm:text-sm font-medium">Nama Kepala Keluarga</Label>
                                <Input
                                    id="nama_kepala_keluarga"
                                    name="nama_kepala_keluarga"
                                    value={data.nama_kepala_keluarga}
                                    onChange={handleChange}
                                    required
                                    className="h-9 sm:h-10 text-xs sm:text-sm px-3"
                                    placeholder="Masukkan Nama Kepala Keluarga"
                                />
                                {errors.nama_kepala_keluarga && <p className="text-xs sm:text-sm text-red-500 mt-1">{errors.nama_kepala_keluarga}</p>}
                            </div>

                            <div className="md:grid md:grid-cols-2 md:gap-4">
                                <div className="space-y-1 sm:space-y-1.5 mb-3 md:mb-0">
                                    <Label htmlFor="hubungan_keluarga" className="text-xs sm:text-sm font-medium">Hubungan Keluarga</Label>
                                    <select 
                                        id="hubungan_keluarga"
                                        name="hubungan_keluarga"
                                        className="flex h-9 sm:h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-xs sm:text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={data.hubungan_keluarga}
                                        onChange={(e) => setData('hubungan_keluarga', e.target.value)}
                                        required
                                    >
                                        <option value="">Pilih Hubungan Keluarga</option>
                                        <option value="Kepala Keluarga">Kepala Keluarga</option>
                                        <option value="Suami">Suami</option>
                                        <option value="Istri">Istri</option>
                                        <option value="Anak">Anak</option>
                                        <option value="Menantu">Menantu</option>
                                        <option value="Cucu">Cucu</option>
                                        <option value="Orang Tua">Orang Tua</option>
                                        <option value="Mertua">Mertua</option>
                                        <option value="Famili Lain">Famili Lain</option>
                                    </select>
                                    {errors.hubungan_keluarga && <p className="text-xs sm:text-sm text-red-500 mt-1">{errors.hubungan_keluarga}</p>}
                                </div>

                                <div className="space-y-1 sm:space-y-1.5">
                                    <Label htmlFor="pendidikan" className="text-xs sm:text-sm font-medium">Pendidikan</Label>
                                    <select 
                                        id="pendidikan"
                                        name="pendidikan"
                                        className="flex h-9 sm:h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-xs sm:text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={data.pendidikan}
                                        onChange={(e) => setData('pendidikan', e.target.value)}
                                        required
                                    >
                                        <option value="">Pilih Pendidikan</option>
                                        <option value="Tidak/Belum Sekolah">Tidak/Belum Sekolah</option>
                                        <option value="SD/Sederajat">SD/Sederajat</option>
                                        <option value="SLTP/Sederajat">SLTP/Sederajat</option>
                                        <option value="SLTA/Sederajat">SLTA/Sederajat</option>
                                        <option value="D1/D2/D3">D1/D2/D3</option>
                                        <option value="D4/S1">D4/S1</option>
                                        <option value="S2">S2</option>
                                        <option value="S3">S3</option>
                                    </select>
                                    {errors.pendidikan && <p className="text-xs sm:text-sm text-red-500 mt-1">{errors.pendidikan}</p>}
                                </div>
                            </div>

                            <div className="md:grid md:grid-cols-2 md:gap-4">
                                <div className="space-y-1 sm:space-y-1.5 mb-3 md:mb-0">
                                    <Label htmlFor="golongan_darah" className="text-xs sm:text-sm font-medium">Golongan Darah</Label>
                                    <select 
                                        id="golongan_darah"
                                        name="golongan_darah"
                                        className="flex h-9 sm:h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-xs sm:text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={data.golongan_darah}
                                        onChange={(e) => setData('golongan_darah', e.target.value)}
                                        required
                                    >
                                        <option value="A">A</option>
                                        <option value="B">B</option>
                                        <option value="AB">AB</option>
                                        <option value="O">O</option>
                                        <option value="Tidak Tahu">Tidak Tahu</option>
                                    </select>
                                    {errors.golongan_darah && <p className="text-xs sm:text-sm text-red-500 mt-1">{errors.golongan_darah}</p>}
                                </div>

                                <div className="space-y-1 sm:space-y-1.5">
                                    <Label htmlFor="anggota_keluarga" className="text-xs sm:text-sm font-medium">Jumlah Anggota Keluarga</Label>
                                    <Input
                                        id="anggota_keluarga"
                                        name="anggota_keluarga"
                                        type="number"
                                        min="1"
                                        max="20"
                                        value={data.anggota_keluarga}
                                        onChange={handleChange}
                                        required
                                        className="h-9 sm:h-10 text-xs sm:text-sm px-3"
                                        placeholder="Jumlah anggota keluarga"
                                    />
                                    {errors.anggota_keluarga && <p className="text-xs sm:text-sm text-red-500 mt-1">{errors.anggota_keluarga}</p>}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Common fields for all document types - Indonesia 2025 */}
                    <div className="space-y-3 sm:space-y-4 border-t border-border pt-4 mt-4">
                        <p className="text-sm font-medium">Informasi Kontak dan Verifikasi Digital</p>
                        
                        <div className="md:grid md:grid-cols-2 md:gap-4">
                            <div className="space-y-1 sm:space-y-1.5 mb-3 md:mb-0">
                                <Label htmlFor="email" className="text-xs sm:text-sm font-medium">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={data.email}
                                    onChange={handleChange}
                                    required
                                    className="h-9 sm:h-10 text-xs sm:text-sm px-3"
                                    placeholder="Masukkan email aktif"
                                />
                                {errors.email && <p className="text-xs sm:text-sm text-red-500 mt-1">{errors.email}</p>}
                                <p className="text-xs text-muted-foreground mt-1">Untuk notifikasi status dokumen</p>
                            </div>

                            <div className="space-y-1 sm:space-y-1.5">
                                <Label htmlFor="no_telp" className="text-xs sm:text-sm font-medium">Nomor Telepon</Label>
                                <Input
                                    id="no_telp"
                                    name="no_telp"
                                    value={data.no_telp}
                                    onChange={handleChange}
                                    required
                                    className="h-9 sm:h-10 text-xs sm:text-sm px-3"
                                    placeholder="Contoh: 081234567890"
                                />
                                {errors.no_telp && <p className="text-xs sm:text-sm text-red-500 mt-1">{errors.no_telp}</p>}
                                <p className="text-xs text-muted-foreground mt-1">Untuk verifikasi dan notifikasi</p>
                            </div>
                        </div>

                        <div className="space-y-2 sm:space-y-3">

                            <div className="flex items-start space-x-2">
                                <input
                                    type="checkbox"
                                    id="persetujuan_data"
                                    name="persetujuan_data"
                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary mt-0.5"
                                    checked={data.persetujuan_data}
                                    onChange={(e) => setData('persetujuan_data', e.target.checked)}
                                    required
                                />
                                <Label htmlFor="persetujuan_data" className="text-xs sm:text-sm">
                                    Dengan ini saya menyetujui bahwa data yang diberikan adalah benar dan dapat digunakan sesuai dengan ketentuan layanan pemerintah untuk pemrosesan dokumen kependudukan
                                </Label>
                            </div>
                            {errors.persetujuan_data && <p className="text-xs sm:text-sm text-red-500 mt-1">{errors.persetujuan_data}</p>}
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 sm:gap-3 mt-4 sm:mt-6">
                        <Button type="button" variant="outline" onClick={onClose} className="h-9 sm:h-10 text-xs sm:text-sm px-3 sm:px-4">
                            Batal
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={processing} 
                            className="h-9 sm:h-10 text-xs sm:text-sm px-3 sm:px-4 bg-gray-900 hover:bg-gray-800 text-white font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="mr-2 size-4 animate-spin" />
                                    <span>Memproses...</span>
                                </>
                            ) : (
                                <span className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="size-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                    Ajukan Sekarang
                                </span>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
