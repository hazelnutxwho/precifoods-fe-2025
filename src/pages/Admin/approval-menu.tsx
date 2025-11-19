"use client";

import { useState } from "react";
import AdminLayout from "@/components/Admin/Adminlayout";
import { useGetMenus } from "@/hooks/useGetData";
import { TableMenuAdmin } from "@/components/Admin/TableMenuAdmin";
import { Menu } from "@/interfaces/menu";
import {
  Box,
  Snackbar,
  Alert,
  Button,
  CircularProgress,
  Chip,
} from "@mui/material";
import { Refresh } from "@mui/icons-material";

export default function ApprovalMenuPage() {
  const { data, errorMessage, isLoading,} = useGetMenus();
  const [filterCategory, setFilterCategory] = useState("Semua");

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const [, setDialogOpen] = useState(false);
  const [, setSelectedMenu] = useState<Menu | null>(null);

  // Filter data berdasarkan kategori
  const filteredData = data?.filter((menu) => {
    if (filterCategory === "Semua") return true;
    return menu.category === filterCategory;
  });

  // View detail menu
  const handleView = (menu: Menu) => {
    setSelectedMenu(menu);
    setDialogOpen(true);
  };

  // Refresh data
  const handleRefresh = () => {
    window.location.reload();
  };

  // Callback saat status berubah (approve/reject)
  const handleStatusChange = () => {
    setSnackbar({
      open: true,
      message: "Menu berhasil diperbarui!",
      severity: "success",
    });
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Verifikasi Kandungan Gizi</h1>
            <p className="text-sm text-gray-600">
              Daftar menu restoran yang menunggu verifikasi
            </p>
          </div>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handleRefresh}
            disabled={isLoading}
          >
            Refresh
          </Button>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <Alert severity="error" className="mb-4">
            {errorMessage}
            <Button onClick={handleRefresh} className="ml-2" size="small">
              Coba Lagi
            </Button>
          </Alert>
        )}

        {/* Loading */}
        {isLoading && (
          <Box display="flex" justifyContent="center" alignItems="center" py={6}>
            <CircularProgress />
          </Box>
        )}

        {/* Filter */}
        <Box sx={{ mb: 3 }}>
          {["Makanan Pokok", "Lauk Pauk", "Sayuran", "Snack", "Minuman", "Semua"].map(
            (category) => (
              <Chip
                key={category}
                label={category}
                onClick={() => setFilterCategory(category)}
                color={filterCategory === category ? "primary" : "default"}
                sx={{ mr: 1, mb: 1 }}
              />
            )
          )}
        </Box>

        {/* Table */}
        {!isLoading && filteredData && (
          <TableMenuAdmin
            data={filteredData.map((item) => ({
              ...item,
              status: item.status || "Waiting",
            }))}
            onView={handleView}
            onStatusChange={handleStatusChange}
            loading={isLoading}
            showCategoryColumn={filterCategory === "Semua"}
          />
        )}

        {/* Dialog Detail */}
        {/* <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          {selectedMenu ? (
            <Box className="p-6">
              <h2 className="text-xl font-semibold mb-2">{selectedMenu.name}</h2>
              <p className="text-gray-600 mb-2">Kategori: {selectedMenu.category}</p>
              <p className="text-gray-600 mb-2">
                Harga: Rp{selectedMenu.price.toLocaleString("id-ID")}
              </p>
              {selectedMenu.description && (
                <p className="text-gray-500">{selectedMenu.description}</p>
              )}
              {selectedMenu.status === "Rejected" && (
                <p className="text-red-500 mt-2">
                  Alasan penolakan: {selectedMenu.reason ?? "-"}
                </p>
              )}
            </Box>
          ) : (
            <Box className="flex justify-center p-6">
              <CircularProgress />
            </Box>
          )}
        </Dialog> */}

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            severity={snackbar.severity}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </div>
    </AdminLayout>
  );
}