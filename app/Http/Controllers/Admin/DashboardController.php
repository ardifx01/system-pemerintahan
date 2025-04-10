<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Berita;
use App\Models\Document;
use App\Models\Penduduk;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Get counts for dashboard statistics
        $totalPenduduk = User::where('role', 'USER')->count();
        $pendingDokumen = Document::where('status', Document::STATUS_DIPROSES)->count();
        $totalBerita = Berita::count();
        $todayActivities = ActivityLog::whereDate('created_at', Carbon::today())->count();

        // Get recent activities
        $recentActivities = ActivityLog::with('user')
            ->latest()
            ->take(10)
            ->get()
            ->map(function ($activity) {
                return [
                    'id' => $activity->id,
                    'user' => $activity->user ? [
                        'name' => $activity->user->name,
                    ] : null,
                    'action' => $activity->action,
                    'description' => $activity->description,
                    'created_at' => $activity->created_at->diffForHumans(),
                    'date' => $activity->created_at->format('d M Y H:i'),
                ];
            });

        // Get recent documents
        $recentDocuments = Document::with('user')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($document) {
                return [
                    'id' => $document->id,
                    'type' => $document->type,
                    'status' => $document->status,
                    'user' => $document->user ? [
                        'name' => $document->user->name,
                    ] : null,
                    'created_at' => $document->created_at->diffForHumans(),
                ];
            });

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'totalPenduduk' => $totalPenduduk,
                'pendingDokumen' => $pendingDokumen,
                'totalBerita' => $totalBerita,
                'todayActivities' => $todayActivities,
                'recentActivities' => $recentActivities,
                'recentDocuments' => $recentDocuments,
            ],
        ]);
    }
}
