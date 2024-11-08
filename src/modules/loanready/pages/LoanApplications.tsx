import { Badge } from "@/components/ui/badge"
import { InfiniteDataTable } from "@/components/ui/infinite-data-table"
import { Progress } from "@/components/ui/progress"
import { APP_PATH, REQUEST_LIMIT_PARAM } from "@/constants"
import { cn } from "@/lib/utils"
import { getBadgeVariantByStatus } from "@/modules/loan-application-management/services"
import { EmptyApplications } from "@/modules/loan-application/components/atoms/EmptyApplications"
import { DataTableColumnHeader } from "@/shared/molecules/table/column-header"
import {
  EDITABLE_STATUSES,
  LoanApplicationStatus,
  type UserMicroLoanApplication
} from "@/types/loan-application.type"
import {
  convertToReadableDate,
  convertToReadableDateAgo,
  snakeCaseToText,
  toCurrency
} from "@/utils"
import { isLaunchKC, isLoanReady, isSbb } from "@/utils/domain.utils"
import { formsConfigurationEnabled } from "@/utils/feature-flag.utils"
import { type AccessorKeyColumnDef, type Row } from "@tanstack/react-table"
import { ChevronRightIcon } from "lucide-react"
import { type NavigateFunction, useNavigate } from "react-router-dom"
import { useQueryGetUserLoanApplications } from "../../loan-application/hooks/useQuery/useQueryUserLoanApplications"
import { StartApplicationButton } from "@/modules/loanready/components/molecules/StartApplicationButton"
import { get } from "lodash"

export function Component() {
  const navigate = useNavigate()
  const { data, fetchNextPage, isFetching } = useQueryGetUserLoanApplications({
    limit: REQUEST_LIMIT_PARAM,
    offset: 0
  })

  const clickDetailHandler = ApplicantLoanReadyApplications(navigate)
  const loanApplicationColumns = getLoanApplicationColumns(
    (row: Row<UserMicroLoanApplication>) => () => clickDetailHandler(row)
  )

  const getFilteredColumns =
    (): AccessorKeyColumnDef<UserMicroLoanApplication>[] => {
      if (!formsConfigurationEnabled()) {
        return loanApplicationColumns.filter(
          (column) =>
            column.accessorKey !== "loanAmount" &&
            column.accessorKey !== "progress"
        )
      } else if (isLaunchKC()) {
        return loanApplicationColumns.filter(
          (column) => column.accessorKey !== "loanAmount"
        )
      } else {
        return loanApplicationColumns
      }
    }

  return (
    <div
      className={cn("container mx-auto px-2xl py-2xl", "md:px-4xl md:py-4xl")}
    >
      <h1 className="text-3xl font-semibold">Account Applications</h1>
      <p className="text-text-tertiary mt-1">
        Keep track of your applications and their statuses
      </p>

      <div className="flex justify-end">
        <StartApplicationButton
          btnText="Start new application"
          className="bg-lime-400 text-black hover:bg-lime-300 font-bold"
        />
      </div>

      {!isFetching && !get(data, "pages[0].data.length", 0) ? (
        <EmptyApplications />
      ) : (
        <InfiniteDataTable
          columns={getFilteredColumns()}
          data={data}
          fetchNextPage={fetchNextPage}
          isFetching={isFetching}
        />
      )}
    </div>
  )
}
Component.displayName = "ApplicantLoanApplications"

interface NavigationConfig {
  path: string
  state?: object
}

