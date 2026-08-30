import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
  Typography,
  CircularProgress,
  Box,
  Alert,
} from "@mui/material";
import Image from "next/image";
import { useDetailMenu } from "@/hooks/Admin/useDetailMenu";

interface MenuDetailAdminProps {
  open: boolean;
  onClose: () => void;
  menuId?: number;
  restaurantId?: string;
}

export default function MenuDetailAdmin({ 
  open, 
  onClose, 
  menuId,
  restaurantId,
}: MenuDetailAdminProps) {
  const { 
    data: menu, 
    isLoading, 
    errorMessage,
  } = useDetailMenu(menuId, restaurantId);

// //Debug
//  console.log("MenuDetailAdmin dipanggil dengan ID:", menuId);

  if (isLoading) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogContent className="flex justify-center items-center py-12">
          <CircularProgress />
          <Typography className="ml-3">Memuat data menu...</Typography>
        </DialogContent>
      </Dialog>
    );
  }

  if (errorMessage) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogContent>
          <Alert severity="error">{errorMessage}</Alert>
        </DialogContent>
      </Dialog>
    );
  }

  if (!menu) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogContent>
          <Typography className="text-center py-6 text-gray-500">
            Data menu tidak ditemukan ada
          </Typography>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className="text-center font-semibold text-gray-800">
        Detail Menu
      </DialogTitle>
      
      <DialogContent className="space-y-4">
        <Typography
          variant="h6"
          className="text-xl text-center font-semibold text-gray-800"
        >
          {menu.name}
        </Typography>

        <Box className="w-full flex justify-center">
          <Image
            src={menu.image_url}
            alt={`Foto ${menu.name}`}
            width={400}
            height={300}
            className="rounded-lg shadow-md"
            style={{
              maxWidth: "100%",
              height: "auto"
            }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/images/no-image.png";
            }}
          />
        </Box>

        <div>
          <Typography variant="subtitle1" className="text-sm text-gray-600 mt-1">
            {menu.description || "Tidak ada deskripsi."}
          </Typography>
        </div>

        <Divider className="my-2" />

        <div className="space-y-2">
          <Typography variant="body1" className="text-gray-800">
            <strong>Hidangan untuk:</strong> {menu.portion} (porsi/orang)
          </Typography>
          <Typography variant="body1" className="text-gray-800">
            <strong>Kategori:</strong> {menu.category}
          </Typography>
          <Typography variant="body1" className="text-gray-800 font-medium">
            <strong>Harga:</strong> Rp{menu.price.toLocaleString("id-ID")}
          </Typography>
          {/* <Typography variant="body1" className="text-gray-800">
            <strong>Status:</strong> {menu.status}
          </Typography> */}
          
          {menu.reason && (
            <Typography variant="body1" className="text-red-600">
              <strong>Saran:</strong> {menu.reason}
            </Typography>
          )}
        </div>

        <Divider className="my-2" />

        <Typography variant="body1" className="font-semibold text-gray-800">
          Kandungan Gizi Hidangan:
        </Typography>
        <div className="text-gray-600 space-y-1">
          <Typography variant="body2">
            Kalori: {menu.nutrition?.calory || "-"} kkal
          </Typography>
          <Typography variant="body2">
            Protein: {menu.nutrition?.protein || "-"} g
          </Typography>
          <Typography variant="body2">
            Lemak: {menu.nutrition?.fat || "-"} g
          </Typography>
          <Typography variant="body2">
            Karbohidrat: {menu.nutrition?.carbohydrate || "-"} g
          </Typography>
          <Typography variant="body2">
            Serat: {menu.nutrition?.fiber || "-"} g
          </Typography>
          <Typography variant="body2">
            Natrium: {menu.nutrition?.natrium || "-"} g
          </Typography>
          <Typography variant="body2">
            Kolesterol: {menu.nutrition?.cholesterol || "-"} g
          </Typography>
          <Typography variant="body2">
            SFA: {menu.nutrition?.sfa || "-"} g
          </Typography>
          <Typography variant="body2">
            MUFA: {menu.nutrition?.mufa || "-"} g
          </Typography>
          <Typography variant="body2">
            PUFA: {menu.nutrition?.pufa || "-"} g
          </Typography>
        </div>

        <Divider className="my-2" />

        <Typography variant="body1" className="font-semibold text-gray-800">
          Kandungan Gizi per Porsi:
        </Typography>
        <div className="text-gray-600 space-y-1">
          <Typography variant="body2">
            Kalori: {menu.nutrition_per_portion?.calory || "-"} kkal
          </Typography>
          <Typography variant="body2">
            Protein: {menu.nutrition_per_portion?.protein || "-"} g
          </Typography>
          <Typography variant="body2">
            Lemak: {menu.nutrition_per_portion?.fat || "-"} g
          </Typography>
          <Typography variant="body2">
            Karbohidrat: {menu.nutrition_per_portion?.carbohydrate || "-"} g
          </Typography>
          <Typography variant="body2">
            Serat: {menu.nutrition_per_portion?.fiber || "-"} g
          </Typography>
          <Typography variant="body2">
            Natrium: {menu.nutrition_per_portion?.natrium || "-"} g
          </Typography>
          <Typography variant="body2">
            Kolesterol: {menu.nutrition_per_portion?.cholesterol || "-"} g
          </Typography>
          <Typography variant="body2">
            SFA: {menu.nutrition_per_portion?.sfa || "-"} g
          </Typography>
          <Typography variant="body2">
            MUFA: {menu.nutrition_per_portion?.mufa || "-"} g
          </Typography>
          <Typography variant="body2">
            PUFA: {menu.nutrition_per_portion?.pufa || "-"} g
          </Typography>
        </div>
      </DialogContent>
    </Dialog>
  );
}