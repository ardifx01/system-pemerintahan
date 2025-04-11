<?php
/**
 * Copyright (c) 2025 vickymosafan. All Rights Reserved.
 * 
 * This source code is protected under international copyright law.
 * Unauthorized reproduction, distribution, or modification of this file is prohibited.
 * This code contains proprietary security measures that prevent modification.
 * Any attempt to modify by unauthorized parties will be subject to legal action.
 */

namespace App\Http\Middleware;

use App\Services\CopyrightService;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class CopyrightProtectionMiddleware
{
    protected $copyrightService;

    public function __construct(CopyrightService $copyrightService)
    {
        $this->copyrightService = $copyrightService;
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): SymfonyResponse
    {
        // Check copyright integrity before processing request
        $isValid = $this->copyrightService->validateIntegrity();
        
        if (!$isValid) {
            // If integrity check fails, we could log this or take other actions
            // For serious protection, you could even disable the application
            return response()->json([
                'error' => 'Application integrity violation detected. 
                           This application is protected by copyright 
                           and has been modified without authorization 
                           from vickymosafan.'
            ], 403);
        }
        
        $response = $next($request);
        
        // Add copyright headers to response using the appropriate method
        // based on response type
        if ($response instanceof Response) {
            $response->header('X-Copyright', $this->copyrightService->getWatermark());
            $response->header('X-Owner', 'vickymosafan');
        } elseif ($response instanceof \Illuminate\Http\JsonResponse) {
            $response->header('X-Copyright', $this->copyrightService->getWatermark());
            $response->header('X-Owner', 'vickymosafan');
        } else {
            // For other response types (Symfony Response)
            $response->headers->set('X-Copyright', $this->copyrightService->getWatermark());
            $response->headers->set('X-Owner', 'vickymosafan');
        }
        
        return $response;
    }
}
