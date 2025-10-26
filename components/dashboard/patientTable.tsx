import { IPatient } from "@/lib/interfaces";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";

interface PatientTableProps {
  columns: any[];
  data: IPatient[];
  onEdit: (patient: any) => void;
}

export default function PatientTable({ columns, data, onEdit }: PatientTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const headerGroups = table?.getHeaderGroups?.();
  if (!headerGroups) return null;

  return (
    <div className="hidden sm:block">
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm md:text-base">
            <thead className="bg-muted-100 dark:bg-muted-800/60 text-muted-700 dark:text-muted-200">
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-3 sm:px-4 py-3 text-left font-semibold border-b border-muted-200 dark:border-muted-700"
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                  <th className="px-3 sm:px-4 py-3 text-center font-semibold border-b border-muted-200 dark:border-muted-700">
                    Actions
                  </th>
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row, idx) => (
                <tr
                  key={row.id}
                  className={idx % 2 === 0 ? "bg-white dark:bg-muted-900/20" : "bg-muted-50 dark:bg-muted-900/10"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-3 sm:px-4 py-3 text-left border-b border-muted-100 dark:border-muted-800">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                  <td className="px-3 sm:px-4 py-3 text-center border-b border-muted-100 dark:border-muted-800">
                    <button
                      type="button"
                      className="btn btn-outline !px-2"
                      onClick={() => onEdit(row.original)}
                      aria-label="Edit"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                        <path d="M5 21h14v-2H5v2Zm13.71-13.29-2.42-2.42a1 1 0 0 0-1.41 0L5 13.17V16h2.83l9.88-9.88a1 1 0 0 0 0-1.41ZM7.92 14H7v-.92l7.46-7.46.92.92L7.92 14Z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
