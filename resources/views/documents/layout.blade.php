<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title ?? 'Dokumen Resmi' }}</title>
    <style>
        @page {
            margin: 0;
            size: A4;
        }
        body {
            font-family: 'Times New Roman', Times, serif;
            margin: 0;
            padding: 0;
            color: #000;
            background-color: #fff;
            font-size: 12pt;
            line-height: 1.2;
        }
        .document {
            max-width: 21cm;
            margin: 0 auto;
            padding: 1cm;
            position: relative;
            background: #fff;
            box-sizing: border-box;
        }
        .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 60px;
            color: rgba(200, 200, 200, 0.1);
            z-index: -1;
            pointer-events: none;
            text-transform: uppercase;
            font-weight: bold;
            white-space: nowrap;
        }
        .header {
            text-align: center;
            margin-bottom: 1cm;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
        }
        .title {
            font-size: 16pt;
            font-weight: bold;
            margin: 5px 0;
            text-transform: uppercase;
        }
        .subtitle {
            font-size: 12pt;
            margin: 3px 0;
        }
        .content {
            margin-bottom: 1cm;
        }
        .footer {
            margin-top: 15px;
            text-align: right;
            font-size: 10pt;
        }
        .signatures {
            margin-top: 1cm;
            display: flex;
            justify-content: space-between;
            font-size: 10pt;
        }
        .signature {
            width: 45%;
            text-align: center;
        }
        .signature-line {
            margin-top: 50px;
            border-bottom: 1px solid #000;
            margin-bottom: 5px;
        }
        .document-number {
            margin: 10px auto;
            text-align: center;
            font-size: 11pt;
            font-weight: bold;
            border: 1px solid #000;
            display: inline-block;
            padding: 2px 10px;
        }
        .document-validity {
            margin-top: 15px;
            padding: 5px;
            border: 1px solid #ddd;
            text-align: center;
            font-size: 10pt;
        }
        h2 {
            font-size: 14pt;
            margin: 10px 0;
            text-align: center;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
            font-size: 10pt;
        }
        th, td {
            border: 1px solid #000;
            padding: 5px;
        }
        th {
            background-color: #f2f2f2;
        }
        p {
            margin: 0 0 5px 0;
        }
    </style>
</head>
<body>
    <div class="document">
        <div class="watermark">REPUBLIK INDONESIA</div>
        
        <div class="header">
            <div class="title">PEMERINTAH REPUBLIK INDONESIA</div>
            <div class="subtitle">{{ $documentTitle ?? 'DOKUMEN RESMI' }}</div>
            @isset($documentNumber)
                <div class="document-number">{{ $documentNumber }}</div>
            @endisset
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
                    <div>{{ $signatureData['pemohon'] ?? ($document->nama ?? 'Pemohon') }}</div>
                </div>
                
                <div class="signature">
                    <div>{{ $signatureData['jabatan'] ?? 'Pejabat Berwenang' }},</div>
                    <div class="signature-line"></div>
                    <div>{{ $signatureData['pejabat'] ?? 'Kepala Bidang Kependudukan' }}</div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
