@extends('documents.layout', ['title' => 'Akta Kelahiran', 'documentTitle' => 'AKTA KELAHIRAN', 'documentNumber' => 'AK-' . str_pad($document->id, 6, '0', STR_PAD_LEFT)])

@section('content')
    <div style="text-align: center; margin-bottom: 20px;">
        <h2>AKTA KELAHIRAN</h2>
        <p>Nomor: {{ 'AK' . str_pad($document->id, 8, '0', STR_PAD_LEFT) }}</p>
    </div>

    <div style="text-align: center; margin-bottom: 30px;">
        <p>Dengan ini menerangkan bahwa pada tanggal {{ \Carbon\Carbon::parse($document->tanggal_lahir)->format('d F Y') }}</p>
        <p>Di {{ $document->tempat_lahir }}</p>
        <p style="font-size: 18px; font-weight: bold; margin: 15px 0;">Telah Lahir Seorang Anak:</p>
    </div>

    <div class="info-item clearfix">
        <div class="label">Nama Lengkap</div>
        <div class="value">: {{ $document->nama }}</div>
    </div>
    
    <div class="info-item clearfix">
        <div class="label">Tempat / Tanggal Lahir</div>
        <div class="value">: {{ $document->tempat_lahir }}, {{ \Carbon\Carbon::parse($document->tanggal_lahir)->format('d F Y') }}</div>
    </div>
    
    <div class="info-item clearfix">
        <div class="label">Jenis Kelamin</div>
        <div class="value">: {{ $document->jenis_kelamin ?? 'Tidak diketahui' }}</div>
    </div>
    
    <div class="info-item clearfix">
        <div class="label">Nama Ayah</div>
        <div class="value">: {{ $document->nama_ayah }}</div>
    </div>
    
    <div class="info-item clearfix">
        <div class="label">Nama Ibu</div>
        <div class="value">: {{ $document->nama_ibu }}</div>
    </div>
    
    <div class="info-item clearfix">
        <div class="label">Alamat</div>
        <div class="value">: {{ $document->alamat }}</div>
    </div>
    
    <div style="margin-top: 40px; padding: 15px; border: 1px dashed #aaa; text-align: center;">
        <p>Akta Kelahiran ini merupakan dokumen resmi negara yang dikeluarkan berdasarkan data yang diberikan oleh pemohon.</p>
        <p>Dokumen ini sah dan memiliki kekuatan hukum.</p>
    </div>
@endsection
