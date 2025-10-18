import { MasterBahan } from '@/interfaces/masterBahan';
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
import { Edit, Delete } from "@mui/icons-material";

interface TableMasterBahanProps {
  data: MasterBahan[];
  onEdit: (item: MasterBahan) => void;
  onDelete: (id: number) => void;
  loading?: boolean;
  showTypeColumn?: boolean;
}

export const TableMasterBahan: React.FC<TableMasterBahanProps> = ({
  data,
  onEdit,
  onDelete,
  loading = false,
  showTypeColumn = true,
}) => {
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
    <TableContainer component={Paper} sx={{ width: "100%", overflowX: "auto" }}>
      <Table sx={{ minWidth: 1200 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: 'grey.100' }}>
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
            <TableCell><strong>Aksi</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={item.id} hover>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{item.name}</TableCell>
              {showTypeColumn && <TableCell>{item.type_name}</TableCell>}
              <TableCell>{item.bdd}</TableCell>
              <TableCell>{item.calory.toFixed(2)}</TableCell>
              <TableCell>{item.protein.toFixed(2)}</TableCell>
              <TableCell>{item.fat.toFixed(2)}</TableCell>
              <TableCell>{item.carbohydrate.toFixed(2)}</TableCell>
              <TableCell>{item.fiber.toFixed(2)}</TableCell>
              <TableCell>{item.natrium.toFixed(2)}</TableCell>
              <TableCell>{item.cholesterol.toFixed(2)}</TableCell>
              <TableCell>{item.sfa.toFixed(2)}</TableCell>
              <TableCell>{item.mufa.toFixed(2)}</TableCell>
              <TableCell>{item.pufa.toFixed(2)}</TableCell>
              <TableCell>
                <IconButton 
                  size="small" 
                  onClick={() => onEdit(item)}
                  color="primary"
                  title="Edit"
                >
                  <Edit />
                </IconButton>
                <IconButton 
                  size="small" 
                  onClick={() => onDelete(item.id)}
                  color="error"
                  title="Hapus"
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
