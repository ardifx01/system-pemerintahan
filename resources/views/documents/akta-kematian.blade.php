@extends('documents.layout', ['title' => 'Akta Kematian', 'documentTitle' => 'AKTA KEMATIAN', 'documentNumber' => 'AM-' . str_pad($document->id, 6, '0', STR_PAD_LEFT)])

@section('content')
    <h2>AKTA KEMATIAN</h2>
    <p style="text-align: center; margin-bottom: 15px;">Nomor: {{ 'AM' . str_pad($document->id, 8, '0', STR_PAD_LEFT) }}</p>
    
    <div style="margin-bottom: 20px;">
        <p><strong>Nama Lengkap</strong> : {{ $document->nama_almarhum }}</p>
        
        <p><strong>NIK</strong> : {{ $document->nik }}</p>
        
        <p><strong>Tempat Meninggal</strong> : {{ $document->tempat_meninggal ?? 'Rumah Sakit' }}</p>
        
        <p><strong>Tanggal Meninggal</strong> : {{ \Carbon\Carbon::parse($document->tanggal_meninggal)->format('d F Y') }}</p>
        
        <p><strong>Penyebab Kematian</strong> : {{ $document->penyebab_kematian ?? 'Sakit' }}</p>
        
        <p><strong>Alamat Terakhir</strong> : {{ $document->alamat }}</p>
        
        <p><strong>Nama Pelapor</strong> : {{ $document->nama }}</p>
    </div>
    
    <div class="document-validity">
        <p>Akta Kematian ini merupakan dokumen resmi negara yang dikeluarkan berdasarkan data yang diberikan oleh pemohon.</p>
        <p><strong>Dokumen ini sah dan memiliki kekuatan hukum.</strong></p>
    </div>
@endsection
