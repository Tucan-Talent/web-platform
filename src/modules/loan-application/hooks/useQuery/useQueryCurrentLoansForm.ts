import { QUERY_KEY } from "../../constants/query-key"
import { API_PATH } from "@/constants"
import { type CurrentLoansInformationResponse } from "../../constants/type"
import { type FormDetailsQueryProps } from "."
import { useQueryFormByApplicationId } from "./useQueryFormByApplicationId"

export const useQueryGetCurrentLoansForm = ({
  applicationId,
  enabled
}: FormDetailsQueryProps) =>
  useQueryFormByApplicationId<CurrentLoansInformationResponse>({
    applicationId,
    queryKey: [QUERY_KEY.GET_CURRENT_LOANS_FORM],
    enabled,
    path: API_PATH.application.currentLoansForm
  })
