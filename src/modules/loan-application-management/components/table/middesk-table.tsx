import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  Row
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"

import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  isFilterView?: boolean
  handleClickDetail?: (row: Row<TData>) => void
  tableClassName?: string
  cellClassName?: string
  isLoading?: boolean
  noResultText?: string
}

export function MiddeskTable<TData, TValue>({
  columns,
  data,
  handleClickDetail,
  tableClassName,
  cellClassName,
  isLoading,
  noResultText = "No results."
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  })

  return (
    <div>
      <Table className={tableClassName}>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="text-xs">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length
            ? table.getRowModel().rows.map((row) => (
                <TableRow
                  className={cn(!!handleClickDetail && "cursor-pointer")}
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => handleClickDetail && handleClickDetail(row)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn("text-base", cellClassName)}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : !isLoading && (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-base text-gray-500"
                  >
                    {noResultText}
                  </TableCell>
                </TableRow>
              )}
        </TableBody>
      </Table>

      {isLoading && (
        <div className="flex items-center flex-col justify-center w-full mt-4">
          <Loader2
            className={cn(
              "m-2 h-8 w-8 transition-all ease-out animate-spin text-primary"
            )}
          />
          Loading...
        </div>
      )}
    </div>
  )
}
