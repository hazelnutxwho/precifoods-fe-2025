import { useState } from "react";
import { getDataAuthenticated, putDataAuthenticated } from "@/utils/http";
import { GET_RECIPE } from "@/constants/endpoint";

export interface RecipeItem {
  item_id: number;
  item_type: "bahan" | "bumbu";
  quantity_grams: number | string;
  name?: string;
}

const useResep = () => {
  const [dataResep, setDataResep] = useState<RecipeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ambil resep untuk menu tertentu
  const getMenuRecipe = async (restaurantId: string, menuId: number) => {
    try {
      setLoading(true);
      setError(null);

      const res = await getDataAuthenticated(GET_RECIPE(restaurantId, menuId));
      if (res?.items) {
        setDataResep(res.items);
        return res.items;
      }
      return [];
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Gagal mengambil resep");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update resep
  const updateMenuRecipe = async (
    restaurantId: string,
    menuId: number,
    items: RecipeItem[]
  ) => {
    try {
      setLoading(true);
      setError(null);
      const res = await putDataAuthenticated(
        GET_RECIPE(restaurantId, menuId),
        { items }
      );
      setDataResep(items);
      return res;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Gagal memperbarui resep");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Hapus semua resep (set kosong)
  const deleteMenuRecipe = async (restaurantId: string, menuId: number) => {
    try {
      setLoading(true);
      setError(null);
      const res = await putDataAuthenticated(
        GET_RECIPE(restaurantId, menuId),
        { items: [] }
      );
      setDataResep([]);
      return res;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Gagal menghapus resep");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    dataResep,
    loading,
    error,
    getMenuRecipe,
    updateMenuRecipe,
    deleteMenuRecipe,
    setDataResep,
  };
};

export default useResep;
