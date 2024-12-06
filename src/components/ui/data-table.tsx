import type { Table as TableType } from "@tanstack/react-table"
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type OnChangeFn,
  type PaginationState,
  type Row,
  type SortingState,
  useReactTable
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
import { DataTableViewOptions } from "@/shared/molecules/table/column-visible"
import { DataTablePagination } from "@/shared/molecules/table/table-pagination"
import { type ReactNode, useState } from "react"

interface DataTableProps<TData, TValue> {
  readonly columns: ColumnDef<TData, TValue>[]
  readonly data: TData[]
  readonly isFilterView?: boolean
  readonly handleClickDetail?: (row: Row<TData>) => void
  readonly pagination?: PaginationState
  readonly sorting?: SortingState
  readonly setPagination?: OnChangeFn<PaginationState>
  readonly setSorting?: OnChangeFn<SortingState>
  readonly total: number
  readonly isLoading?: boolean
  readonly manualSorting?: boolean
  readonly headerFilter?: (table: TableType<TData>) => ReactNode
  readonly tableContainerClassName?: string
  readonly tableWrapperClassName?: string
  readonly tableCellClassName?: string
  readonly tableHeaderClassName?: string
  readonly tableHeadClassName?: string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isFilterView,
  handleClickDetail,
  pagination,
  setPagination,
  total,
  isLoading,
  tableContainerClassName,
  tableWrapperClassName,
  setSorting,
  sorting,
  manualSorting,
  headerFilter,
  tableCellClassName,
  tableHeaderClassName,
  tableHeadClassName
}: DataTableProps<TData, TValue>) {
  const [columnOrder, setColumnOrder] = useState(columns.map((c) => c.id!))

  const table = useReactTable({
    data,
    columns,
    rowCount: total,
    state: { pagination, sorting, columnOrder },
    onPaginationChange: setPagination,
    onColumnOrderChange: setColumnOrder,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: !!pagination,
    getSortedRowModel: manualSorting ? undefined : getSortedRowModel(),
    enableSortingRemoval: true,
    manualSorting
  })

  return (
    <div className={tableContainerClassName}>
      <div className="flex items-center py-3">
        {headerFilter
          ? headerFilter(table)
          : isFilterView && <DataTableViewOptions table={table} />}
      </div>

      <div
        className={cn(
          "relative max-h-full overflow-auto rounded-md border",
          tableWrapperClassName
        )}
      >
        <Table className="text-sm" isLoading={isLoading}>
          <TableHeader
            className={cn(
              "sticky top-0 z-10 bg-gray-100",
              tableHeaderClassName
            )}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        "whitespace-nowrap text-sm font-medium text-text-foreground",
                        tableHeadClassName
                      )}
                    >
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={cn(!!handleClickDetail && "cursor-pointer")}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => handleClickDetail && handleClickDetail(row)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className={tableCellClassName}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  className="h-24 text-center text-base"
                  colSpan={columns.length}
                >
                  {!isLoading && "No results."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {!!pagination && !!data.length && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <DataTablePagination table={table} />
        </div>
      )}
    </div>
  )
}
