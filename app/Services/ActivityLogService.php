<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class ActivityLogService
{
    /**
     * Log an activity performed by a user
     *
     * @param string $action The action performed
     * @param string $description A description of the activity
     * @param string|null $modelType The type of model affected
     * @param int|null $modelId The ID of the model affected
     * @param array|null $properties Additional properties to store
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
     * Log a document-related activity
     *
     * @param string $action The action performed
     * @param string $description A description of the activity
     * @param int $documentId The document ID
     * @param array|null $properties Additional properties to store
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
     * Log a penduduk-related activity
     *
     * @param string $action The action performed
     * @param string $description A description of the activity
     * @param int $pendudukId The penduduk ID
     * @param array|null $properties Additional properties to store
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
     * Log a berita-related activity
     *
     * @param string $action The action performed
     * @param string $description A description of the activity
     * @param int $beritaId The berita ID
     * @param array|null $properties Additional properties to store
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
