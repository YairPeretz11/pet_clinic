interface ModalActionsProps {
  onClose: () => void;
  onSubmit: () => void;
  label: string;
}

export default function ModalActions({ onClose, onSubmit, label }: ModalActionsProps) {
  return (
    <div className="flex justify-end gap-2 mt-6">
      <button type="button" className="btn btn-outline" onClick={onClose}>
        Close
      </button>
      <button type="button" className="btn btn-primary" onClick={onSubmit}>
        {label}
      </button>
    </div>
  );
}
