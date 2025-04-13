<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title ?? 'Dokumen Resmi' }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
        }
        .document {
            max-width: 800px;
            margin: 0 auto;
            padding: 30px;
            border: 1px solid #ddd;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #000;
            padding-bottom: 20px;
        }
        .logo {
            width: 80px;
            height: auto;
            display: block;
            margin: 0 auto 15px;
        }
        .title {
            font-size: 18px;
            font-weight: bold;
            margin: 5px 0;
            text-transform: uppercase;
        }
        .subtitle {
            font-size: 14px;
            margin: 5px 0;
        }
        .content {
            margin-bottom: 30px;
        }
        .info-item {
            margin-bottom: 15px;
        }
        .info-item .label {
            font-weight: bold;
            width: 200px;
            float: left;
        }
        .info-item .value {
            margin-left: 210px;
        }
        .footer {
            margin-top: 50px;
            text-align: right;
        }
        .signatures {
            margin-top: 80px;
            display: flex;
            justify-content: space-between;
        }
        .signature {
            width: 45%;
            text-align: center;
        }
        .signature-line {
            margin-top: 70px;
            border-bottom: 1px solid #000;
            margin-bottom: 5px;
        }
        .clearfix::after {
            content: "";
            clear: both;
            display: table;
        }
        .document-number {
            margin-top: 10px;
            text-align: center;
            font-size: 14px;
            font-weight: bold;
            border: 1px solid #000;
            display: inline-block;
            padding: 5px 10px;
            margin-left: auto;
            margin-right: auto;
        }
        .official-stamp {
            margin-top: 30px;
            text-align: center;
            font-style: italic;
            font-size: 12px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="document">
        <div class="header">
            <div style="display: flex; justify-content: center; align-items: center;">
                <div style="position: absolute; left: 50px;">
                    <!-- Logo goes here, e.g. <img src="{{ asset('images/logo.png') }}" alt="Logo" class="logo"> -->
                    [LOGO]
                </div>
                <div>
                    <div class="title">PEMERINTAH REPUBLIK INDONESIA</div>
                    <div class="subtitle">DOKUMEN RESMI KEPENDUDUKAN</div>
                    <div class="subtitle">{{ $documentTitle ?? 'DOKUMEN RESMI' }}</div>
                </div>
            </div>
            @if(isset($documentNumber))
                <div class="document-number">{{ $documentNumber }}</div>
            @endif
        </div>
        
        <div class="content">
            @yield('content')
        </div>
        
        <div class="footer">
            <div>Dikeluarkan di: Jakarta</div>
            <div>Pada tanggal: {{ date('d F Y') }}</div>
            
            <div class="signatures">
                <div class="signature">
                    <div>Pemohon,</div>
                    <div class="signature-line"></div>
                    <div>{{ $document->nama ?? '[NAMA PEMOHON]' }}</div>
                </div>
                
                <div class="signature">
                    <div>Pejabat Berwenang,</div>
                    <div class="signature-line"></div>
                    <div>Admin Sistem</div>
                    <div class="official-stamp">[STEMPEL RESMI]</div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
