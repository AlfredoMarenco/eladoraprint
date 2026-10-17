<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Cotización {{ $quotation->folio }} - {{ $company_info['name'] }}</title>
    <style>
        @page {
            margin: 18mm 16mm 20mm 16mm;
            size: letter portrait;
        }

        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-size: 11px;
            color: #1e293b;
            line-height: 1.45;
            background-color: #ffffff;
            margin: 0;
            padding: 0;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        .header-table td {
            vertical-align: top;
        }

        .logo-img {
            max-height: 52px;
            width: auto;
            margin-bottom: 6px;
        }

        .company-name {
            font-family: 'Georgia', serif;
            font-size: 20px;
            font-weight: bold;
            color: #0f172a;
            letter-spacing: -0.5px;
        }

        .company-tagline {
            font-size: 8.5px;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: #9a7b4f;
            font-weight: bold;
            margin-top: 1px;
        }

        .company-contact {
            font-size: 9px;
            color: #64748b;
            margin-top: 5px;
            line-height: 1.35;
        }

        .quote-badge-box {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-top: 3px solid #9a7b4f;
            border-radius: 6px;
            padding: 10px 14px;
            text-align: right;
            width: 210px;
        }

        .quote-title {
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            font-weight: bold;
            color: #64748b;
        }

        .quote-folio {
            font-family: 'Courier New', monospace;
            font-size: 18px;
            font-weight: bold;
            color: #0f172a;
            margin: 2px 0;
        }

        .universe-tag {
            display: inline-block;
            font-size: 8.5px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            padding: 2px 8px;
            border-radius: 12px;
            margin-top: 3px;
        }

        .universe-print {
            background-color: #ecfdf5;
            color: #065f46;
            border: 1px solid #a7f3d0;
        }

        .universe-studio {
            background-color: #eef2ff;
            color: #3730a3;
            border: 1px solid #c7d2fe;
        }

        .universe-moments {
            background-color: #fff1f2;
            color: #9f1239;
            border: 1px solid #fecdd3;
        }

        .quote-meta-row {
            font-size: 9.5px;
            color: #475569;
            margin-top: 4px;
        }

        .quote-meta-row strong {
            color: #0f172a;
        }

        /* Gold Hairline Divider */
        .gold-divider {
            height: 2px;
            background-color: #c5a880;
            margin: 14px 0 16px 0;
            width: 100%;
        }

        /* Client & Project Cards */
        .info-card {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 10px 12px;
        }

        .info-card-title {
            font-size: 8.5px;
            text-transform: uppercase;
            letter-spacing: 1.2px;
            font-weight: bold;
            color: #9a7b4f;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 4px;
            margin-bottom: 6px;
        }

        .info-card-name {
            font-size: 13px;
            font-weight: bold;
            color: #0f172a;
        }

        .info-card-sub {
            font-size: 9.5px;
            color: #64748b;
            margin-top: 2px;
        }

        /* Items Table */
        .items-table {
            margin-top: 16px;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            overflow: hidden;
        }

        .items-table th {
            background-color: #0f172a;
            color: #ffffff;
            font-size: 8.5px;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: bold;
            padding: 7px 10px;
            text-align: left;
        }

        .items-table td {
            padding: 8px 10px;
            border-bottom: 1px solid #e2e8f0;
            vertical-align: top;
            font-size: 10px;
        }

        .items-table tr:nth-child(even) td {
            background-color: #fafbfc;
        }

        .item-concept {
            font-weight: bold;
            color: #0f172a;
            font-size: 10.5px;
        }

        .item-desc {
            font-size: 9px;
            color: #64748b;
            margin-top: 2px;
            line-height: 1.35;
        }

        .text-center {
            text-align: center;
        }

        .text-right {
            text-align: right;
        }

        /* Bottom Section: Terms & Totals */
        .bottom-section {
            margin-top: 14px;
        }

        .terms-box {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 10px 12px;
            font-size: 9px;
            color: #475569;
        }

        .terms-title {
            font-size: 8.5px;
            text-transform: uppercase;
            letter-spacing: 1.2px;
            font-weight: bold;
            color: #9a7b4f;
            margin-bottom: 6px;
        }

        .bank-details {
            margin-top: 8px;
            padding: 7px 9px;
            background-color: #ffffff;
            border: 1px solid #cbd5e1;
            border-radius: 4px;
        }

        .totals-box {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 10px 14px;
            width: 230px;
        }

        .totals-row {
            margin-bottom: 5px;
        }

        .totals-row td {
            padding: 2px 0;
            font-size: 10px;
        }

        .total-highlight {
            border-top: 1.5px solid #0f172a;
            padding-top: 6px;
            margin-top: 4px;
        }

        .total-highlight td {
            font-size: 13px;
            font-weight: bold;
            color: #0f172a;
        }

        .advance-highlight {
            background-color: #ecfdf5;
            border: 1px solid #a7f3d0;
            border-radius: 4px;
            padding: 6px 8px;
            margin-top: 6px;
        }

        .advance-highlight td {
            font-size: 9.5px;
            font-weight: bold;
            color: #065f46;
        }

        /* Signatures */
        .signatures-table {
            margin-top: 26px;
            page-break-inside: avoid;
        }

        .signature-col {
            width: 46%;
            text-align: center;
            vertical-align: bottom;
        }

        .signature-line {
            border-bottom: 1px solid #94a3b8;
            margin-bottom: 6px;
            height: 38px;
        }

        .signature-label {
            font-size: 8.5px;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: bold;
            color: #475569;
        }

        .signature-sub {
            font-size: 8px;
            color: #94a3b8;
            margin-top: 1px;
        }

        /* Footer */
        .doc-footer {
            margin-top: 22px;
            border-top: 1px solid #e2e8f0;
            padding-top: 8px;
            text-align: center;
            font-size: 8px;
            color: #94a3b8;
            letter-spacing: 0.5px;
        }
    </style>
