import { useState, useEffect } from "react";
import { Modal, Box } from "@mui/material";
import { useSnackbar } from "notistack";
import { IPatient } from "@/lib/interfaces";
import ModalHeader from "./modalHeader";
import ModalActions from "./modalActions";
import ModalField from "./modalField";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: IPatient) => void;
  onDelete?: () => void;
  initialData?: IPatient;
}

export default function PatientModal({
  open,
  onClose,
  onSave,
  onDelete,
  initialData,
}: Props) {
  const { enqueueSnackbar } = useSnackbar();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    petName: "",
    petAge: 0,
    petType: "",
  });

  useEffect(() => {
    if (!open) return; 
    if (initialData) setForm(initialData);
    else setForm({ name: "", phone: "", petName: "", petType: "", petAge: 0 });
  }, [open, initialData]);

  const handleChange = (key: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    if (
      !form.name ||
      !form.phone ||
      !form.petName ||
      !form.petType ||
      !form.petAge
    ) {
      enqueueSnackbar("All fields are required!", { variant: "warning" });
      return;
    }

    onSave({ ...form, petAge: Number(form.petAge) });
    enqueueSnackbar(
      initialData
        ? "Patient updated successfully!"
        : "Patient added successfully!",
      { variant: "success" }
    );
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
    if (e.key === "Escape") onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      BackdropProps={{
        sx: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(3px)",
        },
      }}
    >
      <Box
        onKeyDown={handleKeyDown}
        className="absolute top-1/2 left-1/2 w-11/12 sm:w-[420px] max-h-[90vh] overflow-y-auto -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl p-6 focus:outline-none z-[1500]"
        sx={{
          bgcolor: "white",
          boxShadow: 6,
          p: 4,
          borderRadius: 2,
          zIndex: 1500,
        }}
      >
        <ModalHeader
          title={initialData ? "Edit Patient" : "Add Patient"}
          onDelete={initialData ? onDelete : undefined}
        />

        {["name", "phone", "petName", "petType", "petAge"].map((field) => (
          <ModalField
            key={field}
            keyName={field}
            value={(form as any)[field]}
            onChange={handleChange}
          />
        ))}

        <ModalActions
          onClose={onClose}
          onSubmit={handleSubmit}
          label={initialData ? "Save" : "Add"}
        />
      </Box>
    </Modal>
  );
}
