@extends('documents.layout', ['title' => 'Akta Kelahiran', 'documentTitle' => 'AKTA KELAHIRAN', 'documentNumber' => 'AK-' . str_pad($document->id, 6, '0', STR_PAD_LEFT)])

@section('content')
    <h2>AKTA KELAHIRAN</h2>
    <p style="text-align: center; margin-bottom: 15px;">Nomor: {{ 'AK' . str_pad($document->id, 8, '0', STR_PAD_LEFT) }}</p>
    
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
            <div class="label">Nama Ayah</div>
            <div class="value">: {{ $document->nama_ayah }}</div>
        </div>
        
        <div class="info-item">
            <div class="label">Nama Ibu</div>
            <div class="value">: {{ $document->nama_ibu }}</div>
        </div>
        
        <div class="info-item">
            <div class="label">Alamat</div>
            <div class="value">: {{ $document->alamat }}</div>
        </div>
    </div>
    
    <div class="document-validity">
        <p>Akta Kelahiran ini merupakan dokumen resmi negara yang dikeluarkan berdasarkan data yang diberikan oleh pemohon.</p>
        <p><strong>Dokumen ini sah dan memiliki kekuatan hukum.</strong></p>
    </div>
@endsection
