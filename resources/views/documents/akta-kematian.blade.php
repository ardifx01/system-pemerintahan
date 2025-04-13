@extends('documents.layout', ['title' => 'Akta Kematian', 'documentTitle' => 'AKTA KEMATIAN', 'documentNumber' => 'AM-' . str_pad($document->id, 6, '0', STR_PAD_LEFT)])

@section('content')
    <div style="text-align: center; margin-bottom: 20px;">
        <h2>AKTA KEMATIAN</h2>
        <p>Nomor: {{ 'AM' . str_pad($document->id, 8, '0', STR_PAD_LEFT) }}</p>
    </div>

    <div style="text-align: center; margin-bottom: 30px;">
        <p>Dengan ini menerangkan bahwa pada tanggal {{ \Carbon\Carbon::parse($document->tanggal_meninggal)->format('d F Y') }}</p>
        <p style="font-size: 18px; font-weight: bold; margin: 15px 0;">Telah Meninggal Dunia:</p>
    </div>

    <div class="info-item clearfix">
        <div class="label">Nama Lengkap</div>
        <div class="value">: {{ $document->nama_almarhum }}</div>
    </div>
    
    <div class="info-item clearfix">
        <div class="label">NIK</div>
        <div class="value">: {{ $document->nik }}</div>
    </div>
    
    <div class="info-item clearfix">
        <div class="label">Tanggal Meninggal</div>
        <div class="value">: {{ \Carbon\Carbon::parse($document->tanggal_meninggal)->format('d F Y') }}</div>
    </div>
    
    <div class="info-item clearfix">
        <div class="label">Alamat Terakhir</div>
        <div class="value">: {{ $document->alamat }}</div>
    </div>
    
    <div class="info-item clearfix">
        <div class="label">Nama Pelapor</div>
        <div class="value">: {{ $document->nama }}</div>
    </div>
    
    <div style="margin-top: 40px; padding: 15px; border: 1px dashed #aaa; text-align: center;">
        <p>Akta Kematian ini merupakan dokumen resmi negara yang dikeluarkan berdasarkan data yang diberikan oleh pemohon.</p>
        <p>Dokumen ini sah dan memiliki kekuatan hukum.</p>
    </div>
@endsection
