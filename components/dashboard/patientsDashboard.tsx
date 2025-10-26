import { useEffect, useMemo, useState } from "react";
import debounce from "lodash.debounce";
import { usePatients } from "../../hooks/usePatients";
import PatientModal from "../modal/patientModal";
import PatientTable from "../dashboard/patientTable";
import PatientCardList from "../dashboard/patientCardList";
import { getColumns } from "../dashboard/tableColumns";
import { IPatient } from "@/lib/interfaces";

export default function PatientDashboard() {
  const {
    data: patients = [],
    addPatient,
    updatePatient,
    deletePatient,
    isLoading,
  } = usePatients();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [filters, setFilters] = useState({ name: "", petAge: "", petType: "" });
  const [dark, setDark] = useState(false);

  const debouncedNameChange = useMemo(
    () =>
      debounce(
        (value: string) => setFilters((p) => ({ ...p, name: value })),
        300
      ),
    []
  );

  const filteredPatients = useMemo(() => {
    return patients.filter((p: IPatient) => {
      const nameMatch = p.name
        .toLowerCase()
        .includes(filters.name.toLowerCase());
      const ageMatch = filters.petAge
        ? Number(p.petAge ?? -1) === Number(filters.petAge)
        : true;
      const typeMatch = filters.petType ? p.petType === filters.petType : true;
      return nameMatch && ageMatch && typeMatch;
    });
  }, [patients, filters]);

  const columns = useMemo(() => {
    return getColumns(setFilters, debouncedNameChange);
  }, [debouncedNameChange]);

  const handleSave = (data: IPatient) => {
    editing
      ? updatePatient.mutate(
          { id: editing._id, data },
          { onSuccess: () => setOpen(false) }
        )
      : addPatient.mutate(data);
  };

  const handleDelete = () => {
    if (editing?._id) {
      deletePatient.mutate(editing._id);
      setEditing(null);
      setOpen(false);
    }
  };

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('theme-dark') : null;
    const isDark = stored === '1';
    setDark(isDark);
    if (isDark) document.documentElement.classList.add('dark');
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme-dark', '1');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.removeItem('theme-dark');
    }
  };

  if (isLoading) return <p className="p-4">Loading patients...</p>;

  return (
    <div className="container-page py-6">
      <div className="card glass card-hover p-5 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-muted-900 dark:text-white">
              Pet Clinic Patients
            </h1>
            <p className="text-sm text-muted-500">Manage, search and edit patient details</p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={toggleDark}
              className="btn btn-outline !px-3"
              aria-label="Toggle dark mode"
              title="Toggle theme"
            >
              {dark ? '🌙' : '☀️'}
            </button>
            <button
              type="button"
              className="btn btn-primary w-full sm:w-auto"
              onClick={() => setOpen(true)}
            >
              Add Patient
            </button>
          </div>
        </div>
      </div>

      <PatientTable
        columns={columns}
        data={filteredPatients}
        onEdit={(patient: IPatient) => {
          setEditing(patient);
          setTimeout(() => setOpen(true), 0);
        }}
      />
      <PatientCardList
        patients={filteredPatients}
        onEdit={(patient) => {
          setEditing(patient);
          setTimeout(() => setOpen(true), 0); 
        }}
      />

      <PatientModal
        open={open}
        onClose={() => {
          setEditing(null);
          setOpen(false);
        }}
        onSave={handleSave}
        onDelete={editing ? handleDelete : undefined}
        initialData={editing}
      />
    </div>
  );
}
