<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Response;
use Inertia\Inertia;

class DocumentController extends Controller
{
    public function index()
    {
        $documents = Document::where('user_id', Auth::id())
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
            $document = Document::create([
                'user_id' => Auth::id(),
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
        if ($document->user_id !== Auth::id()) {
            abort(403);
        }

        if (!$document->file_path || !Storage::exists($document->file_path)) {
            abort(404);
        }

        return Storage::download($document->file_path);
    }

    // Admin document management methods
    public function adminIndex()
    {
        // Return document statistics and list of all documents with related data
        $totalDocuments = Document::count();
        $pendingDocuments = Document::where('status', Document::STATUS_DIPROSES)->count();
        $approvedDocuments = Document::where('status', Document::STATUS_SELESAI)->count();
        $rejectedDocuments = Document::where('status', Document::STATUS_DITOLAK)->count();
        
        $documents = Document::with('user')
            ->orderBy('submitted_at', 'desc')
            ->get()
            ->map(function ($document) {
                return [
                    'id' => $document->id,
                    'document_number' => 'DOC-' . date('Y', strtotime($document->submitted_at)) . '-' . str_pad($document->id, 3, '0', STR_PAD_LEFT),
                    'type' => $document->type,
                    'user_name' => $document->nama,
                    'submitted_at' => $document->submitted_at->format('Y-m-d'),
                    'status' => $document->status,
                    'notes' => $document->notes,
                    'can_download' => $document->status === Document::STATUS_SELESAI && $document->file_path !== null,
                ];
            });

        return Inertia::render('admin/dokumen', [
            'stats' => [
                'total' => $totalDocuments,
                'pending' => $pendingDocuments,
                'approved' => $approvedDocuments,
                'rejected' => $rejectedDocuments,
            ],
            'documents' => $documents,
        ]);
    }

    public function show(Document $document)
    {
        return response()->json([
            'id' => $document->id,
            'type' => $document->type,
            'status' => $document->status,
            'nik' => $document->nik,
            'nama' => $document->nama,
            'alamat' => $document->alamat,
            'tempat_lahir' => $document->tempat_lahir,
            'tanggal_lahir' => $document->tanggal_lahir,
            'nama_ayah' => $document->nama_ayah,
            'nama_ibu' => $document->nama_ibu,
            'nama_almarhum' => $document->nama_almarhum,
            'tanggal_meninggal' => $document->tanggal_meninggal,
            'submitted_at' => $document->submitted_at->format('Y-m-d'),
            'notes' => $document->notes,
        ]);
    }

    public function approve(Document $document, Request $request)
    {
        $validated = $request->validate([
            'notes' => 'nullable|string',
        ]);

        $document->status = Document::STATUS_SELESAI;
        $document->notes = $validated['notes'] ?? null;
        // Here we would generate the document file and save its path
        // For now we'll simulate this with a placeholder
        $document->file_path = 'documents/' . $document->type . '_' . $document->id . '.pdf';
        $document->save();

        return back()->with('success', 'Dokumen berhasil disetujui');
    }

    public function reject(Document $document, Request $request)
    {
        $validated = $request->validate([
            'notes' => 'required|string',
        ]);

        $document->status = Document::STATUS_DITOLAK;
        $document->notes = $validated['notes'];
        $document->save();

        return back()->with('success', 'Dokumen telah ditolak');
    }

    public function adminDownload(Document $document)
    {
        if (!$document->file_path || !Storage::exists($document->file_path)) {
            abort(404);
        }

        return Storage::download($document->file_path);
    }
}
