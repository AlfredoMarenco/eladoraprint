<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BusinessSetting;
use App\Models\CrmTaskTemplate;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CrmSettingController extends Controller
{
    public function index(): Response
    {
        $settings = BusinessSetting::all()->keyBy('key');
        $templates = CrmTaskTemplate::with('items')->get();

        return Inertia::render('admin/crm/settings/index', [
            'settings' => $settings,
            'templates' => $templates,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'company_name' => 'required|string|max:255',
            'company_email' => 'required|email|max:255',
            'company_phone' => 'nullable|string|max:50',
            'default_currency' => 'required|string|max:10',
            'timezone' => 'required|string',
            'date_format' => 'required|string',
            'folio_prefix_print' => 'required|string|max:10',
            'folio_prefix_studio' => 'required|string|max:10',
            'folio_prefix_moments' => 'required|string|max:10',
            'folio_prefix_quote' => 'required|string|max:10',
            'folio_prefix_purchase' => 'required|string|max:10',
            'default_advance_percent' => 'required|numeric|min:0|max:100',
            'workshop_overhead_method' => 'required|in:percent,fixed,manual',
            'workshop_overhead_value' => 'required|numeric|min:0',
            'alert_upcoming_days' => 'required|integer|min:1',
            'alert_overdue_days' => 'required|integer|min:1',
        ]);

        foreach ($validated as $key => $value) {
            BusinessSetting::updateOrCreate(
                ['key' => $key],
                ['value' => (string) $value]
            );
        }

        return redirect()->back()->with('success', 'Configuración del CRM actualizada correctamente');
    }
}
