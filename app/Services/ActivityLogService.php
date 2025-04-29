<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class ActivityLogService
{
    /**
     * Mencatat aktivitas yang dilakukan oleh pengguna
     *
     * @return ActivityLog
     */
    public function log(
        string $action,
        string $description,
        ?string $modelType = null,
        ?int $modelId = null,
        ?array $properties = null
    ): ActivityLog {
        $user = Auth::user();
        $userId = $user ? $user->id : null;

        return ActivityLog::create([
            'user_id' => $userId,
            'action' => $action,
            'description' => $description,
            'model_type' => $modelType,
            'model_id' => $modelId,
            'properties' => $properties,
        ]);
    }

    /**
     * Mencatat aktivitas yang terkait dengan dokumen
     *
     * @return ActivityLog
     */
    public function logDocumentActivity(
        string $action,
        string $description,
        int $documentId,
        ?array $properties = null
    ): ActivityLog {
        return $this->log(
            $action,
            $description,
            'App\Models\Document',
            $documentId,
            $properties
        );
    }

    /**
     * Mencatat aktivitas yang terkait dengan penduduk
     *
     * @return ActivityLog
     */
    public function logPendudukActivity(
        string $action,
        string $description,
        int $pendudukId,
        ?array $properties = null
    ): ActivityLog {
        return $this->log(
            $action,
            $description,
            'App\Models\Penduduk',
            $pendudukId,
            $properties
        );
    }

    /**
     * Mencatat aktivitas yang terkait dengan berita
     *
     * @return ActivityLog
     */
    public function logBeritaActivity(
        string $action,
        string $description,
        int $beritaId,
        ?array $properties = null
    ): ActivityLog {
        return $this->log(
            $action,
            $description,
            'App\Models\Berita',
            $beritaId,
            $properties
        );
    }
}
