import { Badge } from "@/components/ui/badge"
import { Button, ButtonLoading } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { APP_PATH } from "@/constants"
import { getBadgeVariantByStatus } from "@/modules/loan-application-management/services"
import {
  useBRLoanApplicationDetailsContext,
  useLoanApplicationFormContext
} from "@/modules/loan-application/providers"
import { LoanApplicationStatus } from "@/types/loan-application.type"
import { capitalizeWords, snakeCaseToText } from "@/utils"
import { useNavigate } from "react-router-dom"
import { CustomAlertDialog } from "./AlertDialog"
import { cn } from "@/lib/utils"
import { DiscardApplication } from "@/modules/loan-application/components/atoms/DiscardApplication"
import { Icons } from "@/components/ui/icons"

export function ApplicationDetailsHeader() {
  const { loanApplicationDetails, isFetchingDetails } =
    useBRLoanApplicationDetailsContext()
  const { submitLoanForm, isSubmitting } = useLoanApplicationFormContext()
  const status = loanApplicationDetails?.status ?? LoanApplicationStatus.DRAFT
  const navigate = useNavigate()

  const editableStatuses = [
    LoanApplicationStatus.DRAFT.toLowerCase(),
    LoanApplicationStatus.PENDING_SUBMISSION.toLowerCase()
  ]

  const onConfirmed = () => {
    if (editableStatuses.includes(status)) {
      // Save and close
      submitLoanForm()
    } else {
      // Close
      navigate(APP_PATH.LOAN_APPLICATION.APPLICATIONS.index)
    }
  }

  const description = `Are you sure you want to save and continue with this loan application?`

  return (
    <nav
      className={cn(
        "gap-4 w-full p-4 pr-2 shrink-0 flex justify-between items-center sticky top-0 bg-white border-b border-t z-20",
        "md:h-20 md:pr-8 md:border-t-0 md:p-5"
      )}
    >
      <div className="flex items-center gap-2 min-w-20">
        <h4
          className={cn(
            "text-lg font-semibold ml-0 md:ml-3 truncate min-w-20",
            "md:text-2xl"
          )}
          title={loanApplicationDetails?.loanProgram?.name}
        >
          {status && editableStatuses.includes(status)
            ? loanApplicationDetails?.loanProgram?.name
            : null}

          {!isFetchingDetails &&
            !editableStatuses.includes(status) &&
            "Status:"}
        </h4>
        {isFetchingDetails ? (
          <Skeleton className="w-20 h-8" />
        ) : (
          <Badge
            isDot
            isDotBefore
            className="text-sm"
            variant="soft"
            variantColor={getBadgeVariantByStatus(status)}
          >
            {capitalizeWords(snakeCaseToText(status))}
          </Badge>
        )}
      </div>
      {editableStatuses.includes(status) ? (
        <div className="flex gap-2">
          <DiscardApplication />
          <CustomAlertDialog
            cancelText="Cancel"
            confirmText="Save & Continue"
            description={<span className="break-keep">{description}</span>}
            title="Save and continue?"
            onConfirmed={onConfirmed}
          >
            <ButtonLoading isLoading={isSubmitting} variant="outline">
              <Icons.saveApplication className="mr-1" />
              Save and continue
            </ButtonLoading>
          </CustomAlertDialog>
        </div>
      ) : (
        <Button variant="outline" onClick={onConfirmed}>
          Close
        </Button>
      )}
    </nav>
  )
}
