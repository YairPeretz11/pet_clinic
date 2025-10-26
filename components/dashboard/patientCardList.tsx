import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { IPatient } from "@/lib/interfaces";

// This component renders a list of patient cards for mobile view

interface ListedPatient extends IPatient {
  _id: string;
}

export default function PatientCardList({ patients, onEdit }: { patients: ListedPatient[], onEdit: (patient: IPatient) => void }) {
  return (
    <div className="sm:hidden flex flex-col gap-3">
      {patients.map((p: ListedPatient) => (
        <div
          key={p._id}
          className="border border-gray-300 rounded-lg p-4 shadow-sm bg-white"
        >
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">{p.name}</h2>
            <IconButton color="primary" onClick={() => onEdit(p)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </div>
          <p className="text-sm text-gray-600">📞 {p.phone}</p>
          <p className="text-sm text-gray-600">
            🐾 {p.petName} ({p.petType})
          </p>
          <p className="text-sm text-gray-600">🎂 Age: {p.petAge}</p>
        </div>
      ))}
    </div>
  );
}
