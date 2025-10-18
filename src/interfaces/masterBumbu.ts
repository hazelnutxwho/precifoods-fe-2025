export interface MasterBumbu {
  id: number;
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
  created_at?: string;
  updated_at?: string;
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
