<?php

use App\Http\Middleware\AdminMiddleware;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Admin routes
Route::middleware(['auth', 'verified', AdminMiddleware::class])->prefix('admin')->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('admin/dashboard');
    })->name('admin.dashboard');
});

// Penduduk routes
Route::middleware(['auth', 'verified'])->prefix('penduduk')->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('penduduk/dashboard');
    })->name('penduduk.dashboard');
});

// Document routes
Route::middleware(['auth'])->group(function () {
    Route::get('/api/documents', [DocumentController::class, 'index']);
    Route::post('/api/documents/request', [DocumentController::class, 'store']);
    Route::get('/api/documents/{document}/download', [DocumentController::class, 'download']);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
