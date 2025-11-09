export interface Notification {
  id: number;
  title: string;
  restaurant_name: string;
  restaurant_id: string;
  menu_id: number;
  menu_name: string;
  is_read: boolean;
}

export interface NotificationResponse {
  message: string;
  data: Notification[];
}

export interface UpdateNotificationRequest {
  is_read: boolean;
}

export interface UpdateNotificationResponse {
  message: string;
}


// Approval
export interface MasterStatusApprovedRequest {
  status: "Approved";
}

// Reject
export interface MasterStatusRejectedRequest {
  status: "Rejected";
  reason: string; 
}

export type MasterStatusRequest =
  | MasterStatusApprovedRequest
  | MasterStatusRejectedRequest;
