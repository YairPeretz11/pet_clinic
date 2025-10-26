import { useState, useMemo } from "react";
import debounce from "lodash.debounce";
import { Button } from "@mui/material";
import { usePatients } from "../../hooks/usePatients";
import PatientModal from "../modal/patientModal";
import PatientFilters from "../dashboard/patientFilters";
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
        ? p.petAge === Number(filters.petAge)
        : true;
      const typeMatch = filters.petType ? p.petType === filters.petType : true;
      return nameMatch && ageMatch && typeMatch;
    });
  }, [patients, filters]);

  const columns = useMemo(() => {
    const currentFilters = { ...filters };
    return getColumns(currentFilters, setFilters, debouncedNameChange);
  }, [filters, debouncedNameChange]);

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

  if (isLoading) return <p className="p-4">Loading patients...</p>;

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-700 text-center sm:text-left">
          Pet Clinic Patients
        </h1>
        <Button
          variant="contained"
          className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
          onClick={() => setOpen(true)}
        >
          Add Patient
        </Button>
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