</head>
<body>

    <!-- Header Table: Logo & Company on Left, Folio & Metadata on Right -->
    <table class="header-table">
        <tr>
            <td style="width: 58%;">
                @if(!empty($logo))
                    <img src="{{ $logo }}" class="logo-img" alt="{{ $company_info['name'] }}">
                @else
                    <div class="company-name">{{ $company_info['name'] }}</div>
                @endif
                <div class="company-tagline">Taller de Impresión Fina • Diseño • Experiencias</div>
                <div class="company-contact">
                    {{ $company_info['email'] }} • {{ $company_info['phone'] }}<br>
                    {{ $company_info['website'] ?? 'www.eladora.mx' }} • {{ $company_info['address'] ?? 'Ciudad de México, México' }}
                </div>
            </td>
            <td style="width: 42%; text-align: right;">
                <div class="quote-badge-box">
                    <div class="quote-title">Cotización Formal</div>
                    <div class="quote-folio">{{ $quotation->folio }}</div>
                    
                    @php
                        $u = strtolower($quotation->universe ?? 'print');
                        $universeClass = 'universe-' . $u;
                        $universeName = match($u) {
                            'print' => 'Eladora Print',
                            'studio' => 'Eladora Studio',
                            'moments' => 'Eladora Moments',
                            default => 'Eladora ' . ucfirst($u),
                        };
                    @endphp
                    <div>
                        <span class="universe-tag {{ $universeClass }}">{{ $universeName }}</span>
                    </div>

                    <div class="quote-meta-row" style="margin-top: 7px;">
                        Fecha de expedición: <strong>{{ \Carbon\Carbon::parse($quotation->creation_date)->format('d/m/Y') }}</strong>
                    </div>
                    @if($quotation->expiration_date)
                    <div class="quote-meta-row">
                        Válida hasta: <strong>{{ \Carbon\Carbon::parse($quotation->expiration_date)->format('d/m/Y') }}</strong>
                    </div>
                    @endif
                    <div class="quote-meta-row">
                        Versión: <strong>v{{ $quotation->version }}</strong>
                    </div>
                </div>
            </td>
        </tr>
    </table>

    <!-- Decorative Gold Divider -->
    <div class="gold-divider"></div>

    <!-- Client & Project Info Cards -->
    <table>
        <tr>
            <td style="width: 48.5%; vertical-align: top;">
                <div class="info-card">
                    <div class="info-card-title">Preparado Para (Cliente)</div>
                    <div class="info-card-name">{{ $quotation->client->name ?? 'Cliente General' }}</div>
                    @if(!empty($quotation->client->business_name))
                        <div class="info-card-sub" style="font-weight: 600; color: #334155;">
                            {{ $quotation->client->business_name }}
                        </div>
                    @endif
                    @if(!empty($quotation->client->email) || !empty($quotation->client->whatsapp) || !empty($quotation->client->phone))
                        <div class="info-card-sub">
                            {{ $quotation->client->email ?? '' }} 
                            @if(!empty($quotation->client->email) && (!empty($quotation->client->whatsapp) || !empty($quotation->client->phone))) • @endif
                            {{ $quotation->client->whatsapp ?? $quotation->client->phone ?? '' }}
                        </div>
                    @endif
                </div>
            </td>
            <td style="width: 3%;"></td>
            <td style="width: 48.5%; vertical-align: top;">
                <div class="info-card">
                    <div class="info-card-title">Especificaciones del Proyecto</div>
                    <div class="info-card-name">{{ $quotation->project_name }}</div>
                    @if(!empty($quotation->description))
                        <div class="info-card-sub" style="margin-top: 4px; line-height: 1.35;">
                            {{ $quotation->description }}
                        </div>
                    @endif
                </div>
            </td>
        </tr>
    </table>

    <!-- Detailed Items Table -->
    <table class="items-table">
        <thead>
            <tr>
                <th style="width: 5%; text-align: center;">#</th>
                <th style="width: 53%;">Concepto y Especificaciones Técnicas</th>
                <th style="width: 12%; text-align: center;">Cantidad</th>
                <th style="width: 15%; text-align: right;">P. Unitario</th>
                <th style="width: 15%; text-align: right;">Importe</th>
            </tr>
        </thead>
        <tbody>
            @forelse($quotation->items ?? [] as $index => $item)
                <tr>
                    <td class="text-center" style="color: #64748b; font-family: monospace;">{{ $index + 1 }}</td>
                    <td>
                        <div class="item-concept">{{ $item['concept'] ?? 'Partida ' . ($index + 1) }}</div>
                        @if(!empty($item['description']))
                            <div class="item-desc">{{ $item['description'] }}</div>
                        @endif
                    </td>
                    <td class="text-center" style="font-weight: 600;">{{ $item['quantity'] ?? 1 }}</td>
                    <td class="text-right">${{ number_format((float) ($item['unit_price'] ?? 0), 2) }}</td>
                    <td class="text-right" style="font-weight: bold; color: #0f172a;">${{ number_format((float) ($item['subtotal'] ?? 0), 2) }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="5" class="text-center" style="padding: 18px; color: #94a3b8;">
                        Sin partidas especificadas.
                    </td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <!-- Bottom Section: Terms & Conditions on Left, Totals on Right -->
    <table class="bottom-section" style="page-break-inside: avoid;">
        <tr>
            <td style="width: 55%; vertical-align: top;">
                <div class="terms-box">
                    <div class="terms-title">Términos Comerciales & Forma de Pago</div>
                    
                    @if(!empty($quotation->estimated_delivery_time))
                        <div style="margin-bottom: 3px;">
                            <strong>Tiempo de entrega:</strong> {{ $quotation->estimated_delivery_time }}
                        </div>
                    @endif
                    
                    @if(!empty($quotation->payment_terms))
                        <div style="margin-bottom: 3px;">
                            <strong>Condiciones de pago:</strong> {{ $quotation->payment_terms }}
                        </div>
                    @endif

                    @if(!empty($quotation->notes))
                        <div style="margin-top: 5px; padding-top: 4px; border-top: 1px dashed #cbd5e1; color: #334155;">
                            <strong>Notas de producción:</strong> {{ $quotation->notes }}
                        </div>
                    @endif

                    <!-- Bank details for immediate transfer -->
                    <div class="bank-details">
                        <div style="font-weight: bold; color: #0f172a; margin-bottom: 2px;">Datos de Depósito / Transferencia (SPEI):</div>
                        <div>Banco: <strong>{{ $company_info['bank_name'] }}</strong></div>
                        <div>Beneficiario: <strong>{{ $company_info['bank_beneficiary'] }}</strong></div>
                        <div>CLABE Interbancaria: <strong style="font-family: monospace; font-size: 9.5px;">{{ $company_info['bank_clabe'] }}</strong></div>
                    </div>
                </div>
            </td>
            <td style="width: 5%;"></td>
            <td style="width: 40%; vertical-align: top;">
                <div class="totals-box">
                    <table class="totals-row">
                        <tr>
                            <td style="color: #64748b;">Subtotal:</td>
                            <td class="text-right" style="font-weight: 600;">${{ number_format((float) $quotation->subtotal, 2) }}</td>
                        </tr>
                        @if((float) $quotation->discount > 0)
                        <tr>
                            <td style="color: #059669;">Descuento aplicable:</td>
                            <td class="text-right" style="color: #059669; font-weight: 600;">-${{ number_format((float) $quotation->discount, 2) }}</td>
                        </tr>
                        @endif
                        <tr class="total-highlight">
                            <td>TOTAL:</td>
                            <td class="text-right" style="font-family: 'Georgia', serif; font-size: 15px; color: #0f172a;">
                                ${{ number_format((float) $quotation->total_amount, 2) }} <span style="font-size: 8px; font-weight: normal; color: #64748b;">{{ $company_info['currency'] }}</span>
                            </td>
                        </tr>
                    </table>

                    <!-- Advance Box -->
                    <div class="advance-highlight">
                        <table style="width: 100%;">
                            <tr>
                                <td>Anticipo p/ inicio ({{ round(((float) $quotation->advance_required / max(1, (float) $quotation->total_amount)) * 100) }}%):</td>
                                <td class="text-right" style="font-size: 11px; font-weight: bold;">
                                    ${{ number_format((float) $quotation->advance_required, 2) }}
                                </td>
                            </tr>
                            <tr>
                                <td style="font-size: 8.5px; color: #047857; font-weight: normal;">Saldo restante al entregar:</td>
                                <td class="text-right" style="font-size: 9px; color: #047857;">
                                    ${{ number_format(max(0, (float) $quotation->total_amount - (float) $quotation->advance_required), 2) }}
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </td>
        </tr>
    </table>

    <!-- Acceptance & Signature Block -->
    <table class="signatures-table">
        <tr>
            <td class="signature-col">
                <div class="signature-line"></div>
                <div class="signature-label">Por {{ $company_info['name'] }}</div>
                <div class="signature-sub">Taller & Asesoría Comercial</div>
            </td>
            <td style="width: 8%;"></td>
            <td class="signature-col">
                <div class="signature-line"></div>
                <div class="signature-label">Aceptación y Visto Bueno del Cliente</div>
                <div class="signature-sub">Nombre, Firma y Fecha de Confirmación</div>
            </td>
        </tr>
    </table>

    <!-- Footer -->
    <div class="doc-footer">
        Este documento constituye una propuesta formal de trabajo de <strong>{{ $company_info['name'] }}</strong>. Los precios cotizados están sujetos a las especificaciones aquí descritas.<br>
        {{ $company_info['website'] ?? 'www.eladora.mx' }} • {{ $company_info['email'] }} • Tel: {{ $company_info['phone'] }}
    </div>

</body>
</html>
