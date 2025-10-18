import { getCookies } from "@/utils/cookie";

export type Endpoint = (query?: string) => string;
// export type Endpoint = (...args: any[]) => string;


export const GET_ORDERS: Endpoint = () => `/consumers/orders`;
export const PROFILE: Endpoint = () => `/users/consumers/profile`;
export const GET_RESTAURANTS: Endpoint = () => `/list/restaurant`;
export const GET_RECOMMENDATIONS: Endpoint = () => `/restaurants/${getCookies("restaurant_id")}/recommendations`;
export const GET_MENUS: Endpoint = () => `/restaurants/${getCookies("restaurant_id")}/menus`;
export const GET_RESTAURANT_PROFILE: Endpoint = () => `/users/restaurants/${getCookies("restaurant_id")}`;
export const SEARCH_MENUS: Endpoint = (query?: string) => `/restaurants/${getCookies("restaurant_id")}/menus/search?name=${query}`;


// ==================== RESTAURANT ENDPOINTS ==================================

// Master Bahan
export const GET_ALL_BAHAN: Endpoint = () => `/master-bahan`;                  // GET all bahan
export const GET_SINGLE_BAHAN: Endpoint = (id?: string) => `/master-bahan/${id}`; // GET single bahan by id
export const GET_BAHAN_TYPES: Endpoint = () => `/master-bahan-types`;  

// Master Bumbu
export const GET_ALL_BUMBU: Endpoint = () => `/master-bumbu`; // GET all bumbu  
export const GET_SINGLE_BUMBU: Endpoint = (id?: string) => `/master-bumbu/${id}`; // GET single bumbu by id

// Menu
export const GET_RESTAURANT_MENUS: Endpoint = () => `/restaurants/menus`;
export const GET_MENU_DETAIL: Endpoint = (id?: string) => `/restaurants/menus/${id}`;
export const CREATE_MENU: Endpoint = () => `/restaurants/menu`; 

// Get resep
export type RecipeEndpoint = (restaurantId: string, menuId: number) => string;
// export const GET_RECIPE: Endpoint = (restaurantId: string, menuId: number) =>
//   `/restaurants/${restaurantId}/menus/${menuId}/recipe`;

export const GET_RECIPE: RecipeEndpoint= (restaurantId: string, menuId: number) =>
  `/restaurants/${restaurantId}/menus/${menuId}/recipe`;

// ==================== ADMIN ENDPOINTS ==================================

export const GET_NOTIFIKASI: Endpoint = () => `/notifications`;

export const PUT_NOTIFIKASI: Endpoint = (notificationId?: string) => 
  `/api/notifications/${notificationId}`;

