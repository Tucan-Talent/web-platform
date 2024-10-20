import { API_PATH } from "@/constants"
import { getRequest } from "@/services/client.service"
import { type ErrorResponse } from "@/types/common.type"
import { useQuery } from "@tanstack/react-query"
import { type AxiosError } from "axios"
import { QUERY_KEY } from "../../constants/query-key"
import { type LoanApplicationCashflowVerification } from "../../constants/type"

export const useQueryGetLoanApplicationCashflowVerification = (id?: string) => {
  return useQuery<
    LoanApplicationCashflowVerification,
    AxiosError<ErrorResponse>
  >({
    queryKey: [QUERY_KEY.GET_LOAN_APPLICATION_CASHFLOW_VERIFICATION, id],
    queryFn: () => {
      if (!id) throw new Error("Loan application ID not found!")

      return getRequest({
        path: API_PATH.application.getCashflowVerification(id)
      })
    },
    enabled: !!id
  })
}
