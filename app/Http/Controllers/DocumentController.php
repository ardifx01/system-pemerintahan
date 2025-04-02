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
        $validated = $request->validate([
            'type' => 'required|in:KTP,KK,AKTA_KELAHIRAN,AKTA_KEMATIAN',
            'nik' => 'required|string|size:16',
            'nama' => 'required|string|max:255',
            'alamat' => 'required|string',
            'tempat_lahir' => 'required_if:type,KTP,AKTA_KELAHIRAN|string|nullable',
            'tanggal_lahir' => 'required_if:type,KTP,AKTA_KELAHIRAN|date|nullable',
            'nama_ayah' => 'required_if:type,AKTA_KELAHIRAN|string|nullable',
            'nama_ibu' => 'required_if:type,AKTA_KELAHIRAN|string|nullable',
            'nama_almarhum' => 'required_if:type,AKTA_KEMATIAN|string|nullable',
            'tanggal_meninggal' => 'required_if:type,AKTA_KEMATIAN|date|nullable',
        ]);

        try {
            $document = auth()->user()->documents()->create([
                'type' => $validated['type'],
                'status' => Document::STATUS_DIPROSES,
                'submitted_at' => now(),
                'nik' => $validated['nik'],
                'nama' => $validated['nama'],
                'alamat' => $validated['alamat'],
                'tempat_lahir' => $validated['tempat_lahir'] ?? null,
                'tanggal_lahir' => $validated['tanggal_lahir'] ?? null,
                'nama_ayah' => $validated['nama_ayah'] ?? null,
                'nama_ibu' => $validated['nama_ibu'] ?? null,
                'nama_almarhum' => $validated['nama_almarhum'] ?? null,
                'tanggal_meninggal' => $validated['tanggal_meninggal'] ?? null,
            ]);

            if ($request->wantsJson()) {
                return response()->json([
                    'message' => 'Dokumen berhasil diajukan',
                    'document' => $document
                ], 201);
            }

            return redirect()->route('penduduk.dashboard')
                ->with('success', 'Dokumen berhasil diajukan');
        } catch (\Exception $e) {
            if ($request->wantsJson()) {
                return response()->json([
                    'message' => 'Gagal mengajukan dokumen',
                    'error' => $e->getMessage()
                ], 500);
            }

            return back()->withErrors([
                'error' => 'Gagal mengajukan dokumen: ' . $e->getMessage()
            ]);
        }
    }

    public function download(Document $document)
    {
        if ($document->user_id !== auth()->id()) {
            abort(403);
        }

        if (!$document->file_path || !Storage::exists($document->file_path)) {
            abort(404);
        }

        return Storage::download($document->file_path);
    }
}
