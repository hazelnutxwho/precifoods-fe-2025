import { useState, useEffect } from "react";
import { MasterBahan, MasterBahanFormData } from "@/interfaces/masterBahan";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";

interface MasterBahanFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: MasterBahanFormData) => Promise<void>;
  bahanTypes: { id: number; name: string }[];
  initialData?: MasterBahan | null;
  loading?: boolean;
}

// export const MasterBahanFormRestoran: React.FC<MasterBahanFormProps> = ({
//   open,
//   onClose,
//   onSubmit,
//   bahanTypes,
//   initialData,
//   loading = false,
// }) => {
//   const defaultValues = {
//     name: "",
//     type_id: 0,
//     bdd: 100, // ✅ default agar lolos validasi backend
//     calory: 0,
//     protein: 0,
//     fat: 0,
//     carbohydrate: 0,
//     fiber: 0,
//     natrium: 0,
//     cholesterol: 0,
//     sfa: 0,
//     mufa: 0,
//     pufa: 0,
//   };

//   const [formData, setFormData] = useState(defaultValues);

//   useEffect(() => {
//     if (initialData) {
//       setFormData({
//         ...defaultValues,
//         name: initialData.name,
//         type_id: initialData.type_id,
//       });
//     } else {
//       setFormData(defaultValues);
//     }
//   }, [initialData, open]);

const defaultValues = {
  name: "",
  type_id: 0,
  bdd: 100,
  calory: 0,
  protein: 0,
  fat: 0,
  carbohydrate: 0,
  fiber: 0,
  natrium: 0,
  cholesterol: 0,
  sfa: 0,
  mufa: 0,
  pufa: 0,
};

export const MasterBahanFormRestoran: React.FC<MasterBahanFormProps> = ({
  open,
  onClose,
  onSubmit,
  bahanTypes,
  initialData,
  loading = false,
}) => {
  const [formData, setFormData] = useState(defaultValues);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...defaultValues,
        name: initialData.name,
        type_id: initialData.type_id,
      });
    } else {
      setFormData(defaultValues);
    }
  }, [initialData, open]); // defaultValues sudah stabil

  // ... rest of the component

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: MasterBahanFormData = {
      ...formData,
      bdd: 100, // ✅ default fix agar tidak error validasi
      calory: 0,
      protein: 0,
      fat: 0,
      carbohydrate: 0,
      fiber: 0,
      natrium: 0,
      cholesterol: 0,
      sfa: 0,
      mufa: 0,
      pufa: 0,
    };

    try {
      await onSubmit(payload);
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initialData ? "Edit Bahan" : "Tambah Bahan"}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            label="Nama Bahan"
            name="name"
            fullWidth
            margin="dense"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <TextField
            select
            label="Tipe Bahan"
            name="type_id"
            fullWidth
            margin="dense"
            value={formData.type_id}
            onChange={handleChange}
            required
          >
            {bahanTypes.map(type => (
              <MenuItem key={type.id} value={type.id}>
                {type.name}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Batal</Button>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? "Menyimpan..." : initialData ? "Update" : "Simpan"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
