import { AxiosError } from "axios"
import { useCallback } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useQueryClient } from "@tanstack/react-query"
import { toastError, toastSuccess } from "@/utils"
import { getAxiosError } from "@/utils/custom-error"
import { TOAST_MSG } from "@/constants/toastMsg"
import { useSubmitLoanConfirmationForm } from "../hooks/useForm/useSubmitLoanConfirmationForm"
import { useSubmitLoanFinancialForm } from "../hooks/useForm/useSubmitLoanFinancialForm"
import { useSubmitLoanKYBForm } from "../hooks/useForm/useSubmitLoanKYBForm"
import { useSubmitLoanKYCForm } from "../hooks/useForm/useSubmitLoanKYCForm"
import { useSubmitMicroLoanRequestForm } from "../hooks/useForm/useSubmitLoanRequest"
import { LoanType } from "@/types/loan-program.type"
import {
  BusinessFormValue,
  ConfirmationFormValue,
  FinancialFormValue,
  LoanRequestFormValue,
  OwnerFormValue,
  CurrentLoansFormValue,
  OperatingExpensesFormValue
} from "../constants/form"
import { APP_PATH } from "@/constants"
import { ApplicationStep, FORM_TYPE } from "../constants/type"
import { useUploadFormDocuments } from "../hooks/useForm/useUploadFormDocuments"
import { loanApplicationUserKeys } from "@/constants/query-key"
import { useSubmitCurrentLoansForm } from "../hooks/useForm/useSubmitCurrentLoansForm"
import { isEnableCashFlowV2 } from "@/utils/feature-flag.utils"
import { useSubmitOperatingExpensesForm } from "../hooks/useForm/useSubmitOperatingExpensesForm"
import {
  LOAN_APPLICATION_STEP_STATUS,
  LOAN_APPLICATION_STEPS
} from "../constants"

