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
        
        // Common fields
        'nik',
        'nama',
        'alamat',
        
        // Digital verification fields (Indonesia 2025)
        'email',
        'no_telp',
        'persetujuan_data',
        
        // KTP & Birth Certificate fields
        'tempat_lahir',
        'tanggal_lahir',
        'jenis_kelamin',
        
        // KTP-specific fields
        'jenis_permohonan_ktp',
        'agama',
        'status_perkawinan',
        'pekerjaan',
        'kewarganegaraan',
        'scan_ktp',
        
        // Family-related fields
        'nama_ayah',
        'nama_ibu',
        
        // Death Certificate fields
        'nama_almarhum',
        'tanggal_meninggal',
        
        // Family Card fields
        'no_kk',
        'hubungan_keluarga',
        'pendidikan',
        'golongan_darah',
        'nama_kepala_keluarga',
        'anggota_keluarga',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
    ];

    // Document Types
    public const TYPE_KTP = 'KTP';
    public const TYPE_KK = 'KK';
    public const TYPE_AKTA_KELAHIRAN = 'AKTA_KELAHIRAN';
    public const TYPE_AKTA_KEMATIAN = 'AKTA_KEMATIAN';
    
    // KTP Application Types
    public const KTP_BARU = 'BARU';
    public const KTP_PERPANJANGAN = 'PERPANJANGAN';
    public const KTP_PENGGANTIAN = 'PENGGANTIAN';
    
    // Gender Options
    public const GENDER_MALE = 'Laki-laki';
    public const GENDER_FEMALE = 'Perempuan';

    public const STATUS_DIPROSES = 'DIPROSES';
    public const STATUS_SELESAI = 'SELESAI';
    public const STATUS_DITOLAK = 'DITOLAK';

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
