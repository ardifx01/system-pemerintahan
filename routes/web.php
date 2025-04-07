<?php

use App\Http\Controllers\DocumentController;
use App\Http\Controllers\PendudukController;
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

    // Verifikasi Akun Penduduk
    Route::get('verifikasi', function () {
        return Inertia::render('admin/verifikasi');
    })->name('admin.verifikasi');

    // Manajemen Penduduk
    Route::controller(PendudukController::class)->group(function () {
        Route::get('penduduk', 'index')->name('admin.penduduk');
        Route::post('penduduk', 'store')->name('admin.penduduk.store');
        Route::get('penduduk/{penduduk}', 'show')->name('admin.penduduk.show');
        Route::put('penduduk/{penduduk}', 'update')->name('admin.penduduk.update');
        Route::delete('penduduk/{penduduk}', 'destroy')->name('admin.penduduk.destroy');
    });

    // Manajemen Dokumen
    Route::get('dokumen', function () {
        return Inertia::render('admin/dokumen');
    })->name('admin.dokumen');

    // Manajemen Berita
    Route::get('berita', function () {
        return Inertia::render('admin/berita');
    })->name('admin.berita');
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
