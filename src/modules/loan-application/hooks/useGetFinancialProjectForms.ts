import {
  useQueryGetCurrentAssetsForm,
  useQueryGetLongTermAssetsForm
} from "@/modules/loan-application/[module]-financial-projection/hooks/assets/useQueryGetAssetsForm"
import { reverseFormatAssetsForm } from "@/modules/loan-application/[module]-financial-projection/hooks/assets/useSubmitAssetsForm"
import { useQueryGetDirectCostsForm } from "@/modules/loan-application/[module]-financial-projection/hooks/direct-costs/useQueryGetDirectCostsForm"
import { reverseFormatDirectCostsForm } from "@/modules/loan-application/[module]-financial-projection/hooks/direct-costs/useSubmitDirectCostsForm"
import { useQueryGetEquityFinancingForm } from "@/modules/loan-application/[module]-financial-projection/hooks/equity-financing/useQueryGetEquityFinancingForm"
import { reverseFormatEquityFinancingForm } from "@/modules/loan-application/[module]-financial-projection/hooks/equity-financing/useSubmitEquityFinancingForm"
import { useQueryGetExpensePeopleForm } from "@/modules/loan-application/[module]-financial-projection/hooks/expense-people/useQueryGetExpensePeopleForm"
import { useQueryGetFpOperatingExpensesForm } from "@/modules/loan-application/[module]-financial-projection/hooks/operating-expenses/useQueryGetFpOperatingExpensesForm"
import { reverseFormatFpOperatingExpensesForm } from "@/modules/loan-application/[module]-financial-projection/hooks/operating-expenses/useSubmitOperatingExpensesForm"
import { useQueryGetTaxRateForm } from "@/modules/loan-application/[module]-financial-projection/hooks/tax-rate/useQueryGetTaxRateForm"
import { reverseFormatExpenseTaxRateForm } from "@/modules/loan-application/[module]-financial-projection/hooks/tax-rate/useSubmitTaxRateForm"
import { reverseFormatExpensePeopleForm } from "@/modules/loan-application/[module]-financial-projection/services/form.services"
import { LOAN_APPLICATION_STEPS } from "@/modules/loan-application/models/LoanApplicationStep/type"
import {
  useLoanApplicationFormContext,
  useLoanApplicationProgressContext
} from "@/modules/loan-application/providers"
import {
  FORM_ACTION,
  FormStateType
} from "@/modules/loan-application/providers/LoanApplicationFormProvider"
import { LOAN_PROGRESS_ACTION } from "@/modules/loan-application/providers/LoanProgressProvider"
import { useCallback, useEffect } from "react"
import { useParams } from "react-router-dom"
import {
  reverseFormatRevenueResponse,
  useQueryRevenueForm
} from "@/modules/loan-application/[module]-financial-projection/hooks/revenue/useQueryRevenueForm.ts"

