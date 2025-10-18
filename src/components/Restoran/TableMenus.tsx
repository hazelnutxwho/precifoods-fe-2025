import { Menu } from "@/interfaces/menu";
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
} from "@mui/material";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import { useState } from "react";

interface TableMenusProps {
  data: Menu[];
  onEdit: (item: Menu) => void;
  onDelete: (id: number) => void;
  onView: (item: Menu) => void;
  loading?: boolean;
  showCategoryColumn?: boolean;
}

export const TableMenus: React.FC<TableMenusProps> = ({
  data,
  onEdit,
  onDelete,
  onView,
  loading = false,
  showCategoryColumn = true, // default: true
}) => {
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  const handleImageError = (id: number) => {
    setImageErrors((prev) => new Set(prev).add(id));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (data.length === 0) {
    return (
      <Box textAlign="center" py={4} color="text.secondary">
        Tidak ada data menu
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "grey.100" }}>
            <TableCell><strong>No</strong></TableCell>
            <TableCell><strong>Foto Menu</strong></TableCell>
            <TableCell><strong>Nama Menu</strong></TableCell>

            {/* 👇 Kolom kategori hanya muncul kalau showCategoryColumn true */}
            {showCategoryColumn && (
              <TableCell><strong>Kategori</strong></TableCell>
            )}

            <TableCell><strong>Harga</strong></TableCell>
            <TableCell><strong>Status</strong></TableCell>
            <TableCell><strong>Aksi</strong></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data.map((item, index) => {
            const showFallback = imageErrors.has(item.id);
            return (
              <TableRow key={item.id} hover>
                <TableCell>{index + 1}</TableCell>
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

                <TableCell>
                  <div style={{ fontWeight: "500" }}>{item.name}</div>
                </TableCell>

                {/* 👇 Kolom kategori disembunyikan jika filter != "Semua" */}
                {showCategoryColumn && (
                  <TableCell>{item.category}</TableCell>
                )}

                <TableCell>
                  <span style={{ fontWeight: "bold" }}>
                    {formatPrice(item.price)}
                  </span>
                </TableCell>

                <TableCell>
                  <span
                    style={{
                      padding: "4px 8px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      backgroundColor:
                        item.status === "Approved"
                          ? "#e8f5e8"
                          : item.status === "Pending"
                          ? "#fff3cd"
                          : "#f8d7da",
                      color:
                        item.status === "Approved"
                          ? "#2e7d32"
                          : item.status === "Pending"
                          ? "#856404"
                          : "#dc3545",
                    }}
                  >
                    {item.status}
                  </span>
                </TableCell>

                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => onView(item)}
                    color="info"
                    title="Lihat Detail"
                  >
                    <Visibility />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => onEdit(item)}
                    color="primary"
                    title="Edit Menu"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => onDelete(item.id)}
                    color="error"
                    title="Hapus Menu"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
