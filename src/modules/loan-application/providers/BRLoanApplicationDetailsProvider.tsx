import { UserMicroLoanApplication } from "@/types/loan-application.type"
import { LoanType, MicroLoanProgramType } from "@/types/loan-program.type"
import { useCallback, useEffect, useMemo } from "react"
import { useLocation, useParams } from "react-router-dom"
import { createContext } from "use-context-selector"
import {
  useLoanApplicationFormContext,
  useLoanApplicationProgressContext,
  usePlaidContext
} from "."
import {
  ConfirmationFormResponse,
  CurrentLoansInformationResponse,
  DocumentUploadedResponse,
  FinancialInformationResponse,
  KYBInformationResponse,
  KYCInformationResponse,
  LoanProgramData,
  OperatingExpensesInformationResponse
} from "../constants/type"
import { useGetLoanProgramDetail } from "../hooks/useGetLoanProgramDetail"
import { useQueryGetConfirmationForm } from "../hooks/useQuery/useQueryConfirmationForm"
import { useQueryGetCurrentLoansForm } from "../hooks/useQuery/useQueryCurrentLoansForm"
import { useQueryGetFinancialForm } from "../hooks/useQuery/useQueryFinancialForm"
import { useQueryGetDocumentsByForm } from "../hooks/useQuery/useQueryGetDocuments"
import { useQueryGetIdentityVerification } from "../hooks/useQuery/useQueryGetIdentityVerification"
import { useQueryGetPlaidItemIds } from "../hooks/useQuery/useQueryGetPlaidItemIds"
import { useQueryGetKybForm } from "../hooks/useQuery/useQueryKybForm"
import { useQueryGetKycForm } from "../hooks/useQuery/useQueryKycForm"
import { useQueryLoanProgramDetailsByType } from "../hooks/useQuery/useQueryLoanProgramDetails"
import { useQueryGetOperatingExpensesForm } from "../hooks/useQuery/useQueryOperatingExpensesForm"
import { useQueryLoanApplicationDetailsByType } from "../hooks/useQuery/useQueryUserLoanApplicationDetails"
import { LOAN_APPLICATION_STEPS } from "../models/LoanApplicationStep/type"
import {
  reverseFormatCurrentLoansForm,
  reverseFormatKybForm,
  reverseFormatKycForm,
  reverseFormatOperatingExpensesForm
} from "../services/form.services"
import { FORM_ACTION, FormStateType } from "./LoanApplicationFormProvider"
import { LOAN_PROGRESS_ACTION } from "./LoanProgressProvider"

type BRLoanApplicationDetailsContext<T> = {
  loanProgramDetails?: T
  loanProgramInfo?: LoanProgramData
  kybFormData?: KYBInformationResponse
  kycFormData?: KYCInformationResponse
  currentLoanFormData?: CurrentLoansInformationResponse
  operatingExpensesFormData?: OperatingExpensesInformationResponse
  confirmationFormData?: ConfirmationFormResponse
  financialFormData?: FinancialInformationResponse
  loanApplicationDetails?: UserMicroLoanApplication
  kycDocuments?: DocumentUploadedResponse[]
  financialDocuments?: DocumentUploadedResponse[]
  isLoading: boolean
  isFetchingDetails: boolean
}

export const MicroLoanBRLoanApplicationDetailsContext = createContext<
  BRLoanApplicationDetailsContext<MicroLoanProgramType>
>({
  isLoading: false,
  isFetchingDetails: false
})

type Props = {
  children: React.ReactNode
}

