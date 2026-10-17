<?php

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ClientController;
use App\Http\Controllers\Admin\CrmApprovalController;
use App\Http\Controllers\Admin\CrmCalendarController;
use App\Http\Controllers\Admin\CrmDashboardController;
use App\Http\Controllers\Admin\CrmFinanceController;
use App\Http\Controllers\Admin\CrmOrderController;
use App\Http\Controllers\Admin\CrmPaymentController;
use App\Http\Controllers\Admin\CrmPurchaseController;
use App\Http\Controllers\Admin\CrmReportController;
use App\Http\Controllers\Admin\CrmSettingController;
use App\Http\Controllers\Admin\CrmSimulationController;
use App\Http\Controllers\Admin\CrmSupplierController;
use App\Http\Controllers\Admin\CrmTaskController;
use App\Http\Controllers\Admin\OpportunityController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\PageController;
use App\Http\Controllers\Admin\PostController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\ProjectController;
use App\Http\Controllers\Admin\QuotationController;
use App\Http\Controllers\Admin\ServiceController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\TestimonialController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Internal CRM Operations Control Center Routes
|--------------------------------------------------------------------------
*/

// Executive Dashboard
Route::get('/', [CrmDashboardController::class, 'index'])->name('dashboard');

// Clients & CRM Commercial Directory
Route::resource('clients', ClientController::class);

// Commercial Opportunities (Funnel / Leads)
Route::resource('opportunities', OpportunityController::class);
Route::post('opportunities/{opportunity}/convert-to-quotation', [OpportunityController::class, 'convertToQuotation'])
    ->name('opportunities.convert-to-quotation');

// Quotations
Route::resource('quotations', QuotationController::class);
Route::post('quotations/{quotation}/status', [QuotationController::class, 'updateStatus'])
    ->name('quotations.update-status');
Route::post('quotations/{quotation}/convert-to-order', [QuotationController::class, 'convertToOrder'])
    ->name('quotations.convert-to-order');
Route::post('quotations/{quotation}/duplicate', [QuotationController::class, 'duplicate'])
    ->name('quotations.duplicate');
Route::get('quotations/{quotation}/pdf', [QuotationController::class, 'downloadPdf'])
    ->name('quotations.pdf');
Route::get('quotations/{quotation}/preview-pdf', [QuotationController::class, 'previewPdf'])
    ->name('quotations.preview-pdf');

// CRM Central Orders (Print, Studio, Moments)
Route::resource('crm-orders', CrmOrderController::class);
Route::post('crm-orders/{crmOrder}/operating-status', [CrmOrderController::class, 'updateOperatingStatus'])
    ->name('crm-orders.update-operating-status');
Route::post('crm-orders/{crmOrder}/commercial-status', [CrmOrderController::class, 'updateCommercialStatus'])
    ->name('crm-orders.update-commercial-status');

// Tasks & Activities
Route::post('crm-orders/{crmOrder}/tasks', [CrmTaskController::class, 'store'])
    ->name('crm-tasks.store');
Route::put('crm-tasks/{crmTask}', [CrmTaskController::class, 'update'])
    ->name('crm-tasks.update');
Route::post('crm-tasks/{crmTask}/status', [CrmTaskController::class, 'updateStatus'])
    ->name('crm-tasks.update-status');
Route::delete('crm-tasks/{crmTask}', [CrmTaskController::class, 'destroy'])
    ->name('crm-tasks.destroy');

// Approvals & Proofs
Route::post('crm-orders/{crmOrder}/approvals', [CrmApprovalController::class, 'store'])
    ->name('crm-approvals.store');
Route::put('crm-approvals/{crmApproval}', [CrmApprovalController::class, 'update'])
    ->name('crm-approvals.update');
Route::delete('crm-approvals/{crmApproval}', [CrmApprovalController::class, 'destroy'])
    ->name('crm-approvals.destroy');

// Financial: Customer Payments & Reversals
Route::post('crm-orders/{crmOrder}/payments', [CrmPaymentController::class, 'store'])
    ->name('crm-payments.store');
Route::post('crm-payments/{crmCustomerPayment}/reverse', [CrmPaymentController::class, 'reverse'])
    ->name('crm-payments.reverse');

// External Purchases & Commitments
Route::resource('purchases', CrmPurchaseController::class);
Route::post('purchases/{crmPurchase}/payments', [CrmPurchaseController::class, 'registerPayment'])
    ->name('purchases.register-payment');

// Suppliers
Route::resource('suppliers', CrmSupplierController::class);

// Calendar (Month, Week, Agenda)
Route::get('calendar', [CrmCalendarController::class, 'index'])->name('calendar.index');

// Finances Dashboard & Adjustments
Route::get('finances', [CrmFinanceController::class, 'index'])->name('finances.index');
Route::post('crm-orders/{crmOrder}/adjustments', [CrmFinanceController::class, 'storeAdjustment'])
    ->name('crm-orders.adjustments.store');
Route::post('crm-orders/{crmOrder}/cost-items', [CrmFinanceController::class, 'storeCostItem'])
    ->name('crm-orders.cost-items.store');

// Quotation Simulator
Route::get('simulations', [CrmSimulationController::class, 'index'])->name('simulations.index');
Route::post('simulations', [CrmSimulationController::class, 'store'])->name('simulations.store');
Route::post('simulations/{crmSimulationScenario}/duplicate', [CrmSimulationController::class, 'duplicate'])
    ->name('simulations.duplicate');
Route::post('simulations/{crmSimulationScenario}/convert-to-quotation', [CrmSimulationController::class, 'convertToQuotation'])
    ->name('simulations.convert-to-quotation');
Route::delete('simulations/{crmSimulationScenario}', [CrmSimulationController::class, 'destroy'])
    ->name('simulations.destroy');

// Reports & CSV Export
Route::get('reports', [CrmReportController::class, 'index'])->name('reports.index');
Route::get('reports/export-orders-csv', [CrmReportController::class, 'exportOrdersCsv'])->name('reports.export-orders-csv');

// CRM Settings
Route::get('crm-settings', [CrmSettingController::class, 'index'])->name('crm-settings.index');
Route::post('crm-settings', [CrmSettingController::class, 'update'])->name('crm-settings.update');

/*
|--------------------------------------------------------------------------
| Website & Portfolio CMS Management Routes
|--------------------------------------------------------------------------
*/
Route::resource('pages', PageController::class);
Route::resource('projects', ProjectController::class);
Route::resource('categories', CategoryController::class);
Route::resource('posts', PostController::class);
Route::resource('testimonials', TestimonialController::class);
Route::resource('services', ServiceController::class);
Route::resource('products', ProductController::class);
Route::resource('orders', OrderController::class);

Route::get('settings', [SettingController::class, 'index'])->name('settings.index');
Route::post('settings', [SettingController::class, 'update'])->name('settings.update');
