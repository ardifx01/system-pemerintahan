@extends('documents.layout', ['title' => 'Kartu Tanda Penduduk', 'documentTitle' => 'KARTU TANDA PENDUDUK', 'documentNumber' => 'KTP-' . str_pad($document->id, 6, '0', STR_PAD_LEFT)])

@section('content')
    <h2>KARTU TANDA PENDUDUK</h2>
    <p style="text-align: center; margin-bottom: 15px;">Nomor NIK: <strong>{{ $document->nik }}</strong></p>
    
    <div style="margin-bottom: 20px;">
        <p><strong>Nama Lengkap</strong> : {{ $document->nama }}</p>
        
        <p><strong>Tempat / Tanggal Lahir</strong> : {{ $document->tempat_lahir }}, {{ \Carbon\Carbon::parse($document->tanggal_lahir)->format('d F Y') }}</p>
        
        <p><strong>Jenis Kelamin</strong> : {{ $document->jenis_kelamin ?? 'Tidak diketahui' }}</p>
        
        <p><strong>Alamat</strong> : {{ $document->alamat }}</p>
        
        <p><strong>Agama</strong> : {{ $document->agama ?? '-' }}</p>
        
        <p><strong>Status Perkawinan</strong> : {{ $document->status_perkawinan ?? '-' }}</p>
        
        <p><strong>Pekerjaan</strong> : {{ $document->pekerjaan ?? '-' }}</p>
        
        <p><strong>Kewarganegaraan</strong> : Indonesia</p>
    </div>
    
    <div class="document-validity">
        <p>Kartu Tanda Penduduk ini berlaku sebagai identitas resmi warga Negara Republik Indonesia.</p>
        <p><strong>Wajib dibawa saat melakukan aktivitas yang memerlukan identifikasi resmi.</strong></p>
    </div>
@endsection
