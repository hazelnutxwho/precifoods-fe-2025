import { MasterBumbu } from '@/interfaces/masterBumbu';
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
  Chip,
} from "@mui/material";
import {Delete } from "@mui/icons-material";

interface TableMasterBumbuProps {
  data: MasterBumbu[];
  onEdit: (item: MasterBumbu) => void;
  onDelete: (id: number) => void;
  loading?: boolean;
}

export const TableMasterBumbu: React.FC<TableMasterBumbuProps> = ({
  data,
  onDelete,
  loading = false,
}) => {
  const getStatusChip = (status: "Waiting" | "Approved" | "Rejected") => {
    switch (status) {
      case "Approved":
        return (
          <Chip 
            label="Done" 
            color="success"
            variant="filled"
            size="small"
          />
        );
      case "Rejected":
        return (
          <Chip 
            label="Rejected" 
            color="error"
            variant="filled"
            size="small"
          />
        );
      case "Waiting":
      default:
        return (
          <Chip 
            label="Waiting" 
            color="warning"
            variant="filled"
            size="small"
          />
        );
    }
  };

  // Fungsi untuk menampilkan nilai atau "-" jika waiting
  const displayValue = (value: number, status: "Waiting" | "Approved" | "Rejected") => {
    return status === "Waiting" ? "-" : value.toFixed(2);
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
        Tidak ada data bumbu
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ width: "100%", overflowX: "auto" }}>
      <Table size="small" sx={{ minWidth: 1300 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: 'grey.100' }}>
            <TableCell><strong>No</strong></TableCell>
            <TableCell><strong>Nama Bumbu</strong></TableCell>
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
          {data.map((item, index) => (
            <TableRow key={item.id} hover>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.status === "Waiting" ? "-" : item.bdd}</TableCell>
              <TableCell>{displayValue(item.calory, item.status)}</TableCell>
              <TableCell>{displayValue(item.protein, item.status)}</TableCell>
              <TableCell>{displayValue(item.fat, item.status)}</TableCell>
              <TableCell>{displayValue(item.carbohydrate, item.status)}</TableCell>
              <TableCell>{displayValue(item.fiber, item.status)}</TableCell>
              <TableCell>{displayValue(item.natrium, item.status)}</TableCell>
              <TableCell>{displayValue(item.cholesterol, item.status)}</TableCell>
              <TableCell>{displayValue(item.sfa, item.status)}</TableCell>
              <TableCell>{displayValue(item.mufa, item.status)}</TableCell>
              <TableCell>{displayValue(item.pufa, item.status)}</TableCell>
              <TableCell>
                {getStatusChip(item.status)}
              </TableCell>
              <TableCell>
                <IconButton 
                  size="small" 
                  onClick={() => onDelete(item.id)}
                  color="error"
                  title="Hapus"
                  // disabled={item.status === "Approved"} // Nonaktifkan hapus jika sudah disetujui
                >
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};