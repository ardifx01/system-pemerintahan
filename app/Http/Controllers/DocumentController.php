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
            'type' => 'required|in:KTP,KK,AKTA_KELAHIRAN,AKTA_KEMATIAN',
            'nik' => 'required|string',
            'nama' => 'required|string',
            'alamat' => 'required|string',
            'tempat_lahir' => 'required_if:type,KTP|string|nullable',
            'tanggal_lahir' => 'required_if:type,KTP|date|nullable',
            'nama_ayah' => 'required_if:type,AKTA_KELAHIRAN|string|nullable',
            'nama_ibu' => 'required_if:type,AKTA_KELAHIRAN|string|nullable',
            'nama_almarhum' => 'required_if:type,AKTA_KEMATIAN|string|nullable',
            'tanggal_meninggal' => 'required_if:type,AKTA_KEMATIAN|date|nullable',
        ]);

        $document = auth()->user()->documents()->create([
            'type' => $request->type,
            'status' => Document::STATUS_DIPROSES,
            'submitted_at' => now(),
            'nik' => $request->nik,
            'nama' => $request->nama,
            'alamat' => $request->alamat,
            'tempat_lahir' => $request->tempat_lahir,
            'tanggal_lahir' => $request->tanggal_lahir,
            'nama_ayah' => $request->nama_ayah,
            'nama_ibu' => $request->nama_ibu,
            'nama_almarhum' => $request->nama_almarhum,
            'tanggal_meninggal' => $request->tanggal_meninggal,
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
