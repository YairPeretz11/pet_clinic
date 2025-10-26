import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<any>();

export const getColumns = (setFilters: (filters: any) => void, debouncedNameChange: (value: string) => void)=> [
  columnHelper.accessor("name", {
    header: () => (
      <div className="flex items-center gap-2">
        <span className="font-medium text-muted-700 whitespace-nowrap">Name:</span>
        <input
          className="input w-[130px]"
          placeholder="Search..."
          onChange={(e) => {
            setFilters((prev: any) => ({ ...prev, name: e.target.value }));
            debouncedNameChange(e.target.value);
          }}
        />
      </div>
    ),
  }),

  columnHelper.accessor("phone", {
    header: "Phone",
    cell: (info) => (
      <a href={`tel:${info.getValue()}`} className="text-primary-600 hover:underline">
        {info.getValue()}
      </a>
    ),
  }),

  columnHelper.accessor("petName", {
    header: "Pet Name",
  }),

  columnHelper.accessor("petAge", {
    header: () => (
      <div className="flex items-center gap-2">
        <span className="font-medium text-muted-700 whitespace-nowrap">Age:</span>
        <input
          className="input w-[80px]"
          type="number"
          onChange={(e) => setFilters((prev: any) => ({ ...prev, petAge: e.target.value }))}
        />
      </div>
    ),
  }),

  columnHelper.accessor("petType", {
    header: () => (
      <div className="flex items-center gap-2">
        <span className="font-medium text-muted-700 whitespace-nowrap">Type:</span>
        <select
          className="select w-[120px]"
          defaultValue=""
          onChange={(e) => setFilters((prev: any) => ({ ...prev, petType: (e.target as HTMLSelectElement).value }))}
        >
          <option value="">All</option>
          <option value="Dog">🐶 Dog</option>
          <option value="Cat">🐱 Cat</option>
          <option value="Parrot">🦜 Parrot</option>
          <option value="Other">🐾 Other</option>
        </select>
      </div>
    ),
    cell: (info) => (
      <span className="badge bg-muted-50 dark:bg-muted-900">
        {info.getValue()}
      </span>
    ),
  }),
];
