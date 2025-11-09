export interface MasterBahan {
  id: number;
  name: string;
  type_id: number;
  type_name: string;
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
  status: "Waiting" | "Approved" | "Rejected"; // tambahkan status
  approval_logs: ApprovalLog[]; //tambahkan approval logs
  created_at: string;
  updated_at: string;
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



export interface MasterBahanType {
  id: number;
  name: string;
}

export interface MasterBahanFormData {
  name: string;
  type_id: number;
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

// Response interfaces untuk API
export interface MasterBahanResponse {
  message: string;
  data: MasterBahan;
}

export interface MasterBahanListResponse {
  message: string;
  data: MasterBahan[];
}