// import AdminLayout from "@/components/Admin/Adminlayout";
// export default function Approval() {
//   return (
//     <AdminLayout>
//       <div className="p-6">
//         <h1 className="text-4xl font-bold text-gray-800">Approval</h1>
//         <p className="text-sm text-gray-600">Ini page approval</p>
//       </div>
//     </AdminLayout>
//   );
// }

"use client";

import { useState } from "react";
import AdminLayout from "@/components/Admin/Adminlayout";
import { MasterBahanForm } from "@/components/Admin/AdminMasterBahanForm";
import { TableMasterBahan } from "@/components/Restoran/TableMasterBahan";
import { useMasterBahan } from "@/hooks/Restoran/useMasterBahan";
import { MasterBahan, MasterBahanFormData } from "@/interfaces/masterBahan";
import { Box, Chip, Snackbar, Alert, Button } from "@mui/material";
import { Add, Refresh } from "@mui/icons-material";

export default function MasterBahanPage() {
  const {
    bahanList: data,
    bahanTypes: types,
    loading,
    error,
    createBahan,
    updateBahan,
    deleteBahan,
    fetchAllBahan: refetch,
  } = useMasterBahan();

  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MasterBahan | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const [filterType, setFilterType] = useState<string>("Semua");

  const handleOpenForm = (item?: MasterBahan) => {
    setEditingItem(item || null);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = async (formData: MasterBahanFormData) => {
    setFormLoading(true);
    try {
      if (editingItem) {
        await updateBahan(editingItem.id.toString(), formData);
        setSnackbar({
          open: true,
          message: "Data berhasil diupdate",
          severity: "success",
        });
      } else {
        await createBahan(formData);
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

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data ini?")) return;

    try {
      await deleteBahan(id.toString());
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

  const handleEdit = (item: MasterBahan) => handleOpenForm(item);
  const handleRefresh = () => {
    refetch();
  };

  const filteredData =
    filterType === "Semua"
      ? data
      : data.filter((item) => item.type_name === filterType);

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Master Bahan</h1>
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
              Tambah Bahan
            </Button>
          </div>
        </div>

        {/* Filter */}
        <Box sx={{ mb: 3 }}>
          {["Utama", "Pelengkap", "Dasar", "Semua"].map((type) => (
            <Chip
              key={type}
              label={type}
              onClick={() => setFilterType(type)}
              color={filterType === type ? "primary" : "default"}
              sx={{ mr: 1, mb: 1 }}
            />
          ))}
        </Box>

        {/* Error Handling */}
        {error && (
          <Alert severity="error" className="mb-4">
            {error}
            <Button onClick={() => refetch()} className="ml-2" size="small">
              Coba Lagi
            </Button>
          </Alert>
        )}

        {/* Table */}
        <TableMasterBahan
          data={filteredData}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
          showTypeColumn={filterType === "Semua"} // ✅ hanya tampil jika filter "Semua"
        />

        <MasterBahanForm
          open={formOpen}
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
          bahanTypes={types}
          initialData={editingItem}
          loading={formLoading}
        />

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