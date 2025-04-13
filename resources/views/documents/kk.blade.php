@extends('documents.layout', ['title' => 'Kartu Keluarga', 'documentTitle' => 'KARTU KELUARGA', 'documentNumber' => 'KK-' . str_pad($document->id, 6, '0', STR_PAD_LEFT)])

@section('content')
    <div style="text-align: center; margin-bottom: 20px;">
        <h2>KARTU KELUARGA</h2>
        <p>Nomor Kartu Keluarga: {{ 'KK' . $document->nik }}</p>
    </div>

    <div style="margin-bottom: 20px;">
        <div style="font-weight: bold; margin-bottom: 10px;">DATA KEPALA KELUARGA</div>
        
        <div class="info-item clearfix">
            <div class="label">Nama Lengkap</div>
            <div class="value">: {{ $document->nama }}</div>
        </div>
        
        <div class="info-item clearfix">
            <div class="label">NIK</div>
            <div class="value">: {{ $document->nik }}</div>
        </div>
        
        <div class="info-item clearfix">
            <div class="label">Alamat</div>
            <div class="value">: {{ $document->alamat }}</div>
        </div>
    </div>
    
    <div style="margin-bottom: 20px;">
        <div style="font-weight: bold; margin-bottom: 10px;">DAFTAR ANGGOTA KELUARGA</div>
        
        <table style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr style="background-color: #f2f2f2;">
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">No</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Nama Lengkap</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">NIK</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Hubungan</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">1</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">{{ $document->nama }}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">{{ $document->nik }}</td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">Kepala Keluarga</td>
                </tr>
                <!-- Anggota keluarga lainnya bisa ditambahkan melalui data yang lebih lengkap -->
            </tbody>
        </table>
    </div>
    
    <div style="margin-top: 40px; padding: 15px; border: 1px dashed #aaa; text-align: center;">
        <p>Kartu Keluarga ini merupakan dokumen resmi yang berisi data keluarga dan berlaku seumur hidup kecuali terjadi perubahan atas data keluarga.</p>
    </div>
@endsection
