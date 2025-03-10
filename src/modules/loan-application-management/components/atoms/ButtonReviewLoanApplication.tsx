import { ButtonLoading } from "@/components/ui/button"
import { APP_PATH } from "@/constants"
import { LoanApplicationStatus } from "@/types/loan-application.type"
import { ChevronRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useReviewLoanApplication } from "../../hooks/useMutation/useReviewLoanApplication"
import { LoanType } from "@/types/loan-program.type"

export const ButtonReviewLoanApplication = ({
  loanApplicationStatus,
  loanApplicationId,
  loanProgramType
}: {
  loanApplicationStatus: LoanApplicationStatus
  loanApplicationId: string
  loanProgramType: LoanType
}) => {
  const navigate = useNavigate()
  const {
    mutateAsync: reviewLoanApplication,
    isPending: isReviewingLoanApplication
  } = useReviewLoanApplication(loanApplicationId)
  const handleClickDetail = async () => {
    if (
      loanApplicationStatus ===
      LoanApplicationStatus.READY_FOR_REVIEW.toLowerCase()
    ) {
      await reviewLoanApplication()
    }
    navigate(
      APP_PATH.LOAN_APPLICATION_MANAGEMENT.BUSINESS_VERIFICATION.detailWithId(
        loanApplicationId
      ),
      {
        state: {
          applicationDetail: {
            type: loanProgramType
          }
        }
      }
    )
  }

  return (
    <ButtonLoading
      isLoading={isReviewingLoanApplication}
      variant="ghost"
      className="flex items-center gap-0.5 px-2 pr-1 h-8"
      onClick={handleClickDetail}
    >
      Review
      <ChevronRight className="w-4" />
    </ButtonLoading>
  )
}
