import { useState, useEffect } from 'react';
import {
  getDataAuthenticated,
  deleteDataAuthenticated,
  patchFormDataAuthenticated
} from '@/utils/http';
import {
  GET_RESTAURANT_MENUS,
  GET_MENU_DETAIL
} from '@/constants/endpoint';
import { Menu, MENU_CATEGORIES } from '@/interfaces/menu';

export interface MenuFormData {
  name: string;
  price: number;
  portion: number;
  category: string;
  description: string;
  image?: File | null;
}

export const useRestaurantMenu = () => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('Semua');


  // Get all menus
  const fetchMenus = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getDataAuthenticated(GET_RESTAURANT_MENUS());
      // Handle response structure
      const data = response.data || response;
      setMenus(Array.isArray(data) ? data : []);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Gagal memuat menu';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Get menu by id
  const fetchMenuById = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getDataAuthenticated(GET_MENU_DETAIL(id));
      const data = response.data || response;
      setSelectedMenu(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Gagal memuat detail menu';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  // Update menu
  const updateMenu = async (id: string, formData: Partial<MenuFormData>) => {
  try {
    setLoading(true);
    setError(null);

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (key === "image" && value instanceof File) {
          payload.append(key, value);
        } else if (key !== "image") {
          payload.append(key, value.toString());
        }
      }
    });

    // Eksekusi PATCH request
    await patchFormDataAuthenticated(GET_MENU_DETAIL(id), payload);
    
    // Selalu fetch data terbaru setelah update berhasil
    const updatedData = await fetchMenuById(id);
    
      if (updatedData) {
        setMenus((prev) => prev.map((menu) => (menu.id === parseInt(id) ? updatedData : menu)));
        setSelectedMenu(updatedData);
        return updatedData;
      }
      
      throw new Error("Berhasil update tetapi gagal mengambil data terbaru");

    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Gagal mengupdate menu";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Delete menu
  const deleteMenu = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await deleteDataAuthenticated(GET_MENU_DETAIL(id));
      setMenus(prev => prev.filter(menu => menu.id !== parseInt(id)));
      setSelectedMenu(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Gagal menghapus menu';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Filtered menus berdasarkan category
  const filteredMenus = menus.filter(menu => {
    return filterCategory === 'Semua' || menu.category === filterCategory;
  });

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Clear selected menu
  const clearSelectedMenu = () => {
    setSelectedMenu(null);
  };

  // Refetch data
  const refetch = () => {
    fetchMenus();
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  return {
    // State
    menus: filteredMenus,
    allMenus: menus,
    categories: MENU_CATEGORIES,
    loading,
    error,
    selectedMenu,
    filterCategory,
    
    // Actions
    fetchMenus,
    fetchMenuById,
    updateMenu,
    deleteMenu,
    setFilterCategory,
    clearError,
    clearSelectedMenu,
    refetch
  };
};

export default useRestaurantMenu;
