import { Button } from "@mui/material";

interface ModalActionsProps {
  onClose: () => void;
  onSubmit: () => void;
  label: string;
}

export default function ModalActions({ onClose, onSubmit, label }: ModalActionsProps) {
  return (
    <div className="flex justify-end gap-2 mt-4">
      <Button
        variant="outlined"
        className="border border-gray-300 text-gray-700 hover:bg-gray-100"
        onClick={onClose}
      >
        Close
      </Button>
      <Button
        variant="contained"
        className="bg-blue-600 hover:bg-blue-700 text-white"
        onClick={onSubmit}
      >
        {label}
      </Button>
    </div>
  );
}
