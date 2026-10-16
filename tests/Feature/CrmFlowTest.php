<?php

use App\Models\BusinessSetting;
use App\Models\Client;
use App\Models\CrmCustomerPayment;
use App\Models\CrmOrder;
use App\Models\CrmOrderCostItem;
use App\Models\CrmPurchase;
use App\Models\CrmSimulationScenario;
use App\Models\CrmSupplier;
use App\Models\CrmTaskTemplate;
use App\Models\CrmTaskTemplateItem;
use App\Models\Opportunity;
use App\Models\Quotation;
use App\Models\User;
use App\Services\CrmFinancialService;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    // Seed essential roles
    Role::firstOrCreate(['name' => 'Administradora']);
    Role::firstOrCreate(['name' => 'Colaborador']);
    Role::firstOrCreate(['name' => 'Consulta']);

    // Seed test business settings
    BusinessSetting::updateOrCreate(['key' => 'default_advance_percent'], ['value' => '50']);
    BusinessSetting::updateOrCreate(['key' => 'folio_prefix_print'], ['value' => 'PRN']);
    BusinessSetting::updateOrCreate(['key' => 'folio_prefix_studio'], ['value' => 'STU']);
    BusinessSetting::updateOrCreate(['key' => 'folio_prefix_moments'], ['value' => 'MOM']);
    BusinessSetting::updateOrCreate(['key' => 'folio_prefix_quote'], ['value' => 'COT']);
    BusinessSetting::updateOrCreate(['key' => 'folio_prefix_purchase'], ['value' => 'CMP']);
    BusinessSetting::updateOrCreate(['key' => 'workshop_overhead_method'], ['value' => 'percent']);
    BusinessSetting::updateOrCreate(['key' => 'workshop_overhead_value'], ['value' => '10']);

    // Seed task template for Print
    $printTemplate = CrmTaskTemplate::create([
        'universe' => 'print',
        'name' => 'Flujo de Producción Print',
        'description' => 'Plantilla estándar de papelería e impresos finos',
        'is_active' => true,
    ]);

    CrmTaskTemplateItem::create([
        'template_id' => $printTemplate->id,
        'title' => 'Revisión técnica de archivos',
        'category' => 'preprensa',
        'default_priority' => 'high',
        'days_offset' => 1,
        'order_index' => 1,
    ]);

    CrmTaskTemplateItem::create([
        'template_id' => $printTemplate->id,
        'title' => 'Compra de papel y sustratos',
        'category' => 'compras',
        'default_priority' => 'medium',
        'days_offset' => 2,
        'order_index' => 2,
    ]);

    CrmTaskTemplateItem::create([
        'template_id' => $printTemplate->id,
        'title' => 'Producción e impresión',
        'category' => 'produccion',
        'default_priority' => 'high',
        'days_offset' => 5,
        'order_index' => 3,
    ]);
});

test('unauthenticated users are redirected from crm routes', function () {
    $this->get('/admin/clients')->assertRedirect('/login');
    $this->get('/admin/crm-orders')->assertRedirect('/login');
    $this->get('/admin/finances')->assertRedirect('/login');
});

test('authenticated admin can access crm pages', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Administradora');

    $this->actingAs($admin);

    $this->get('/admin')->assertOk();
    $this->get('/admin/clients')->assertOk();
    $this->get('/admin/opportunities')->assertOk();
    $this->get('/admin/quotations')->assertOk();
    $this->get('/admin/crm-orders')->assertOk();
    $this->get('/admin/purchases')->assertOk();
    $this->get('/admin/suppliers')->assertOk();
    $this->get('/admin/finances')->assertOk();
    $this->get('/admin/simulations')->assertOk();
    $this->get('/admin/reports')->assertOk();
    $this->get('/admin/crm-settings')->assertOk();
});

