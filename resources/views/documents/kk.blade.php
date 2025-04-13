@extends('documents.layout', ['title' => 'Kartu Keluarga', 'documentTitle' => 'KARTU KELUARGA', 'documentNumber' => 'KK-' . str_pad($document->id, 6, '0', STR_PAD_LEFT)])

@section('content')
    <h2>KARTU KELUARGA</h2>
    <p style="text-align: center; margin-bottom: 15px;">Nomor: <strong>{{ 'KK' . $document->nik }}</strong></p>
    
    <div class="info-section">
        <div style="font-weight: bold; margin-bottom: 10px;">DATA KEPALA KELUARGA</div>
        
        <div class="info-item">
            <div class="label">Nama Lengkap</div>
            <div class="value">: {{ $document->nama }}</div>
        </div>
        
        <div class="info-item">
            <div class="label">NIK</div>
            <div class="value">: {{ $document->nik }}</div>
        </div>
        
        <div class="info-item">
            <div class="label">Alamat</div>
            <div class="value">: {{ $document->alamat }}</div>
        </div>
        
        <div class="info-item">
            <div class="label">Provinsi / Kota</div>
            <div class="value">: {{ $document->kota ?? 'DKI Jakarta' }}</div>
        </div>

        <div class="info-item">
            <div class="label">Kecamatan / Kelurahan</div>
            <div class="value">: {{ $document->kecamatan ?? '-' }}</div>
        </div>
    </div>
    
    <div class="info-section">
        <div style="font-weight: bold; margin-bottom: 10px;">DAFTAR ANGGOTA KELUARGA</div>
        
        <table>
            <thead>
                <tr>
                    <th>No</th>
                    <th>Nama Lengkap</th>
                    <th>NIK</th>
                    <th>Hubungan</th>
                    <th>Kelamin</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="text-align: center;">1</td>
                    <td>{{ $document->nama }}</td>
                    <td>{{ $document->nik }}</td>
                    <td style="text-align: center;">Kepala Keluarga</td>
                    <td style="text-align: center;">{{ $document->jenis_kelamin ?? '-' }}</td>
                </tr>
                {{-- Anggota keluarga lainnya --}}
                @if(isset($document->anggota_keluarga) && is_array($document->anggota_keluarga))
                    @foreach($document->anggota_keluarga as $index => $anggota)
                    <tr>
                        <td style="text-align: center;">{{ $index + 2 }}</td>
                        <td>{{ $anggota['nama'] ?? '-' }}</td>
                        <td>{{ $anggota['nik'] ?? '-' }}</td>
                        <td style="text-align: center;">{{ $anggota['hubungan'] ?? '-' }}</td>
                        <td style="text-align: center;">{{ $anggota['jenis_kelamin'] ?? '-' }}</td>
                    </tr>
                    @endforeach
                @endif
            </tbody>
        </table>
    </div>
    
    <div class="document-validity">
        <p>Kartu Keluarga ini merupakan dokumen resmi yang berisi data keluarga dan berlaku seumur hidup kecuali terjadi perubahan atas data keluarga.</p>
    </div>
@endsection
