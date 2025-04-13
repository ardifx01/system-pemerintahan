@extends('documents.layout', ['title' => 'Kartu Tanda Penduduk', 'documentTitle' => 'KARTU TANDA PENDUDUK', 'documentNumber' => 'KTP-' . str_pad($document->id, 6, '0', STR_PAD_LEFT)])

@section('content')
    <h2>KARTU TANDA PENDUDUK</h2>
    <p style="text-align: center; margin-bottom: 15px;">Nomor NIK: <strong>{{ $document->nik }}</strong></p>
    
    <div class="info-section">
        <div class="info-item">
            <div class="label">Nama Lengkap</div>
            <div class="value">: {{ $document->nama }}</div>
        </div>
        
        <div class="info-item">
            <div class="label">Tempat / Tanggal Lahir</div>
            <div class="value">: {{ $document->tempat_lahir }}, {{ \Carbon\Carbon::parse($document->tanggal_lahir)->format('d F Y') }}</div>
        </div>
        
        <div class="info-item">
            <div class="label">Jenis Kelamin</div>
            <div class="value">: {{ $document->jenis_kelamin ?? 'Tidak diketahui' }}</div>
        </div>
        
        <div class="info-item">
            <div class="label">Alamat</div>
            <div class="value">: {{ $document->alamat }}</div>
        </div>
        
        <div class="info-item">
            <div class="label">Agama</div>
            <div class="value">: {{ $document->agama ?? '-' }}</div>
        </div>
        
        <div class="info-item">
            <div class="label">Status Perkawinan</div>
            <div class="value">: {{ $document->status_perkawinan ?? '-' }}</div>
        </div>
        
        <div class="info-item">
            <div class="label">Pekerjaan</div>
            <div class="value">: {{ $document->pekerjaan ?? '-' }}</div>
        </div>
        
        <div class="info-item">
            <div class="label">Kewarganegaraan</div>
            <div class="value">: Indonesia</div>
        </div>
    </div>
    
    <div class="document-validity">
        <p>Kartu Tanda Penduduk ini berlaku sebagai identitas resmi warga Negara Republik Indonesia.</p>
        <p><strong>Wajib dibawa saat melakukan aktivitas yang memerlukan identifikasi resmi.</strong></p>
    </div>
@endsection
