import { Document } from '@/types';

export class DocumentService {
    static async getDocuments(): Promise<Document[]> {
        const response = await fetch('/api/documents');
        if (!response.ok) {
            throw new Error('Failed to fetch documents');
        }
        return response.json();
    }

    static async requestDocument(type: string): Promise<void> {
        const response = await fetch('/api/documents/request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ type }),
        });
        
        if (!response.ok) {
            throw new Error('Failed to request document');
        }
    }
}
