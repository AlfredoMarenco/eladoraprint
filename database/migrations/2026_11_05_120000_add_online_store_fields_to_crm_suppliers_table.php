<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('crm_suppliers', function (Blueprint $table) {
            if (! Schema::hasColumn('crm_suppliers', 'supplier_type')) {
                $table->string('supplier_type')->default('traditional')->after('name');
            }
            if (! Schema::hasColumn('crm_suppliers', 'website_url')) {
                $table->string('website_url', 2048)->nullable()->after('email');
            }
        });
    }

    public function down(): void
    {
        Schema::table('crm_suppliers', function (Blueprint $table) {
            $cols = [];
            if (Schema::hasColumn('crm_suppliers', 'supplier_type')) {
                $cols[] = 'supplier_type';
            }
            if (Schema::hasColumn('crm_suppliers', 'website_url')) {
                $cols[] = 'website_url';
            }
            if (! empty($cols)) {
                $table->dropColumn($cols);
            }
        });
    }
};
