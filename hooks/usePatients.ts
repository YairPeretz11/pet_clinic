import { IPatient } from "@/lib/interfaces";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const calculateAge = (birthDate?: string | Date) => {
  if (!birthDate) return undefined;
  const bd = typeof birthDate === "string" ? new Date(birthDate) : birthDate;
  if (isNaN(bd.getTime())) return undefined;

  const now = new Date();
  let years = now.getUTCFullYear() - bd.getUTCFullYear();
  const monthDiff = now.getUTCMonth() - bd.getUTCMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getUTCDate() < bd.getUTCDate())) {
    years--;
  }
  return Math.max(0, years);
};

const normalizePatient = (patient: IPatient): IPatient => ({
  ...patient,
  petAge: calculateAge(patient.birthDate),
});

const stripDerivedFields = (payload: Partial<IPatient>) => {
  const { petAge: _unused, ...rest } = payload;
  return rest;
};

export function usePatients() {
  const queryClient = useQueryClient();

  // Get all patients
  const patientsQuery = useQuery({
    queryKey: ["patients"],
    queryFn: async () => {
      const res = await fetch("/api/patients");
      const data = await res.json();
      const patients: IPatient[] = data?.patients || [];
      return patients.map(normalizePatient);
    },
  });

  // Add a new patient
  const addPatient = useMutation({
    mutationFn: async (newPatient: IPatient) =>
      fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stripDerivedFields(newPatient)),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["patients"] }),
  });

  // Update an existing patient
  const updatePatient = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<IPatient> }) =>
      fetch(`/api/patients?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stripDerivedFields(data)),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["patients"] }),
  });

  // Delete a patient
  const deletePatient = useMutation({
    mutationFn: async (id: string) =>
      fetch(`/api/patients?id=${id}`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["patients"] }),
  });

  return { ...patientsQuery, addPatient, updatePatient, deletePatient };
}
