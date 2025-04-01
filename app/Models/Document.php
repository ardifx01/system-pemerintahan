<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Document extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'status',
        'notes',
        'file_path',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
    ];

    public const TYPE_KTP = 'KTP';
    public const TYPE_KK = 'KK';
    public const TYPE_AKTA_KELAHIRAN = 'AKTA_KELAHIRAN';
    public const TYPE_AKTA_KEMATIAN = 'AKTA_KEMATIAN';

    public const STATUS_DIPROSES = 'DIPROSES';
    public const STATUS_SELESAI = 'SELESAI';
    public const STATUS_DITOLAK = 'DITOLAK';

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
