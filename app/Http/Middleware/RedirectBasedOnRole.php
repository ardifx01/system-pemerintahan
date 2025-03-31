<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RedirectBasedOnRole
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user()) {
            if ($request->user()->role === 'admin') {
                return redirect()->route('admin.dashboard');
            }
            return redirect()->route('penduduk.dashboard');
        }

        return $next($request);
    }
}
