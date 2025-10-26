import { TextField, Select, MenuItem } from "@mui/material";

interface FiltersType {
  name: string;
  petAge: string;
  petType: string;
}

export default function PatientFilters({ 
  filters, 
  setFilters, 
  debouncedNameChange 
}: { 
  filters: FiltersType;
  setFilters: (value: React.SetStateAction<FiltersType>) => void;
  debouncedNameChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3 mb-4">
      <TextField
        label="Search by Name"
        size="small"
        value={filters.name}
        onChange={(e) => {
          setFilters((prev) => ({ ...prev, name: e.target.value }));
          debouncedNameChange(e.target.value);
        }}
      />
      <TextField
        label="Pet Age"
        size="small"
        type="number"
        value={filters.petAge}
        onChange={(e) =>
          setFilters((prev) => ({ ...prev, petAge: e.target.value }))
        }
        className="w-[100px]"
      />
      <Select
        size="small"
        displayEmpty
        value={filters.petType}
        onChange={(e) =>
          setFilters((prev) => ({ ...prev, petType: e.target.value }))
        }
        className="w-[150px]"
      >
        <MenuItem value="">All Types</MenuItem>
        <MenuItem value="Dog">Dog</MenuItem>
        <MenuItem value="Cat">Cat</MenuItem>
        <MenuItem value="Parrot">Parrot</MenuItem>
        <MenuItem value="Other">Other</MenuItem>
      </Select>
    </div>
  );
}
