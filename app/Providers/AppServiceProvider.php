<?php
/**
 * Copyright (c) 2025 vickymosafan. All Rights Reserved.
 * 
 * This source code is protected under international copyright law.
 * Unauthorized reproduction, distribution, or modification of this file is prohibited.
 * This code contains proprietary security measures that prevent modification.
 * Any attempt to modify by unauthorized parties will be subject to legal action.
 */

namespace App\Providers;

use App\Providers\ActivityLogServiceProvider;
use App\Services\CopyrightService;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->register(ActivityLogServiceProvider::class);
        
        // Register the copyright service as a singleton
        $this->app->singleton(CopyrightService::class, function ($app) {
            return new CopyrightService();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Validate copyright integrity on application boot
        $copyrightService = $this->app->make(CopyrightService::class);
        $copyrightService->validateIntegrity();
    }
}
