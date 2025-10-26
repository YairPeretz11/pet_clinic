import { createColumnHelper } from "@tanstack/react-table";
import { TextField, Select, MenuItem } from "@mui/material";

const columnHelper = createColumnHelper<any>();

export const getColumns = (filters, setFilters, debouncedNameChange) => [
  columnHelper.accessor("name", {
    header: () => (
      <div className="flex flex-row items-center gap-2">
        <span className="font-medium text-gray-700 whitespace-nowrap">Name:</span>
        <TextField
          size="small"
          variant="outlined"
          placeholder="Search..."
          defaultValue={filters.name}
          onChange={(e) => {
            setFilters((prev) => ({ ...prev, name: e.target.value }));
            debouncedNameChange(e.target.value);
          }}
          inputProps={{
            style: {
              fontSize: 13,
              padding: "4px 8px",
            },
          }}
          className="w-[110px] bg-white rounded-md"
        />
      </div>
    ),
  }),

  columnHelper.accessor("phone", {
    header: "Phone",
  }),

  columnHelper.accessor("petName", {
    header: "Pet Name",
  }),

  columnHelper.accessor("petAge", {
    header: () => (
      <div className="flex flex-row items-center gap-2">
        <span className="font-medium text-gray-700 whitespace-nowrap">Age:</span>
        <TextField
          size="small"
          type="number"
          variant="outlined"
          defaultValue={filters.petAge}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, petAge: e.target.value }))
          }
          inputProps={{
            style: {
              fontSize: 13,
              padding: "4px 8px",
            },
          }}
          className="w-[80px] bg-white rounded-md"
        />
      </div>
    ),
  }),

  columnHelper.accessor("petType", {
    header: () => (
      <div className="flex flex-row items-center gap-2">
        <span className="font-medium text-gray-700 whitespace-nowrap">Type:</span>
        <Select
          size="small"
          displayEmpty
          defaultValue={filters.petType}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, petType: e.target.value }))
          }
          className="w-[100px] bg-white rounded-md"
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Dog">Dog 🐶</MenuItem>
          <MenuItem value="Cat">Cat 🐱</MenuItem>
          <MenuItem value="Parrot">Parrot 🐦</MenuItem>
          <MenuItem value="Other">Other 🐾</MenuItem>
        </Select>
      </div>
    ),
  }),
];
