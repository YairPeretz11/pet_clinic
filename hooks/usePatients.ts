import { IPatient } from "@/lib/interfaces";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function usePatients() {
  const queryClient = useQueryClient();

  // Get all patients
  const patientsQuery = useQuery({
    queryKey: ["patients"],
    queryFn: async () => {
      const res = await fetch("/api/patients");
      const data = await res.json();
      return data?.patients || [];
    },
  });

  // Add a new patient
  const addPatient = useMutation({
    mutationFn: async (newPatient: IPatient) =>
      fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPatient),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["patients"] }),
  });

  // Update an existing patient
  const updatePatient = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) =>
    fetch(`/api/patients?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
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
