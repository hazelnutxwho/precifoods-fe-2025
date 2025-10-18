"use client";

import { useState } from "react";
import useRestaurantMenu from "@/hooks/Restoran/useMenus";
import useResep from "@/hooks/Restoran/useResep";

import { TableMenus } from "@/components/Restoran/TableMenus";
import Restoranlayout from "@/components/Restoran/Restoranlayout";
import MenuDetail from "@/components/Restoran/MenuDetail";

import {
  Box,
  Chip,
  Snackbar,
  Alert,
  Button,
  Dialog,
  CircularProgress,
} from "@mui/material";
import { Add, Refresh } from "@mui/icons-material";
import Router from "next/router";
import { Menu } from "@/interfaces/menu"; // Pastikan kamu punya interface ini

export default function TransactionMenuPage() {
  const {
    menus: data,
    loading,
    error,
    deleteMenu,
    refetch,
    filterCategory,
    setFilterCategory,
    fetchMenuById,
    selectedMenu,
    clearSelectedMenu,
  } = useRestaurantMenu();

  const { deleteMenuRecipe } = useResep();

  const RESTO_ID = process.env.NEXT_PUBLIC_RESTAURANT_ID as string;

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const [dialogOpen, setDialogOpen] = useState(false);

  // ✅ Type-safe parameter
  const handleEdit = (item: Menu) => {
    Router.push(`/Restoran/UpdateMenu/${item.id}`);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus menu ini?")) return;

    try {
      await deleteMenuRecipe(RESTO_ID, id);
      await deleteMenu(id.toString());

      setSnackbar({
        open: true,
        message: "Menu berhasil dihapus",
        severity: "success",
      });
      refetch();
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : "Gagal menghapus menu";
      setSnackbar({
        open: true,
        message: errMsg,
        severity: "error",
      });
    }
  };

  const handleView = async (item: Menu) => {
    try {
      await fetchMenuById(item.id.toString());
      setDialogOpen(true);
    } catch (error) {
      console.error("Gagal memuat detail menu:", error);
      setSnackbar({
        open: true,
        message: "Gagal memuat detail menu",
        severity: "error",
      });
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  // Filter kategori
  const filteredData =
    filterCategory === "Semua"
      ? data
      : data.filter((item) => item.category === filterCategory);

  return (
    <Restoranlayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Transaction Menu</h1>
            <p className="text-sm text-gray-600">Kelola menu restoran Anda</p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={handleRefresh}
              disabled={loading}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => Router.push("/Restoran/add-menu")}
              className="bg-primary text-black py-2"
            >
              Tambah Menu
            </Button>
          </div>
        </div>

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

        {/* Error Handling */}
        {error && (
          <Alert severity="error" className="mb-4">
            {error}
            <Button onClick={handleRefresh} className="ml-2" size="small">
              Coba Lagi
            </Button>
          </Alert>
        )}

        {/* Table Data */}
        <TableMenus
          data={filteredData}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          loading={loading}
          showCategoryColumn={filterCategory === "Semua"} 
        />

        {/* Dialog Detail Menu */}
        <Dialog
          open={dialogOpen}
          onClose={() => {
            setDialogOpen(false);
            clearSelectedMenu();
          }}
          maxWidth="sm"
          fullWidth
        >
          {loading && !selectedMenu ? (
            <Box className="flex justify-center p-6">
              <CircularProgress />
            </Box>
          ) : (
            selectedMenu && <MenuDetail menu={selectedMenu} />
          )}
        </Dialog>

        {/* Snackbar Notifikasi */}
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
    </Restoranlayout>
  );
}
