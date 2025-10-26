import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface ModalHeaderProps {
  title: string;
  onDelete?: () => void;
}

export default function ModalHeader({ title, onDelete }: ModalHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-2">
      <h2 className="text-xl font-semibold text-gray-700">{title}</h2>
      {onDelete && (
        <IconButton onClick={onDelete} color="error" size="small">
          <DeleteIcon />
        </IconButton>
      )}
    </div>
  );
}
