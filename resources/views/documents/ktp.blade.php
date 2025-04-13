@extends('documents.layout', ['title' => 'Kartu Tanda Penduduk', 'documentTitle' => 'KARTU TANDA PENDUDUK', 'documentNumber' => 'KTP-' . str_pad($document->id, 6, '0', STR_PAD_LEFT)])

@section('content')
    <div style="text-align: center; margin-bottom: 20px;">
        <h2>KARTU TANDA PENDUDUK</h2>
        <p>Nomor Induk Kependudukan: {{ $document->nik }}</p>
    </div>

    <div class="info-item clearfix">
        <div class="label">Nama Lengkap</div>
        <div class="value">: {{ $document->nama }}</div>
    </div>
    
    <div class="info-item clearfix">
        <div class="label">Tempat / Tanggal Lahir</div>
        <div class="value">: {{ $document->tempat_lahir }}, {{ \Carbon\Carbon::parse($document->tanggal_lahir)->format('d-m-Y') }}</div>
    </div>
    
    <div class="info-item clearfix">
        <div class="label">Alamat</div>
        <div class="value">: {{ $document->alamat }}</div>
    </div>
    
    <div style="margin-top: 40px; padding: 15px; border: 1px dashed #aaa; text-align: center;">
        <p>Kartu Tanda Penduduk ini berlaku sebagai identitas resmi warga Negara Republik Indonesia.</p>
        <p>Wajib dibawa saat melakukan aktivitas yang memerlukan identifikasi resmi.</p>
    </div>
@endsection
