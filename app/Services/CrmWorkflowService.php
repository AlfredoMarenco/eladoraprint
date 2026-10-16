<?php

namespace App\Services;

use App\Models\BusinessSetting;
use App\Models\CrmActivityLog;
use App\Models\CrmCustomerPayment;
use App\Models\CrmOrder;
use App\Models\CrmPurchase;
use App\Models\CrmTask;
use App\Models\CrmTaskTemplate;
use App\Models\Opportunity;
use App\Models\Quotation;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class CrmWorkflowService
{
    /**
     * Generate the next unique sequential folio for an entity.
     */
    public function generateFolio(string $type, string $universe = 'print'): string
    {
        $year = date('Y');
        $prefix = match ($type) {
            'order' => match ($universe) {
                'studio' => BusinessSetting::get('folio_prefix_studio', 'STU'),
                'moments' => BusinessSetting::get('folio_prefix_moments', 'MOM'),
                default => BusinessSetting::get('folio_prefix_print', 'PRN'),
            },
            'quotation' => BusinessSetting::get('folio_prefix_quote', 'COT'),
            'purchase' => BusinessSetting::get('folio_prefix_purchase', 'CMP'),
            'payment' => 'PAG',
            'opportunity' => 'LEAD',
            default => 'DOC',
        };

        // Determine count for sequence
        $count = match ($type) {
            'order' => CrmOrder::whereYear('created_at', $year)->count() + 1,
            'quotation' => Quotation::whereYear('created_at', $year)->count() + 1,
            'purchase' => CrmPurchase::whereYear('created_at', $year)->count() + 1,
            'payment' => CrmCustomerPayment::whereYear('created_at', $year)->count() + 1,
            'opportunity' => Opportunity::whereYear('created_at', $year)->count() + 1,
            default => 1,
        };

        $folio = sprintf('%s-%s-%04d', $prefix, $year, $count);

        // Ensure uniqueness
        while ($this->folioExists($type, $folio)) {
            $count++;
            $folio = sprintf('%s-%s-%04d', $prefix, $year, $count);
        }

        return $folio;
    }

    private function folioExists(string $type, string $folio): bool
    {
        return match ($type) {
            'order' => CrmOrder::where('folio', $folio)->exists(),
            'quotation' => Quotation::where('folio', $folio)->exists(),
            'purchase' => CrmPurchase::where('folio', $folio)->exists(),
            'payment' => CrmCustomerPayment::where('folio', $folio)->exists(),
            'opportunity' => Opportunity::where('folio', $folio)->exists(),
            default => false,
        };
    }

    /**
     * Initialize standard workflow tasks for an order according to its universe.
     */
    public function initializeOrderTasks(CrmOrder $order): void
    {
        $template = CrmTaskTemplate::with('items')
            ->where('universe', $order->universe)
            ->where('is_active', true)
            ->first();

        $startDate = $order->start_planned_at ?? $order->requested_at ?? now();

        if ($template && $template->items->isNotEmpty()) {
            foreach ($template->items as $item) {
                CrmTask::create([
                    'order_id' => $order->id,
                    'title' => $item->title,
                    'description' => $item->description,
                    'category' => $item->category,
                    'start_date' => Carbon::parse($startDate)->addDays($item->days_offset),
                    'due_date' => Carbon::parse($startDate)->addDays($item->days_offset + 1),
                    'status' => 'pending',
                    'priority' => 'medium',
                    'order_index' => $item->order_index,
                ]);
            }
        } else {
            // Default built-in universe tasks if template not seeded yet
            $defaultTasks = $this->getDefaultUniverseTasks($order->universe);
            $index = 1;
            foreach ($defaultTasks as $t) {
                CrmTask::create([
                    'order_id' => $order->id,
                    'title' => $t['title'],
                    'category' => $t['category'],
                    'description' => $t['description'] ?? null,
                    'start_date' => Carbon::parse($startDate)->addDays($t['offset']),
                    'due_date' => Carbon::parse($startDate)->addDays($t['offset'] + 1),
                    'status' => 'pending',
                    'priority' => 'medium',
                    'order_index' => $index++,
                ]);
            }
        }
    }

    /**
     * Convert an accepted quotation into an active CRM order.
     * Prevents duplicate conversions and maintains full historical integrity.
     */
    public function convertQuotationToOrder(Quotation $quotation, ?int $userId = null): CrmOrder
    {
        if ($quotation->converted_to_order_id) {
            throw new \Exception('Esta cotización ya fue convertida previamente en el pedido con ID '.$quotation->converted_to_order_id);
        }

        return DB::transaction(function () use ($quotation, $userId) {
            // Mark quotation accepted if not already
            if ($quotation->status !== 'accepted') {
                $quotation->status = 'accepted';
                $quotation->accepted_date = now();
            }

            // Create immutable snapshot of accepted state
            $quotation->createSnapshot($userId, 'Cotización aceptada y convertida a pedido');

            $folio = $this->generateFolio('order', $quotation->universe);

            // Compute default overhead amount based on business settings
            $overheadMethod = BusinessSetting::get('workshop_overhead_method', 'percent');
            $overheadVal = (float) BusinessSetting::get('workshop_overhead_value', 10);
            $overheadAmount = match ($overheadMethod) {
                'percent' => round(($quotation->total_amount * $overheadVal) / 100, 2),
                'fixed' => $overheadVal,
                default => 0.0,
            };

            $order = CrmOrder::create([
                'folio' => $folio,
                'client_id' => $quotation->client_id,
                'quotation_id' => $quotation->id,
                'universe' => $quotation->universe,
                'project_name' => $quotation->project_name,
                'service_type' => $quotation->universe === 'print' ? 'Impresión y Papelería' : ($quotation->universe === 'studio' ? 'Diseño y Branding' : 'Experiencias y Eventos'),
                'description' => $quotation->description,
                'requested_at' => now(),
                'start_planned_at' => now(),
                'delivery_agreed_at' => $quotation->expiration_date ? Carbon::parse($quotation->expiration_date)->addDays(7) : now()->addDays(14),
                'commercial_status' => 'confirmado',
                'operating_status' => 'no_iniciado',
                'priority' => 'medium',
                'approved_amount' => $quotation->total_amount,
                'advance_required' => $quotation->advance_required > 0 ? $quotation->advance_required : round($quotation->total_amount * 0.5, 2),
                'workshop_overhead_type' => $overheadMethod,
                'workshop_overhead_amount' => $overheadAmount,
                'notes' => 'Convertido desde la cotización '.$quotation->folio,
            ]);

            // Update quotation with reference
            $quotation->converted_to_order_id = $order->id;
            $quotation->converted_at = now();
            $quotation->save();

            // Also update opportunity stage if linked
            if ($quotation->opportunity_id) {
                $quotation->opportunity()->update(['stage' => 'confirmado']);
            }

            // Initialize universe tasks
            $this->initializeOrderTasks($order);

            // Log activity
            CrmActivityLog::log($order, 'converted', "Pedido {$order->folio} creado desde cotización {$quotation->folio}", [
                'quotation_folio' => $quotation->folio,
                'approved_amount' => $order->approved_amount,
            ], $userId);

            return $order;
        });
    }

    /**
     * Default tasks specification per universe as defined in specifications.
     */
    public function getDefaultUniverseTasks(string $universe): array
    {
        return match ($universe) {
            'studio' => [
                ['title' => 'Recibir brief del cliente', 'category' => 'brief', 'offset' => 0],
                ['title' => 'Revisar información y referencias', 'category' => 'brief', 'offset' => 1],
                ['title' => 'Confirmar alcance y condiciones', 'category' => 'brief', 'offset' => 2],
                ['title' => 'Confirmar recepción de anticipo', 'category' => 'cierre', 'offset' => 3],
                ['title' => 'Crear propuesta de diseño', 'category' => 'diseno', 'offset' => 5],
                ['title' => 'Enviar revisión al cliente', 'category' => 'aprobacion', 'offset' => 7],
                ['title' => 'Registrar comentarios y feedback', 'category' => 'aprobacion', 'offset' => 9],
                ['title' => 'Aplicar revisiones incluidas', 'category' => 'diseno', 'offset' => 11],
                ['title' => 'Obtener aprobación final del cliente', 'category' => 'aprobacion', 'offset' => 13],
                ['title' => 'Preparar y entregar archivos finales', 'category' => 'entrega', 'offset' => 14],
                ['title' => 'Registrar saldo y cierre del proyecto', 'category' => 'cierre', 'offset' => 15],
            ],
            'moments' => [
                ['title' => 'Registrar fecha, ubicación y horario del evento', 'category' => 'brief', 'offset' => 0],
                ['title' => 'Confirmar alcance y cotización', 'category' => 'brief', 'offset' => 1],
                ['title' => 'Registrar anticipo y condiciones', 'category' => 'cierre', 'offset' => 2],
                ['title' => 'Planificar compras y logística', 'category' => 'compras', 'offset' => 4],
                ['title' => 'Confirmar materiales, cantidades y personal', 'category' => 'compras', 'offset' => 6],
                ['title' => 'Preparar elementos personalizados', 'category' => 'produccion', 'offset' => 8],
                ['title' => 'Coordinar montaje del evento', 'category' => 'produccion', 'offset' => 10],
                ['title' => 'Ejecutar el servicio o evento', 'category' => 'entrega', 'offset' => 12],
                ['title' => 'Registrar entrega o cierre del servicio', 'category' => 'entrega', 'offset' => 13],
                ['title' => 'Registrar desmontaje del evento', 'category' => 'produccion', 'offset' => 14],
                ['title' => 'Registrar saldo y cierre final', 'category' => 'cierre', 'offset' => 15],
            ],
            default => [ // print
                ['title' => 'Recopilar especificaciones y medidas', 'category' => 'brief', 'offset' => 0],
                ['title' => 'Confirmar cotización y condiciones', 'category' => 'brief', 'offset' => 1],
                ['title' => 'Recibir anticipo correspondiente', 'category' => 'cierre', 'offset' => 2],
                ['title' => 'Preparar diseño o archivo de impresión', 'category' => 'diseno', 'offset' => 3],
                ['title' => 'Revisar prueba de impresión y obtener aprobación', 'category' => 'aprobacion', 'offset' => 5],
                ['title' => 'Comprar o recibir insumos y papeles', 'category' => 'compras', 'offset' => 6],
                ['title' => 'Coordinar servicios externos (hot stamping, serigrafía)', 'category' => 'produccion', 'offset' => 8],
                ['title' => 'Producción e impresión en taller', 'category' => 'produccion', 'offset' => 10],
                ['title' => 'Realizar control de calidad', 'category' => 'calidad', 'offset' => 11],
                ['title' => 'Empaque y presentación fina', 'category' => 'calidad', 'offset' => 12],
                ['title' => 'Entrega al cliente o despacho', 'category' => 'entrega', 'offset' => 13],
                ['title' => 'Registrar liquidación de saldo y cierre', 'category' => 'cierre', 'offset' => 14],
            ],
        };
    }
}
