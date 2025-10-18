// import { useState, useEffect } from "react";
// import { MasterBahan, MasterBahanFormData } from "@/interfaces/masterBahan";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   MenuItem,
//   Box,
// } from "@mui/material";

// interface MasterBahanFormProps {
//   open: boolean;
//   onClose: () => void;
//   onSubmit: (data: MasterBahanFormData) => Promise<void>;
//   bahanTypes: { id: number; name: string }[];
//   initialData?: MasterBahan | null;
//   loading?: boolean;
// }

// // Buat tipe state lokal (sementara dalam form)
// type MasterBahanFormState = {
//   [K in keyof MasterBahanFormData]: string | number;
// };

// export const MasterBahanForm: React.FC<MasterBahanFormProps> = ({
//   open,
//   onClose,
//   onSubmit,
//   bahanTypes,
//   initialData,
//   loading = false,
// }) => {
//   const [formData, setFormData] = useState<MasterBahanFormState>({
//     name: "",
//     type_id: 0,
//     bdd: "",
//     calory: "",
//     protein: "",
//     fat: "",
//     carbohydrate: "",
//     fiber: "",
//     natrium: "",
//     cholesterol: "",
//     sfa: "",
//     mufa: "",
//     pufa: "",
//   });

//   // Sync formData ketika initialData berubah (misal saat edit)
//   useEffect(() => {
//     if (initialData) {
//       setFormData({
//         name: initialData.name,
//         type_id: initialData.type_id,
//         bdd: String(initialData.bdd ?? ""),
//         calory: String(initialData.calory ?? ""),
//         protein: String(initialData.protein ?? ""),
//         fat: String(initialData.fat ?? ""),
//         carbohydrate: String(initialData.carbohydrate ?? ""),
//         fiber: String(initialData.fiber ?? ""),
//         natrium: String(initialData.natrium ?? ""),
//         cholesterol: String(initialData.cholesterol ?? ""),
//         sfa: String(initialData.sfa ?? ""),
//         mufa: String(initialData.mufa ?? ""),
//         pufa: String(initialData.pufa ?? ""),
//       });
//     } else {
//       setFormData({
//         name: "",
//         type_id: 0,
//         bdd: "",
//         calory: "",
//         protein: "",
//         fat: "",
//         carbohydrate: "",
//         fiber: "",
//         natrium: "",
//         cholesterol: "",
//         sfa: "",
//         mufa: "",
//         pufa: "",
//       });
//     }
//   }, [initialData, open]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const payload: MasterBahanFormData = {
//       name: String(formData.name),
//       type_id: Number(formData.type_id),
//       bdd: parseFloat(String(formData.bdd).replace(",", ".")) || 0,
//       calory: parseFloat(String(formData.calory).replace(",", ".")) || 0,
//       protein: parseFloat(String(formData.protein).replace(",", ".")) || 0,
//       fat: parseFloat(String(formData.fat).replace(",", ".")) || 0,
//       carbohydrate: parseFloat(String(formData.carbohydrate).replace(",", ".")) || 0,
//       fiber: parseFloat(String(formData.fiber).replace(",", ".")) || 0,
//       natrium: parseFloat(String(formData.natrium).replace(",", ".")) || 0,
//       cholesterol: parseFloat(String(formData.cholesterol).replace(",", ".")) || 0,
//       sfa: parseFloat(String(formData.sfa).replace(",", ".")) || 0,
//       mufa: parseFloat(String(formData.mufa).replace(",", ".")) || 0,
//       pufa: parseFloat(String(formData.pufa).replace(",", ".")) || 0,
//     };

//     try {
//       await onSubmit(payload);
//     } catch (error) {
//       console.error("Error submitting form:", error);
//     }
//   };

//   const handleClose = () => {
//     onClose();
//   };

//   return (
//     <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
//       <DialogTitle>{initialData ? "Edit Bahan" : "Tambah Bahan"}</DialogTitle>
//       <form onSubmit={handleSubmit}>
//         <DialogContent>
//           <TextField
//             label="Nama Bahan"
//             name="name"
//             fullWidth
//             margin="dense"
//             value={formData.name}
//             onChange={handleChange}
//             required
//           />
//           <TextField
//             select
//             label="Tipe Bahan"
//             name="type_id"
//             fullWidth
//             margin="dense"
//             value={formData.type_id}
//             onChange={handleSelectChange}
//             required
//           >
//             {bahanTypes.map(type => (
//               <MenuItem key={type.id} value={type.id}>
//                 {type.name}
//               </MenuItem>
//             ))}
//           </TextField>

