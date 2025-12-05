export interface OptionalFeatures {
  price_history: boolean;
  price_prediction: boolean;
  review_quality: boolean;
  loyalty_scan: boolean;
  seller_risk_filter: boolean;
  stock_alerts: boolean;
  image_barcode_mode: boolean;
  price_match_support: boolean;
}

export interface SearchParams {
  product_query: string;
  delivery_location: string;
  max_distance_km: number;
  currency: string;
  condition: string;
  budget_min: number | null;
  budget_max: number | null;
  optional_features: OptionalFeatures;
}

// --- API Response Types ---

export interface ResolvedProduct {
  title: string;
  sku: string;
  gtin: string;
  notes: string;
}

export interface ExchangeRate {
  rate_to_base: number;
  base_currency: string;
  timestamp: string;
}

export interface Offer {
  rank: number;
  seller: string;
  url: string;
  item_price: number;
  shipping_cost: number;
  taxes: number;
  total_landed_price: number;
  distance_km: number;
  delivery_eta: string;
  stock_status: 'in_stock' | 'limited' | 'pre_order' | 'out_of_stock';
  seller_rating: number;
  review_count: number;
  coupon_codes: string[];
  warranty: string;
  return_policy: string;
  condition: string;
  risk_level: 'low' | 'medium' | 'high';
  verification_notes: string;
}

export interface OfferAnalysis {
  rank: number;
  pros: string[];
  cons: string[];
  best_for: string;
  warnings: string[];
  warranty_comparison: string;
  return_comparison: string;
}

export interface Top2Analysis {
  offer1: OfferAnalysis;
  offer2: OfferAnalysis;
}

export interface VibeDealResponse {
  product_query: string;
  resolved_product: ResolvedProduct;
  location: string;
  currency: string;
  exchange_rate: ExchangeRate;
  offers: Offer[];
  top2_analysis: Top2Analysis;
  optional_features_used: string[];
  verification_summary: string[];
  timestamp: string;
  // Synthetic field for the UI to display price history if requested
  price_history_data?: { date: string; price: number }[];
}
