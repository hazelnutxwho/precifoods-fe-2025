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
  created_at?: string;
  updated_at?: string;
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
