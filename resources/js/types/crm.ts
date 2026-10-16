export type Universe = 'print' | 'studio' | 'moments';

export interface Client {
    id: number;
    name: string;
    business_name?: string | null;
    phone?: string | null;
    whatsapp?: string | null;
    email?: string | null;
    client_type: 'direct' | 'business' | 'agency' | 'event';
    channel: 'whatsapp' | 'instagram' | 'referral' | 'website' | 'event' | 'other';
    first_contact_at?: string | null;
    internal_notes?: string | null;
    status: 'active' | 'archived';
    orders_count?: number;
    quotations_count?: number;
    total_paid?: number;
    total_balance_due?: number;
    opportunities?: Opportunity[];
    quotations?: Quotation[];
    orders?: CrmOrder[];
    payments?: CrmCustomerPayment[];
    created_at?: string;
    updated_at?: string;
}

export interface Opportunity {
    id: number;
    folio: string;
    client_id: number;
    universe: Universe;
    title: string;
    description?: string | null;
    contact_channel?: string | null;
    entry_date: string;
    last_contact_date?: string | null;
    next_followup_date?: string | null;
    assigned_to?: number | null;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    estimated_amount?: number | null;
    stage: string;
    lost_reason?: string | null;
    notes?: string | null;
    client?: Client;
    assigned_user?: { id: number; name: string } | null;
    created_at?: string;
    updated_at?: string;
}

export interface QuotationItem {
    concept: string;
    description?: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
}

export interface QuotationVersion {
    id: number;
    quotation_id: number;
    version_number: number;
    snapshot_data: Record<string, unknown>;
    created_by?: number | null;
    reason?: string | null;
    created_at: string;
    created_by_user?: { id: number; name: string } | null;
}

export interface Quotation {
    id: number;
    folio: string;
    client_id: number;
    opportunity_id?: number | null;
    universe: Universe;
    project_name: string;
    description?: string | null;
    items?: QuotationItem[];
    subtotal: number;
    discount: number;
    total_amount: number;
    advance_required: number;
    payment_terms?: string | null;
    estimated_delivery_time?: string | null;
    creation_date: string;
    sent_date?: string | null;
    expiration_date?: string | null;
    accepted_date?: string | null;
    status: 'draft' | 'preparing' | 'sent' | 'in_followup' | 'accepted' | 'rejected' | 'expired' | 'cancelled';
    notes?: string | null;
    version: number;
    converted_to_order_id?: number | null;
    converted_at?: string | null;
    client?: Client;
    opportunity?: Opportunity;
    converted_order?: CrmOrder;
    versions?: QuotationVersion[];
    created_at?: string;
    updated_at?: string;
}

export interface CrmTask {
    id: number;
    order_id: number;
    title: string;
    description?: string | null;
    category: string;
    assigned_to?: number | null;
    start_date?: string | null;
    due_date?: string | null;
    completed_at?: string | null;
    status: 'pending' | 'in_progress' | 'blocked' | 'completed' | 'cancelled';
    blocked_reason?: string | null;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    order_index: number;
    notes?: string | null;
    assigned_user?: { id: number; name: string } | null;
    order?: CrmOrder;
}

export interface CrmOrderApproval {
    id: number;
    order_id: number;
    version_title: string;
    review_type: string;
    sent_at?: string | null;
    deadline_at?: string | null;
    file_path?: string | null;
    file_name?: string | null;
    external_url?: string | null;
    client_feedback?: string | null;
    status: 'draft' | 'sent' | 'changes_requested' | 'approved' | 'rejected' | 'superseded';
    responded_at?: string | null;
    approved_by_name?: string | null;
    evidence_notes?: string | null;
    created_by?: number | null;
    creator?: { id: number; name: string } | null;
}

export interface CrmSupplier {
    id: number;
    name: string;
    contact_name?: string | null;
    phone?: string | null;
    email?: string | null;
    category: string;
    notes?: string | null;
    status: 'active' | 'archived';
    purchases_count?: number;
    total_purchased?: number;
    total_paid?: number;
    pending_balance?: number;
}

