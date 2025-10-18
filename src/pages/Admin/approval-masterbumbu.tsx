"use client";

import { useState } from "react";
import AdminLayout from "@/components/Admin/Adminlayout";
import { MasterBumbuForm} from "@/components/Admin/AdminMasterBumbuForm";
import { TableMasterBumbu } from "@/components/Restoran/TableMasterBumbu";
import { useMasterBumbu } from "@/hooks/Restoran/useMasterBumbu";
import { MasterBumbu, MasterBumbuFormData } from "@/interfaces/masterBumbu";
import { Snackbar, Alert, Button } from "@mui/material";
import { Add, Refresh } from "@mui/icons-material";

export default function MasterBumbuPage() {
  const {
    bumbuList: data,
    loading,
    error,
    createBumbu,
    updateBumbu,
    deleteBumbu,
    fetchAllBumbu: refetch,
  } = useMasterBumbu();

  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MasterBumbu | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  // Buka form tambah/edit
  const handleOpenForm = (item?: MasterBumbu) => {
    setEditingItem(item || null);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingItem(null);
  };

  // Simpan form
  const handleSubmit = async (formData: MasterBumbuFormData) => {
    setFormLoading(true);
    try {
      if (editingItem) {
        await updateBumbu(editingItem.id.toString(), formData);
        setSnackbar({
          open: true,
          message: "Data berhasil diupdate",
          severity: "success",
        });
      } else {
        await createBumbu(formData);
        setSnackbar({
          open: true,
          message: "Data berhasil ditambahkan",
          severity: "success",
        });
      }
      handleCloseForm();
      refetch();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Terjadi kesalahan";
      setSnackbar({ open: true, message, severity: "error" });
    } finally {
      setFormLoading(false);
    }
  };

  // Hapus data
  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data ini?")) return;

    try {
      await deleteBumbu(id.toString());
      setSnackbar({
        open: true,
        message: "Data berhasil dihapus",
        severity: "success",
      });
      refetch();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Gagal menghapus data";
      setSnackbar({ open: true, message, severity: "error" });
    }
  };

  const handleEdit = (item: MasterBumbu) => handleOpenForm(item);
  const handleRefresh = () => refetch();

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Master Bumbu</h1>
            <p className="text-sm text-gray-600">Kandungan Gizi/100 g</p>
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
              onClick={() => handleOpenForm()}
              className="bg-primary text-black py-2"
            >
              Tambah Bumbu
            </Button>
          </div>
        </div>

        {/* Error Handling */}
        {error && (
          <Alert severity="error" className="mb-4">
            {error}
            <Button onClick={() => refetch()} className="ml-2" size="small">
              Coba Lagi
            </Button>
          </Alert>
        )}

        {/* Table Data */}
        <TableMasterBumbu
          data={data}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />

        {/* Form Dialog */}
        <MasterBumbuForm
          open={formOpen}
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
          initialData={editingItem}
          loading={formLoading}
        />

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
    </AdminLayout>
  );
}
