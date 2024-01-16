import { LOAN_APPLICATION_STEPS } from "../../constants"
import { useLoanApplicationContext } from "../../providers"
import { BusinessInformationForm } from "../organisms/BusinessInformationForm"
import { OwnerInformationForm } from "../organisms/OwnerInformationForm"
import { ProgressSteps } from "../organisms/ProgressSteps"

export const LoanInformation = () => {
  const { step } = useLoanApplicationContext()

  return (
    <div className={`flex flex-col w-full gap-6 md:flex-row`}>
      <ProgressSteps />
      {step === LOAN_APPLICATION_STEPS.BUSINESS_INFORMATION && (
        <BusinessInformationForm />
      )}{" "}
      {step === LOAN_APPLICATION_STEPS.OWNER_INFORMATION && (
        <OwnerInformationForm />
      )}
    </div>
  )
}