test('can create and update clients', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Administradora');
    $this->actingAs($admin);

    $response = $this->post('/admin/clients', [
        'name' => 'Mariana Ruiz',
        'business_name' => 'Studio Creativo Ruiz',
        'phone' => '5551234567',
        'whatsapp' => '5551234567',
        'email' => 'mariana@ruizstudio.com',
        'client_type' => 'business',
        'channel' => 'instagram',
        'internal_notes' => 'Cliente recurrente para empaques',
    ]);

    $response->assertRedirect();
    $client = Client::where('email', 'mariana@ruizstudio.com')->first();
    expect($client)->not->toBeNull()
        ->and($client->name)->toBe('Mariana Ruiz')
        ->and($client->status)->toBe('active');

    // Update client
    $this->put("/admin/clients/{$client->id}", [
        'name' => 'Mariana Ruiz Valdés',
        'business_name' => 'Studio Creativo Ruiz',
        'phone' => '5551234567',
        'whatsapp' => '5551234567',
        'email' => 'mariana@ruizstudio.com',
        'client_type' => 'agency',
        'channel' => 'instagram',
        'status' => 'active',
        'internal_notes' => 'Actualizado a agencia',
    ])->assertRedirect("/admin/clients/{$client->id}");

    expect($client->fresh()->name)->toBe('Mariana Ruiz Valdés')
        ->and($client->fresh()->client_type)->toBe('agency');

    $this->get("/admin/clients/{$client->id}")
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/crm/clients/show')
            ->has('client')
            ->has('total_paid')
            ->has('total_balance_due')
        );
});

test('can create opportunity and convert it to quotation', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Administradora');
    $this->actingAs($admin);

    $client = Client::create([
        'name' => 'Boutique Flor de Sal',
        'client_type' => 'business',
        'channel' => 'whatsapp',
        'status' => 'active',
    ]);

    // Create opportunity
    $this->post('/admin/opportunities', [
        'client_id' => $client->id,
        'universe' => 'print',
        'title' => 'Etiquetas con Foil Dorado',
        'description' => '1000 etiquetas circulares para frascos de miel',
        'contact_channel' => 'whatsapp',
        'priority' => 'high',
        'estimated_amount' => 4500.00,
        'entry_date' => now()->toDateString(),
        'stage' => 'nuevo_contacto',
    ])->assertRedirect();

    $opportunity = Opportunity::where('title', 'Etiquetas con Foil Dorado')->first();
    expect($opportunity)->not->toBeNull()
        ->and($opportunity->client_id)->toBe($client->id);

    // Convert opportunity to quotation
    $this->post("/admin/opportunities/{$opportunity->id}/convert-to-quotation")
        ->assertRedirect();

    $quotation = Quotation::where('opportunity_id', $opportunity->id)->first();
    expect($quotation)->not->toBeNull()
        ->and($quotation->client_id)->toBe($client->id)
        ->and($quotation->universe)->toBe('print')
        ->and((float) $quotation->total_amount)->toBe(4500.0)
        ->and($quotation->status)->toBe('draft');
});

