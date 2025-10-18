import { useState, useEffect } from "react";
import { MasterBumbu, MasterBumbuFormData } from "@/interfaces/masterBumbu";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

interface MasterBumbuFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: MasterBumbuFormData) => Promise<void>;
  initialData?: MasterBumbu | null;
  loading?: boolean;
}

// export const MasterBumbuFormRestoran: React.FC<MasterBumbuFormProps> = ({
//   open,
//   onClose,
//   onSubmit,
//   initialData,
//   loading = false,
// }) => {
//   // ✅ Default value dengan nilai numerik agar lolos validasi backend
//   const defaultValues = {
//     name: "",
//     bdd: 100, // tetap 100 agar valid
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
//       });
//     } else {
//       setFormData(defaultValues);
//     }
//   }, [initialData, open]);

const defaultValues = {
  name: "",
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

export const MasterBumbuFormRestoran: React.FC<MasterBumbuFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  loading = false,
}) => {
  const [formData, setFormData] = useState(defaultValues);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...defaultValues,
        name: initialData.name,
      });
    } else {
      setFormData(defaultValues);
    }
  }, [initialData, open]); // defaultValues sudah stabil

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: MasterBumbuFormData = {
      ...formData,
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

    try {
      await onSubmit(payload);
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initialData ? "Edit Bumbu" : "Tambah Bumbu"}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            label="Nama Bumbu"
            name="name"
            fullWidth
            margin="dense"
            value={formData.name}
            onChange={handleChange}
            required
          />
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
