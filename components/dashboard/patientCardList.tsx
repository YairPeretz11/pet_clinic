import { IPatient } from "@/lib/interfaces";

// This component renders a list of patient cards for mobile view

interface ListedPatient extends IPatient {
  _id: string;
}

interface PatientCardListProps {
  patients: ListedPatient[];
  onEdit: (patient: IPatient) => void;
}

export default function PatientCardList({ patients, onEdit }: PatientCardListProps) {
  return (
    <div className="sm:hidden flex flex-col gap-3">
      {patients.map((p: ListedPatient) => (
        <div key={p._id} className="card card-hover p-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-muted-800 dark:text-white">{p.name}</h2>
            <button
              type="button"
              className="btn btn-outline !px-2"
              onClick={() => onEdit(p)}
              aria-label="Edit"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                <path d="M5 21h14v-2H5v2Zm13.71-13.29-2.42-2.42a1 1 0 0 0-1.41 0L5 13.17V16h2.83l9.88-9.88a1 1 0 0 0 0-1.41ZM7.92 14H7v-.92l7.46-7.46.92.92L7.92 14Z" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-muted-600">📞 {p.phone}</p>
          <p className="text-sm text-muted-600">🐾 {p.petName} ({p.petType})</p>
          <p className="text-sm text-muted-600">🎂 Age: {p.petAge}</p>
        </div>
      ))}
    </div>
  );
}

