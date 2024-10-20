import { DataTable } from "@/components/ui/data-table"
import { Input } from "@/components/ui/input"
import { REQUEST_LIMIT_PARAM } from "@/constants"
import { useBreadcrumb } from "@/hooks/useBreadcrumb"
import { cn } from "@/lib/utils"
import { Breadcrumbs } from "@/shared/molecules/Breadcrumbs"
import { type Option, SortOrder } from "@/types/common.type"
import { zodResolver } from "@hookform/resolvers/zod"
import { type PaginationState, type SortingState } from "@tanstack/react-table"
import debounce from "lodash.debounce"
import { Search } from "lucide-react"
import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react"
import { useForm } from "react-hook-form"
import { sbbLoanApplicationColumns } from "../../components/table/loan-application-columns"
import {
  FormFieldNames,
  LoanApplicationFilterSchema,
  type LoanApplicationFilterValues,
  useQueryListPaginateLoanApplication
} from "../../hooks/useQuery/useQueryListPaginateLoanApplication"
import { Filter } from "./filter"

export function SbbApplicationsList() {
  const crumbs = useBreadcrumb()

  // Filter state
  const filterForm = useForm<LoanApplicationFilterValues>({
    resolver: zodResolver(LoanApplicationFilterSchema),
    defaultValues: {
      status: [],
      createdOn: undefined,
      submittedOn: undefined
    }
  })

  const filter = (() => {
    const mapToLowerCase = (options?: Option[]) =>
      options?.map((item) => item.value.toLowerCase())

    return {
      statuses: mapToLowerCase(filterForm.watch(FormFieldNames.STATUS)),
      createdOn: filterForm.watch(FormFieldNames.CREATED_ON),
      submittedOn: filterForm.watch(FormFieldNames.SUBMITTED_ON)
    }
  })()

  // Paginate state
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: REQUEST_LIMIT_PARAM
  })

  // Sort state
  const [sorting, setSorting] = useState<SortingState>([])
  const getSort = useCallback(() => {
    if (!sorting.length) return undefined

    return `${sorting[0].id}:${
      sorting[0].desc ? SortOrder.DESC_NULLS_LAST : SortOrder.ASC_NULLS_FIRST
    }`
  }, [sorting])

  // Search state
  const [searchField, setSearchField] = useState("")
  const handleSearch = debounce(
    (inputChangeEvent: ChangeEvent<HTMLInputElement>) => {
      setSearchField(inputChangeEvent.target.value)
      resetTableToFirstPage()
    },
    400
  )
  const resetTableToFirstPage = useCallback(() => {
    setPagination((preState) => ({
      ...preState,
      pageIndex: 0
    }))
  }, [])

  const { data, isFetching } = useQueryListPaginateLoanApplication({
    limit: pagination.pageSize,
    offset: pagination.pageIndex * pagination.pageSize,
    search: searchField,
    status: filter.statuses,
    submittedOn: filter.submittedOn,
    createdOn: filter.createdOn,
    sort: getSort()
  })

  useEffect(() => {
    const watchFilter = filterForm.watch(() => {
      resetTableToFirstPage()
    })

    return () => watchFilter.unsubscribe()
  }, [filterForm, resetTableToFirstPage])

  const renderHeaderFilter = useMemo(
    () =>
      function () {
        return (
          <div className="flex items-center flex-wrap w-full gap-4 bg-active p-5 rounded-xl">
            <div className="flex-[2] min-w-0 overflow-x-auto py-1">
              <Filter filterForm={filterForm} />
            </div>

            <div className="justify-items-end flex flex-1 gap-3 py-1">
              <Input
                name="search"
                placeholder="Search"
                prefixIcon={<Search className="w-4 h-4 text-text-tertiary" />}
                wrapperClassName="flex-1"
                onChange={handleSearch}
              />
            </div>
          </div>
        )
      },
    [filterForm, handleSearch]
  )

  return (
    <div className={cn("container mx-auto px-xl py-xl", "md:px-2xl md:py-2xl")}>
      <div className="flex flex-wrap justify-between gap-4">
        <div className="flex flex-col gap-1">
          <Breadcrumbs breads={crumbs} className="px-0 mb-3" />
          <h1 className="text-2xl font-semibold">Account Applications</h1>
        </div>
      </div>

      <DataTable
        manualSorting
        columns={sbbLoanApplicationColumns}
        data={data?.data ?? []}
        headerFilter={renderHeaderFilter}
        isLoading={isFetching}
        pagination={pagination}
        setPagination={setPagination}
        setSorting={setSorting}
        sorting={sorting}
        tableContainerClassName="flex flex-col flex-1 h-[85vh]"
        total={data?.total ?? 0}
      />
    </div>
  )
}
