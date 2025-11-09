import Restoranlayout from "@/components/Restoran/Restoranlayout";
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
import { useRestaurantNotifications } from "@/hooks/Restoran/useRestaurantNotifications";

export default function RestoranIndex() {
  const { notifications, loading, error, refetch } = useRestaurantNotifications();

  // Sort by belum dibaca
  const sortedNotifications = [...notifications].sort((a, b) => {
    // Prioritaskan yang belum dibaca
    if (a.is_read !== b.is_read) {
      return a.is_read ? 1 : -1;
    }
    // Untuk status baca sama, urutkan berdasarkan created_at (terbaru dulu)
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  // Hitung jumlah belum dibaca 
  const unreadCount = notifications.filter(notif => !notif.is_read).length;

  return (
    <Restoranlayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Notifikasi</h1>
            <p className="text-sm text-gray-600">
              Daftar notifikasi yang diterima restoran
              {unreadCount > 0 && (
                <span className="ml-2 text-red-600 font-medium">
                  ({unreadCount} belum dibaca)
                </span>
              )}
            </p>
          </div>

          <Button
            variant="outlined"
            onClick={refetch}
            className="bg-white hover:bg-gray-50"
            disabled={loading}
          >
            {loading ? "Memuat..." : "Muat Ulang"}
          </Button>
        </div>

        {/* Error Handling */}
        {error && (
          <Alert severity="error" className="mb-4">
            {error}
            <Button onClick={refetch} className="ml-2" size="small">
              Coba Lagi
            </Button>
          </Alert>
        )}

        {/* Loading State */}
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
                Notifikasi dari admin akan muncul di sini
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {sortedNotifications.map((notif) => (
              <Card
                key={notif.id}
                className={`border-l-4 ${
                  notif.is_read
                    ? "border-l-gray-300 bg-gray-50"
                    : "border-l-[#9C3238] bg-white shadow-sm"
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Typography
                          variant="h6"
                          className={`font-semibold ${
                            notif.is_read ? "text-gray-600" : "text-gray-900"
                          }`}
                        >
                          {notif.title}
                        </Typography>
                        {!notif.is_read && (
                          <Chip
                            label="Baru"
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        )}
                      </div>

                      <Typography
                        variant="body2"
                        color="textSecondary"
                        className="mb-1"
                      >
                        <strong>Menu:</strong> {notif.menu_name}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="textSecondary"
                      >
                        ID Restoran: {notif.restaurant_id} • ID Menu:{" "}
                        {notif.menu_id}
                      </Typography>
                    </div>

                    <div className="flex flex-col items-end gap-2 ml-4">
                      <Typography
                        variant="caption"
                        color="textSecondary"
                        className="text-right"
                      >
                        {new Date(notif.created_at).toLocaleString("id-ID")}
                      </Typography>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Restoranlayout>
  );
}