test('can save quotation, generate historic versions, and convert to order with tasks', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Administradora');
    $this->actingAs($admin);

    $client = Client::create([
        'name' => 'Casa Madero Eventos',
        'client_type' => 'business',
        'channel' => 'referral',
        'status' => 'active',
    ]);

    // Create quotation
    $this->post('/admin/quotations', [
        'client_id' => $client->id,
        'universe' => 'print',
        'project_name' => 'Menús en Papel Algodón 300g',
        'description' => 'Menús para gala de aniversario con hot stamping',
        'items' => [
            [
                'concept' => 'Menú Cena de Gala',
                'description' => 'Impresión digital + Hot Stamping oro mate',
                'quantity' => 150,
                'unit_price' => 40.00,
                'subtotal' => 6000.00,
            ],
        ],
        'discount' => 500.00,
        'advance_required' => 2750.00,
        'payment_terms' => '50% anticipo, 50% al entregar',
        'estimated_delivery_time' => '10 días hábiles',
        'expiration_date' => now()->addDays(15)->toDateString(),
    ])->assertRedirect();

    $quotation = Quotation::where('project_name', 'Menús en Papel Algodón 300g')->first();
    expect($quotation)->not->toBeNull()
        ->and((float) $quotation->total_amount)->toBe(5500.00)
        ->and((float) $quotation->advance_required)->toBe(2750.00);

    // Update quotation status to sent, then accepted
    $this->post("/admin/quotations/{$quotation->id}/status", [
        'status' => 'accepted',
        'change_reason' => 'Cliente aprobó por WhatsApp',
    ])->assertRedirect();

    expect($quotation->fresh()->status)->toBe('accepted')
        ->and($quotation->versions()->count())->toBeGreaterThan(0);

    // Convert accepted quotation to order
    $this->post("/admin/quotations/{$quotation->id}/convert-to-order")
        ->assertRedirect();

    $order = CrmOrder::where('quotation_id', $quotation->id)->first();
    expect($order)->not->toBeNull()
        ->and($order->client_id)->toBe($client->id)
        ->and($order->universe)->toBe('print')
        ->and((float) $order->approved_amount)->toBe(5500.00)
        ->and((float) $order->advance_required)->toBe(2750.00)
        ->and($order->commercial_status)->toBe('confirmado')
        ->and($order->operating_status)->toBe('no_iniciado');

    // Verify tasks were generated from Print template
    expect($order->tasks()->count())->toBe(3)
        ->and($order->tasks()->where('title', 'Revisión técnica de archivos')->exists())->toBeTrue();

    // Verify duplicate conversion is rejected
    $this->post("/admin/quotations/{$quotation->id}/convert-to-order")
        ->assertRedirect();
    expect(CrmOrder::where('quotation_id', $quotation->id)->count())->toBe(1);
});

test('commercial, operating, and financial statuses operate independently', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Administradora');
    $this->actingAs($admin);

    $client = Client::create(['name' => 'Cliente Independencia', 'client_type' => 'direct', 'status' => 'active']);

    $order = CrmOrder::create([
        'folio' => 'PRN-2026-9999',
        'client_id' => $client->id,
        'universe' => 'print',
        'project_name' => 'Tarjetas de Presentación',
        'approved_amount' => 1500.00,
        'advance_required' => 750.00,
        'commercial_status' => 'confirmado',
        'operating_status' => 'en_produccion',
        'requested_at' => now(),
    ]);

    // Financial status should automatically be "Sin anticipo registrado" because no payments exist
    expect($order->financial_status)->toBe('Sin anticipo registrado');

    // Delivering the order DOES NOT mean it's paid!
    $order->update(['operating_status' => 'entregado', 'delivered_at' => now()]);
    expect($order->operating_status)->toBe('entregado')
        ->and($order->financial_status)->toBe('Sin anticipo registrado')
        ->and($order->balance_due)->toBe(1500.00);
});

