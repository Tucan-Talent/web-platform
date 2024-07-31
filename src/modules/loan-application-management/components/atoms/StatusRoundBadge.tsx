import * as React from "react"

import { cn } from "@/lib/utils"
import { LoanApplicationStatus } from "@/types/loan-application.type"
import { IconProps, Icons } from "../../../../components/ui/icons"

interface StatusRoundBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  round: LoanApplicationStatus
  isShowIcon?: boolean
  className?: string
}

export const getBadgeVariantByRound = (round: LoanApplicationStatus) => {
  switch (round.toUpperCase()) {
    case LoanApplicationStatus.PENDING_SUBMISSION:
      return "bg-gray-300"
    case LoanApplicationStatus.READY_FOR_REVIEW:
    case LoanApplicationStatus.IN_REVIEW:
      return "bg-yellow-400 bg-opacity-40"
    case LoanApplicationStatus.ELIMINATED_AFTER_INITIAL_REVIEW:
    case LoanApplicationStatus.ELIMINATED_AFTER_ROUND_1:
    case LoanApplicationStatus.ELIMINATED_AFTER_ROUND_2:
    case LoanApplicationStatus.ELIMINATED_AFTER_ROUND_3:
      return "bg-red-200"
    case LoanApplicationStatus.ROUND_1:
      return "bg-sky-200 bg-opacity-70"
    case LoanApplicationStatus.ROUND_2:
      return "bg-sky-200"
    case LoanApplicationStatus.ROUND_3:
      return "bg-sky-300"
    case LoanApplicationStatus.APPROVED:
      return "bg-green-200"
    case LoanApplicationStatus.DENIED:
      return "bg-red-200"
    default:
      return undefined
  }
}

export const getBadgeIconByRound = (
  round: LoanApplicationStatus
): ((props: IconProps) => JSX.Element) | undefined => {
  switch (round.toUpperCase()) {
    case LoanApplicationStatus.PENDING_SUBMISSION:
      return Icons.clock
    case LoanApplicationStatus.READY_FOR_REVIEW:
    case LoanApplicationStatus.IN_REVIEW:
    case LoanApplicationStatus.ELIMINATED_AFTER_INITIAL_REVIEW:
      return Icons.thumpsUp
    case LoanApplicationStatus.ROUND_1:
    case LoanApplicationStatus.ELIMINATED_AFTER_ROUND_1:
      return Icons.numberOneCircle
    case LoanApplicationStatus.ROUND_2:
    case LoanApplicationStatus.ELIMINATED_AFTER_ROUND_2:
      return Icons.numberTwoCircle
    case LoanApplicationStatus.ROUND_3:
    case LoanApplicationStatus.ELIMINATED_AFTER_ROUND_3:
      return Icons.numberThreeCircle
    default:
      return undefined
  }
}

function StatusRoundBadge({
  className,
  round,
  children,
  isShowIcon = true,
  ...props
}: Readonly<StatusRoundBadgeProps>) {
  const RoundBadgeIcon = getBadgeIconByRound(round)

  return (
    <div
      className={cn(
        "h-7 inline-flex items-center whitespace-nowrap rounded-full px-2 text-xs font-normal",
        "text-gray-900 bg-opacity-80",
        getBadgeVariantByRound(round),
        className
      )}
      {...props}
    >
      {isShowIcon && RoundBadgeIcon && <RoundBadgeIcon className="mr-1" />}
      {children}
    </div>
  )
}

export { StatusRoundBadge }
