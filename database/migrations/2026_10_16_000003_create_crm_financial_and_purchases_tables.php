<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Suppliers / Providers
        Schema::create('crm_suppliers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('contact_name')->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->string('category')->default('materiales');
            // impresion, papeleria, acabados, montaje_eventos, mensajeria, materiales, otros
            $table->text('notes')->nullable();
            $table->string('status')->default('active'); // active, archived
            $table->timestamps();
            $table->softDeletes();
        });

        // Purchases & Commitments
        Schema::create('crm_purchases', function (Blueprint $table) {
            $table->id();
            $table->string('folio')->unique();
            $table->foreignId('supplier_id')->constrained('crm_suppliers')->restrictOnDelete();
            $table->foreignId('order_id')->nullable()->constrained('crm_orders')->nullOnDelete();
            $table->string('concept');
            $table->string('category')->default('materiales');
            // materiales, servicios_externos, mano_de_obra_externa, logistica, taller, otros
            $table->decimal('estimated_amount', 12, 2)->default(0);
            $table->decimal('real_amount', 12, 2)->nullable();
            $table->date('requested_date');
            $table->date('expected_delivery_date')->nullable();
            $table->date('real_delivery_date')->nullable();
            $table->date('payment_due_date')->nullable();
            $table->string('purchase_status')->default('requested');
            // to_quote, requested, confirmed, pending_reception, partially_received, received, cancelled
            $table->text('receipt_notes')->nullable();
            $table->string('receipt_file_path')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['order_id', 'purchase_status']);
        });

        // Customer Payments (Money received from clients)
        Schema::create('crm_customer_payments', function (Blueprint $table) {
            $table->id();
            $table->string('folio')->unique();
            $table->foreignId('order_id')->constrained('crm_orders')->cascadeOnDelete();
            $table->foreignId('client_id')->constrained('clients')->restrictOnDelete();
            $table->date('payment_date');
            $table->decimal('amount', 12, 2);
            $table->string('concept')->default('anticipo');
            // anticipo, pago_parcial, liquidacion, ajuste
            $table->string('payment_method')->default('transferencia');
            // transferencia, efectivo, tarjeta, mercadopago, otro
            $table->string('reference')->nullable();
            $table->string('receipt_file_path')->nullable();
            $table->text('notes')->nullable();
            $table->foreignId('registered_by')->constrained('users')->restrictOnDelete();

            // Reversal & Auditability (never silently delete payments!)
            $table->boolean('is_reversal')->default(false);
            $table->foreignId('reversed_payment_id')->nullable()->constrained('crm_customer_payments')->nullOnDelete();
            $table->timestamps();

            $table->index(['order_id', 'concept']);
            $table->index('payment_date');
        });

        // Supplier Payments (Money paid to suppliers for purchases)
        Schema::create('crm_supplier_payments', function (Blueprint $table) {
            $table->id();
            $table->string('folio')->unique();
            $table->foreignId('purchase_id')->constrained('crm_purchases')->cascadeOnDelete();
            $table->foreignId('supplier_id')->constrained('crm_suppliers')->restrictOnDelete();
            $table->date('payment_date');
            $table->decimal('amount', 12, 2);
            $table->string('payment_method')->default('transferencia');
            $table->string('reference')->nullable();
            $table->string('receipt_file_path')->nullable();
            $table->text('notes')->nullable();
            $table->foreignId('registered_by')->constrained('users')->restrictOnDelete();
            $table->timestamps();

            $table->index('purchase_id');
        });

        // Order Cost Items (Other operational, internal, or outsourced costs assigned to an order)
        Schema::create('crm_order_cost_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('crm_orders')->cascadeOnDelete();
            $table->string('category')->default('insumos');
            // insumos, servicios_externos, mano_de_obra, gastos_operativos, otros
            $table->string('concept');
            $table->decimal('estimated_amount', 12, 2)->default(0);
            $table->decimal('real_amount', 12, 2)->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index('order_id');
        });

        // Financial Adjustments (Auditable modifications to price, discounts, refunds)
        Schema::create('crm_financial_adjustments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('crm_orders')->cascadeOnDelete();
            $table->string('type'); // discount, price_adjustment, refund_adjustment, cancellation_balance
            $table->decimal('amount', 12, 2);
            $table->text('reason');
            $table->foreignId('registered_by')->constrained('users')->restrictOnDelete();
            $table->timestamps();

            $table->index('order_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('crm_financial_adjustments');
        Schema::dropIfExists('crm_order_cost_items');
        Schema::dropIfExists('crm_supplier_payments');
        Schema::dropIfExists('crm_customer_payments');
        Schema::dropIfExists('crm_purchases');
        Schema::dropIfExists('crm_suppliers');
    }
};