test('handles payments, balances, automatic financial status, and auditable reversals', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Administradora');
    $this->actingAs($admin);

    $client = Client::create(['name' => 'Sofia Morales', 'client_type' => 'direct', 'status' => 'active']);

    $order = CrmOrder::create([
        'folio' => 'PRN-2026-8888',
        'client_id' => $client->id,
        'universe' => 'print',
        'project_name' => 'Papelería de Boda',
        'approved_amount' => 10000.00,
        'advance_required' => 5000.00,
        'commercial_status' => 'confirmado',
        'operating_status' => 'listo_produccion',
        'requested_at' => now(),
    ]);

    expect($order->total_collected)->toBe(0.0)
        ->and($order->balance_due)->toBe(10000.0)
        ->and($order->pending_advance)->toBe(5000.0)
        ->and($order->financial_status)->toBe('Sin anticipo registrado');

    // Register advance payment of $5,000
    $this->post("/admin/crm-orders/{$order->id}/payments", [
        'amount' => 5000.00,
        'concept' => 'anticipo',
        'payment_method' => 'transferencia',
        'payment_date' => now()->toDateString(),
        'reference' => 'SPEI-789456',
    ])->assertRedirect();

    $order->refresh();
    expect($order->total_collected)->toBe(5000.0)
        ->and($order->balance_due)->toBe(5000.0)
        ->and($order->pending_advance)->toBe(0.0)
        ->and($order->financial_status)->toBe('Anticipo cubierto');

    // Register final liquidation of $5,000
    $this->post("/admin/crm-orders/{$order->id}/payments", [
        'amount' => 5000.00,
        'concept' => 'liquidacion',
        'payment_method' => 'transferencia',
        'payment_date' => now()->toDateString(),
        'reference' => 'SPEI-999111',
    ])->assertRedirect();

    $order->refresh();
    expect($order->total_collected)->toBe(10000.0)
        ->and($order->balance_due)->toBe(0.0)
        ->and($order->financial_status)->toBe('Liquidado');

    // Reversal of payment (non-silent audit trail)
    $lastPayment = $order->payments()->where('concept', 'liquidacion')->first();
    expect($lastPayment)->not->toBeNull();

    $this->post("/admin/crm-payments/{$lastPayment->id}/reverse", [
        'reason' => 'Transferencia rechazada por banco del cliente',
    ])->assertRedirect();

    $order->refresh();
    // Payment was reversed: collected is back to 5000, balance due is back to 5000
    expect($order->total_collected)->toBe(5000.0)
        ->and($order->balance_due)->toBe(5000.0);

    // Verify reversal record exists in database
    $reversalRecord = CrmCustomerPayment::where('reversed_payment_id', $lastPayment->id)->first();
    expect($reversalRecord)->not->toBeNull()
        ->and($reversalRecord->is_reversal)->toBeTrue()
        ->and((float) $reversalRecord->amount)->toBe(5000.0);

    $this->get("/admin/clients/{$client->id}")
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/crm/clients/show')
            ->has('client.orders')
            ->has('client.payments')
        );
});

test('tracks external purchases, receipts, and separate supplier disbursements', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Administradora');
    $this->actingAs($admin);

    $supplier = CrmSupplier::create([
        'name' => 'Papelera Lumen Mayorista',
        'category' => 'papel_y_sustratos',
        'status' => 'active',
    ]);

    $client = Client::create(['name' => 'Empresa Test', 'client_type' => 'business', 'status' => 'active']);
    $order = CrmOrder::create([
        'folio' => 'PRN-2026-7777',
        'client_id' => $client->id,
        'universe' => 'print',
        'project_name' => 'Cuadernos Corporativos',
        'approved_amount' => 8000.00,
        'advance_required' => 4000.00,
        'commercial_status' => 'confirmado',
        'operating_status' => 'pendiente_compra',
        'requested_at' => now(),
    ]);

    // Register purchase
    $this->post('/admin/purchases', [
        'supplier_id' => $supplier->id,
        'order_id' => $order->id,
        'concept' => '50 pliegos papel Sirio Pearl 300g',
        'category' => 'materiales',
        'estimated_amount' => 1800.00,
        'real_amount' => 1950.00,
        'requested_date' => now()->toDateString(),
        'purchase_status' => 'solicitada',
    ])->assertRedirect();

    $purchase = CrmPurchase::where('concept', 'like', '%Sirio Pearl%')->first();
    expect($purchase)->not->toBeNull()
        ->and((float) $purchase->effective_cost)->toBe(1950.00)
        ->and($purchase->paid_amount)->toBe(0.0)
        ->and($purchase->pending_payment_amount)->toBe(1950.00);

    // Order real costs should now include the purchase
    $order->refresh();
    expect($order->real_costs)->toBe(1950.00);

    // Register payment to supplier
    $this->post("/admin/purchases/{$purchase->id}/payments", [
        'amount' => 1950.00,
        'payment_date' => now()->toDateString(),
        'payment_method' => 'transferencia',
        'reference' => 'SPEI-PROV-1234',
    ])->assertRedirect();

    $purchase->refresh();
    expect($purchase->paid_amount)->toBe(1950.00)
        ->and($purchase->pending_payment_amount)->toBe(0.0)
        ->and($purchase->payment_status)->toBe('paid');
});

