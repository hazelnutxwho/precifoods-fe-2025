import { useState, useEffect } from "react";
import { MasterBumbu, MasterBumbuFormData } from "@/interfaces/masterBumbu";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from "@mui/material";

interface MasterBumbuFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: MasterBumbuFormData) => Promise<void>;
  initialData?: MasterBumbu | null;
  loading?: boolean;
}

// Buat tipe state lokal (sementara dalam form)
type MasterBumbuFormState = {
  [K in keyof MasterBumbuFormData]: string | number;
};

export const MasterBumbuForm: React.FC<MasterBumbuFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  loading = false,
}) => {
  const [formData, setFormData] = useState<MasterBumbuFormState>({
    name: "",
    bdd: "1",
    calory: "",
    protein: "",
    fat: "",
    carbohydrate: "",
    fiber: "",
    natrium: "",
    cholesterol: "",
    sfa: "",
    mufa: "",
    pufa: "",
  });

  // Sync formData ketika initialData berubah (misal saat edit)
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        bdd: String(initialData.bdd ?? ""),
        calory: String(initialData.calory ?? ""),
        protein: String(initialData.protein ?? ""),
        fat: String(initialData.fat ?? ""),
        carbohydrate: String(initialData.carbohydrate ?? ""),
        fiber: String(initialData.fiber ?? ""),
        natrium: String(initialData.natrium ?? ""),
        cholesterol: String(initialData.cholesterol ?? ""),
        sfa: String(initialData.sfa ?? ""),
        mufa: String(initialData.mufa ?? ""),
        pufa: String(initialData.pufa ?? ""),
      });
    } else {
      setFormData({
        name: "",
        bdd: "",
        calory: "",
        protein: "",
        fat: "",
        carbohydrate: "",
        fiber: "",
        natrium: "",
        cholesterol: "",
        sfa: "",
        mufa: "",
        pufa: "",
      });
    }
  }, [initialData, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: MasterBumbuFormData = {
      name: String(formData.name),
      bdd: parseFloat(String(formData.bdd).replace(",", ".")) || 0,
      calory: parseFloat(String(formData.calory).replace(",", ".")) || 0,
      protein: parseFloat(String(formData.protein).replace(",", ".")) || 0,
      fat: parseFloat(String(formData.fat).replace(",", ".")) || 0,
      carbohydrate: parseFloat(String(formData.carbohydrate).replace(",", ".")) || 0,
      fiber: parseFloat(String(formData.fiber).replace(",", ".")) || 0,
      natrium: parseFloat(String(formData.natrium).replace(",", ".")) || 0,
      cholesterol: parseFloat(String(formData.cholesterol).replace(",", ".")) || 0,
      sfa: parseFloat(String(formData.sfa).replace(",", ".")) || 0,
      mufa: parseFloat(String(formData.mufa).replace(",", ".")) || 0,
      pufa: parseFloat(String(formData.pufa).replace(",", ".")) || 0,
    };

    try {
      await onSubmit(payload);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
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

          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2, mt: 2 }}>
            <TextField label="BDD" name="bdd" type="text" value={formData.bdd} onChange={handleChange} fullWidth margin="dense" />
            <TextField label="Kalori" name="calory" type="text" value={formData.calory} onChange={handleChange} fullWidth margin="dense" />
            <TextField label="Protein" name="protein" type="text" value={formData.protein} onChange={handleChange} fullWidth margin="dense" />
            <TextField label="Lemak" name="fat" type="text" value={formData.fat} onChange={handleChange} fullWidth margin="dense" />
            <TextField label="Karbohidrat" name="carbohydrate" type="text" value={formData.carbohydrate} onChange={handleChange} fullWidth margin="dense" />
            <TextField label="Serat" name="fiber" type="text" value={formData.fiber} onChange={handleChange} fullWidth margin="dense" />
            <TextField label="Natrium" name="natrium" type="text" value={formData.natrium} onChange={handleChange} fullWidth margin="dense" />
            <TextField label="Kolesterol" name="cholesterol" type="text" value={formData.cholesterol} onChange={handleChange} fullWidth margin="dense" />
            <TextField label="SFA" name="sfa" type="text" value={formData.sfa} onChange={handleChange} fullWidth margin="dense" />
            <TextField label="MUFA" name="mufa" type="text" value={formData.mufa} onChange={handleChange} fullWidth margin="dense" />
            <TextField label="PUFA" name="pufa" type="text" value={formData.pufa} onChange={handleChange} fullWidth margin="dense" />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Batal</Button>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? "Menyimpan..." : initialData ? "Update" : "Simpan"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
