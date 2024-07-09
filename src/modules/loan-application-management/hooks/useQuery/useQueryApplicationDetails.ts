import { API_PATH } from "@/constants"
import { getRequest } from "@/services/client.service"
import { useQuery } from "@tanstack/react-query"
import { ErrorResponse } from "@/types/common.type"
import { QUERY_KEY } from "../../constants/query-key"
import {
  LoanMeta,
  UserMicroLoanApplication
} from "@/types/loan-application.type"
import { AxiosError } from "axios"
import { LoanType } from "@/types/loan-program.type"

export const useQueryGetApplicationDetailsByType = (
  type: LoanType,
  applicationId: string
) => {
  const microLoanApplicationDetailsQuery =
    useQueryGetMicroLoanApplicationDetails(applicationId)

  switch (type) {
    case LoanType.MICRO:
      return microLoanApplicationDetailsQuery
    default:
      return microLoanApplicationDetailsQuery
  }
}

export const useQueryGetMicroLoanApplicationDetails = (
  applicationId: string
) => {
  return useQueryGetApplicationDetails<UserMicroLoanApplication<LoanMeta>>(
    [QUERY_KEY.GET_LOAN_APPLICATION_DETAILS, applicationId],
    () => {
      return getRequest({
        path: API_PATH.loanApplication.details(LoanType.MICRO),
        params: { id: applicationId }
      })
    },
    !!applicationId
  )
}

export const useQueryGetApplicationDetails = <T>(
  queryKey: string[],
  queryFn: () => Promise<T>,
  enabled: boolean = false
) => {
  return useQuery<T, AxiosError<ErrorResponse>>({
    queryKey: [queryKey],
    queryFn: queryFn,
    enabled: enabled
  })
}