test('calculates profit and margin with overhead without double counting', function () {
    $financialService = app(CrmFinancialService::class);

    $client = Client::create(['name' => 'Cliente Rentabilidad', 'client_type' => 'business', 'status' => 'active']);
    $order = CrmOrder::create([
        'folio' => 'PRN-2026-6666',
        'client_id' => $client->id,
        'universe' => 'print',
        'project_name' => 'Cajas de Lujo',
        'approved_amount' => 10000.00,
        'advance_required' => 5000.00,
        'workshop_overhead_type' => 'percent',
        'workshop_overhead_amount' => 1000.00, // 10% of 10,000 = $1,000
        'commercial_status' => 'confirmado',
        'operating_status' => 'en_produccion',
        'requested_at' => now(),
    ]);

    // Cost item 1: estimated 2,000, real 2,200
    CrmOrderCostItem::create([
        'order_id' => $order->id,
        'category' => 'materiales',
        'concept' => 'Cartón rígido gris 2mm',
        'estimated_amount' => 2000.00,
        'real_amount' => 2200.00,
    ]);

    // Cost item 2: estimated 1,500, real 1,500
    CrmOrderCostItem::create([
        'order_id' => $order->id,
        'category' => 'acabados',
        'concept' => 'Foil stamping oro',
        'estimated_amount' => 1500.00,
        'real_amount' => 1500.00,
    ]);

    $order->refresh();

    // Workshop overhead = 10% of 10,000 = $1,000
    // Real costs = 2200 + 1500 = 3700
    // Total costs with overhead = 3700 + 1000 = 4700
    // Real profit = 10,000 - 4700 = 5300
    // Estimated margin = 5300 / 10000 * 100 = 53.0%

    expect($order->real_costs)->toBe(4700.0)
        ->and($order->real_profit)->toBe(5300.0)
        ->and($order->estimated_margin_percent)->toBe(55.0);
});

test('quotation simulator saves scenarios and allows converting to formal quotation', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Administradora');
    $this->actingAs($admin);

    $client = Client::create(['name' => 'Cliente Simulación', 'client_type' => 'direct', 'status' => 'active']);

    // Create scenario
    $this->post('/admin/simulations', [
        'name' => 'Escenario Invitaciones 200pz',
        'universe' => 'moments',
        'service_type' => 'Invitaciones Premium',
        'quantity' => 200,
        'proposed_sale_price' => 7000.00,
        'workshop_overhead_amount' => 700.00,
        'notes' => 'Comparación de márgenes con sobre artesanal',
        'cost_items' => [
            ['category' => 'materiales', 'concept' => 'Papel artesanal', 'amount' => 1800.00],
            ['category' => 'acabados', 'concept' => 'Sello de lacre', 'amount' => 600.00],
        ],
    ])->assertRedirect();

    $scenario = CrmSimulationScenario::where('name', 'Escenario Invitaciones 200pz')->first();
    expect($scenario)->not->toBeNull()
        ->and((float) $scenario->total_costs)->toBe(3100.00) // 1800 + 600 + 700
        ->and((float) $scenario->estimated_profit)->toBe(3900.00);

    // Duplicate scenario
    $this->post("/admin/simulations/{$scenario->id}/duplicate")->assertRedirect();
    expect(CrmSimulationScenario::where('name', 'Escenario Invitaciones 200pz (Copia)')->exists())->toBeTrue();

    // Convert to formal quotation
    $this->post("/admin/simulations/{$scenario->id}/convert-to-quotation", [
        'client_id' => $client->id,
    ])->assertRedirect();

    $quotation = Quotation::where('client_id', $client->id)->where('project_name', 'Escenario Invitaciones 200pz')->first();
    expect($quotation)->not->toBeNull()
        ->and((float) $quotation->total_amount)->toBe(7000.00)
        ->and($quotation->universe)->toBe('moments')
        ->and($quotation->status)->toBe('draft');
});
