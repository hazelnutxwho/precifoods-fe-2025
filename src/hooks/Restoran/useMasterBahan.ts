import { useState, useEffect, useCallback } from "react";
import {
  getDataAuthenticated,
  postDataAuthenticated,
  putDataAuthenticated,
  deleteDataAuthenticated,
} from "@/utils/http";
import {
  GET_ALL_BAHAN,
  GET_SINGLE_BAHAN,
  GET_BAHAN_TYPES,
} from "@/constants/endpoint";
import {
  MasterBahan,
  MasterBahanType,
  MasterBahanFormData,
} from "@/interfaces/masterBahan";

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) return error.message;
  return fallback;
}

export const useMasterBahan = () => {
  const [bahanList, setBahanList] = useState<MasterBahan[]>([]);
  const [bahanTypes, setBahanTypes] = useState<MasterBahanType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch semua bahan
  const fetchAllBahan = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getDataAuthenticated(GET_ALL_BAHAN());
      setBahanList(res?.data || res || []);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Gagal memuat data bahan"));
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch semua tipe bahan
  const fetchBahanTypes = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getDataAuthenticated(GET_BAHAN_TYPES());
      setBahanTypes(res?.data || res || []);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Gagal memuat tipe bahan"));
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch single bahan by ID
  const fetchSingleBahan = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const res = await getDataAuthenticated(GET_SINGLE_BAHAN(id));
      return res?.data || res;
    } catch (err: unknown) {
      const message = getErrorMessage(err, "Gagal memuat detail bahan");
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create bahan baru
  const createBahan = useCallback(async (payload: MasterBahanFormData) => {
    try {
      setLoading(true);
      const res = await postDataAuthenticated(GET_ALL_BAHAN(), payload);
      const newBahan = res?.data || res;
      setBahanList((prev) => [...prev, newBahan]);
      return newBahan;
    } catch (err: unknown) {
      const message = getErrorMessage(err, "Gagal membuat bahan baru");
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update bahan
  const updateBahan = useCallback(
    async (id: string, payload: Partial<MasterBahanFormData>) => {
      try {
        setLoading(true);
        const res = await putDataAuthenticated(GET_SINGLE_BAHAN(id), payload);
        const updated = res?.data || res;
        setBahanList((prev) =>
          prev.map((item) => (item.id === updated.id ? updated : item))
        );
        return updated;
      } catch (err: unknown) {
        const message = getErrorMessage(err, "Gagal mengupdate bahan");
        setError(message);
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Delete bahan
  const deleteBahan = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await deleteDataAuthenticated(GET_SINGLE_BAHAN(id));
      setBahanList((prev) => prev.filter((item) => String(item.id) !== id));
    } catch (err: unknown) {
      const message = getErrorMessage(err, "Gagal menghapus bahan");
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refetch awal
  useEffect(() => {
    fetchAllBahan();
    fetchBahanTypes();
  }, [fetchAllBahan, fetchBahanTypes]);

  return {
    bahanList,
    bahanTypes,
    loading,
    error,
    fetchAllBahan,
    fetchBahanTypes,
    fetchSingleBahan,
    createBahan,
    updateBahan,
    deleteBahan,
  };
};

export default useMasterBahan;
