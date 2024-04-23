import { Button } from "@/components/ui/button"
import { useConnectPlaid } from "../../../hooks/useConnectPlaid"
import { ArrowRight, Check } from "lucide-react"
import { useEffect } from "react"
import { LOAN_APPLICATION_STEPS } from "@/modules/loan-application/constants"
import {
  useLoanApplicationFormContext,
  useLoanApplicationProgressContext
} from "@/modules/loan-application/providers"
import { FORM_ACTION } from "@/modules/loan-application/providers/LoanApplicationFormProvider"

interface Props {
  disabled: boolean
}
export const ConnectBankAccountsButton: React.FC<Props> = ({ disabled }) => {
  const { open, ready, linkSuccess } = useConnectPlaid()
  const { financialInformationForm, dispatchFormAction } =
    useLoanApplicationFormContext()

  const { finishCurrentStep, progress, getStepStatus } =
    useLoanApplicationProgressContext()

  useEffect(() => {
    if (
      linkSuccess &&
      !getStepStatus(LOAN_APPLICATION_STEPS.FINANCIAL_INFORMATION)
    ) {
      dispatchFormAction({
        action: FORM_ACTION.SET_DATA,
        key: LOAN_APPLICATION_STEPS.FINANCIAL_INFORMATION,
        state: {
          id: financialInformationForm?.id ?? "",
          incomeCategories: [],
          w2sFile: []
        }
      })
      finishCurrentStep()
    }
  }, [
    dispatchFormAction,
    financialInformationForm?.id,
    finishCurrentStep,
    getStepStatus,
    linkSuccess,
    progress
  ])

  return linkSuccess ? (
    <Button
      className="text-primary bg-primary w-full text-white px-lg py-md flex gap-1"
      type="button"
    >
      <p>Connected</p>
      <Check size={20} className="text-white" />
    </Button>
  ) : (
    <Button
      className="text-primary bg-black w-full text-white px-lg py-md"
      onClick={() => open()}
      disabled={!ready || disabled}
      type="button"
    >
      Connect Bank Accounts
      <ArrowRight className="ml-1 w-4" />
    </Button>
  )
}
