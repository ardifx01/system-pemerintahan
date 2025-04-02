import axios from 'axios';
import { toast } from 'react-hot-toast';
import type { Document, DocumentType } from '@/types';

export interface DocumentSubmissionData {
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

export const DocumentService = {
    async getDocuments(): Promise<Document[]> {
        try {
            const response = await axios.get<Document[]>('/api/documents');
            return response.data;
        } catch (error) {
            console.error('Error fetching documents:', error);
            toast.error('Gagal memuat data dokumen');
            return [];
        }
    },

    async submitDocument(data: DocumentSubmissionData): Promise<Document> {
        try {
            const response = await axios.post<Document>('/api/documents/request', data);
            toast.success('Dokumen berhasil diajukan');
            return response.data;
        } catch (error: any) {
            console.error('Error submitting document:', error);
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Gagal mengajukan dokumen');
            }
            throw error;
        }
    },

    async downloadDocument(id: number): Promise<void> {
        try {
            const response = await axios.get(`/api/documents/${id}/download`, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `document-${id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading document:', error);
            toast.error('Gagal mengunduh dokumen');
        }
    },
};
