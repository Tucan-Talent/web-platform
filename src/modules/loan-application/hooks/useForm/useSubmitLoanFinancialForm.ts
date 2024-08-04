import { API_PATH } from "@/constants"
import { putRequest, postRequest } from "@/services/client.service"
import { customRequestHeader } from "@/utils/request-header"
import { useMutation } from "@tanstack/react-query"
import { AxiosResponse, AxiosError } from "axios"
import { ErrorResponse } from "react-router-dom"
import { FinancialFormValue } from "../../constants/form"
import {
  FinancialInformationResponse,
  FinancialInformation
} from "../../constants/type"
import { useCallback } from "react"

type Props = {
  rawData: FinancialFormValue
  onSuccess: (data: FinancialInformationResponse) => void
}

export const useSubmitLoanFinancialForm = ({ rawData, onSuccess }: Props) => {
  const { mutateAsync: updateLoanFinancial, isPending: isUpdating } =
    useUpdateLoanFinancialInformation()

  const { mutateAsync: submitLoanFinancial, isPending: isSubmitting } =
    useSubmitLoanFinancialInformation()

  const onSubmitSuccess = useCallback(
    (data: FinancialInformationResponse) => onSuccess(data),
    [onSuccess]
  )
  const submitLoanFinancialForm = async (loanApplicationId: string) => {
    if (rawData?.id?.length) {
      // Update
      return await updateLoanFinancial({ ...rawData })
    } else {
      // Create
      return await submitLoanFinancial(
        {
          ...rawData,
          loanApplicationId,
          incomeCategories: rawData.incomeCategories ?? []
        },
        {
          onSuccess: (res) => onSubmitSuccess(res.data)
        }
      )
    }
  }
  return {
    isLoading: isUpdating || isSubmitting,
    submitLoanFinancialForm
  }
}
const useUpdateLoanFinancialInformation = () => {
  return useMutation<
    AxiosResponse<FinancialInformationResponse>,
    AxiosError<ErrorResponse>,
    FinancialInformation
  >({
    mutationFn: (data) => {
      return putRequest({
        path: API_PATH.application.financialForm,
        data,
        customHeader: customRequestHeader.customHeaders
      })
    }
  })
}

const useSubmitLoanFinancialInformation = () => {
  return useMutation<
    AxiosResponse<FinancialInformationResponse>,
    AxiosError<ErrorResponse>,
    FinancialInformation
  >({
    mutationFn: (data) => {
      return postRequest({
        path: API_PATH.application.financialForm,
        data,
        customHeader: customRequestHeader.customHeaders
      })
    }
  })
}
