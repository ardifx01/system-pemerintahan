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
            line-height: 1.3;
        }

        .document {
            max-width: 21cm;
            height: 29.7cm;
            margin: 0 auto;
            padding: 1.5cm 2cm;
            position: relative;
            background: #fff;
            box-sizing: border-box;
            overflow: hidden;
        }

        .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 80px;
            color: rgba(200, 200, 200, 0.08);
            z-index: -1;
            pointer-events: none;
            text-transform: uppercase;
            font-weight: bold;
            white-space: nowrap;
        }

        .header {
            text-align: center;
            margin-bottom: 1cm;
            border-bottom: 3px double #000;
            padding-bottom: 10px;
            position: relative;
        }

        .header::before {
            content: "";
            position: absolute;
            bottom: 3px;
            left: 0;
            width: 100%;
            height: 1px;
            background-color: #000;
        }

        .logo {
            margin-bottom: 10px;
        }

        .title {
            font-size: 16pt;
            font-weight: bold;
            margin: 5px 0;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .subtitle {
            font-size: 14pt;
            font-weight: bold;
            margin: 3px 0;
            letter-spacing: 0.5px;
        }

        .content {
            margin-bottom: 1cm;
            text-align: justify;
        }

        .footer {
            margin-top: 15px;
            text-align: right;
            font-size: 10pt;
        }

        .signatures {
            margin-top: 0.8cm;
            display: flex;
            justify-content: space-between;
            font-size: 10pt;
        }

        .signature {
            width: 45%;
            text-align: center;
        }

        .signature-line {
            margin-top: 45px;
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
            padding: 3px 12px;
            background-color: rgba(245, 245, 245, 0.5);
        }

        .document-validity {
            margin-top: 15px;
            padding: 5px;
            border: 1px solid #000;
            text-align: center;
            font-size: 10pt;
            background-color: rgba(245, 245, 245, 0.5);
        }

        h2 {
            font-size: 14pt;
            margin: 10px 0;
            text-align: center;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
            font-size: 10pt;
        }

        th,
        td {
            border: 1px solid #000;
            padding: 6px;
        }

        th {
            background-color: #f0f0f0;
            font-weight: bold;
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