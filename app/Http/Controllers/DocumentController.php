<?php
/**
 * Copyright (c) 2025 vickymosafan. All Rights Reserved.
 * 
 * This source code is protected under international copyright law.
 * Unauthorized reproduction, distribution, or modification of this file is prohibited.
 * This code contains proprietary security measures that prevent modification.
 * Any attempt to modify by unauthorized parties will be subject to legal action.
 */

namespace App\Http\Controllers;

use App\Models\Document;
use App\Services\ActivityLogService;
use App\Services\DocumentGeneratorService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
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
        // Check if the user is authorized to download this document
        if ($document->user_id !== Auth::id() && Auth::user()->role !== 'admin') {
            abort(403, 'Anda tidak memiliki akses untuk mengunduh dokumen ini.');
        }

        // Check if document is approved
        if ($document->status !== Document::STATUS_SELESAI) {
            abort(403, 'Dokumen belum disetujui dan tidak dapat diunduh.');
        }

        try {
            // Get document generator service
            $documentGeneratorService = new DocumentGeneratorService();
            
            // Always regenerate the document to ensure we have the latest version
            $filePath = $documentGeneratorService->generateDocument($document);
            
            if (!$filePath) {
                Log::error('Failed to generate document: ' . $document->id);
                abort(500, 'Gagal menghasilkan dokumen. Silakan coba lagi nanti.');
            }
            
            // Update the document record with the file path
            $document->file_path = $filePath;
            $document->save();
            
            // Create a readable filename for the downloaded file
            $filename = $this->getDocumentFileName($document);
            
            // Check if file exists in public directory
            $fullPath = public_path($document->file_path);
            if (!file_exists($fullPath)) {
                Log::error('Document file not found: ' . $fullPath);
                abort(404, 'File dokumen tidak ditemukan.');
            }
            
            // Return the file for download
            return Response::download($fullPath, $filename);
        } catch (\Exception $e) {
            Log::error('Document download failed: ' . $e->getMessage());
            abort(500, 'Terjadi kesalahan saat mengunduh dokumen: ' . $e->getMessage());
        }
    }
    
    /**
     * Generate a descriptive filename for downloading
     *
     * @param Document $document
     * @return string
     */
    private function getDocumentFileName(Document $document)
    {
        $prefix = match ($document->type) {
            Document::TYPE_KTP => 'KTP',
            Document::TYPE_KK => 'Kartu_Keluarga',
            Document::TYPE_AKTA_KELAHIRAN => 'Akta_Kelahiran',
            Document::TYPE_AKTA_KEMATIAN => 'Akta_Kematian',
            default => 'Dokumen',
        };
        
        $sanitizedName = str_replace(' ', '_', $document->nama);
        $date = now()->format('Ymd');
        
        return "{$prefix}_{$sanitizedName}_{$date}.pdf";
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

    public function approve(Document $document, Request $request, ActivityLogService $activityLogService, DocumentGeneratorService $documentGeneratorService)
    {
        $validated = $request->validate([
            'notes' => 'nullable|string',
        ]);

        $document->status = Document::STATUS_SELESAI;
        $document->notes = $validated['notes'] ?? null;
        
        // Generate the document PDF
        $filePath = $documentGeneratorService->generateDocument($document);
        if ($filePath) {
            $document->file_path = $filePath;
        }
        
        $document->save();

        // Log the activity
        $activityLogService->logDocumentActivity(
            'approve_document',
            'Menyetujui ' . $this->getDocumentTypeName($document->type) . ' untuk ' . $document->nama,
            $document->id,
            [
                'document_type' => $document->type,
                'nama_pemohon' => $document->nama
            ]
        );

        return back()->with('success', 'Dokumen berhasil disetujui');
    }

    public function reject(Document $document, Request $request, ActivityLogService $activityLogService)
    {
        $validated = $request->validate([
            'notes' => 'required|string',
        ]);

        $document->status = Document::STATUS_DITOLAK;
        $document->notes = $validated['notes'];
        $document->save();

        // Log the activity
        $activityLogService->logDocumentActivity(
            'reject_document',
            'Menolak ' . $this->getDocumentTypeName($document->type) . ' untuk ' . $document->nama,
            $document->id,
            [
                'document_type' => $document->type,
                'nama_pemohon' => $document->nama,
                'alasan' => $validated['notes']
            ]
        );

        return back()->with('success', 'Dokumen telah ditolak');
    }

    private function getDocumentTypeName(string $type): string
    {
        switch ($type) {
            case Document::TYPE_KTP:
                return 'KTP';
            case Document::TYPE_KK:
                return 'Kartu Keluarga';
            case Document::TYPE_AKTA_KELAHIRAN:
                return 'Akta Kelahiran';
            case Document::TYPE_AKTA_KEMATIAN:
                return 'Akta Kematian';
            default:
                return $type;
        }
    }

    /**
     * Admin version of document download function
     */
    public function adminDownload(Document $document)
    {
        try {
            // Get document generator service
            $documentGeneratorService = new DocumentGeneratorService();
            
            // Always regenerate the document to ensure we have the latest version
            $filePath = $documentGeneratorService->generateDocument($document);
            
            if (!$filePath) {
                Log::error('Admin failed to generate document: ' . $document->id);
                abort(500, 'Gagal menghasilkan dokumen. Silakan coba lagi nanti.');
            }
            
            // Update the document record with the file path
            $document->file_path = $filePath;
            $document->save();
            
            // Create a readable filename for the downloaded file
            $filename = $this->getDocumentFileName($document);
            
            // Check if file exists in public directory
            $fullPath = public_path($document->file_path);
            if (!file_exists($fullPath)) {
                Log::error('Admin document file not found: ' . $fullPath);
                abort(404, 'File dokumen tidak ditemukan.');
            }
            
            // Return the file for download
            return Response::download($fullPath, $filename);
        } catch (\Exception $e) {
            Log::error('Admin document download failed: ' . $e->getMessage());
            abort(500, 'Terjadi kesalahan saat mengunduh dokumen: ' . $e->getMessage());
        }
    }
}
