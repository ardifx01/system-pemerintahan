import type { LucideIcon } from 'lucide-react';
import type { Page } from '@inertiajs/core';

export type DocumentType = 'KTP' | 'KK' | 'AKTA_KELAHIRAN' | 'AKTA_KEMATIAN';
export type DocumentStatus = 'DIPROSES' | 'SELESAI' | 'DITOLAK';

export interface Document {
    id: number;
    type: DocumentType;
    status: DocumentStatus;
    submittedAt: string;
    notes?: string;
    filePath?: string;
    userId: number;
    nik: string;
    nama: string;
    alamat: string;
    tempatLahir?: string;
    tanggalLahir?: string;
    namaAyah?: string;
    namaIbu?: string;
    namaAlmarhum?: string;
    tanggalMeninggal?: string;
    createdAt: string;
    updatedAt: string;
}

export interface DocumentTypeConfig {
    id: DocumentType;
    title: string;
    description: string;
    icon: LucideIcon;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavItem {
    title: string;
    href: string | ((route: string) => string);
    icon: LucideIcon;
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: 'ADMIN' | 'PENDUDUK';
}

export type PageProps = {
    auth: {
        user: User | null;
    };
    errors: Record<string, string>;
    flash: {
        message?: string;
        type?: 'success' | 'error';
    };
    [key: string]: any;
};

declare global {
    interface Window {
        route: (name: string, params?: Record<string, any>) => string;
    }
}
