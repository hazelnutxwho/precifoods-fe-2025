// import AdminLayout from "@/components/Admin/Adminlayout";
// export default function Adminindex() {
//   return (
//     <AdminLayout>
//       <div className="p-6">
//         <h1 className="text-4xl font-bold text-gray-800">Notifikasi</h1>
//         <p className="text-sm text-gray-600">Ini page notifikasi admin</p>
//       </div>
//     </AdminLayout>
//   );
// }


import { useEffect, useState } from "react";
import AdminLayout from "@/components/Admin/Adminlayout";
import { GET_NOTIFIKASI, PUT_NOTIFIKASI } from "@/constants/endpoint";
import { Notification, NotificationResponse, UpdateNotificationRequest, UpdateNotificationResponse } from "@/interfaces/admin";
import {
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
} from "@mui/material";
import { Notifications} from "@mui/icons-material";

export default function Adminindex() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch(GET_NOTIFIKASI());
      
      if (!response.ok) {
        throw new Error("Gagal mengambil data notifikasi");
      }
      
      const data: NotificationResponse = await response.json();
      setNotifications(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      const requestBody: UpdateNotificationRequest = {
        is_read: true
      };

      const response = await fetch(PUT_NOTIFIKASI(notificationId.toString()), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        throw new Error('Gagal update notifikasi');
      }

      const result: UpdateNotificationResponse = await response.json();
      console.log(result.message); // "Success!"
      
      // Update local state
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, is_read: true } : notif
        )
      );
    } catch (err) {
      console.error("Gagal menandai notifikasi sebagai dibaca:", err);
      setError(err instanceof Error ? err.message : "Gagal menandai notifikasi sebagai dibaca");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      // Mark all unread notifications one by one
      const unreadNotifications = notifications.filter(notif => !notif.is_read);
      
      for (const notification of unreadNotifications) {
        const requestBody: UpdateNotificationRequest = {
          is_read: true
        };

        const response = await fetch(PUT_NOTIFIKASI(notification.id.toString()), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
          throw new Error(`Gagal update notifikasi ${notification.id}`);
        }
      }
      
      // Update local state
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, is_read: true }))
      );
    } catch (err) {
      console.error("Gagal menandai semua notifikasi:", err);
      setError(err instanceof Error ? err.message : "Gagal menandai semua notifikasi");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter(notif => !notif.is_read).length;

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Notifikasi</h1>
            <p className="text-sm text-gray-600">
              Kelola notifikasi dari restoran
              {unreadCount > 0 && (
                <span className="ml-2 text-red-600 font-medium">
                  ({unreadCount} belum dibaca)
                </span>
              )}
            </p>
          </div>
          
          {unreadCount > 0 && (
            <Button
              variant="outlined"
              // startIcon={<MarkAsRead />}
              onClick={handleMarkAllAsRead}
              className="bg-white hover:bg-gray-50"
              disabled={loading}
            >
              Tandai Semua Dibaca
            </Button>
          )}
        </div>

        {/* Error Handling */}
        {error && (
          <Alert severity="error" className="mb-4">
            {error}
            <Button onClick={fetchNotifications} className="ml-2" size="small">
              Coba Lagi
            </Button>
          </Alert>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center mt-10">
            <CircularProgress />
          </div>
        ) : notifications.length === 0 ? (
          <Card className="text-center py-8">
            <CardContent>
              <Notifications sx={{ fontSize: 64, color: "gray", mb: 2 }} />
              <Typography variant="h6" color="textSecondary">
                Belum ada notifikasi
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Notifikasi dari restoran akan muncul di sini
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`border-l-4 ${
                  notification.is_read 
                    ? "border-l-gray-300 bg-gray-50" 
                    : "border-l-blue-500 bg-white shadow-sm"
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Typography 
                          variant="h6" 
                          className={`font-semibold ${
                            notification.is_read ? "text-gray-600" : "text-gray-900"
                          }`}
                        >
                          {notification.title}
                        </Typography>
                        {!notification.is_read && (
                          <Chip 
                            label="Baru" 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                          />
                        )}
                      </div>
                      
                      <Typography variant="body2" color="textSecondary" className="mb-1">
                        <strong>Restoran:</strong> {notification.restaurant_name}
                      </Typography>
                      
                      <Typography variant="body2" color="textSecondary" className="mb-1">
                        <strong>Menu:</strong> {notification.menu_name}
                      </Typography>
                      
                      <Typography variant="caption" color="textSecondary">
                        ID Restoran: {notification.restaurant_id} • ID Menu: {notification.menu_id}
                      </Typography>
                    </div>
                    
                    {!notification.is_read && (
                      <Button
                        size="small"
                        variant="outlined"
                        // startIcon={<MarkAsRead />}
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="ml-4"
                        disabled={loading}
                      >
                        Tandai Dibaca
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

