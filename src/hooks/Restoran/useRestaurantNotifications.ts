import { useEffect, useState } from "react";
import {
  RestaurantNotification,
  RestaurantNotificationSuccessResponse,
  RestaurantNotificationErrorResponse,
} from "@/interfaces/notifikasirestoran";
import { GET_RESTAURANT_NOTIFICATIONS } from "@/constants/endpoint";
import { getCookies } from "@/utils/cookie";

export const useRestaurantNotifications = () => {
  const [notifications, setNotifications] = useState<RestaurantNotification[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = getCookies("token");
      const role = getCookies("role");

      // Batasi akses hanya untuk restoran
      if (role !== "Restoran") {
        setError("User tidak memiliki akses untuk melihat notifikasi restoran");
        setLoading(false);
        return;
      }

      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const url = `${baseUrl}${GET_RESTAURANT_NOTIFICATIONS()}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Data notifikasi tidak ditemukan (404)");
        }

        const errorData =
          (await response.json()) as RestaurantNotificationErrorResponse;
        throw new Error(errorData.errors || "Gagal mengambil data notifikasi");
      }

      const data =
        (await response.json()) as RestaurantNotificationSuccessResponse;
      setNotifications(data.data);
      
    } catch (err: unknown) {
      console.error("Error saat fetch notifikasi restoran:", err);
      const errorMessage = err instanceof Error 
        ? err.message 
        : "Terjadi kesalahan saat mengambil data notifikasi";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return { notifications, loading, error, refetch: fetchNotifications };
};
