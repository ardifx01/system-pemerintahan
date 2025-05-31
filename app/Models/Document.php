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
        'nik',
        'nama',
        'alamat',
        'tempat_lahir',
        'tanggal_lahir',
        'nama_ayah',
        'nama_ibu',
        'nama_almarhum',
        'tanggal_meninggal',
        'jenis_permohonan_ktp', // Field untuk jenis permohonan KTP (BARU/PERPANJANGAN/PENGGANTIAN)
        'scan_ktp',             // Field untuk menyimpan nama file scan KTP
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
