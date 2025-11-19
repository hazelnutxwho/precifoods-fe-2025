import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";
import { useState } from "react";

interface RejectDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
  submitting: boolean;
}

export const RejectDialog: React.FC<RejectDialogProps> = ({
  open,
  onClose,
  onSubmit,
  submitting,
}) => {
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    if (!reason.trim()) {
      alert("Saran harus diisi!");
      return;
    }
    onSubmit(reason);
    setReason("");
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { borderRadius: 2, p: 2, minWidth: 420 },
      }}
    >
      <DialogTitle>Saran</DialogTitle>
      <DialogContent>
        <TextField
          label="Masukkan saran"
          fullWidth
          multiline
          minRows={6}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          sx={{
            mt: 1,
            "& .MuiInputBase-root": { fontSize: 15 },
          }}
        />
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Batal</Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={submitting}
        >
          Kirim
        </Button>
      </DialogActions>
    </Dialog>
  );
};

