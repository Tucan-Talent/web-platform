import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"
import { LoanApplication } from "@/types/loan-application.type"
import { snakeCaseToText, toCurrency } from "@/utils"
import { ColumnDef } from "@tanstack/react-table"
import { getBadgeVariantByStatus } from "../../services"

import { ClipboardCopy } from "@/components/ui/clipboard-copy"
import { FORMAT_DATE_M_D_Y } from "@/constants/date.constants"
import { formatDate } from "@/utils/date.utils"
import { renderFilterableHeader } from "@/utils/table.utils"
import { format } from "date-fns"
import { ButtonReviewLoanApplication } from "../atoms/ButtonReviewLoanApplication"

export const loanApplicationColumns: ColumnDef<LoanApplication>[] = [
  {
    id: "select",
    header: "ID",
    cell: ({ row }) => {
      const application = row.original

      return (
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger className="font-medium cursor-default">
              {application.applicationIdNumber}
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className="inline-block"
              asChild={true}
            >
              <ClipboardCopy
                content={application.applicationIdNumber.toString()}
                value={application.applicationIdNumber}
                variant={"blue"}
              />
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
    enableSorting: false,
    enableHiding: false,
    size: 80
  },
  {
    id: "applicant",
    accessorKey: "businessName",
    header: "Business name",
    cell: ({ row }) => {
      const application = row.original

      return (
        <div className="min-w-0">
          <p className="truncate">{application.businessName ?? "N/A"}</p>
        </div>
      )
    },
    size: 250
  },
  {
    id: "programName",
    accessorKey: "programName",
    header: "Loan program",
    size: 200,
    cell: ({ row }) => {
      const application = row.original

      return (
        <div className="min-w-0">
          <p className="truncate capitalize">{application.programName}</p>
        </div>
      )
    }
  },
  {
    id: "loanAmount",
    accessorKey: "loanAmount",
    header: () => <p className="text-right">Amount requested</p>,
    size: 100,
    cell: ({ row }) => {
      const application = row.original
      const amount = toCurrency(application.requestedLoanAmount, 0)

      return <div className="text-right">{amount}</div>
    }
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: () => <p>Created on</p>,
    size: 150,
    cell: ({ row }) => {
      const application = row.original

      return (
        <div>
          {application.createdAt
            ? format(application.createdAt, FORMAT_DATE_M_D_Y)
            : "N/A"}
        </div>
      )
    }
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Status",
    size: 150,
    cell: ({ row }) => {
      const application = row.original

      return (
        <div>
          <Badge
            isDot
            variant="soft"
            variantColor={getBadgeVariantByStatus(application.status)}
            className="capitalize"
          >
            {snakeCaseToText(application.status)}
          </Badge>
        </div>
      )
    }
  },
  {
    id: "action",
    cell: ({ row }) => {
      return (
        <ButtonReviewLoanApplication
          loanApplicationStatus={row.original.status}
          loanApplicationId={row.original.id}
          loanProgramType={row.original.programType}
        />
      )
    }
  }
]

export const sbbLoanApplicationColumns: ColumnDef<LoanApplication>[] = [
  {
    id: "applicationIdNumber",
    header: renderFilterableHeader({ title: "ID" }),
    cell: ({ row }) => {
      const application = row.original

      return (
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger className="font-medium cursor-default w-full">
              <p className="text-center">{application.applicationIdNumber}</p>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className="inline-block"
              asChild={true}
            >
              <ClipboardCopy
                content={application.applicationIdNumber.toString()}
                value={application.applicationIdNumber}
                variant={"blue"}
              />
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
    enableSorting: false,
    enableHiding: false,
    size: 80
  },
  {
    id: "businessName",
    header: renderFilterableHeader({ title: "Business name" }),
    cell: ({ row }) => {
      const application = row.original

      return (
        <div className="min-w-0">
          <p className="truncate text-center">
            {application.businessName ?? "N/A"}
          </p>
        </div>
      )
    },
    size: 250
  },
  {
    id: "email",
    header: renderFilterableHeader({
      title: "Email",
      disabled: true
    }),
    size: 200,
    cell: ({ row }) => {
      const application = row.original

      return (
        <div className="min-w-0 text-center">
          <p className="truncate">{application.applicant.email}</p>
        </div>
      )
    }
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: renderFilterableHeader({ title: "Created on" }),
    size: 150,
    cell: ({ row }) => {
      const application = row.original

      return (
        <div className="text-center">
          {application.createdAt
            ? format(application.createdAt, FORMAT_DATE_M_D_Y)
            : "N/A"}
        </div>
      )
    }
  },
  {
    id: "submittedAt",
    accessorKey: "submittedAt",
    header: renderFilterableHeader({ title: "Submitted on" }),
    size: 150,
    cell: ({ row }) => {
      const application = row.original

      return (
        <div className="text-center">
          {application.submittedAt
            ? formatDate(application.submittedAt, FORMAT_DATE_M_D_Y)
            : "N/A"}
        </div>
      )
    }
  },
  {
    id: "status",
    accessorKey: "status",
    header: renderFilterableHeader({ title: "Status" }),
    size: 150,
    cell: ({ row }) => {
      const application = row.original

      return (
        <div className="text-center">
          <Badge
            isDot
            variant="soft"
            variantColor={getBadgeVariantByStatus(application.status)}
            className="capitalize"
          >
            {snakeCaseToText(application.status)}
          </Badge>
        </div>
      )
    }
  },
  {
    id: "action",
    cell: ({ row }) => {
      return (
        <ButtonReviewLoanApplication
          loanApplicationStatus={row.original.status}
          loanApplicationId={row.original.id}
          loanProgramType={row.original.programType}
        />
      )
    }
  }
]