export const BRLoanApplicationDetailsProvider: React.FC<Props> = ({
  children
}) => {
  const { state } = useLocation()

  const { loanProgramId, id: loanApplicationId } = useParams()
  const { dispatchProgress } = useLoanApplicationProgressContext()
  const { dispatchFormAction } = useLoanApplicationFormContext()
  const { dispatch: plaidDispatch } = usePlaidContext()

  const loanProgramQuery = useQueryLoanProgramDetailsByType(
    state?.loanProgramDetails?.type ?? "",
    loanProgramId!
  )

  const loanApplicationDetailsQuery = useQueryLoanApplicationDetailsByType(
    loanApplicationId!,
    loanProgramQuery.data?.type ?? LoanType.MICRO
  )
  const loanProgramInfo = useGetLoanProgramDetail(
    loanProgramQuery.data?.type ?? ""
  )

  /**
   * Return the persona inquiry verification status for the loan application
   */
  const identityVerificationQuery = useQueryGetIdentityVerification(
    loanApplicationId!
  )

  /**
   * Return the Plaid ItemIds
   */
  const plaidItemIdsQuery = useQueryGetPlaidItemIds(loanApplicationId!)

  const kybFormQuery = useQueryGetKybForm(loanApplicationId!)
  const kycFormQuery = useQueryGetKycForm(loanApplicationId!)
  const confirmationFormQuery = useQueryGetConfirmationForm(loanApplicationId!)
  const financialFormQuery = useQueryGetFinancialForm(loanApplicationId!)
  const currentLoansFormQuery = useQueryGetCurrentLoansForm(loanApplicationId!)
  const operatingExpensesFormQuery = useQueryGetOperatingExpensesForm(
    loanApplicationId!
  )
  const financialDocuments = useQueryGetDocumentsByForm(
    financialFormQuery.data?.id ?? ""
  )
  const kycDocuments = useQueryGetDocumentsByForm(kycFormQuery.data?.id ?? "")
  const changeDataAndProgress = useCallback(
    (data: FormStateType, progress: LOAN_APPLICATION_STEPS) => {
      dispatchProgress({
        type: LOAN_PROGRESS_ACTION.CHANGE_PROGRESS,
        progress
      })
      dispatchFormAction({
        action: FORM_ACTION.SET_DATA,
        key: progress,
        state: data
      })
    },
    [dispatchProgress, dispatchFormAction]
  )
  // Save data to edit form
  // KYB Form
  useEffect(() => {
    if (kybFormQuery.data) {
      changeDataAndProgress(
        reverseFormatKybForm(kybFormQuery.data),
        LOAN_APPLICATION_STEPS.BUSINESS_INFORMATION
      )
    }
  }, [changeDataAndProgress, kybFormQuery.data])
  // KYC Form
  useEffect(() => {
    if (kycFormQuery.data) {
      changeDataAndProgress(
        reverseFormatKycForm(kycFormQuery.data),
        LOAN_APPLICATION_STEPS.OWNER_INFORMATION
      )
    }
  }, [changeDataAndProgress, kycFormQuery.data])
  // Financial Form
  useEffect(() => {
    if (financialFormQuery.data) {
      changeDataAndProgress(
        {
          ...financialFormQuery.data,
          incomeCategories: financialFormQuery.data.incomeCategories ?? [],
          w2sFile: []
        },
        LOAN_APPLICATION_STEPS.FINANCIAL_INFORMATION
      )
      changeDataAndProgress(
        {
          ...financialFormQuery.data,
          incomeCategories: financialFormQuery.data.incomeCategories ?? [],
          w2sFile: []
        },
        LOAN_APPLICATION_STEPS.CASH_FLOW_VERIFICATION
      )
    }
  }, [changeDataAndProgress, financialFormQuery.data])
  // Current Loans Form
  useEffect(() => {
    if (currentLoansFormQuery.data) {
      changeDataAndProgress(
        reverseFormatCurrentLoansForm(currentLoansFormQuery.data),
        LOAN_APPLICATION_STEPS.CURRENT_LOANS
      )
    }
  }, [changeDataAndProgress, currentLoansFormQuery.data])
  // Operating Expenses Form
  useEffect(() => {
    if (operatingExpensesFormQuery.data) {
      changeDataAndProgress(
        reverseFormatOperatingExpensesForm(operatingExpensesFormQuery.data),
        LOAN_APPLICATION_STEPS.OPERATING_EXPENSES
      )
    }
  }, [changeDataAndProgress, operatingExpensesFormQuery.data])
  // Loan Request Form
  useEffect(() => {
    if (loanApplicationDetailsQuery.data) {
      changeDataAndProgress(
        {
          id: loanApplicationDetailsQuery.data.id,
          loanAmount: loanApplicationDetailsQuery.data.loanAmount,
          loanTermInMonth: loanApplicationDetailsQuery.data.loanTermInMonth,
          proposeUseOfLoan: loanApplicationDetailsQuery.data.proposeUseOfLoan
        },
        LOAN_APPLICATION_STEPS.LOAN_REQUEST
      )
    }
  }, [changeDataAndProgress, loanApplicationDetailsQuery.data])

  /**
   * Handle update identity verification data when edit draft application
   */
  useEffect(() => {
    if (
      identityVerificationQuery.data?.inquiryId &&
      identityVerificationQuery.data?.personaStatus
    ) {
      changeDataAndProgress(
        {
          smartKycId: identityVerificationQuery.data?.id,
          inquiryId: identityVerificationQuery.data.inquiryId,
          status: identityVerificationQuery.data.personaStatus?.toLowerCase()
        },
        LOAN_APPLICATION_STEPS.IDENTITY_VERIFICATION
      )
    }
  }, [
    changeDataAndProgress,
    identityVerificationQuery.data?.id,
    identityVerificationQuery.data?.inquiryId,
    identityVerificationQuery.data?.personaStatus
  ])

  /**
   * Handle retrieve list Plaid ItemIds
   */
  useEffect(() => {
    if (plaidItemIdsQuery.data?.data?.plaidItems) {
      plaidDispatch({
        type: "SET_STATE",
        state: {
          fetchedItemIds:
            plaidItemIdsQuery.data?.data?.plaidItems?.map(
              (plaidItem) => plaidItem.itemId
            ) ?? []
        }
      })
    }
  }, [plaidDispatch, plaidItemIdsQuery.data?.data])

  /**
   * TODO: Handle retrieve list bank account
   * TODO: How to remove fetchedItemIds
   */

  const value = useMemo(
    () => ({
      loanProgramInfo,
      loanProgramDetails: loanProgramQuery.data,
      kybFormData: kybFormQuery.data,
      kycFormData: kycFormQuery.data,
      currentLoanFormData: currentLoansFormQuery.data,
      operatingExpensesFormData: operatingExpensesFormQuery.data,
      confirmationFormData: confirmationFormQuery.data,
      financialFormData: financialFormQuery.data,
      loanApplicationDetails: loanApplicationDetailsQuery.data,
      kycDocuments: kycDocuments.data,
      financialDocuments: financialDocuments.data,
      isFetchingDetails:
        loanApplicationDetailsQuery.isLoading ||
        kybFormQuery.isLoading ||
        kycFormQuery.isLoading ||
        confirmationFormQuery.isLoading ||
        financialFormQuery.isLoading ||
        currentLoansFormQuery.isLoading ||
        operatingExpensesFormQuery.isLoading ||
        kycDocuments.isLoading ||
        financialDocuments.isLoading ||
        plaidItemIdsQuery.isLoading,
      isLoading: loanProgramQuery.isLoading
    }),
    [
      loanProgramInfo,
      loanProgramQuery.data,
      loanProgramQuery.isLoading,
      kybFormQuery.data,
      kybFormQuery.isLoading,
      kycFormQuery.data,
      kycFormQuery.isLoading,
      currentLoansFormQuery.data,
      currentLoansFormQuery.isLoading,
      operatingExpensesFormQuery.data,
      operatingExpensesFormQuery.isLoading,
      confirmationFormQuery.data,
      confirmationFormQuery.isLoading,
      financialFormQuery.data,
      financialFormQuery.isLoading,
      loanApplicationDetailsQuery.data,
      loanApplicationDetailsQuery.isLoading,
      kycDocuments.data,
      kycDocuments.isLoading,
      financialDocuments.data,
      financialDocuments.isLoading,
      plaidItemIdsQuery.isLoading
    ]
  )
  switch (loanProgramQuery.data?.type) {
    case LoanType.MICRO:
      return (
        <MicroLoanBRLoanApplicationDetailsContext.Provider value={value}>
          {children}
        </MicroLoanBRLoanApplicationDetailsContext.Provider>
      )
    default:
      return (
        <MicroLoanBRLoanApplicationDetailsContext.Provider value={value}>
          {children}
        </MicroLoanBRLoanApplicationDetailsContext.Provider>
      )
  }
}
