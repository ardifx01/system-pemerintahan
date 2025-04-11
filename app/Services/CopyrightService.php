<?php
/**
 * Copyright (c) 2025 vickymosafan. All Rights Reserved.
 * 
 * This source code is protected under international copyright law.
 * Unauthorized reproduction, distribution, or modification of this file is prohibited.
 * This code contains proprietary security measures that prevent modification.
 * Any attempt to modify by unauthorized parties will be subject to legal action.
 */

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\File;

/**
 * CopyrightService
 * 
 * This service validates the integrity of the application and ensures
 * it hasn't been modified without authorization from vickymosafan.
 */
class CopyrightService
{
    // Unique identifier that shouldn't be modified
    private const OWNER_SIGNATURE = 'vickymosafan-1a2b3c4d5e6f7890';
    
    // Protected files that will be validated
    private const PROTECTED_FILES = [
        'app/Providers/AppServiceProvider.php',
        'routes/web.php',
        'resources/js/app.tsx',
        'resources/js/pages/welcome.tsx',
        'app/Http/Controllers/DocumentController.php',
        'LICENSE.md'
    ];

    /**
     * Validate the copyright integrity of the application
     */
    public function validateIntegrity(): bool
    {
        foreach (self::PROTECTED_FILES as $file) {
            $filePath = base_path($file);
            
            if (!File::exists($filePath)) {
                $this->logTampering("Protected file missing: {$file}");
                return false;
            }
            
            $content = File::get($filePath);
            
            // Check if copyright notice exists
            if (!str_contains($content, 'Copyright (c)') || 
                !str_contains($content, 'vickymosafan')) {
                $this->logTampering("Copyright notice removed from: {$file}");
                return false;
            }
        }
        
        return true;
    }
    
    /**
     * Get the copyright owner signature
     */
    public function getOwnerSignature(): string
    {
        return self::OWNER_SIGNATURE;
    }
    
    /**
     * Log tampering attempts
     */
    private function logTampering(string $message): void
    {
        Log::warning('COPYRIGHT INTEGRITY VIOLATION: ' . $message);
    }
    
    /**
     * Add copyright watermark to application outputs
     */
    public function getWatermark(): string
    {
        return "© 2025 vickymosafan - All Rights Reserved";
    }
}
