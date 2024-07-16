import { API_PATH } from "@/constants"
import { postRequest } from "@/services/client.service"
import { useMutation } from "@tanstack/react-query"
import { ErrorResponse } from "@/types/common.type"
import { AxiosError, AxiosResponse } from "axios"
import { customRequestHeader } from "@/utils/request-header"
import {
  PreQualificationFormRequest,
  PreQualificationResponse
} from "../../constants/type"
export const useSubmitPreQualificationForm = () => {
  return useMutation<
    AxiosResponse<PreQualificationResponse>,
    AxiosError<ErrorResponse>,
    PreQualificationFormRequest
  >({
    mutationFn: (data) => {
      return postRequest({
        path: API_PATH.application.preQualification,
        data,
        customHeader: customRequestHeader.customHeaders
      })
    }
  })
}
