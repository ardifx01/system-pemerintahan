<?php

namespace App\Http\Middleware;

use App\Providers\RouteServiceProvider;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RedirectIfAuthenticated
{
    /**
     * Handle an incoming request.
     * 
     * This middleware serves two purposes:
     * 1. For guest routes (like login pages): Redirects authenticated users to their appropriate dashboard
     * 2. For auth routes: Ensures users are redirected to the correct dashboard based on their role
     * 
     * @param string ...$guards  Authentication guards to check
     */
    public function handle(Request $request, Closure $next, string ...$guards): Response
    {
        $guards = empty($guards) ? [null] : $guards;

        foreach ($guards as $guard) {
            if (Auth::guard($guard)->check()) {
                $user = Auth::guard($guard)->user();
                
                // Redirect to appropriate dashboard based on user role
                if ($user->role === 'admin') {
                    return redirect()->route('admin.dashboard');
                }
                
                return redirect()->route('penduduk.dashboard');
            }
        }

        return $next($request);
    }
}