//           <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2, mt: 2 }}>
//             <TextField label="BDD" name="bdd" type="text" value={formData.bdd} onChange={handleChange} fullWidth margin="dense" />
//             <TextField label="Kalori" name="calory" type="text" value={formData.calory} onChange={handleChange} fullWidth margin="dense" />
//             <TextField label="Protein" name="protein" type="text" value={formData.protein} onChange={handleChange} fullWidth margin="dense" />
//             <TextField label="Lemak" name="fat" type="text" value={formData.fat} onChange={handleChange} fullWidth margin="dense" />
//             <TextField label="Karbohidrat" name="carbohydrate" type="text" value={formData.carbohydrate} onChange={handleChange} fullWidth margin="dense" />
//             <TextField label="Serat" name="fiber" type="text" value={formData.fiber} onChange={handleChange} fullWidth margin="dense" />
//             <TextField label="Natrium" name="natrium" type="text" value={formData.natrium} onChange={handleChange} fullWidth margin="dense" />
//             <TextField label="Kolesterol" name="cholesterol" type="text" value={formData.cholesterol} onChange={handleChange} fullWidth margin="dense" />
//             <TextField label="SFA" name="sfa" type="text" value={formData.sfa} onChange={handleChange} fullWidth margin="dense" />
//             <TextField label="MUFA" name="mufa" type="text" value={formData.mufa} onChange={handleChange} fullWidth margin="dense" />
//             <TextField label="PUFA" name="pufa" type="text" value={formData.pufa} onChange={handleChange} fullWidth margin="dense" />
//           </Box>
//         </DialogContent>

//         <DialogActions>
//           <Button onClick={handleClose}>Batal</Button>
//           <Button type="submit" variant="contained" color="primary" disabled={loading}>
//             {loading ? "Menyimpan..." : initialData ? "Update" : "Simpan"}
//           </Button>
//         </DialogActions>
//       </form>
//     </Dialog>
//   );
// };



// YANG LAIN DISABLE

"use client";

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
  Box,
} from "@mui/material";

interface MasterBahanFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: MasterBahanFormData) => Promise<void>;
  bahanTypes: { id: number; name: string }[];
  initialData?: MasterBahan | null;
  loading?: boolean;
}

type MasterBahanFormState = {
  [K in keyof MasterBahanFormData]: string | number;
};

export const MasterBahanForm: React.FC<MasterBahanFormProps> = ({
  open,
  onClose,
  onSubmit,
  bahanTypes,
  initialData,
  loading = false,
}) => {
  const [formData, setFormData] = useState<MasterBahanFormState>({
    name: "",
    type_id: 0,
    bdd: 1, // default minimal 1
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

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        type_id: initialData.type_id,
        bdd: initialData.bdd ?? 1, // tetap minimal 1
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
      setFormData(prev => ({ ...prev, bdd: 1 })); // default BDD = 1
    }
  }, [initialData, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: MasterBahanFormData = {
      name: String(formData.name),
      type_id: Number(formData.type_id),
      bdd: Number(formData.bdd),
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
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>{initialData ? "Edit Bahan" : "Tambah Bahan"}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {/* Nama Bahan */}
          <TextField
            label="Nama Bahan"
            name="name"
            fullWidth
            margin="dense"
            value={formData.name}
            onChange={handleChange}
            required
          />

          {/* Tipe Bahan */}
          <TextField
            select
            label="Tipe Bahan"
            name="type_id"
            fullWidth
            margin="dense"
            value={formData.type_id}
            onChange={handleSelectChange}
            required
          >
            {bahanTypes.map(type => (
              <MenuItem key={type.id} value={type.id}>
                {type.name}
              </MenuItem>
            ))}
          </TextField>

          {/* Nutrisi & BDD */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 2,
              mt: 2,
            }}
          >
            <TextField
              label="BDD"
              name="bdd"
              value={formData.bdd}
              fullWidth
              margin="dense"
              disabled
            />
            <TextField label="Kalori" value={formData.calory} fullWidth margin="dense" disabled />
            <TextField label="Protein" value={formData.protein} fullWidth margin="dense" disabled />
            <TextField label="Lemak" value={formData.fat} fullWidth margin="dense" disabled />
            <TextField label="Karbohidrat" value={formData.carbohydrate} fullWidth margin="dense" disabled />
            <TextField label="Serat" value={formData.fiber} fullWidth margin="dense" disabled />
            <TextField label="Natrium" value={formData.natrium} fullWidth margin="dense" disabled />
            <TextField label="Kolesterol" value={formData.cholesterol} fullWidth margin="dense" disabled />
            <TextField label="SFA" value={formData.sfa} fullWidth margin="dense" disabled />
            <TextField label="MUFA" value={formData.mufa} fullWidth margin="dense" disabled />
            <TextField label="PUFA" value={formData.pufa} fullWidth margin="dense" disabled />
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