export const useSubmitLoanForm = (
  loanType: LoanType,
  progress: ApplicationStep[],
  loanRequestData: LoanRequestFormValue,
  businessData: BusinessFormValue,
  ownerData: OwnerFormValue,
  financialData: FinancialFormValue,
  currentLoansData: CurrentLoansFormValue,
  operatingExpensesData: OperatingExpensesFormValue,
  confirmationData: ConfirmationFormValue
) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { loanProgramId } = useParams()

  const { submitLoanKYBForm, isLoading: isSubmittingKYB } =
    useSubmitLoanKYBForm(businessData, businessData?.id ?? "")
  const { submitLoanKYCForm, isLoading: isSubmittingKYC } =
    useSubmitLoanKYCForm(ownerData, ownerData?.id ?? "")

  const { submitLoanRequestForm, isLoading: isSubmittingLoanRequest } =
    useSubmitMicroLoanRequestForm(
      loanRequestData,
      loanRequestData?.id ?? "",
      loanProgramId
    )

  const { submitLoanFinancialForm, isLoading: isSubmittingFinancial } =
    useSubmitLoanFinancialForm(financialData, financialData?.id ?? "")

  const { submitCurrentLoansForm, isLoading: isSubmittingCurrentLoans } =
    useSubmitCurrentLoansForm(currentLoansData)

  const {
    submitOperatingExpensesForm,
    isLoading: isSubmittingOperatingExpenses
  } = useSubmitOperatingExpensesForm(
    operatingExpensesData,
    operatingExpensesData?.id ?? ""
  )

  const { submitLoanConfirmationForm, isLoading: isSubmittingConfirmation } =
    useSubmitLoanConfirmationForm(confirmationData)

  const { uploadDocuments, isUploading } = useUploadFormDocuments()

  const handleSubmitFormSuccess = useCallback(
    (isUpdated: boolean, isSubmitted: boolean, applicationId?: string) => {
      if (isSubmitted) {
        toastSuccess({
          title: TOAST_MSG.loanApplication.submitSuccess.title,
          description: TOAST_MSG.loanApplication.submitSuccess.description
        })
        // Navigate to submission page with applicationId
        navigate(APP_PATH.LOAN_APPLICATION.SUBMISSION, {
          state: {
            applicationId: applicationId,
            businessName: businessData?.businessLegalName
          }
        })
      } else {
        if (!isUpdated) {
          toastSuccess({
            title: TOAST_MSG.loanApplication.createSuccess.title,
            description: TOAST_MSG.loanApplication.createSuccess.description
          })
        } else {
          toastSuccess({
            title: TOAST_MSG.loanApplication.updateSuccess.title,
            description: TOAST_MSG.loanApplication.updateSuccess.description
          })
        }
        navigate(APP_PATH.LOAN_APPLICATION.APPLICATIONS.index)
      }
    },
    [businessData?.businessLegalName, navigate]
  )

  const handleSubmitFormError = useCallback((error: AxiosError) => {
    const message = getAxiosError(error)?.message
    toastError({
      title: TOAST_MSG.loanApplication.submitError.title,
      description: message.length
        ? message
        : TOAST_MSG.loanApplication.submitError.description
    })
  }, [])

  const isCompleteSteps = useCallback(
    (step: LOAN_APPLICATION_STEPS) =>
      progress.find((item) => item.step === step)?.status ===
      LOAN_APPLICATION_STEP_STATUS.COMPLETE,
    [progress]
  )

  const submitLoanForm = useCallback(async () => {
    try {
      const {
        data: { id: loanRequestId }
      } = await submitLoanRequestForm()
      let isSubmitted = false
      if (loanType === LoanType.MICRO) {
        if (
          businessData &&
          isCompleteSteps(LOAN_APPLICATION_STEPS.BUSINESS_INFORMATION)
        )
          await submitLoanKYBForm(loanRequestId)
        if (
          ownerData &&
          isCompleteSteps(LOAN_APPLICATION_STEPS.OWNER_INFORMATION)
        ) {
          const {
            data: { id: ownerFormId }
          } = await submitLoanKYCForm(loanRequestId)
          if (ownerData.governmentFile.length) {
            await uploadDocuments(
              ownerFormId,
              ownerData.governmentFile,
              FORM_TYPE.KYC
            )
          }
        }
        if (
          financialData &&
          isCompleteSteps(LOAN_APPLICATION_STEPS.FINANCIAL_INFORMATION)
        ) {
          const {
            data: { id: financialFormId }
          } = await submitLoanFinancialForm(loanRequestId)
          if (financialData.w2sFile.length) {
            await uploadDocuments(
              financialFormId,
              financialData.w2sFile,
              FORM_TYPE.FINANCIAL
            )
          }
        }
        if (isEnableCashFlowV2()) {
          if (
            currentLoansData &&
            isCompleteSteps(LOAN_APPLICATION_STEPS.CURRENT_LOANS)
          ) {
            await submitCurrentLoansForm(loanRequestId)
          }
          if (
            operatingExpensesData &&
            isCompleteSteps(LOAN_APPLICATION_STEPS.OPERATING_EXPENSES)
          ) {
            await submitOperatingExpensesForm(loanRequestId)
          }
        }
        if (confirmationData) {
          await submitLoanConfirmationForm(loanRequestId)
          isSubmitted = true
        }
      } else if (loanType === LoanType.READINESS) {
        // Customize submission steps for Readiness loan type
        if (businessData) await submitLoanKYBForm(loanRequestId)
        if (ownerData) await submitLoanKYCForm(loanRequestId)
        await submitLoanFinancialForm(loanRequestId)
        if (isEnableCashFlowV2()) {
          if (currentLoansData) {
            await submitCurrentLoansForm(loanRequestId)
          }
          if (operatingExpensesData) {
            await submitOperatingExpensesForm(loanRequestId)
          }
        }
        if (confirmationData) {
          await submitLoanConfirmationForm(loanRequestId)
          isSubmitted = true
        }
      }
      handleSubmitFormSuccess(
        loanRequestData?.id?.length > 0,
        isSubmitted,
        loanRequestId
      )
    } catch (error) {
      handleSubmitFormError(error as AxiosError)
    } finally {
      queryClient.invalidateQueries({
        queryKey: loanApplicationUserKeys.lists()
      })
    }
  }, [
    submitLoanRequestForm,
    loanType,
    handleSubmitFormSuccess,
    loanRequestData?.id?.length,
    businessData,
    isCompleteSteps,
    submitLoanKYBForm,
    ownerData,
    financialData,
    confirmationData,
    submitLoanKYCForm,
    uploadDocuments,
    submitLoanFinancialForm,
    currentLoansData,
    operatingExpensesData,
    submitCurrentLoansForm,
    submitOperatingExpensesForm,
    submitLoanConfirmationForm,
    handleSubmitFormError,
    queryClient
  ])

  return {
    submitLoanForm,
    isLoading:
      isSubmittingLoanRequest ||
      isSubmittingKYB ||
      isSubmittingKYC ||
      isSubmittingFinancial ||
      isSubmittingCurrentLoans ||
      isSubmittingOperatingExpenses ||
      isSubmittingConfirmation ||
      isUploading
  }
}
