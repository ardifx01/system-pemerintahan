<?php

namespace App\Services;

use App\Models\Document;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class DocumentGeneratorService
{
    /**
     * Generate a document file for the given document
     * 
     * @param Document $document The document to generate a file for
     * @return string|null The path to the generated file or null if generation failed
     */
    public function generateDocument(Document $document): ?string
    {
        try {
            // Ensure the storage directory exists
            if (!file_exists(public_path('documents'))) {
                mkdir(public_path('documents'), 0755, true);
            }
            
            // Get the appropriate view for the document type
            $view = $this->getDocumentView($document->type);
            
            // Generate a unique filename
            $filename = $this->generateFilename($document);
            
            // Generate the PDF
            $pdf = App::make('dompdf.wrapper');
            $pdf->loadView($view, ['document' => $document]);
            
            // Save the PDF directly to the public directory
            $filePath = 'documents/' . $filename;
            $fullPath = public_path($filePath);
            file_put_contents($fullPath, $pdf->output());
            
            // Return the relative path
            return $filePath;
        } catch (\Exception $e) {
            Log::error('Document generation failed: ' . $e->getMessage());
            return null;
        }
    }
    
    /**
     * Get the appropriate view for the document type
     * 
     * @param string $type The document type
     * @return string The view name
     */
    private function getDocumentView(string $type): string
    {
        return match ($type) {
            Document::TYPE_KTP => 'documents.ktp',
            Document::TYPE_KK => 'documents.kk',
            Document::TYPE_AKTA_KELAHIRAN => 'documents.akta-kelahiran',
            Document::TYPE_AKTA_KEMATIAN => 'documents.akta-kematian',
            default => 'documents.default',
        };
    }
    
    /**
     * Generate a unique filename for the document
     * 
     * @param Document $document The document
     * @return string The generated filename
     */
    private function generateFilename(Document $document): string
    {
        $prefix = match ($document->type) {
            Document::TYPE_KTP => 'KTP',
            Document::TYPE_KK => 'KK',
            Document::TYPE_AKTA_KELAHIRAN => 'AKTA_KELAHIRAN',
            Document::TYPE_AKTA_KEMATIAN => 'AKTA_KEMATIAN',
            default => 'DOC',
        };
        
        $timestamp = now()->format('YmdHis');
        return "{$prefix}_{$document->id}_{$timestamp}.pdf";
    }
}
