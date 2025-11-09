import React from "react";
import Image from "next/image";
import { DialogContent, Divider, Typography, Chip, Box, Alert } from "@mui/material";
import { Menu } from "@/interfaces/menu";

export default function MenuDetail({ menu }: { menu: Menu }) {
  if (!menu) {
    return (
      <DialogContent>
        <Alert severity="error">Data menu tidak tersedia</Alert>
      </DialogContent>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "success";
      case "Rejected":
        return "error";
      case "Waiting":
        return "warning";
      default:
        return "default";
    }
  };

  // Ambil reason dari log
  const latestLog = menu.menu_approval_logs?.[0];
  const rejectionReason = menu.status === "Rejected" && latestLog?.reason 
    ? latestLog.reason 
    : null;

  const displayNutritionValue = (value: string | number | undefined | null) => {
    if (value === undefined || value === null) return "-";
    
    if (typeof value === 'string' && value.includes("belum dimasukkan")) {
      return "-";
    }
    
    if (typeof value === 'string' && !isNaN(Number(value))) {
      return Number(value).toFixed(1);
    }

    if (typeof value === 'number') {
      return value.toFixed(1);
    }
    
    return "-";
  };

  return (
    <DialogContent className="space-y-6">
      {/* Header dengan Status */}
      <div className="text-center">
        <Typography
          variant="h6"
          className="text-xl font-semibold text-gray-800 mb-2"
        >
          {menu.name || "Nama Menu Tidak Tersedia"}
        </Typography>
        <Chip 
          label={menu.status || "Unknown"} 
          color={getStatusColor(menu.status)}
          variant="filled"
          size="small"
        />
      </div>

      {/* Gambar Menu */}
      {menu.image_url && (
        <div className="w-full flex justify-center relative">
          <Image
            src={menu.image_url}
            alt={`Foto ${menu.name}`}
            width={500}
            height={500}
            className="rounded-lg shadow-md"
            style={{
              maxWidth: "100%",
              height: "auto"
            }} 
            onError={(e) => {
              console.error("Gambar gagal dimuat:", menu.image_url);
              e.currentTarget.src = "https://placehold.co/600x400/EEE/31343C";
            }}
          />
        </div>
      )}

      {/* Deskripsi */}
      {menu.description && (
        <div>
          <Typography variant="subtitle1" className="text-sm text-gray-600 mt-1">
            {menu.description}
          </Typography>
        </div>
      )}

      <Divider className="my-4" />

      {/* Informasi Dasar */}
      <div className="space-y-1">
        <Typography variant="body1" className="text-gray-800">
          <strong>Porsi:</strong> {menu.portion || "0"} orang
        </Typography>
        <Typography variant="body1" className="text-gray-800">
          <strong>Kategori:</strong> {menu.category || "Tidak ada kategori"}
        </Typography>
        <Typography variant="body1" className="text-gray-800 font-medium">
          <strong>Harga:</strong> Rp{menu.price ? menu.price.toLocaleString("id-ID") : "0"}
        </Typography>
      </div>

      {/* Reason untuk Status Rejected */}
      {rejectionReason && (
        <Box className="bg-red-50 border border-red-200 rounded-md p-3">
          <Typography variant="subtitle2" className="text-red-800 font-semibold mb-1">
            Alasan Penolakan:
          </Typography>
          <Typography variant="body2" className="text-red-700">
            {rejectionReason}
          </Typography>
        </Box>
      )}

      {/* Info untuk Status Waiting */}
      {menu.status === "Waiting" && (
        <Box className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
          <Typography variant="subtitle2" className="text-yellow-800 font-semibold mb-1">
            Menunggu Persetujuan Admin
          </Typography>
        </Box>
      )}

      {/* Kandungan Gizi per Porsi */}
      <div>
        <Typography variant="body1" className="font-semibold text-gray-800 mb-2">
          Kandungan Gizi per Porsi:
        </Typography>
        
        <div className="italic text-gray-600 space-y-1">
          <Typography variant="body2">
            Kalori: {displayNutritionValue(menu.nutrition_per_portion?.calory)} kkal
          </Typography>
          <Typography variant="body2">
            Protein: {displayNutritionValue(menu.nutrition_per_portion?.protein)} g
          </Typography>
          <Typography variant="body2">
            Karbohidrat: {displayNutritionValue(menu.nutrition_per_portion?.carbohydrate)} g
          </Typography>
          <Typography variant="body2">
            Lemak: {displayNutritionValue(menu.nutrition_per_portion?.fat)} g
          </Typography>
        </div>
      </div>

      {/* Riwayat Approval*/}
      {menu.menu_approval_logs && menu.menu_approval_logs.length > 0 && (
        <>
          <Divider className="my-4" />
          <div>
            <Typography variant="body1" className="font-semibold text-gray-800 mb-2">
              Riwayat Status:
            </Typography>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {menu.menu_approval_logs.slice(0, 3).map((log) => (
                <Box key={log.id} className="bg-gray-50 rounded-md p-2">
                  <Typography variant="caption" className="text-gray-600 block">
                    {new Date(log.changed_at).toLocaleString("id-ID")}
                  </Typography>
                  <Typography variant="body2" className="text-gray-800">
                    {log.from_status ? `${log.from_status} → ${log.to_status}` : `Created as ${log.to_status}`}
                  </Typography>
                  {log.reason && (
                    <Typography variant="caption" className="text-gray-500 block mt-1">
                      {log.reason}
                    </Typography>
                  )}
                </Box>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Info untuk menu tanpa riwayat approval */}
      {menu.status === "Waiting" && (!menu.menu_approval_logs || menu.menu_approval_logs.length === 0) && (
        <Box className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <Typography variant="body2" className="text-blue-700 text-center">
            Menu baru dibuat dan sedang menunggu persetujuan
          </Typography>
        </Box>
      )}
    </DialogContent>
  );
}