export const useGetFinancialProjectForms = () => {
  /**
   * Financial Projection Forms
   **/
  const { id: loanApplicationId } = useParams()

  const { dispatchProgress, isInitialized, progress } =
    useLoanApplicationProgressContext()

  const { dispatchFormAction } = useLoanApplicationFormContext()

  const isEnabledQuery = (step: LOAN_APPLICATION_STEPS) =>
    progress.map((item) => item.step).includes(step)

  const changeDataAndProgress = useCallback(
    (
      data: FormStateType,
      progress: LOAN_APPLICATION_STEPS,
      isDone: boolean = true
    ) => {
      if (isDone) {
        dispatchProgress({
          type: LOAN_PROGRESS_ACTION.CHANGE_PROGRESS,
          progress
        })
      }
      dispatchFormAction({
        action: FORM_ACTION.SET_DATA,
        key: progress,
        state: data
      })
    },
    [dispatchProgress, dispatchFormAction]
  )

  // Expense People Form
  const expensePeopleFormQuery = useQueryGetExpensePeopleForm({
    applicationId: loanApplicationId!,
    enabled: isEnabledQuery(LOAN_APPLICATION_STEPS.PEOPLE)
  })
  useEffect(() => {
    if (expensePeopleFormQuery.data && isInitialized) {
      changeDataAndProgress(
        reverseFormatExpensePeopleForm(expensePeopleFormQuery.data),
        LOAN_APPLICATION_STEPS.PEOPLE
      )
    }
  }, [changeDataAndProgress, expensePeopleFormQuery.data, isInitialized])

  // Operating Expenses Form
  const fpOperatingExpensesFormQuery = useQueryGetFpOperatingExpensesForm({
    applicationId: loanApplicationId!,
    enabled: isEnabledQuery(LOAN_APPLICATION_STEPS.FP_OPERATING_EXPENSES)
  })
  useEffect(() => {
    if (fpOperatingExpensesFormQuery.data && isInitialized) {
      changeDataAndProgress(
        reverseFormatFpOperatingExpensesForm(fpOperatingExpensesFormQuery.data),
        LOAN_APPLICATION_STEPS.FP_OPERATING_EXPENSES
      )
    }
  }, [changeDataAndProgress, fpOperatingExpensesFormQuery.data, isInitialized])

  // Direct Costs Form
  const directCosts = useQueryGetDirectCostsForm({
    applicationId: loanApplicationId!,
    enabled: isEnabledQuery(LOAN_APPLICATION_STEPS.DIRECT_COSTS)
  })
  useEffect(() => {
    if (directCosts.data && isInitialized) {
      changeDataAndProgress(
        reverseFormatDirectCostsForm(directCosts.data),
        LOAN_APPLICATION_STEPS.DIRECT_COSTS
      )
    }
  }, [changeDataAndProgress, directCosts.data, isInitialized])

  // Equity Financing Form
  const fpEquityFinancingFormQuery = useQueryGetEquityFinancingForm({
    applicationId: loanApplicationId!,
    enabled: isEnabledQuery(LOAN_APPLICATION_STEPS.EQUITY)
  })
  useEffect(() => {
    if (fpEquityFinancingFormQuery.data && isInitialized) {
      changeDataAndProgress(
        reverseFormatEquityFinancingForm(fpEquityFinancingFormQuery.data),
        LOAN_APPLICATION_STEPS.EQUITY
      )
    }
  }, [changeDataAndProgress, fpEquityFinancingFormQuery.data, isInitialized])

  // Assets Form (Current & Long-Term)
  const fpAssetsCurrentFormQuery = useQueryGetCurrentAssetsForm({
    applicationId: loanApplicationId!,
    enabled: isEnabledQuery(LOAN_APPLICATION_STEPS.ASSETS)
  })
  const fpAssetsLongTermFormQuery = useQueryGetLongTermAssetsForm({
    applicationId: loanApplicationId!,
    enabled: isEnabledQuery(LOAN_APPLICATION_STEPS.ASSETS)
  })

  // Tax Rates Form
  const fpExpenseTaxRateFormQuery = useQueryGetTaxRateForm({
    applicationId: loanApplicationId!,
    enabled: isEnabledQuery(LOAN_APPLICATION_STEPS.TAX_RATES)
  })
  useEffect(() => {
    if (fpExpenseTaxRateFormQuery.data && isInitialized) {
      changeDataAndProgress(
        reverseFormatExpenseTaxRateForm(fpExpenseTaxRateFormQuery.data),
        LOAN_APPLICATION_STEPS.TAX_RATES
      )
    }
  }, [changeDataAndProgress, fpExpenseTaxRateFormQuery.data, isInitialized])

  useEffect(() => {
    if (
      fpAssetsCurrentFormQuery.data &&
      fpAssetsLongTermFormQuery.data &&
      isInitialized
    ) {
      changeDataAndProgress(
        reverseFormatAssetsForm(
          fpAssetsCurrentFormQuery.data,
          fpAssetsLongTermFormQuery.data
        ),
        LOAN_APPLICATION_STEPS.ASSETS
      )
    }
  }, [
    changeDataAndProgress,
    fpAssetsCurrentFormQuery.data,
    fpAssetsLongTermFormQuery.data,
    fpEquityFinancingFormQuery.data,
    isInitialized
  ])

  // Revenue
  const revenueFormQuery = useQueryRevenueForm({
    applicationId: loanApplicationId!,
    enabled: isEnabledQuery(LOAN_APPLICATION_STEPS.REVENUE)
  })
  useEffect(() => {
    if (revenueFormQuery.data && isInitialized) {
      const formattedData = reverseFormatRevenueResponse(revenueFormQuery.data)

      changeDataAndProgress(
        formattedData,
        LOAN_APPLICATION_STEPS.REVENUE,
        formattedData.billableHours.length !== 0 ||
          formattedData.unitSales.length !== 0 ||
          formattedData.recurringCharges.length !== 0 ||
          formattedData.contracts.length !== 0
      )
    }
  }, [changeDataAndProgress, isInitialized, revenueFormQuery.data])

  return {
    expensePeopleFormQuery,
    fpOperatingExpensesFormQuery,
    revenueFormQuery
  }
}
