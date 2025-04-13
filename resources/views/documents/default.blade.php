@extends('documents.layout', ['title' => 'Dokumen Resmi', 'documentTitle' => 'DOKUMEN KEPENDUDUKAN', 'documentNumber' => 'DOC-' . str_pad($document->id, 6, '0', STR_PAD_LEFT)])

@section('content')
    <div style="text-align: center; margin-bottom: 20px;">
        <h2>DOKUMEN RESMI KEPENDUDUKAN</h2>
        <p>Nomor: {{ 'DOC' . str_pad($document->id, 8, '0', STR_PAD_LEFT) }}</p>
    </div>

    <div class="info-item clearfix">
        <div class="label">Jenis Dokumen</div>
        <div class="value">: {{ $document->type }}</div>
    </div>

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
    
    <div style="margin-top: 40px; padding: 15px; border: 1px dashed #aaa; text-align: center;">
        <p>Dokumen ini merupakan dokumen resmi yang dikeluarkan berdasarkan data yang diberikan oleh pemohon.</p>
        <p>Dokumen ini sah dan memiliki kekuatan hukum.</p>
    </div>
@endsection
