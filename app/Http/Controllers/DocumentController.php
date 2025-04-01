<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Response;
use Inertia\Inertia;

class DocumentController extends Controller
{
    public function index()
    {
        $documents = auth()->user()->documents()
            ->orderBy('submitted_at', 'desc')
            ->get()
            ->map(function ($document) {
                return [
                    'id' => $document->id,
                    'type' => $document->type,
                    'status' => $document->status,
                    'submittedAt' => $document->submitted_at->toISOString(),
                    'notes' => $document->notes,
                ];
            });

        return response()->json($documents);
    }

    public function store(Request $request)
    {
        $request->validate([
            'type' => 'required|in:ktp,kk,akta_kelahiran,akta_kematian',
        ]);

        $typeMap = [
            'ktp' => Document::TYPE_KTP,
            'kk' => Document::TYPE_KK,
            'akta_kelahiran' => Document::TYPE_AKTA_KELAHIRAN,
            'akta_kematian' => Document::TYPE_AKTA_KEMATIAN,
        ];

        $document = auth()->user()->documents()->create([
            'type' => $typeMap[$request->type],
            'status' => Document::STATUS_DIPROSES,
            'submitted_at' => now(),
        ]);

        return response()->json($document, 201);
    }

    public function download(Document $document)
    {
        // Check if user owns the document
        if ($document->user_id !== auth()->id()) {
            abort(403);
        }

        // Check if document is completed and has a file
        if ($document->status !== Document::STATUS_SELESAI || !$document->file_path) {
            abort(404);
        }

        return Storage::download($document->file_path);
    }
}
