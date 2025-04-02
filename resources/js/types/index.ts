import type { LucideIcon } from 'lucide-react';

export const DOCUMENT_TYPES = ['KTP', 'KK', 'AKTA_KELAHIRAN', 'AKTA_KEMATIAN'] as const;
export type DocumentType = (typeof DOCUMENT_TYPES)[number];

export const DOCUMENT_STATUSES = ['DIPROSES', 'SELESAI', 'DITOLAK'] as const;
export type DocumentStatus = (typeof DOCUMENT_STATUSES)[number];

export interface Document {
    id: number;
    userId: number;
    type: DocumentType;
    status: DocumentStatus;
    notes?: string;
    filePath?: string;
    nik: string;
    nama: string;
    alamat: string;
    tempatLahir?: string;
    tanggalLahir?: string;
    namaAyah?: string;
    namaIbu?: string;
    namaAlmarhum?: string;
    tanggalMeninggal?: string;
    submittedAt: string;
    createdAt: string;
    updatedAt: string;
}

export interface BreadcrumbItem {
    title: string;
    href?: string;
}

export interface DocumentTypeConfig {
    id: DocumentType;
    title: string;
    description: string;
    icon: LucideIcon;
}
