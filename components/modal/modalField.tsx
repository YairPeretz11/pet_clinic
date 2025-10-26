import { TextField, Select, MenuItem } from "@mui/material";

interface ModalFieldProps {
  keyName: string;
  value?: string | number;
  onChange: (key: string, value: string | number) => void;
}

export default function ModalField({ keyName, value, onChange }: ModalFieldProps) {
  switch (keyName) {
    case "petType":
      return (
        <Select
          key={keyName}
          value={value || ""}
          fullWidth
          displayEmpty
          onChange={(e) => onChange(keyName, e.target.value)}
          className="my-2"
        >
          <MenuItem value="" disabled>
            Select Pet Type
          </MenuItem>
          <MenuItem value="Dog">Dog 🐶</MenuItem>
          <MenuItem value="Cat">Cat 🐱</MenuItem>
          <MenuItem value="Parrot">Parrot 🐦</MenuItem>
          <MenuItem value="Other">Other 🐾</MenuItem>
        </Select>
      );

    case "petAge":
      return (
        <TextField
          key={keyName}
          label="Pet Birth Date"
          type="date"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          onChange={(e) => {
            const birthDate = new Date(e.target.value);
            const diffMs = Date.now() - birthDate.getTime();
            const ageDate = new Date(diffMs);
            const years = Math.abs(ageDate.getUTCFullYear() - 1970);
            onChange("petAge", years);
          }}
        />
      );

    default:
      return (
        <TextField
          key={keyName}
          label={keyName}
          fullWidth
          margin="normal"
          autoFocus={keyName === "name"}
          value={value || ""}
          onChange={(e) => onChange(keyName, e.target.value)}
        />
      );
  }
}
