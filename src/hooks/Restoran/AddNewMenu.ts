import { getDataAuthenticated, postFormDataAuthenticated } from "@/utils/http";
import { Menu } from "@/interfaces/menu";
import {GET_RESTAURANT_MENUS, CREATE_MENU} from "@/constants/endpoint";

export const getRestaurantMenus = async (): Promise<Menu[]> => {
  return getDataAuthenticated(GET_RESTAURANT_MENUS());
};

export const createMenu = async (payload: {
  name: string;
  category: string;
  price: number;
  portion: number;
  description: string;
  image?: File;
}) => {
  const formData = new FormData();
  formData.append("name", payload.name);
  formData.append("category", payload.category);
  formData.append("price", String(payload.price));
  formData.append("portion", String(payload.portion));
  formData.append("description", payload.description);

  if (payload.image) {
    formData.append("image", payload.image);
  }   

  return postFormDataAuthenticated(CREATE_MENU(), formData);
};




