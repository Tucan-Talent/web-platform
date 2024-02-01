import { API_PATH } from "@/constants"
import { postRequest } from "@/services/client.service"
import { useMutation } from "@tanstack/react-query"
import { ErrorResponse } from "@/types/common.type"
import { AxiosError, AxiosResponse } from "axios"
import { customRequestHeader } from "@/utils/request-header"
import { KYCInformation, KYCInformationResponse } from "../../constants/type"

export const useSubmitLoanKycInformation = () => {
  return useMutation<
    AxiosResponse<KYCInformationResponse>,
    AxiosError<ErrorResponse>,
    KYCInformation
  >({
    mutationFn: (data) => {
      return postRequest({
        path: API_PATH.application.submitKyc,
        data,
        customHeader: customRequestHeader.customHeaders
      })
    },
    onSuccess: ({ data }) => {
      // TODO: Clean after demo notification
      localStorage.setItem("DEMO_NOTIFICATION", JSON.stringify([data]))
    }
  })
}
