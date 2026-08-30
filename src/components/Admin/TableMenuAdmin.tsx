import { useState, useMemo } from "react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Box,
  Button,
  Chip,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { Menu } from "@/interfaces/menu";
import { PUT_MENU_STATUS } from "@/constants/endpoint";
import { MasterStatusRequest } from "@/interfaces/admin";
import { getCookies } from "@/utils/cookie";
import { RejectDialog } from "./RejectDialog";
import MenuDetailDialog from "./MenuDetailAdmin"; 

interface TableMenuAdminProps {
  data: Menu[];
  onStatusChange?: () => void;
  onView?: (menu: Menu) => void;
  loading?: boolean;
  showCategoryColumn?: boolean;
}

export const TableMenuAdmin: React.FC<TableMenuAdminProps> = ({
  data,
  onStatusChange,
  loading = false,
  showCategoryColumn = true,
}) => {
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedMenuId, setSelectedMenuId] = useState<number | null>(null);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  // === SORT DATA DARI YANG TERBARU ===
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      // Priority 1: Sort by created_at jika ada
      if (a.created_at && b.created_at) {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      // Priority 2: Sort by updated_at jika ada
      if (a.updated_at && b.updated_at) {
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      }
      // Priority 3: Sort by id (asumsi id auto increment)
      return b.id - a.id;
    });
  }, [data]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  const handleImageError = (id: number) => {
    setImageErrors((prev) => new Set(prev).add(id));
  };

  // === POST STATUS ===
  const postStatus = async (
    restaurantId: string,
    id: number,
    status: "Approved" | "Rejected",
    reason?: string
  ) => {
    const token = getCookies("token");
    if (!token) {
      alert("Token tidak tersedia. Silakan login kembali.");
      return;
    }

    try {
      setSubmitting(true);
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const payload: MasterStatusRequest =
        status === "Rejected" ? { status, reason: reason ?? "" } : { status };

      const response = await fetch(
        `${baseUrl}${PUT_MENU_STATUS(restaurantId, String(id))}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      if (!response.ok)
        throw new Error(result.errors || "Gagal mengubah status menu.");

      alert(
        status === "Approved"
          ? "Menu berhasil diverifikasi"
          : "Saran berhasil dikirim"
      );

      onStatusChange?.();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Terjadi kesalahan";
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprove = (item: Menu) =>
    postStatus(item.restaurant_id || getCookies("restaurant_id") || "", item.id, "Approved");

  const handleRejectSubmit = (reason: string) => {
    if (!selectedId) return;
    const target = data.find((m) => m.id === selectedId);
    postStatus(
      target?.restaurant_id || getCookies("restaurant_id") || "",
      selectedId,
      "Rejected",
      reason
    );
    setOpenRejectDialog(false);
  };

  // Status
  const getStatusChip = (status?: string) => {
    switch (status) {
      case "Approved":
        return <Chip label="Approved" color="success" size="small" />;
      case "Rejected":
        return <Chip label="Waiting for reply" color="info" size="small" />;
      default:
        return <Chip label="Waiting for verification" color="warning" size="small" />;
    }
  };

  // Loading
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Box textAlign="center" py={4} color="text.secondary">
        Tidak ada data menu
      </Box>
    );
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "grey.100" }}>
              <TableCell><strong>No</strong></TableCell>
              <TableCell><strong>Foto Menu</strong></TableCell>
              <TableCell><strong>Nama Menu</strong></TableCell>
              {showCategoryColumn && (
                <TableCell><strong>Kategori</strong></TableCell>
              )}
              <TableCell><strong>Harga</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Aksi</strong></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {sortedData.map((item, index) => {
              const showFallback = imageErrors.has(item.id);
              return (
                <TableRow key={item.id} hover>
                  <TableCell>{index + 1}</TableCell>

                  {/* Gambar */}
                  <TableCell>
                    {showFallback ? (
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: 2,
                          bgcolor: "grey.200",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 12,
                          color: "text.secondary",
                        }}
                      >
                        No Image
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          position: "relative",
                          width: 60,
                          height: 60,
                          borderRadius: 2,
                          overflow: "hidden",
                        }}
                      >
                        <Image
                          src={item.image_url}
                          alt={item.name}
                          fill
                          style={{ objectFit: "cover", borderRadius: 8 }}
                          onError={() => handleImageError(item.id)}
                        />
                      </Box>
                    )}
                  </TableCell>

                  {/* Nama menu */}
                  <TableCell>
                    <div style={{ fontWeight: 500 }}>{item.name}</div>
                  </TableCell>

                  {showCategoryColumn && (
                    <TableCell>{item.category || "-"}</TableCell>
                  )}

                  <TableCell>
                    <span style={{ fontWeight: "bold" }}>
                      {formatPrice(item.price)}
                    </span>
                  </TableCell>

                  <TableCell>{getStatusChip(item.status)}</TableCell>

                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <IconButton
                        size="small"
                        color="info"
                        onClick={() => {
                          setSelectedMenuId(item.id);
                          setSelectedRestaurantId(
                            item.restaurant_id || getCookies("restaurant_id") || null
                          );
                          setOpenDetailDialog(true);
                        }}
                        title="Lihat Detail"
                      >
                        <Visibility />
                      </IconButton>
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        disabled={submitting || item.status === "Approved"}
                        onClick={() => handleApprove(item)}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        disabled={submitting || item.status === "Rejected"}
                        onClick={() => {
                          setSelectedId(item.id);
                          setOpenRejectDialog(true);
                        }}
                      >
                        Saran
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* DIALOG REJECT */}
      <RejectDialog
        open={openRejectDialog}
        onClose={() => setOpenRejectDialog(false)}
        onSubmit={handleRejectSubmit}
        submitting={submitting}
      />

      {/* DIALOG DETAIL MENU */}
      {/* <MenuDetailDialog
        open={openDetailDialog}
        onClose={() => setOpenDetailDialog(false)}
        menuId={selectedMenuId ?? undefined}
      /> */}

      {selectedMenuId && (
        <MenuDetailDialog
          open={openDetailDialog}
          onClose={() => {
            setOpenDetailDialog(false);
            setSelectedMenuId(null);
            setSelectedRestaurantId(null);
          }}
          menuId={selectedMenuId}
          restaurantId={selectedRestaurantId || undefined}
        />
      )}
    </>
  );
};