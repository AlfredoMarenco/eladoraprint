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
        // Simulation Scenarios (Quotation Simulator)
        Schema::create('crm_simulation_scenarios', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('universe', ['print', 'studio', 'moments'])->default('print');
            $table->string('service_type')->nullable();
            $table->integer('quantity')->default(1);
            $table->decimal('proposed_sale_price', 12, 2)->default(0);
            $table->decimal('workshop_overhead_amount', 12, 2)->default(0);
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        // Simulation Cost Items
        Schema::create('crm_simulation_cost_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('scenario_id')->constrained('crm_simulation_scenarios')->cascadeOnDelete();
            $table->string('category')->default('insumos');
            // insumos, compras_externas, gastos_operativos, mano_de_obra_extra, otros
            $table->string('concept');
            $table->decimal('amount', 12, 2)->default(0);
            $table->timestamps();
        });

        // Activity Logs (Full audit trail of operational, commercial, and financial events)
        Schema::create('crm_activity_logs', function (Blueprint $table) {
            $table->id();
            $table->string('subject_type');
            $table->unsignedBigInteger('subject_id');
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('action'); // created, status_changed, converted, payment_added, reversed, updated
            $table->text('description');
            $table->json('properties')->nullable();
            $table->timestamps();

            $table->index(['subject_type', 'subject_id']);
            $table->index('action');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('crm_activity_logs');
        Schema::dropIfExists('crm_simulation_cost_items');
        Schema::dropIfExists('crm_simulation_scenarios');
    }
};
