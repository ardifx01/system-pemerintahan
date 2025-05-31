<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('type');
            $table->string('status');
            $table->text('notes')->nullable();
            $table->string('file_path')->nullable();
            
            // Common fields
            $table->string('nik')->nullable(); // Made nullable for new KTP applications
            $table->string('nama');
            $table->text('alamat');
            
            // Digital verification fields (Indonesia 2025)
            $table->string('email')->nullable();
            $table->string('no_telp')->nullable();
            $table->boolean('persetujuan_data')->default(false);
            
            // KTP & Birth Certificate fields
            $table->string('tempat_lahir')->nullable();
            $table->date('tanggal_lahir')->nullable();
            $table->string('jenis_kelamin')->nullable();
            
            // KTP-specific fields
            $table->string('jenis_permohonan_ktp')->nullable(); // BARU/PERPANJANGAN/PENGGANTIAN
            $table->string('agama')->nullable();
            $table->string('status_perkawinan')->nullable();
            $table->string('pekerjaan')->nullable();
            $table->string('kewarganegaraan')->nullable();
            $table->string('scan_ktp')->nullable(); // Field for storing scan KTP filename
            
            // Family-related fields
            $table->string('nama_ayah')->nullable();
            $table->string('nama_ibu')->nullable();
            
            // Death Certificate fields
            $table->string('nama_almarhum')->nullable();
            $table->date('tanggal_meninggal')->nullable();
            
            // Family Card fields
            $table->string('no_kk')->nullable();
            $table->string('hubungan_keluarga')->nullable();
            $table->string('pendidikan')->nullable();
            $table->string('golongan_darah')->nullable();
            $table->string('nama_kepala_keluarga')->nullable();
            $table->text('anggota_keluarga')->nullable();
            
            $table->timestamp('submitted_at')->useCurrent();
            $table->timestamps();

            $table->index(['user_id', 'type']);
            $table->index(['user_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
