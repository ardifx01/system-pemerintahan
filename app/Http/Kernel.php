<?php

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel
{
    /**
     * The application's global HTTP middleware stack.
     *
     * These middleware are run during every request to your application.
     *
     * @var array<int, class-string|string>
     */
    protected $middleware = [
        // \App\Http\Middleware\TrustHosts::class,
        'App\Http\Middleware\TrustProxies',
        'Illuminate\Http\Middleware\HandleCors',
        'App\Http\Middleware\PreventRequestsDuringMaintenance',
        'Illuminate\Foundation\Http\Middleware\ValidatePostSize',
        'App\Http\Middleware\TrimStrings',
        'Illuminate\Foundation\Http\Middleware\ConvertEmptyStringsToNull',
    ];

    /**
     * The application's route middleware groups.
     *
     * @var array<string, array<int, class-string|string>>
     */
    protected $middlewareGroups = [
        'web' => [
            'App\Http\Middleware\EncryptCookies',
            'Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse',
            'Illuminate\Session\Middleware\StartSession',
            'Illuminate\View\Middleware\ShareErrorsFromSession',
            'App\Http\Middleware\VerifyCsrfToken',
            'Illuminate\Routing\Middleware\SubstituteBindings',
            'App\Http\Middleware\HandleInertiaRequests',
            'Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets',
        ],

        'api' => [
            'Illuminate\Routing\Middleware\ThrottleRequests:api',
            'Illuminate\Routing\Middleware\SubstituteBindings',
        ],
    ];

    /**
     * The application's middleware aliases.
     *
     * Aliases may be used instead of class names to conveniently assign middleware to routes and groups.
     *
     * @var array<string, class-string|string>
     */
    protected $middlewareAliases = [
        'auth' => 'App\Http\Middleware\Authenticate',
        'auth.basic' => 'Illuminate\Auth\Middleware\AuthenticateWithBasicAuth',
        'auth.session' => 'Illuminate\Session\Middleware\AuthenticateSession',
        'cache.headers' => 'Illuminate\Http\Middleware\SetCacheHeaders',
        'can' => 'Illuminate\Auth\Middleware\Authorize',
        'guest' => 'App\Http\Middleware\RedirectIfAuthenticated',
        'password.confirm' => 'Illuminate\Auth\Middleware\RequirePassword',
        'precognitive' => 'Illuminate\Foundation\Http\Middleware\HandlePrecognitiveRequests',
        'signed' => 'App\Http\Middleware\ValidateSignature',
        'throttle' => 'Illuminate\Routing\Middleware\ThrottleRequests',
        'verified' => 'Illuminate\Auth\Middleware\EnsureEmailIsVerified',
        'admin' => 'App\Http\Middleware\AdminMiddleware',
        'penduduk' => 'App\Http\Middleware\PendudukMiddleware',
    ];
}
