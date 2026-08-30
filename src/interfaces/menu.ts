export interface Menu {
  id: number;
  name: string;
  price: number;
  portion: number;
  category: string;
  description: string;
  status: string;
  image_url: string;
  restaurant_id?: string;
  nutrition?: Nutrition;

  nutrition_per_portion?: NutritionPerPortion; 
  reason?: string;
  created_at?: string; 
  updated_at?: string; 
  menu_approval_logs?: MenuApprovalLog[]; // ditambah
}

export interface Nutrition {
  weight_per_portion: number;
  weight_with_bdd: number;
  calory: number;
  protein: number;
  fat: number;
  carbohydrate: number;
  fiber: number;
  natrium: number;
  cholesterol: number;
  mufa: number;
  pufa: number;
  sfa: number;
}

export interface NutritionPerPortion {
  calory: number;
  protein: number;
  fat: number;
  carbohydrate: number;
  fiber: number;
  natrium: number;
  cholesterol: number;
  mufa: number;
  pufa: number;
  sfa: number;
}

export interface MenuApprovalLog {
  id: number;
  menu_id: number;
  from_status: string | null;
  to_status: string;
  changed_at: string;
  reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface MenuResponse {
  message: string;
  data: Menu;
}

export const MENU_CATEGORIES = [
  "Semua",
  "Makanan Pokok",
  "Lauk Pauk",
  "Sayuran",
  "Snack",
  "Minuman",
] as const;

export interface Recommendation {
  total_price: number;
  recommendations: Menu[];
  nutrition_summary: NutritionSummary;
}

export interface SimpleRecommendation {
  id: number;
  rank: number;
  description: string;
  total_price: number;
  image_url: { url: string }[];
}

export interface IndexRecommendation {
  restaurant_id: string;
  restaurant_name: string;
  recommended_at: number;
  status: {
    is_generating: boolean;
    generator_error: string | null;
  };
  recommendations: SimpleRecommendation[];
}

export interface NutritionSummary {
  calory: number;
  protein: number;
  fat: number;
  carbohydrate: number;
}