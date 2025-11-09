export interface RestaurantNotification {
  id: number;
  title: string;
  restaurant_name: string;
  restaurant_id: string;
  menu_id: number;
  menu_name: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface RestaurantNotificationSuccessResponse {
  message: string;
  data: RestaurantNotification[];
}

export interface RestaurantNotificationErrorResponse {
  errors: string;
}
