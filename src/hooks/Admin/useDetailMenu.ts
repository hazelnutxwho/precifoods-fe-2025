import { useEffect, useState} from 'react';
import { Menu, MenuResponse } from '@/interfaces/menu';
import { MasterStatusRequest } from '@/interfaces/admin';
import { GET_DETAIL_MENU, PUT_MENU_STATUS } from '@/constants/endpoint';
import { getCookies } from '@/utils/cookie';

interface UseDetailMenuReturn {
  // Data dan state untuk GET_DETAIL_MENU
  data: Menu | null;
  isLoading: boolean;
  errorMessage: string | null;
  refetch: () => void;
  
  // Functions dan state untuk PUT_MENU_STATUS
  updateStatus: (params: MasterStatusRequest) => Promise<void>;
  isUpdating: boolean;
  updateError: string | null;
  isUpdateSuccess: boolean;
  resetUpdateState: () => void;
}

export const useDetailMenu = (menuId?: number, restaurantId?: string): UseDetailMenuReturn => {
  // State untuk GET_DETAIL_MENU
  const [data, setData] = useState<Menu | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // State untuk PUT_MENU_STATUS
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [isUpdateSuccess, setIsUpdateSuccess] = useState<boolean>(false);

  // Fungsi untuk GET_DETAIL_MENU
  const fetchMenuDetail = async () => {
    if (!menuId) {
      setData(null);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const rid = restaurantId || getCookies("restaurant_id");
      const token = getCookies("token");

      if (!rid) {
        throw new Error('Restaurant ID tidak ditemukan');
      }
      if (!token) {
        throw new Error('Token tidak tersedia');
      }

      const endpoint = GET_DETAIL_MENU(rid, menuId.toString());
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || `Gagal mengambil data menu: ${response.status}`
        );
      }

      const result: MenuResponse = await response.json();
      
      if (result.message === 'Success!' && result.data) {
        setData(result.data);
      } else {
        throw new Error(result.message || 'Format response tidak valid');
      }
    } catch (error) {
      console.error('Error fetching menu detail:', error);
      setErrorMessage(
        error instanceof Error 
          ? error.message 
          : 'Terjadi kesalahan saat mengambil data menu'
      );
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi untuk PUT_MENU_STATUS
  const updateStatus = async (params: MasterStatusRequest) => {
    if (!menuId) {
      setUpdateError('Menu ID tidak tersedia');
      return;
    }

    setIsUpdating(true);
    setUpdateError(null);
    setIsUpdateSuccess(false);

    try {
      const rid = restaurantId || getCookies("restaurant_id");
      const token = getCookies("token");

      if (!rid || !token) {
        throw new Error('Restaurant ID atau Token tidak tersedia');
      }

      const endpoint = PUT_MENU_STATUS(rid, menuId.toString());
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;

      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.errors || errorData?.message || `Gagal update status: ${response.status}`
        );
      }

      const result = await response.json();
      
      if (result.message === 'Success!') {
        setIsUpdateSuccess(true);
        // Refresh data setelah update status berhasil
        await fetchMenuDetail();
      } else {
        throw new Error(result.message || 'Update status gagal');
      }
    } catch (error) {
      console.error('Error updating menu status:', error);
      setUpdateError(
        error instanceof Error 
          ? error.message 
          : 'Terjadi kesalahan saat mengupdate status menu'
      );
    } finally {
      setIsUpdating(false);
    }
  };

  // Reset state update
  const resetUpdateState = () => {
    setUpdateError(null);
    setIsUpdateSuccess(false);
  };

  // Effect untuk fetch data ketika menuId berubah
  useEffect(() => {
    fetchMenuDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuId, restaurantId]);

  const refetch = () => {
    fetchMenuDetail();
  };

  return {
    // GET_DETAIL_MENU
    data,
    isLoading,
    errorMessage,
    refetch,
    
    // PUT_MENU_STATUS
    updateStatus,
    isUpdating,
    updateError,
    isUpdateSuccess,
    resetUpdateState,
  };
};