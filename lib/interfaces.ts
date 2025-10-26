export interface IPatient {
  name: string;
  phone: string;
  petName: string;
  petType: string;
  birthDate: string | Date;
  // Derived field
  petAge?: number;
}
