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
        // Business Settings
        Schema::create('business_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->string('group')->default('general');
            $table->string('type')->default('string'); // string, number, boolean, json
            $table->string('description')->nullable();
            $table->timestamps();
        });

        // Clients
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('business_name')->nullable();
            $table->string('phone')->nullable();
            $table->string('whatsapp')->nullable();
            $table->string('email')->nullable()->index();
            $table->string('client_type')->default('direct'); // direct, business, agency, event
            $table->string('channel')->default('whatsapp'); // whatsapp, instagram, referral, website, event, other
            $table->date('first_contact_at')->nullable();
            $table->text('internal_notes')->nullable();
            $table->string('status')->default('active'); // active, archived
            $table->timestamps();
            $table->softDeletes();
        });

        // Opportunities / Commercial Leads
        Schema::create('opportunities', function (Blueprint $table) {
            $table->id();
            $table->string('folio')->unique();
            $table->foreignId('client_id')->constrained('clients')->cascadeOnDelete();
            $table->enum('universe', ['print', 'studio', 'moments'])->default('print');
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('contact_channel')->nullable();
            $table->date('entry_date');
            $table->date('last_contact_date')->nullable();
            $table->date('next_followup_date')->nullable();
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            $table->enum('priority', ['low', 'medium', 'high', 'urgent'])->default('medium');
            $table->decimal('estimated_amount', 12, 2)->nullable();
            $table->string('stage')->default('nuevo_contacto');
            // Stages: nuevo_contacto, por_cotizar, cotizacion_en_preparacion, cotizacion_enviada, en_seguimiento, aceptada, confirmado, perdido, cancelado
            $table->text('lost_reason')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['universe', 'stage']);
        });

        // CRM Orders (Declared before quotations so quotations can reference converted_to_order_id, or cross-referenced)
        Schema::create('crm_orders', function (Blueprint $table) {
            $table->id();
            $table->string('folio')->unique();
            $table->foreignId('client_id')->constrained('clients')->restrictOnDelete();
            $table->unsignedBigInteger('quotation_id')->nullable();
            $table->enum('universe', ['print', 'studio', 'moments'])->default('print');
            $table->string('project_name');
            $table->string('service_type')->nullable();
            $table->text('description')->nullable();

            // Operational & Planning Dates
            $table->date('requested_at');
            $table->date('start_planned_at')->nullable();
            $table->date('start_real_at')->nullable();
            $table->date('delivery_agreed_at')->nullable();
            $table->date('next_milestone_at')->nullable();
            $table->date('internal_deadline_at')->nullable();
            $table->date('delivered_at')->nullable();
            $table->date('closed_at')->nullable();

            // Statuses (strictly independent)
            $table->string('commercial_status')->default('confirmado');
            // commercial: cotizado, confirmado, en_proceso, entregado, cerrado, cancelado

            $table->string('operating_status')->default('no_iniciado');
            // operating: no_iniciado, pendiente_informacion, pendiente_aprobacion, pendiente_compra, pendiente_recepcion, listo_produccion, en_produccion, en_revision_interna, pendiente_aprobacion_final, listo_para_entregar, entregado, bloqueado
            $table->text('blocked_reason')->nullable();

            $table->enum('priority', ['low', 'medium', 'high', 'urgent'])->default('medium');
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();

            // Agreed financial parameters
            $table->decimal('approved_amount', 12, 2)->default(0);
            $table->decimal('advance_required', 12, 2)->default(0);
            $table->string('workshop_overhead_type')->default('percent'); // percent, fixed, manual
            $table->decimal('workshop_overhead_amount', 12, 2)->default(0);

            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['universe', 'operating_status']);
            $table->index(['universe', 'commercial_status']);
            $table->index('delivery_agreed_at');
        });

        // Quotations
        Schema::create('quotations', function (Blueprint $table) {
            $table->id();
            $table->string('folio')->unique();
            $table->foreignId('client_id')->constrained('clients')->cascadeOnDelete();
            $table->foreignId('opportunity_id')->nullable()->constrained('opportunities')->nullOnDelete();
            $table->enum('universe', ['print', 'studio', 'moments'])->default('print');
            $table->string('project_name');
            $table->text('description')->nullable();
            $table->json('items')->nullable(); // array of line items { concept, description, quantity, unit_price, subtotal }
            $table->decimal('subtotal', 12, 2)->default(0);
            $table->decimal('discount', 12, 2)->default(0);
            $table->decimal('total_amount', 12, 2)->default(0);
            $table->decimal('advance_required', 12, 2)->default(0);
            $table->text('payment_terms')->nullable();
            $table->string('estimated_delivery_time')->nullable();
            $table->date('creation_date');
            $table->date('sent_date')->nullable();
            $table->date('expiration_date')->nullable();
            $table->date('accepted_date')->nullable();
            $table->string('status')->default('draft');
            // draft, preparing, sent, in_followup, accepted, rejected, expired, cancelled
            $table->text('notes')->nullable();
            $table->integer('version')->default(1);
            $table->foreignId('converted_to_order_id')->nullable()->constrained('crm_orders')->nullOnDelete();
            $table->dateTime('converted_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['universe', 'status']);
        });

        // Link quotation_id back in crm_orders with FK constraint
        Schema::table('crm_orders', function (Blueprint $table) {
            $table->foreign('quotation_id')->references('id')->on('quotations')->nullOnDelete();
        });

        // Quotation Versions / Snapshots
        Schema::create('quotation_versions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('quotation_id')->constrained('quotations')->cascadeOnDelete();
            $table->integer('version_number');
            $table->json('snapshot_data'); // full quotation payload and line items
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('reason')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('crm_orders', function (Blueprint $table) {
            $table->dropForeign(['quotation_id']);
        });
        Schema::dropIfExists('quotation_versions');
        Schema::dropIfExists('quotations');
        Schema::dropIfExists('crm_orders');
        Schema::dropIfExists('opportunities');
        Schema::dropIfExists('clients');
        Schema::dropIfExists('business_settings');
    }
};
