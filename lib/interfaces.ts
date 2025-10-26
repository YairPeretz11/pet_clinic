export interface IPatient {
  name: string;
  phone: string;
  petName: string;
  petType: string;
  // Source of truth saved in DB
  birthDate: string | Date;
  // Derived on the server/client for display/filtering
  petAge?: number;
}
