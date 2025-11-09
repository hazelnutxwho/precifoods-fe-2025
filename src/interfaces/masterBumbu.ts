export interface MasterBumbu {
  id: number;
  name: string;
  type_id?: number;
  type_name?: string;
  bdd: number;           
  calory: number;       
  protein: number;     
  fat: number;         
  carbohydrate: number;
  fiber: number;       
  natrium: number;     
  cholesterol: number; 
  sfa: number;         
  mufa: number;        
  pufa: number;        
  status: "Waiting" | "Approved" | "Rejected"; // field baru dari backend
  approval_logs: ApprovalLog[];               // daftar riwayat approval
  created_at: string;
  updated_at: string;
}

export interface MasterBumbuFormData {
  name: string;
  bdd: number;         
  calory: number;      
  protein: number;     
  fat: number;         
  carbohydrate: number;
  fiber: number;       
  natrium: number;     
  cholesterol: number; 
  sfa: number;         
  mufa: number;        
  pufa: number; 
}


export interface ApprovalLog {
  id: number;
  bahan_id: number;
  from_status: string | null;
  to_status: string;
  changed_at: string;
  reason: string | null;
  created_at: string;
  updated_at: string;
}
