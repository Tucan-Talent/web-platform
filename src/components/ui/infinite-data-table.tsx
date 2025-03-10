import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  Row
} from "@tanstack/react-table"

import {
  InfinityTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"

import { DataTableViewOptions } from "@/shared/molecules/table/column-visible"
import { cn } from "@/lib/utils"

import { useVirtualizer } from "@tanstack/react-virtual"
import { REQUEST_LIMIT_PARAM } from "@/constants"
import {
  InfiniteData,
  InfiniteQueryObserverBaseResult
} from "@tanstack/react-query"
import { ListResponse } from "@/types/common.type"
import { Loader2 } from "lucide-react"

interface DataTableProps<TData extends ListResponse, TValue> {
  columns: ColumnDef<TData["data"][number], TValue>[]
  isFilterView?: boolean
  handleClickDetail?: (row: Row<TData["data"][number]>) => void
  data: InfiniteData<TData, unknown> | undefined
  isFetching: boolean
  fetchNextPage: InfiniteQueryObserverBaseResult["fetchNextPage"]
  className?: string
}

export function InfiniteDataTable<TData extends ListResponse, TValue>({
  columns,
  isFilterView,
  handleClickDetail,
  data,
  isFetching,
  fetchNextPage,
  className
}: DataTableProps<TData, TValue>) {
  const tableContainerRef = React.useRef<HTMLDivElement>(null)

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  //flatten the array of arrays from the useInfiniteQuery hook
  const flatData = React.useMemo(() => {
    return data?.pages?.flatMap((page) => page.data) ?? []
  }, [data?.pages])

  const isHaveMore = React.useMemo(() => {
    return (
      // Query the last data paginate and get the number of data
      data?.pages?.[(data?.pages?.length ?? 1) - 1]?.data?.length ===
      REQUEST_LIMIT_PARAM
    )
  }, [data?.pages])

  const table = useReactTable({
    data: flatData as [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection
    }
  })

  const { rows } = table.getRowModel()

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 33, //estimate row height for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef.current,
    //measure dynamic row height, except in firefox because it measures table border height incorrectly
    measureElement:
      typeof window !== "undefined" &&
      navigator.userAgent.indexOf("Firefox") === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 1
  })

  const fetchMoreOnBottomReached = React.useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement
        //once the user has scrolled within 200px of the bottom of the table, fetch more data if we can
        if (
          scrollHeight - scrollTop - clientHeight < 200 &&
          !isFetching &&
          isHaveMore
        ) {
          fetchNextPage()
        }
      }
    },
    [fetchNextPage, isFetching, isHaveMore]
  )

  //a check on mount and after a fetch to see if the table is already scrolled to the bottom and immediately needs to fetch more data
  React.useEffect(() => {
    fetchMoreOnBottomReached(tableContainerRef.current)
  }, [fetchMoreOnBottomReached])

  return (
    <div>
      <div className="flex items-center py-3">
        {isFilterView && <DataTableViewOptions table={table} />}
      </div>
      <div
        className={cn("rounded-md border", className)}
        onScroll={(e) => fetchMoreOnBottomReached(e.target as HTMLDivElement)}
        ref={tableContainerRef}
        style={{
          overflow: "auto", //our scrollable table container
          position: "relative", //needed for sticky header
          height: `${Math.max(
            Math.min((flatData.length + 1) * 100, 600),
            150
          )}px`
        }}
      >
        <InfinityTable className="grid">
          <TableHeader className="bg-gray-100 grid sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="grid grid-flow-col" key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      className="flex items-center"
                      key={header.id}
                      style={{ width: header.getSize() }}
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
          <TableBody
            //needed for absolute positioning of rows
            className="grid relative"
            style={{
              height: `${rowVirtualizer.getTotalSize()}px` //tells scrollbar how big the table is
            }}
          >
            {rowVirtualizer.getVirtualItems().length ? (
              rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const row = rows[virtualRow.index]

                return (
                  <TableRow
                    data-index={virtualRow.index} //needed for dynamic row height measurement
                    ref={(node) => rowVirtualizer.measureElement(node)} //measure dynamic row height
                    className={cn(
                      "grid grid-flow-col absolute w-full items-center",
                      !!handleClickDetail && "cursor-pointer"
                    )}
                    style={{
                      transform: `translateY(${virtualRow.start}px)` //this should always be a `style` as it changes on scroll
                    }}
                    key={row.id}
                    onClick={() => handleClickDetail?.(row)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        style={{ width: cell.column.getSize() }}
                        className={cn({
                          "mr-0 ml-auto": cell.column.id === "action"
                        })}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-base"
                >
                  {!isFetching && "No results."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </InfinityTable>
        {isFetching && (
          <div className="flex flex-col m-4 items-center mt-3">
            <Loader2
              className={cn(
                "m-2 h-8 w-8 transition-all ease-out animate-spin text-primary"
              )}
            />
            Loading...
          </div>
        )}
      </div>
    </div>
  )
}
