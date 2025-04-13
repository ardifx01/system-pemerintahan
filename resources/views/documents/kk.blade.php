@extends('documents.layout', ['title' => 'Kartu Keluarga', 'documentTitle' => 'KARTU KELUARGA', 'documentNumber' => 'KK-' . str_pad($document->id, 6, '0', STR_PAD_LEFT)])

@section('content')
    <h2>KARTU KELUARGA</h2>
    <p style="text-align: center; margin-bottom: 15px;">Nomor: <strong>{{ 'KK' . $document->nik }}</strong></p>
    
    <p style="font-weight: bold; margin-bottom: 5px; margin-top: 15px;">DATA KEPALA KELUARGA</p>
    
    <p><strong>Nama Lengkap</strong> : {{ $document->nama }}</p>
    
    <p><strong>NIK</strong> : {{ $document->nik }}</p>
    
    <p><strong>Alamat</strong> : {{ $document->alamat }}</p>
    
    <p><strong>Provinsi / Kota</strong> : {{ $document->kota ?? 'DKI Jakarta' }}</p>
    
    <p><strong>Kecamatan / Kelurahan</strong> : {{ $document->kecamatan ?? '-' }}</p>
    
    <p style="font-weight: bold; margin-bottom: 5px; margin-top: 15px;">DAFTAR ANGGOTA KELUARGA</p>
    
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
    
    <div class="document-validity">
        <p>Kartu Keluarga ini merupakan dokumen resmi yang berisi data keluarga dan berlaku seumur hidup kecuali terjadi perubahan atas data keluarga.</p>
    </div>
@endsection
