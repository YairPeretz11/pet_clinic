import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

export default function PatientTable({ columns, data, onEdit }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const headerGroups = table?.getHeaderGroups?.();
  if (!headerGroups) return null;

  return (
    <div className="hidden sm:block overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300 text-sm md:text-base">
        <thead className="bg-gray-100">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                <th
                  key={header.id}
                  className="border px-2 sm:px-4 py-2 text-left"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50 transition">
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="border px-2 sm:px-4 py-2 text-left"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
              <td className="border px-2 sm:px-4 py-2 text-center">
                <IconButton
                  color="primary"
                  onClick={() => onEdit(row.original)}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
