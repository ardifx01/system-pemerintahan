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
            const response = await axios.get<Document[]>('/penduduk/documents');
            return response.data;
        } catch (error) {
            console.error('Error fetching documents:', error);
            toast.error('Gagal memuat daftar dokumen');
            return [];
        }
    },

    async submitDocument(data: DocumentSubmissionData): Promise<Document> {
        try {
            const response = await axios.post<{ document: Document }>('/penduduk/documents', data);
            toast.success('Dokumen berhasil diajukan');
            return response.data.document;
        } catch (error) {
            console.error('Error submitting document:', error);
            toast.error('Gagal mengajukan dokumen');
            throw error;
        }
    },

    async downloadDocument(id: number): Promise<void> {
        try {
            const response = await axios.get(`/penduduk/documents/${id}/download`, {
                responseType: 'blob'
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
            throw error;
        }
    }
};
