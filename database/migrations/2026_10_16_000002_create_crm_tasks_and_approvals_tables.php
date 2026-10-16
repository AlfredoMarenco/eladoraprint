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
        // Task Templates by Universe
        Schema::create('crm_task_templates', function (Blueprint $table) {
            $table->id();
            $table->enum('universe', ['print', 'studio', 'moments']);
            $table->string('name');
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Template Items
        Schema::create('crm_task_template_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('template_id')->constrained('crm_task_templates')->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('category')->default('produccion');
            $table->integer('order_index')->default(0);
            $table->integer('days_offset')->default(0);
            $table->boolean('is_optional')->default(false);
            $table->timestamps();
        });

        // Tasks / Activities
        Schema::create('crm_tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('crm_orders')->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('category')->default('produccion');
            // brief, diseno, aprobacion, compras, produccion, calidad, entrega, cierre
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            $table->date('start_date')->nullable();
            $table->date('due_date')->nullable();
            $table->dateTime('completed_at')->nullable();
            $table->string('status')->default('pending');
            // pending, in_progress, blocked, completed, cancelled
            $table->text('blocked_reason')->nullable();
            $table->foreignId('depends_on_task_id')->nullable()->constrained('crm_tasks')->nullOnDelete();
            $table->enum('priority', ['low', 'medium', 'high', 'urgent'])->default('medium');
            $table->integer('order_index')->default(0);
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['order_id', 'status']);
            $table->index('due_date');
        });

        // Order Approvals / Review Versions
        Schema::create('crm_order_approvals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('crm_orders')->cascadeOnDelete();
            $table->string('version_title');
            $table->string('review_type')->default('design_proposal');
            // design_proposal, print_proof, copy_review, sample, final_deliverable
            $table->dateTime('sent_at')->nullable();
            $table->dateTime('deadline_at')->nullable();
            $table->string('file_path')->nullable();
            $table->string('file_name')->nullable();
            $table->string('external_url')->nullable();
            $table->text('client_feedback')->nullable();
            $table->string('status')->default('draft');
            // draft, sent, changes_requested, approved, rejected, superseded
            $table->dateTime('responded_at')->nullable();
            $table->string('approved_by_name')->nullable();
            $table->text('evidence_notes')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['order_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('crm_order_approvals');
        Schema::dropIfExists('crm_tasks');
        Schema::dropIfExists('crm_task_template_items');
        Schema::dropIfExists('crm_task_templates');
    }
};
