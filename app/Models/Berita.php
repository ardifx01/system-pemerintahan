<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Berita extends Model
{
    use HasFactory;

    protected $fillable = [
        'judul',
        'konten',
        'gambar',
        'penulis',
        'status', // Dipublikasi or Draf
        'user_id',
    ];

    protected $casts = [
        'tanggal_publikasi' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