export interface CrmPurchase {
    id: number;
    folio: string;
    supplier_id: number;
    order_id?: number | null;
    concept: string;
    category: string;
    estimated_amount: number;
    real_amount?: number | null;
    requested_date: string;
    expected_delivery_date?: string | null;
    real_delivery_date?: string | null;
    payment_due_date?: string | null;
    purchase_status: string;
    receipt_notes?: string | null;
    supplier?: CrmSupplier;
    order?: CrmOrder;
    payments?: CrmSupplierPayment[];
    effective_cost?: number;
    paid_amount?: number;
    pending_payment_amount?: number;
    payment_status?: 'pending' | 'partial' | 'paid';
}

export interface CrmCustomerPayment {
    id: number;
    folio: string;
    order_id: number;
    client_id: number;
    payment_date: string;
    amount: number;
    concept: 'anticipo' | 'pago_parcial' | 'liquidacion' | 'ajuste';
    payment_method: string;
    reference?: string | null;
    notes?: string | null;
    is_reversal: boolean;
    reversed_payment_id?: number | null;
    registered_by_user?: { id: number; name: string } | null;
    order?: CrmOrder;
    client?: Client;
}

export interface CrmSupplierPayment {
    id: number;
    folio: string;
    purchase_id: number;
    supplier_id: number;
    payment_date: string;
    amount: number;
    payment_method: string;
    reference?: string | null;
    notes?: string | null;
}

export interface CrmOrderCostItem {
    id: number;
    order_id: number;
    category: string;
    concept: string;
    estimated_amount: number;
    real_amount?: number | null;
    notes?: string | null;
}

export interface CrmFinancialAdjustment {
    id: number;
    order_id: number;
    type: string;
    amount: number;
    reason: string;
    registered_by_user?: { id: number; name: string } | null;
    created_at: string;
}

export interface CrmActivityLog {
    id: number;
    subject_type: string;
    subject_id: number;
    user_id?: number | null;
    action: string;
    description: string;
    properties?: Record<string, unknown> | null;
    created_at: string;
    user?: { id: number; name: string } | null;
}

export interface CrmOrder {
    id: number;
    folio: string;
    client_id: number;
    quotation_id?: number | null;
    universe: Universe;
    project_name: string;
    service_type?: string | null;
    description?: string | null;
    requested_at: string;
    start_planned_at?: string | null;
    start_real_at?: string | null;
    delivery_agreed_at?: string | null;
    next_milestone_at?: string | null;
    internal_deadline_at?: string | null;
    delivered_at?: string | null;
    closed_at?: string | null;
    commercial_status: 'cotizado' | 'confirmado' | 'en_proceso' | 'entregado' | 'cerrado' | 'cancelado';
    operating_status: string;
    blocked_reason?: string | null;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    assigned_to?: number | null;
    approved_amount: number;
    advance_required: number;
    workshop_overhead_type: string;
    workshop_overhead_amount: number;
    notes?: string | null;
    client?: Client;
    quotation?: Quotation;
    assigned_user?: { id: number; name: string } | null;
    tasks?: CrmTask[];
    approvals?: CrmOrderApproval[];
    purchases?: CrmPurchase[];
    payments?: CrmCustomerPayment[];
    cost_items?: CrmOrderCostItem[];
    adjustments?: CrmFinancialAdjustment[];
    activity_logs?: CrmActivityLog[];
    total_collected: number;
    balance_due: number;
    pending_advance: number;
    estimated_costs: number;
    real_costs: number;
    estimated_profit: number;
    real_profit: number;
    estimated_margin_percent: number;
    financial_status: string;
}

export interface CrmSimulationScenario {
    id: number;
    name: string;
    universe: Universe;
    service_type?: string | null;
    quantity: number;
    proposed_sale_price: number;
    workshop_overhead_amount: number;
    notes?: string | null;
    cost_items?: Array<{ id?: number; category: string; concept: string; amount: number }>;
    total_costs?: number;
    estimated_profit?: number;
    estimated_margin_percent?: number;
    created_at?: string;
}

export interface CrmKPIs {
    active_orders: number;
    new_contacts: number;
    quotes_pending_prep: number;
    quotes_sent: number;
    upcoming_deliveries: number;
    overdue_tasks: number;
    blocked_orders: number;
    pending_approvals: number;
    pending_advance: number;
    balance_due: number;
    supplier_debt: number;
    total_collected: number;
    total_approved: number;
    estimated_costs: number;
    real_costs: number;
    estimated_profit: number;
    estimated_margin_percent: number;
}
