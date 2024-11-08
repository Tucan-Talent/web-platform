import { REQUEST_LIMIT_PARAM } from "@/constants"
import { type PaginationState } from "@tanstack/react-table"
import { useSearchOrderLoanApplications } from "@/modules/loanready/hooks/applications/order-list.ts"
import { DataTable } from "@/components/ui/data-table.tsx"
import { useState } from "react"
import { orderApplicationColumn } from "@/modules/loanready/constants/order-application-column.tsx"
import { useNavigate } from "react-router-dom"
import { loanReadyApplicationHandleClickDetail } from "@/modules/loanready/utils"
import { EmptyApplications } from "@/modules/loan-application/components/atoms/EmptyApplications.tsx"
import { isEnableLoanReadyV2 } from "@/utils/feature-flag.utils.ts"
import LoanApplicationsPage from "@/modules/loanready/pages/LoanApplications.tsx"
import { StartApplicationButton } from "@/modules/loanready/components/molecules/StartApplicationButton.tsx"

export function Component() {
  if (isEnableLoanReadyV2()) return <LoanReadyApplications />

  return <LoanApplicationsPage />
}

export default function LoanReadyApplications() {
  const navigate = useNavigate()

  // Paginate state
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: REQUEST_LIMIT_PARAM
  })

  // Query list applications
  const { data, isFetching } = useSearchOrderLoanApplications({
    request: {
      limit: pagination.pageSize,
      offset: pagination.pageIndex * pagination.pageSize
    }
  })

  const clickDetailHandler = loanReadyApplicationHandleClickDetail(navigate)
  const loanApplicationColumns = orderApplicationColumn(
    (row) => () => clickDetailHandler(row)
  )

  return (
    <div className="container mx-auto px-2xl py-2xl md:px-4xl md:py-4xl">
      <h1 className="text-3.5xl font-semibold">Account Applications</h1>
      <p className="mt-1 mb-2">
        Keep track of your account applications and their statuses
      </p>
      <div className="flex justify-end">
        <StartApplicationButton
          btnText="Start new application"
          className="bg-lime-400 text-black hover:bg-lime-300 font-bold"
        />
      </div>

      {!isFetching && !data?.data.data?.length ? (
        <EmptyApplications hideBtnStart />
      ) : (
        <DataTable
          columns={loanApplicationColumns}
          data={data?.data.data ?? []}
          isLoading={isFetching}
          pagination={pagination}
          setPagination={setPagination}
          tableCellClassName="text-[#667085]"
          tableContainerClassName="flex flex-col flex-1 h-[85vh] rounded-full"
          tableHeadClassName="text-xs text-[#667085]"
          tableHeaderClassName="bg-[#f9fafb] !text-xs"
          tableWrapperClassName="rounded-lg"
          total={data?.data.total ?? 0}
        />
      )}
    </div>
  )
}

Component.displayName = "ApplicantOrderLoanApplications"
