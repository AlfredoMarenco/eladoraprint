<?php

namespace Database\Seeders;

use App\Models\BusinessSetting;
use App\Models\Client;
use App\Models\CrmCustomerPayment;
use App\Models\CrmOrder;
use App\Models\CrmOrderApproval;
use App\Models\CrmOrderCostItem;
use App\Models\CrmPurchase;
use App\Models\CrmSimulationCostItem;
use App\Models\CrmSimulationScenario;
use App\Models\CrmSupplier;
use App\Models\CrmSupplierPayment;
use App\Models\CrmTaskTemplate;
use App\Models\CrmTaskTemplateItem;
use App\Models\Opportunity;
use App\Models\Quotation;
use App\Models\User;
use App\Services\CrmWorkflowService;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class CrmDatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Roles & Permissions setup
        $adminRole = Role::firstOrCreate(['name' => 'Admin']);
        $ownerRole = Role::firstOrCreate(['name' => 'Administradora']);
        $collabRole = Role::firstOrCreate(['name' => 'Colaborador']);
        $viewRole = Role::firstOrCreate(['name' => 'Consulta']);

        // Assign Admin / Administradora to existing admin user
        $admin = User::first();
        if ($admin) {
            $admin->assignRole($adminRole);
            $admin->assignRole($ownerRole);
        }

        // 2. Business Settings
        $settings = [
            ['key' => 'company_name', 'value' => 'Eladora', 'group' => 'general', 'type' => 'string', 'description' => 'Nombre del negocio'],
            ['key' => 'company_email', 'value' => 'contacto@eladora.mx', 'group' => 'general', 'type' => 'string', 'description' => 'Correo de contacto principal'],
            ['key' => 'company_phone', 'value' => '+52 55 4912 3847', 'group' => 'general', 'type' => 'string', 'description' => 'Teléfono o WhatsApp oficial'],
            ['key' => 'default_currency', 'value' => 'MXN', 'group' => 'financial', 'type' => 'string', 'description' => 'Moneda predeterminada'],
            ['key' => 'timezone', 'value' => 'America/Mexico_City', 'group' => 'general', 'type' => 'string', 'description' => 'Zona horaria del taller'],
            ['key' => 'date_format', 'value' => 'd/m/Y', 'group' => 'general', 'type' => 'string', 'description' => 'Formato visual de fecha'],
            ['key' => 'folio_prefix_print', 'value' => 'PRN', 'group' => 'folios', 'type' => 'string', 'description' => 'Prefijo folios pedidos Print'],
            ['key' => 'folio_prefix_studio', 'value' => 'STU', 'group' => 'folios', 'type' => 'string', 'description' => 'Prefijo folios pedidos Studio'],
            ['key' => 'folio_prefix_moments', 'value' => 'MOM', 'group' => 'folios', 'type' => 'string', 'description' => 'Prefijo folios pedidos Moments'],
            ['key' => 'folio_prefix_quote', 'value' => 'COT', 'group' => 'folios', 'type' => 'string', 'description' => 'Prefijo folios cotizaciones'],
            ['key' => 'folio_prefix_purchase', 'value' => 'CMP', 'group' => 'folios', 'type' => 'string', 'description' => 'Prefijo folios compras'],
            ['key' => 'default_advance_percent', 'value' => '50', 'group' => 'financial', 'type' => 'number', 'description' => 'Porcentaje estándar de anticipo requerido'],
            ['key' => 'workshop_overhead_method', 'value' => 'percent', 'group' => 'financial', 'type' => 'string', 'description' => 'Método de costeo operativo de taller'],
            ['key' => 'workshop_overhead_value', 'value' => '15', 'group' => 'financial', 'type' => 'number', 'description' => 'Valor de costeo operativo (porcentaje o monto fijo)'],
            ['key' => 'alert_upcoming_days', 'value' => '3', 'group' => 'alerts', 'type' => 'number', 'description' => 'Días para alerta de entregas próximas'],
            ['key' => 'alert_overdue_days', 'value' => '1', 'group' => 'alerts', 'type' => 'number', 'description' => 'Días para alerta de retraso'],
        ];

        foreach ($settings as $s) {
            BusinessSetting::updateOrCreate(['key' => $s['key']], $s);
        }

        // 3. Universe Task Templates
        $workflowService = app(CrmWorkflowService::class);
        $universes = ['print', 'studio', 'moments'];
        $names = [
            'print' => 'Flujo Estándar de Impresión y Papelería Fina',
            'studio' => 'Flujo Creativo de Diseño y Branding',
            'moments' => 'Flujo Integral de Experiencias y Eventos',
        ];

        foreach ($universes as $uni) {
            $tpl = CrmTaskTemplate::updateOrCreate(
                ['universe' => $uni],
                ['name' => $names[$uni], 'description' => 'Plantilla oficial de tareas operativas para '.ucfirst($uni), 'is_active' => true]
            );

            $defaultTasks = $workflowService->getDefaultUniverseTasks($uni);
            $tpl->items()->delete();
            $idx = 1;
            foreach ($defaultTasks as $taskDef) {
                CrmTaskTemplateItem::create([
                    'template_id' => $tpl->id,
                    'title' => $taskDef['title'],
                    'category' => $taskDef['category'],
                    'order_index' => $idx++,
                    'days_offset' => $taskDef['offset'],
                    'is_optional' => false,
                ]);
            }
        }

        // 4. Suppliers (Proveedores)
        $supplierPaper = CrmSupplier::firstOrCreate(
            ['name' => 'Papeles Finos & Algodón S.A.'],
            [
                'contact_name' => 'Roberto Sánchez',
                'phone' => '+52 55 5543 2100',
                'email' => 'ventas@papelesfinos.mx',
                'category' => 'papeleria',
                'notes' => 'Proveedor de papel artesanal 300g, sobres en punta y algodón importado.',
                'status' => 'active',
            ]
        );

        $supplierFoil = CrmSupplier::firstOrCreate(
            ['name' => 'Taller de Acabados & Hot Stamping'],
            [
                'contact_name' => 'Carla Méndez',
                'phone' => '+52 55 8899 4433',
                'email' => 'acabados@foilmex.com',
                'category' => 'acabados',
                'notes' => 'Placas metálicas, grabado en bajo relieve y aplicación de foil oro/cobre.',
                'status' => 'active',
            ]
        );

        // 5. Sample Clients
        $clientMariana = Client::firstOrCreate(
            ['email' => 'mariana.valenzuela@gmail.com'],
            [
                'name' => 'Mariana Valenzuela',
                'business_name' => 'Boda Mariana & Alejandro',
                'phone' => '+52 55 1122 3344',
                'whatsapp' => '+52 55 1122 3344',
                'client_type' => 'event',
                'channel' => 'instagram',
                'first_contact_at' => Carbon::now()->subDays(20),
                'internal_notes' => 'Novia muy detallista. Busca estilo botánico, lacre dorado y papel de algodón.',
                'status' => 'active',
            ]
        );

        $clientStudio = Client::firstOrCreate(
            ['email' => 'hola@luminaflor.mx'],
            [
                'name' => 'Sofía Delgado',
                'business_name' => 'Lumina Flor Floral Studio',
                'phone' => '+52 55 9988 7766',
                'whatsapp' => '+52 55 9988 7766',
                'client_type' => 'business',
                'channel' => 'referral',
                'first_contact_at' => Carbon::now()->subDays(15),
                'internal_notes' => 'Estudio floral boutique. Requiere re-branding completo, manual de identidad y empaques.',
                'status' => 'active',
            ]
        );

        $clientMoments = Client::firstOrCreate(
            ['email' => 'carlos.mendoza@grupozenith.com'],
            [
                'name' => 'Carlos Mendoza',
                'business_name' => 'Grupo Zenith Corp',
                'phone' => '+52 55 4433 2211',
                'whatsapp' => '+52 55 4433 2211',
                'client_type' => 'business',
                'channel' => 'website',
                'first_contact_at' => Carbon::now()->subDays(10),
                'internal_notes' => 'Cena gala fin de año. Requiere experiencia personalizada, minutas impresas y welcome kits.',
                'status' => 'active',
            ]
        );

        // 6. Sample Opportunities
        Opportunity::firstOrCreate(
            ['folio' => 'LEAD-2026-0001'],
            [
                'client_id' => $clientMariana->id,
                'universe' => 'print',
                'title' => 'Invitaciones de Boda y Papelería Social Mariana & Alejandro',
                'description' => '120 invitaciones de lujo con hot stamping oro, sobres con forro y lacre personalizado.',
                'contact_channel' => 'instagram',
                'entry_date' => Carbon::now()->subDays(20),
                'last_contact_date' => Carbon::now()->subDays(2),
                'next_followup_date' => Carbon::now()->addDays(2),
                'assigned_to' => $admin?->id,
                'priority' => 'high',
                'estimated_amount' => 18500.00,
                'stage' => 'confirmado',
                'notes' => 'Cotización aceptada y pedido generado.',
            ]
        );

        Opportunity::firstOrCreate(
            ['folio' => 'LEAD-2026-0002'],
            [
                'client_id' => $clientStudio->id,
                'universe' => 'studio',
                'title' => 'Identidad Visual & Packaging Lumina Flor',
                'description' => 'Logotipo, paleta de colores, tipografías, tarjetas y etiquetas botánicas.',
                'contact_channel' => 'referral',
                'entry_date' => Carbon::now()->subDays(12),
                'last_contact_date' => Carbon::now()->subDays(3),
                'next_followup_date' => Carbon::now()->addDays(1),
                'assigned_to' => $admin?->id,
                'priority' => 'medium',
                'estimated_amount' => 24000.00,
                'stage' => 'cotizacion_enviada',
                'notes' => 'Presupuesto enviado por WhatsApp y correo. En espera de aprobación.',
            ]
        );

        Opportunity::firstOrCreate(
            ['folio' => 'LEAD-2026-0003'],
            [
                'client_id' => $clientMoments->id,
                'universe' => 'moments',
                'title' => 'Experiencia & Welcome Kits Gala Corporativa Zenith',
                'description' => 'Montaje de mesa de bienvenida, caligrafía en vivo y 60 kits personalizados.',
                'contact_channel' => 'website',
                'entry_date' => Carbon::now()->subDays(5),
                'last_contact_date' => Carbon::now()->subDays(1),
                'next_followup_date' => Carbon::now()->addDays(3),
                'assigned_to' => $admin?->id,
                'priority' => 'urgent',
                'estimated_amount' => 38000.00,
                'stage' => 'por_cotizar',
                'notes' => 'Reunión inicial realizada. Preparando propuesta de diseño y opciones de costos.',
            ]
        );

        // 7. Quotations
        $quotePrint = Quotation::firstOrCreate(
            ['folio' => 'COT-2026-0001'],
            [
                'client_id' => $clientMariana->id,
                'universe' => 'print',
                'project_name' => 'Suite de Invitaciones Finas Mariana & Alex',
                'description' => 'Paquete completo de 120 invitaciones artesanales.',
                'items' => [
                    ['concept' => 'Invitación Principal 15x20cm', 'description' => 'Papel algodón 350g con Hot Stamping Oro', 'quantity' => 120, 'unit_price' => 95.00, 'subtotal' => 11400.00],
                    ['concept' => 'Sobres artesanales con solapa en V', 'description' => 'Forro impreso a juego con estampado botánico', 'quantity' => 120, 'unit_price' => 35.00, 'subtotal' => 4200.00],
                    ['concept' => 'Sello de Lacre & Cinta de Seda', 'description' => 'Lacre tono perla y listón artesanal rasgado a mano', 'quantity' => 120, 'unit_price' => 20.00, 'subtotal' => 2400.00],
                    ['concept' => 'Tarjetas de recepción y pases', 'description' => 'Impresión digital de alta definición en algodón 250g', 'quantity' => 240, 'unit_price' => 4.00, 'subtotal' => 960.00],
                ],
                'subtotal' => 18960.00,
                'discount' => 460.00,
                'total_amount' => 18500.00,
                'advance_required' => 9250.00,
                'payment_terms' => '50% de anticipo para iniciar diseño y producción. 50% restante contra entrega.',
                'estimated_delivery_time' => '15 días hábiles a partir de la aprobación de prueba.',
                'creation_date' => Carbon::now()->subDays(18),
                'sent_date' => Carbon::now()->subDays(17),
                'expiration_date' => Carbon::now()->addDays(12),
                'accepted_date' => Carbon::now()->subDays(14),
                'status' => 'accepted',
                'notes' => 'Cotización aprobada por la novia.',
                'version' => 1,
            ]
        );

        $quotePrint->createSnapshot($admin?->id, 'Versión aceptada por la cliente');

        // Studio Quotation (Sent)
        $quoteStudio = Quotation::firstOrCreate(
            ['folio' => 'COT-2026-0002'],
            [
                'client_id' => $clientStudio->id,
                'universe' => 'studio',
                'project_name' => 'Branding Integral Lumina Flor',
                'description' => 'Desarrollo de identidad de marca visual completa para estudio floral.',
                'items' => [
                    ['concept' => 'Identidad de Marca & Logotipo', 'description' => '3 propuestas creativas, paleta cromática, tipografías y manual básico', 'quantity' => 1, 'unit_price' => 14000.00, 'subtotal' => 14000.00],
                    ['concept' => 'Diseño de Papelería & Packaging', 'description' => 'Tarjetas de presentación, papel de envoltura, stickers y etiquetas de listón', 'quantity' => 1, 'unit_price' => 6000.00, 'subtotal' => 6000.00],
                    ['concept' => 'Templates de Redes Sociales', 'description' => 'Pack de 9 plantillas editables para Instagram Feed & Stories', 'quantity' => 1, 'unit_price' => 4000.00, 'subtotal' => 4000.00],
                ],
                'subtotal' => 24000.00,
                'discount' => 0.00,
                'total_amount' => 24000.00,
                'advance_required' => 12000.00,
                'payment_terms' => '50% anticipo para iniciar, 50% al entregar archivos finales.',
                'estimated_delivery_time' => '3 a 4 semanas con rondas de revisión.',
                'creation_date' => Carbon::now()->subDays(4),
                'sent_date' => Carbon::now()->subDays(3),
                'expiration_date' => Carbon::now()->addDays(20),
                'status' => 'sent',
                'notes' => 'En seguimiento con Sofía Delgado.',
                'version' => 1,
            ]
        );

        // 8. Active Orders
        // Order 1: Print (Active, in production)
        $orderPrint = CrmOrder::firstOrCreate(
            ['folio' => 'PRN-2026-0001'],
            [
                'client_id' => $clientMariana->id,
                'quotation_id' => $quotePrint->id,
                'universe' => 'print',
                'project_name' => 'Invitaciones de Boda Mariana & Alejandro',
                'service_type' => 'Invitaciones y Papelería Social',
                'description' => '120 suites completas de invitaciones en algodón con foil oro y lacre.',
                'requested_at' => Carbon::now()->subDays(14),
                'start_planned_at' => Carbon::now()->subDays(12),
                'start_real_at' => Carbon::now()->subDays(10),
                'delivery_agreed_at' => Carbon::now()->addDays(4),
                'next_milestone_at' => Carbon::now()->addDays(2),
                'internal_deadline_at' => Carbon::now()->addDays(3),
                'commercial_status' => 'en_proceso',
                'operating_status' => 'en_produccion',
                'priority' => 'high',
                'assigned_to' => $admin?->id,
                'approved_amount' => 18500.00,
                'advance_required' => 9250.00,
                'workshop_overhead_type' => 'percent',
                'workshop_overhead_amount' => 2775.00, // 15%
                'notes' => 'Prueba de impresión aprobada por Mariana. En proceso de aplicación de foil y armado manual.',
            ]
        );

        $quotePrint->update([
            'converted_to_order_id' => $orderPrint->id,
            'converted_at' => Carbon::now()->subDays(14),
        ]);

        // Initialize tasks for Print Order
        $workflowService->initializeOrderTasks($orderPrint);

        // Mark first 4 tasks as completed
        $orderPrint->tasks()->take(4)->update([
            'status' => 'completed',
            'completed_at' => Carbon::now()->subDays(2),
        ]);

        // Order 1: Approvals
        CrmOrderApproval::create([
            'order_id' => $orderPrint->id,
            'version_title' => 'Prueba Digital y Maqueta de Foil Oro v1',
            'review_type' => 'print_proof',
            'sent_at' => Carbon::now()->subDays(10),
            'deadline_at' => Carbon::now()->subDays(8),
            'status' => 'approved',
            'responded_at' => Carbon::now()->subDays(9),
            'approved_by_name' => 'Mariana Valenzuela',
            'evidence_notes' => 'Aprobado vía WhatsApp sin observaciones. Tipografía y posición del foil validadas.',
            'created_by' => $admin?->id,
        ]);

        // Order 1: Purchases
        $purchasePaper = CrmPurchase::firstOrCreate(
            ['folio' => 'CMP-2026-0001'],
            [
                'supplier_id' => $supplierPaper->id,
                'order_id' => $orderPrint->id,
                'concept' => 'Pliegos papel algodón 350g y sobres en punta',
                'category' => 'papeleria',
                'estimated_amount' => 4200.00,
                'real_amount' => 4150.00,
                'requested_date' => Carbon::now()->subDays(12),
                'expected_delivery_date' => Carbon::now()->subDays(9),
                'real_delivery_date' => Carbon::now()->subDays(9),
                'payment_due_date' => Carbon::now()->addDays(5),
                'purchase_status' => 'received',
                'receipt_notes' => 'Material recibido en perfecto estado en el taller.',
            ]
        );

        $purchaseFoil = CrmPurchase::firstOrCreate(
            ['folio' => 'CMP-2026-0002'],
            [
                'supplier_id' => $supplierFoil->id,
                'order_id' => $orderPrint->id,
                'concept' => 'Placa de magnesio y maquila de estampado Hot Stamping',
                'category' => 'servicios_externos',
                'estimated_amount' => 2800.00,
                'real_amount' => 2800.00,
                'requested_date' => Carbon::now()->subDays(8),
                'expected_delivery_date' => Carbon::now()->addDays(1),
                'purchase_status' => 'confirmed',
                'receipt_notes' => 'En proceso en el taller de acabados.',
            ]
        );

        // Supplier payment for paper purchase
        CrmSupplierPayment::create([
            'folio' => 'PAGP-2026-0001',
            'purchase_id' => $purchasePaper->id,
            'supplier_id' => $supplierPaper->id,
            'payment_date' => Carbon::now()->subDays(9),
            'amount' => 4150.00,
            'payment_method' => 'transferencia',
            'reference' => 'SPEI-8849201',
            'notes' => 'Liquidación de factura papel algodón.',
            'registered_by' => $admin?->id ?? 1,
        ]);

        // Order 1: Customer Advance Payment
        CrmCustomerPayment::create([
            'folio' => 'PAG-2026-0001',
            'order_id' => $orderPrint->id,
            'client_id' => $clientMariana->id,
            'payment_date' => Carbon::now()->subDays(14),
            'amount' => 9250.00,
            'concept' => 'anticipo',
            'payment_method' => 'transferencia',
            'reference' => 'TRANSF-BBVA-9901',
            'notes' => '50% de anticipo recibido para confirmación del pedido.',
            'registered_by' => $admin?->id ?? 1,
        ]);

        // Order 1: Additional cost item (wax seal wax and ribbons)
        CrmOrderCostItem::create([
            'order_id' => $orderPrint->id,
            'category' => 'insumos',
            'concept' => 'Barras de cera para lacre perla y listón de gasa de seda',
            'estimated_amount' => 850.00,
            'real_amount' => 820.00,
            'notes' => 'Comprado en tienda de arte local.',
        ]);

        // Order 2: Studio Project (Brand identity ready for delivery)
        $orderStudio = CrmOrder::firstOrCreate(
            ['folio' => 'STU-2026-0001'],
            [
                'client_id' => $clientStudio->id,
                'universe' => 'studio',
                'project_name' => 'Identidad de Marca Lumina Flor',
                'service_type' => 'Branding y Diseño Digital',
                'description' => 'Logotipo, tipografías, manual de marca y guías de empaque.',
                'requested_at' => Carbon::now()->subDays(25),
                'start_planned_at' => Carbon::now()->subDays(22),
                'start_real_at' => Carbon::now()->subDays(22),
                'delivery_agreed_at' => Carbon::now()->addDays(1),
                'commercial_status' => 'en_proceso',
                'operating_status' => 'listo_para_entregar',
                'priority' => 'medium',
                'assigned_to' => $admin?->id,
                'approved_amount' => 20000.00,
                'advance_required' => 10000.00,
                'workshop_overhead_type' => 'percent',
                'workshop_overhead_amount' => 3000.00,
                'notes' => 'Archivos finales organizados en Google Drive listos para entrega.',
            ]
        );

        $workflowService->initializeOrderTasks($orderStudio);
        $orderStudio->tasks()->take(9)->update([
            'status' => 'completed',
            'completed_at' => Carbon::now()->subDays(1),
        ]);

        CrmCustomerPayment::create([
            'folio' => 'PAG-2026-0002',
            'order_id' => $orderStudio->id,
            'client_id' => $clientStudio->id,
            'payment_date' => Carbon::now()->subDays(24),
            'amount' => 10000.00,
            'concept' => 'anticipo',
            'payment_method' => 'transferencia',
            'reference' => 'TRANSF-STU-01',
            'notes' => 'Anticipo del 50% para desarrollo de marca.',
            'registered_by' => $admin?->id ?? 1,
        ]);

        // Order 3: Moments Event
        $orderMoments = CrmOrder::firstOrCreate(
            ['folio' => 'MOM-2026-0001'],
            [
                'client_id' => $clientMoments->id,
                'universe' => 'moments',
                'project_name' => 'Experiencia Cena de Fin de Año Zenith',
                'service_type' => 'Experiencias y Caligrafía en Vivo',
                'description' => 'Mesa de bienvenida, minutas personalizadas y calígrafa en sitio durante el cóctel.',
                'requested_at' => Carbon::now()->subDays(8),
                'start_planned_at' => Carbon::now()->subDays(5),
                'delivery_agreed_at' => Carbon::now()->addDays(8),
                'commercial_status' => 'confirmado',
                'operating_status' => 'pendiente_compra',
                'priority' => 'urgent',
                'assigned_to' => $admin?->id,
                'approved_amount' => 32000.00,
                'advance_required' => 16000.00,
                'workshop_overhead_type' => 'percent',
                'workshop_overhead_amount' => 4800.00,
                'notes' => 'Requiere contratar calígrafa externa y preparar kits de bienvenida.',
            ]
        );

        $workflowService->initializeOrderTasks($orderMoments);

        CrmCustomerPayment::create([
            'folio' => 'PAG-2026-0003',
            'order_id' => $orderMoments->id,
            'client_id' => $clientMoments->id,
            'payment_date' => Carbon::now()->subDays(6),
            'amount' => 16000.00,
            'concept' => 'anticipo',
            'payment_method' => 'transferencia',
            'reference' => 'TRANSF-ZENITH-01',
            'notes' => 'Anticipo 50% gala Zenith.',
            'registered_by' => $admin?->id ?? 1,
        ]);

        // 9. Simulation Scenarios (Quotation Simulator)
        $sim1 = CrmSimulationScenario::firstOrCreate(
            ['name' => '100 Invitaciones Deluxe Folio Doble'],
            [
                'universe' => 'print',
                'service_type' => 'Papelería Social Fina',
                'quantity' => 100,
                'proposed_sale_price' => 16500.00,
                'workshop_overhead_amount' => 2475.00,
                'notes' => 'Escenario de prueba para paquete con papel handmade y doble estampado.',
                'created_by' => $admin?->id,
            ]
        );

        CrmSimulationCostItem::create(['scenario_id' => $sim1->id, 'category' => 'insumos', 'concept' => 'Papel artesanal bordes rasgados', 'amount' => 3800.00]);
        CrmSimulationCostItem::create(['scenario_id' => $sim1->id, 'category' => 'compras_externas', 'concept' => 'Placas y maquila de foil', 'amount' => 2900.00]);
        CrmSimulationCostItem::create(['scenario_id' => $sim1->id, 'category' => 'mano_de_obra_extra', 'concept' => 'Montaje y sellado manual', 'amount' => 1200.00]);

        $sim2 = CrmSimulationScenario::firstOrCreate(
            ['name' => 'Rediseño de Identidad + Packaging'],
            [
                'universe' => 'studio',
                'service_type' => 'Branding Boutique',
                'quantity' => 1,
                'proposed_sale_price' => 28000.00,
                'workshop_overhead_amount' => 4200.00,
                'notes' => 'Escenario de prueba para servicios creativos integrales.',
                'created_by' => $admin?->id,
            ]
        );

        CrmSimulationCostItem::create(['scenario_id' => $sim2->id, 'category' => 'compras_externas', 'concept' => 'Licencias tipográficas comerciales', 'amount' => 2500.00]);
        CrmSimulationCostItem::create(['scenario_id' => $sim2->id, 'category' => 'mano_de_obra_extra', 'concept' => 'Ilustración botánica comisionada', 'amount' => 3500.00]);
    }
}
