import { useState, useEffect, useCallback } from "react";
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
    birthDate: "",
  });

  useEffect(() => {
    if (!open) return;
    if (initialData) {
      const birthDate = (initialData as any).birthDate
        ? new Date((initialData as any).birthDate)
        : undefined;
      const bdStr = birthDate && !isNaN(birthDate.getTime())
        ? birthDate.toISOString().substring(0, 10)
        : "";
      setForm({
        name: initialData.name || "",
        phone: initialData.phone || "",
        petName: initialData.petName || "",
        petType: initialData.petType || "",
        petAge: (initialData as any).petAge || 0,
        birthDate: bdStr,
      });
    } else {
      setForm({ name: "", phone: "", petName: "", petType: "", petAge: 0, birthDate: "" });
    }
  }, [open, initialData]);

  const handleChange = (key: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const isValidPhone = (phone: string) => {
    const regex = /^\+?[0-9]{7,15}$/;
    return regex.test(phone.replace(/\s|-/g, ""));
  };

  const handleSubmit = () => {
    if (!form.birthDate) {
      enqueueSnackbar("Birth date is required!", { variant: "warning" });
      return;
    }

    if (
      !form.name ||
      !form.phone ||
      !form.petName ||
      !form.petType ||
      !form.birthDate
    ) {
      enqueueSnackbar("All fields are required!", { variant: "warning" });
      return;
    }

    if (!isValidPhone(form.phone)) {
      enqueueSnackbar("Invalid phone number format!", { variant: "error" });
      return;
    }

    const bd = new Date(form.birthDate);
    if (isNaN(bd.getTime()) || bd.getTime() > Date.now()) {
      enqueueSnackbar("Birth date cannot be in the future", { variant: "error" });
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
    if (e.key === "Escape") onClose();
  };

  const onOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[1500] flex items-center justify-center p-4"
      onClick={onOverlayClick}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade" />

      <div
        role="dialog"
        aria-modal="true"
        onKeyDown={handleKeyDown}
        className="relative w-full max-w-md max-h-[90vh] overflow-y-auto card glass p-6 animate-fade"
      >
        <ModalHeader
          title={initialData ? "Edit Patient" : "Add Patient"}
          onDelete={initialData ? onDelete : undefined}
        />

        <div className="mt-2 space-y-2">
          {["name", "phone", "petName", "petType", "petAge"].map((field) => (
            <ModalField
              key={field}
              keyName={field}
              value={field === "petAge" ? (form as any)["birthDate"] : (form as any)[field]}
              onChange={handleChange}
            />
          ))}
        </div>

        <ModalActions
          onClose={onClose}
          onSubmit={handleSubmit}
          label={initialData ? "Save" : "Add"}
        />
      </div>
    </div>
  );
}
