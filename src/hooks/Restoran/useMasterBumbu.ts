import { useState, useEffect, useCallback } from "react";
import {
  getDataAuthenticated,
  postDataAuthenticated,
  putDataAuthenticated,
  deleteDataAuthenticated,
} from "@/utils/http";
import { GET_ALL_BUMBU, GET_SINGLE_BUMBU } from "@/constants/endpoint";
import { MasterBumbu, MasterBumbuFormData } from "@/interfaces/masterBumbu";

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) return error.message;
  return fallback;
}

export const useMasterBumbu = () => {
  const [bumbuList, setBumbuList] = useState<MasterBumbu[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch semua bumbu
  const fetchAllBumbu = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getDataAuthenticated(GET_ALL_BUMBU());
      setBumbuList(res?.data || res || []);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Gagal memuat data bumbu"));
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch single bumbu by ID
  const fetchSingleBumbu = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const res = await getDataAuthenticated(GET_SINGLE_BUMBU(id));
      return res?.data || res;
    } catch (err: unknown) {
      const message = getErrorMessage(err, "Gagal memuat detail bumbu");
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create bumbu baru
  const createBumbu = useCallback(async (payload: MasterBumbuFormData) => {
    try {
      setLoading(true);
      const res = await postDataAuthenticated(GET_ALL_BUMBU(), payload);
      const newBumbu = res?.data || res;
      setBumbuList((prev) => [...prev, newBumbu]);
      return newBumbu;
    } catch (err: unknown) {
      const message = getErrorMessage(err, "Gagal membuat bumbu baru");
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update bumbu
  const updateBumbu = useCallback(
    async (id: string, payload: Partial<MasterBumbuFormData>) => {
      try {
        setLoading(true);
        const res = await putDataAuthenticated(GET_SINGLE_BUMBU(id), payload);
        const updated = res?.data || res;
        setBumbuList((prev) =>
          prev.map((item) => (item.id === updated.id ? updated : item))
        );
        return updated;
      } catch (err: unknown) {
        const message = getErrorMessage(err, "Gagal mengupdate bumbu");
        setError(message);
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Delete bumbu
  const deleteBumbu = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await deleteDataAuthenticated(GET_SINGLE_BUMBU(id));
      setBumbuList((prev) => prev.filter((item) => String(item.id) !== id));
    } catch (err: unknown) {
      const message = getErrorMessage(err, "Gagal menghapus bumbu");
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refetch awal
  useEffect(() => {
    fetchAllBumbu();
  }, [fetchAllBumbu]);

  return {
    bumbuList,
    loading,
    error,
    fetchAllBumbu,
    fetchSingleBumbu,
    createBumbu,
    updateBumbu,
    deleteBumbu,
  };
};

export default useMasterBumbu;
