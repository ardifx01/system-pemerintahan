@extends('documents.layout', ['title' => 'Akta Kelahiran', 'documentTitle' => 'AKTA KELAHIRAN', 'documentNumber' => 'AK-' . str_pad($document->id, 6, '0', STR_PAD_LEFT)])

@section('content')
    <h2>AKTA KELAHIRAN</h2>
    <p style="text-align: center; margin-bottom: 15px;">Nomor: {{ 'AK' . str_pad($document->id, 8, '0', STR_PAD_LEFT) }}</p>
    
    <div style="margin-bottom: 20px;">
        <p><strong>Nama Lengkap</strong> : {{ $document->nama }}</p>
        
        <p><strong>Tempat / Tanggal Lahir</strong> : {{ $document->tempat_lahir }}, {{ \Carbon\Carbon::parse($document->tanggal_lahir)->format('d F Y') }}</p>
        
        <p><strong>Jenis Kelamin</strong> : {{ $document->jenis_kelamin ?? 'Tidak diketahui' }}</p>
        
        <p><strong>Nama Ayah</strong> : {{ $document->nama_ayah }}</p>
        
        <p><strong>Nama Ibu</strong> : {{ $document->nama_ibu }}</p>
        
        <p><strong>Alamat</strong> : {{ $document->alamat }}</p>
    </div>
    
    <div class="document-validity">
        <p>Akta Kelahiran ini merupakan dokumen resmi negara yang dikeluarkan berdasarkan data yang diberikan oleh pemohon.</p>
        <p><strong>Dokumen ini sah dan memiliki kekuatan hukum.</strong></p>
    </div>
@endsection
