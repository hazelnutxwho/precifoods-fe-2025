import { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Box,
  CircularProgress,
} from "@mui/material";
import { MasterBahan } from "@/interfaces/masterBahan";

interface TableMasterBahanProps {
  data: MasterBahan[];
  onEdit: (item: MasterBahan) => void;
  onStatusChange?: () => void;
  loading?: boolean;
  showTypeColumn?: boolean;
}

export const TableMasterBahan: React.FC<TableMasterBahanProps> = ({
  data,
  onEdit,
  loading = false,
  showTypeColumn = true,
}) => {

  // sort dari yang terbaru
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      if (a.created_at && b.created_at) {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      return b.id - a.id;
    });
  }, [data]);


  // Status
  const getStatusChip = (status?: string) => {
    switch (status) {
      case "Approved":
        return <Chip label="Done" color="success" size="small" />;
      case "Rejected":
        return <Chip label="Rejected" color="error" size="small" />;
      default:
        return <Chip label="Awaiting Input" color="warning" size="small" />;
    }
  };

  // Render nilai gizi
  const renderNilaiGizi = (value: number | undefined | null, status?: string) => {
    // Jika status Approved, tampilkan nilai asli
    if (status === "Approved") {
      return value !== null && value !== undefined ? value.toFixed(2) : "-";
    }
    // Jika status BUKAN Approved, selalu tampilkan "-"
    return "-";
  };

  //BDD
  const renderBDD = (bdd: number | undefined | null, status?: string) => {
    // Jika status Approved, tampilkan nilai asli
    if (status === "Approved") {
      return bdd !== null && bdd !== undefined ? bdd : "-";
    }
    // Jika status BUKAN Approved, selalu tampilkan "-"
    return "-";
  };

  // Loading
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
        Tidak ada data bahan
      </Box>
    );
  }

  return (
    <>
      <TableContainer component={Paper} sx={{ width: "100%", overflowX: "auto" }}>
        <Table sx={{ minWidth: 1200 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "grey.100" }}>
              <TableCell><strong>No</strong></TableCell>
              <TableCell><strong>Nama Bahan</strong></TableCell>
              {showTypeColumn && <TableCell><strong>Tipe</strong></TableCell>}
              <TableCell><strong>BDD</strong></TableCell>
              <TableCell><strong>Kalori</strong></TableCell>
              <TableCell><strong>Protein</strong></TableCell>
              <TableCell><strong>Lemak</strong></TableCell>
              <TableCell><strong>Karbohidrat</strong></TableCell>
              <TableCell><strong>Serat</strong></TableCell>
              <TableCell><strong>Natrium</strong></TableCell>
              <TableCell><strong>Kolesterol</strong></TableCell>
              <TableCell><strong>SFA</strong></TableCell>
              <TableCell><strong>MUFA</strong></TableCell>
              <TableCell><strong>PUFA</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Aksi</strong></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {sortedData.map((item, index) => (
              <TableRow key={item.id} hover>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.name}</TableCell>
                {showTypeColumn && <TableCell>{item.type_name || "-"}</TableCell>}
                <TableCell>{renderBDD(item.bdd, item.status)}</TableCell>
                <TableCell>{renderNilaiGizi(item.calory, item.status)}</TableCell>
                <TableCell>{renderNilaiGizi(item.protein, item.status)}</TableCell>
                <TableCell>{renderNilaiGizi(item.fat, item.status)}</TableCell>
                <TableCell>{renderNilaiGizi(item.carbohydrate, item.status)}</TableCell>
                <TableCell>{renderNilaiGizi(item.fiber, item.status)}</TableCell>
                <TableCell>{renderNilaiGizi(item.natrium, item.status)}</TableCell>
                <TableCell>{renderNilaiGizi(item.cholesterol, item.status)}</TableCell>
                <TableCell>{renderNilaiGizi(item.sfa, item.status)}</TableCell>
                <TableCell>{renderNilaiGizi(item.mufa, item.status)}</TableCell>
                <TableCell>{renderNilaiGizi(item.pufa, item.status)}</TableCell>

                <TableCell>{getStatusChip(item.status)}</TableCell>

                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => onEdit(item)}
                    // disabled={item.status === "Approved"}
                  >
                    Input Gizi
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};