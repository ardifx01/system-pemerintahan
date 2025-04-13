@extends('documents.layout', ['title' => 'Akta Kematian', 'documentTitle' => 'AKTA KEMATIAN', 'documentNumber' => 'AM-' . str_pad($document->id, 6, '0', STR_PAD_LEFT)])

@section('content')
    <h2>AKTA KEMATIAN</h2>
    <p style="text-align: center; margin-bottom: 15px;">Nomor: {{ 'AM' . str_pad($document->id, 8, '0', STR_PAD_LEFT) }}</p>
    
    <div class="info-section">
        <div class="info-item">
            <div class="label">Nama Lengkap</div>
            <div class="value">: {{ $document->nama_almarhum }}</div>
        </div>
        
        <div class="info-item">
            <div class="label">NIK</div>
            <div class="value">: {{ $document->nik }}</div>
        </div>
        
        <div class="info-item">
            <div class="label">Tempat Meninggal</div>
            <div class="value">: {{ $document->tempat_meninggal ?? 'Rumah Sakit' }}</div>
        </div>
        
        <div class="info-item">
            <div class="label">Tanggal Meninggal</div>
            <div class="value">: {{ \Carbon\Carbon::parse($document->tanggal_meninggal)->format('d F Y') }}</div>
        </div>
        
        <div class="info-item">
            <div class="label">Penyebab Kematian</div>
            <div class="value">: {{ $document->penyebab_kematian ?? 'Sakit' }}</div>
        </div>
        
        <div class="info-item">
            <div class="label">Alamat Terakhir</div>
            <div class="value">: {{ $document->alamat }}</div>
        </div>
        
        <div class="info-item">
            <div class="label">Nama Pelapor</div>
            <div class="value">: {{ $document->nama }}</div>
        </div>
    </div>
    
    <div class="document-validity">
        <p>Akta Kematian ini merupakan dokumen resmi negara yang dikeluarkan berdasarkan data yang diberikan oleh pemohon.</p>
        <p><strong>Dokumen ini sah dan memiliki kekuatan hukum.</strong></p>
    </div>
@endsection
