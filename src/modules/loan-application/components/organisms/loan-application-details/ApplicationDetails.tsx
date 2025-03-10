import { FinancialFormDetails } from "../../molecules/loan-application-details/FinancialFormDetails"
import { KybFormDetails } from "../../molecules/loan-application-details/KybFormDetails"
import { KycFormDetails } from "../../molecules/loan-application-details/KycFormDetails"
import { LoanRequestDetails } from "../../molecules/loan-application-details/LoanRequestDetails"
import { CashFlowTable } from "./CashFlowTable"
import {
  isCyphrBank,
  isKccBank,
  isLaunchKC,
  isLoanReady,
  isSbb
} from "@/utils/domain.utils"
import { cn } from "@/lib/utils"
import { useBRLoanApplicationDetailsContext } from "@/modules/loan-application/providers"
import { CurrentLoanFormDetails } from "@/modules/loan-application/components/molecules/loan-application-details/CurrentLoanFormDetails.tsx"
import { OperatingExpensesFormDetails } from "@/modules/loan-application/components/molecules/loan-application-details/OperatingExpenseFormDetails.tsx"

export const ApplicationDetails = () => {
  const {
    kybFormData,
    kycFormData,
    currentLoanFormData,
    financialFormData,
    operatingExpensesFormData
  } = useBRLoanApplicationDetailsContext()

  return (
    <div className={cn("flex flex-col gap-2", "md:grid md:grid-cols-4")}>
      <div className="col-span-1">
        <div className="flex flex-col gap-4">
          <h3 className="text-2xl font-semibold">Application</h3>
        </div>
      </div>
      <div className="col-span-3 max-w-screen-sm">
        <div className="flex flex-col gap-4">
          <LoanRequestDetails />
          {kybFormData && <KybFormDetails kybFormData={kybFormData} />}
          {kycFormData && <KycFormDetails kycFormData={kycFormData} />}

          {currentLoanFormData && (
            <CurrentLoanFormDetails currentLoanFormData={currentLoanFormData} />
          )}
          {operatingExpensesFormData && (
            <OperatingExpensesFormDetails
              operatingExpensesFormData={operatingExpensesFormData}
            />
          )}
          {financialFormData && (
            <FinancialFormDetails financialFormData={financialFormData} />
          )}
          {(isLoanReady() ||
            isKccBank() ||
            isCyphrBank() ||
            isSbb() ||
            isLaunchKC()) && <CashFlowTable />}
        </div>
      </div>
    </div>
  )
}
