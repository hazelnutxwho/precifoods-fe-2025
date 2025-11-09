import { useState, useCallback } from "react";
import { getDataAuthenticated, putDataAuthenticated } from "@/utils/http";
import { GET_NOTIFIKASI, PUT_NOTIFIKASI } from "@/constants/endpoint";
import { Notification, UpdateNotificationRequest } from "@/interfaces/admin";

export interface NotificationResponse {
  data: Notification[];
  message?: string;
}

export interface UpdateNotificationResponse {
  message: string;
}

const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatingIds, setUpdatingIds] = useState<number[]>([]);

  // Ambil semua notifikasi
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await getDataAuthenticated(GET_NOTIFIKASI());
            
      // Cek berbagai kemungkinan struktur response
      if (res && typeof res === 'object' && 'data' in res && Array.isArray(res.data)) {
        setNotifications(res.data);
        return res.data;
      } else if (Array.isArray(res)) {
        setNotifications(res);
        return res;
      } else if (res && typeof res === 'object' && 'notifications' in res && Array.isArray(res.notifications)) {
        setNotifications(res.notifications);
        return res.notifications;
      } else {
        console.log('❌ Unexpected response structure');
        setNotifications([]);
        return [];
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Gagal mengambil data notifikasi";
      setError(errorMessage);
      console.error('Error fetching notifications:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Tandai notifikasi sebagai dibaca
  const markAsRead = useCallback(async (notificationId: number) => {
    try {
      setUpdatingIds(prev => [...prev, notificationId]);
      setError(null);

      const requestBody: UpdateNotificationRequest = {
        is_read: true
      };

      const res: UpdateNotificationResponse = await putDataAuthenticated(
        PUT_NOTIFIKASI(notificationId.toString()),
        requestBody
      );

      // Update local state
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, is_read: true } : notif
        )
      );

      return res;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Gagal menandai notifikasi sebagai dibaca";
      setError(errorMessage);
      throw err;
    } finally {
      setUpdatingIds(prev => prev.filter(id => id !== notificationId));
    }
  }, []);

  // Tandai semua notifikasi sebagai dibaca
  const markAllAsRead = useCallback(async () => {
    try {
      const unreadNotifications = notifications.filter(notif => !notif.is_read);
      const unreadIds = unreadNotifications.map(notif => notif.id);
      
      if (unreadIds.length === 0) return;

      setUpdatingIds(unreadIds);
      setError(null);

      // Gunakan Promise.all untuk performa lebih baik
      const updatePromises = unreadNotifications.map(notification => {
        const requestBody: UpdateNotificationRequest = {
          is_read: true
        };
        return putDataAuthenticated(
          PUT_NOTIFIKASI(notification.id.toString()),
          requestBody
        );
      });

      await Promise.all(updatePromises);

      // Update semua notifikasi menjadi sudah dibaca
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, is_read: true }))
      );

      return { message: "Semua notifikasi berhasil ditandai sebagai dibaca" };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Gagal menandai semua notifikasi";
      setError(errorMessage);
      throw err;
    } finally {
      setUpdatingIds([]);
    }
  }, [notifications]);

  // Hitung notifikasi yang belum dibaca
  const unreadCount = notifications.filter(notif => !notif.is_read).length;

  return {
    // State
    notifications,
    loading,
    error,
    updatingIds,
    unreadCount,
    
    // Actions
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    
    // Setters
    setNotifications,
    setError,
  };
};

export default useNotifications;