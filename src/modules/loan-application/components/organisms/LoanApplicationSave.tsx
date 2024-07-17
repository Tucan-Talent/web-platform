import { ButtonLoading } from "@/components/ui/button"
import { CustomAlertDialog } from "@/shared/molecules/AlertDialog"
import {
  useLoanApplicationFormContext,
  useLoanApplicationProgressContext
} from "../../providers"
import { LOAN_PROGRESS_ACTION } from "../../providers/LoanProgressProvider"
import {
  LOAN_APPLICATION_STEP_STATUS,
  LOAN_APPLICATION_STEPS
} from "../../models/LoanApplicationStep/type"
import { isLaunchKC } from "@/utils/domain.utils.ts"

export const LoanApplicationSave = () => {
  const { submitLoanForm, isSubmitting } = useLoanApplicationFormContext()
  const { progress, dispatchProgress } = useLoanApplicationProgressContext()

  const isCompleteLoanRequestForm =
    isLaunchKC() || progress[0].status === LOAN_APPLICATION_STEP_STATUS.COMPLETE

  const onConfirmed = () => {
    if (!isCompleteLoanRequestForm) {
      dispatchProgress({
        type: LOAN_PROGRESS_ACTION.CHANGE_STEP,
        step: LOAN_APPLICATION_STEPS.LOAN_REQUEST
      })
    } else {
      submitLoanForm()
    }
  }

  const confirmText = isCompleteLoanRequestForm ? "Save & Close" : "Go to form"

  const description = isCompleteLoanRequestForm
    ? `Are you sure you want to save and close this application?`
    : `Please finish "Loan Request" form before save and close.`

  return (
    <CustomAlertDialog
      onConfirmed={onConfirmed}
      title="Save & Close?"
      cancelText="Cancel"
      confirmText={confirmText}
      description={description}
    >
      <ButtonLoading variant="outline" isLoading={isSubmitting}>
        Save & Close
      </ButtonLoading>
    </CustomAlertDialog>
  )
}
