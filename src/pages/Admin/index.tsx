import { useEffect } from "react";
import AdminLayout from "@/components/Admin/Adminlayout";
import {
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
} from "@mui/material";
import { Notifications } from "@mui/icons-material";
import useNotifications from "@/hooks/Admin/useAdminNotifications";

export default function AdminNotifications() {
  const {
    notifications,
    loading,
    error,
    updatingIds,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    setError,
  } = useNotifications();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const isMarkAllLoading = updatingIds.length > 0;

  // Sort by belum dibaca
  const sortedNotifications = [...notifications].sort((a, b) => {
    if (a.is_read === b.is_read) {
      return b.id - a.id;
    }
    return a.is_read ? 1 : -1;
  });

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
              onClick={markAllAsRead}
              className="bg-white hover:bg-gray-50"
              disabled={isMarkAllLoading || loading}
            >
              {isMarkAllLoading ? "Memproses..." : "Tandai Semua Dibaca"}
            </Button>
          )}
        </div>

        {/*Error Handling*/}
        {error && (
          <Alert severity="error" className="mb-4" onClose={() => setError(null)}>
            {error}
            <Button onClick={fetchNotifications} className="ml-2" size="small">
              Coba Lagi
            </Button>
          </Alert>
        )}

        {/*Loading State*/}
        {loading ? (
          <div className="flex justify-center items-center mt-10">
            <CircularProgress />
            <span className="ml-2">Memuat notifikasi...</span>
          </div>
        ) : sortedNotifications.length === 0 ? (
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
            {sortedNotifications.map((notification) => {
              const isUpdating = updatingIds.includes(notification.id);

              return (
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
                              notification.is_read
                                ? "text-gray-600"
                                : "text-gray-900"
                            }`}
                          >
                            {notification.title}
                          </Typography>
                          {!notification.is_read && !isUpdating && (
                            <Chip
                              label="Baru"
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          )}
                          {isUpdating && <CircularProgress size={16} />}
                        </div>

                        <Typography
                          variant="body2"
                          color="textSecondary"
                          className="mb-1"
                        >
                          <strong>Restoran:</strong>{" "}
                          {notification.restaurant_name}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="textSecondary"
                          className="mb-1"
                        >
                          <strong>Menu:</strong> {notification.menu_name}
                        </Typography>

                        <Typography variant="caption" color="textSecondary">
                          ID Restoran: {notification.restaurant_id} • ID Menu:{" "}
                          {notification.menu_id}
                        </Typography>
                      </div>

                      {!notification.is_read && (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => markAsRead(notification.id)}
                          className="ml-4"
                          disabled={isUpdating || loading}
                        >
                          {isUpdating ? "..." : "Tandai Dibaca"}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
