import { type Document } from '@/types';
import { formatDistance } from 'date-fns';
import { id } from 'date-fns/locale';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, FileCheck, FileClock, FileX } from 'lucide-react';

interface Props {
    documents: Document[];
}

const statusConfig = {
    DIPROSES: { color: 'bg-yellow-100 text-yellow-800', icon: FileClock },
    SELESAI: { color: 'bg-green-100 text-green-800', icon: FileCheck },
    DITOLAK: { color: 'bg-red-100 text-red-800', icon: FileX },
} as const;

export default function DocumentHistory({ documents }: Props) {
    if (documents.length === 0) {
        return (
            <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/50 p-6 text-center">
                <p className="text-sm text-zinc-400">
                    Belum ada pengajuan dokumen. Silakan ajukan dokumen melalui tombol di atas.
                </p>
            </div>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Riwayat Dokumen</CardTitle>
                <CardDescription>Daftar pengajuan dokumen Anda</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {documents.map((doc) => {
                        const StatusIcon = statusConfig[doc.status].icon;
                        return (
                            <div key={doc.id} className="flex items-start gap-4">
                                <div className="mt-1">
                                    <FileText className="size-5 text-gray-500" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-medium">{doc.type.replace('_', ' ')}</h4>
                                        <Badge className={statusConfig[doc.status].color}>
                                            <StatusIcon className="mr-1 size-3" />
                                            {doc.status}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-gray-500">
                                        {formatDistance(new Date(doc.submittedAt), new Date(), {
                                            addSuffix: true,
                                            locale: id,
                                        })}
                                    </p>
                                    {doc.notes && (
                                        <p className="mt-2 text-sm text-gray-500">{doc.notes}</p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
