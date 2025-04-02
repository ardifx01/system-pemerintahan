<?php

use App\Http\Controllers\DocumentController;
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

    // Document routes
    Route::controller(DocumentController::class)->group(function () {
        Route::get('documents', 'index')->name('documents.index');
        Route::post('documents', 'store')->name('documents.store');
        Route::get('documents/{document}/download', 'download')->name('documents.download');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