export const ApplicantLoanReadyApplications =
  (navigate: NavigateFunction) => (detail: Row<UserMicroLoanApplication>) => {
    const { id, loanProgram } = detail.original
    const { id: loanProgramId } = loanProgram
    const navigationConfigs: Record<string, NavigationConfig> = {
      editable: {
        path: APP_PATH.LOAN_APPLICATION.APPLICATIONS.editing(id, loanProgramId),
        state: { backUrl: APP_PATH.LOAN_APPLICATION.APPLICATIONS.index }
      },
      loanReady: {
        path: APP_PATH.LOAN_APPLICATION.APPLICATIONS.financialApplicationDetails(
          id,
          loanProgramId
        )
      },
      default: {
        path: APP_PATH.LOAN_APPLICATION.APPLICATIONS.details(id, loanProgramId)
      }
    }

    let configKey = "default"

    if (EDITABLE_STATUSES.includes(detail.original.status)) {
      configKey = "editable"
    } else if (isLoanReady()) {
      configKey = "loanReady"
    }
    const { path, state } = navigationConfigs[configKey]

    navigate(path, {
      state: {
        ...state,
        loanProgramDetails: loanProgram
      }
    })
  }

export const getLoanApplicationColumns = (
  handleClickDetail: (row: Row<UserMicroLoanApplication>) => () => void
): AccessorKeyColumnDef<UserMicroLoanApplication>[] => [
  {
    id: "applicant",
    accessorKey: "loanProgram",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Loan Program" />
    ),
    cell: ({ row }) => {
      const application = row.original

      return (
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground mt-0.5 truncate">
            {application.loanProgram.name}
          </p>
        </div>
      )
    },
    size: 300
  },
  {
    accessorKey: "loanAmount",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="text-right w-full"
        column={column}
        title="Amount requested"
      />
    ),
    size: 150,
    cell: ({ row }) => {
      const application = row.original

      return (
        <div className="min-w-0">
          <p className="truncate text-right">
            {toCurrency(application.loanAmount)}
          </p>
        </div>
      )
    }
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="text-right w-full"
        column={column}
        title="Started On"
      />
    ),
    enableSorting: false,
    size: 150,
    cell: ({ row }) => {
      const application = row.original

      return (
        <div className="min-w-0">
          <p className="truncate capitalize text-right">
            {convertToReadableDate(application.createdAt)}
          </p>
        </div>
      )
    }
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="text-right w-full"
        column={column}
        title="Activity"
      />
    ),
    size: 150,
    enableSorting: false,
    cell: ({ row }) => {
      const application = row.original

      return (
        <div className="min-w-0">
          <p className="truncate text-right">
            {convertToReadableDateAgo(application.updatedAt)}
          </p>
        </div>
      )
    }
  },
  {
    accessorKey: "status",
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader
        className="text-right"
        column={column}
        title="Status"
      />
    ),
    size: 190,
    cell: ({ row }) => {
      const application = row.original
      const sbbStatus =
        application?.status?.toUpperCase() !== LoanApplicationStatus.DRAFT
          ? LoanApplicationStatus.SUBMITTED
          : LoanApplicationStatus.DRAFT
      const status = isSbb() ? sbbStatus : application?.status

      return (
        <div className="font-medium">
          <Badge
            isDot
            className="capitalize"
            variant="soft"
            variantColor={getBadgeVariantByStatus(status)}
          >
            {snakeCaseToText(isSbb() ? sbbStatus.toLowerCase() : status)}
          </Badge>
        </div>
      )
    }
  },
  {
    accessorKey: "progress",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="text-right"
        column={column}
        title="Progress"
      />
    ),
    size: 150,
    cell: ({ row }) => {
      const application = row.original

      return (
        <div className="relative">
          <Progress
            className="flex items-center justify-end"
            value={Math.round(100 * application.latestProgress)}
          />
          <span className="absolute top-1/2 transform -translate-y-1/2 pl-2 right-[-40px]">
            {Math.round(100 * application.latestProgress)}%
          </span>
        </div>
      )
    }
  },
  {
    id: "action",
    accessorKey: "detail",
    header: () => <p />,
    size: 150,
    cell: ({ row }) => {
      return (
        <div
          className="font-medium flex gap-2 items-center cursor-pointer justify-end"
          onClick={handleClickDetail(row)}
        >
          {EDITABLE_STATUSES.includes(row.original.status) ? (
            <p>Continue</p>
          ) : (
            <p>Review</p>
          )}
          <ChevronRightIcon className="h-4 w-4" />
        </div>
      )
    }
  }
]
