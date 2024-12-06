import { API_PATH } from "@/constants"
import { QUERY_KEY } from "@/modules/loan-application/[module]-financial-projection/constants/query-key"
import { type ExpensePeopleResponse } from "@/modules/loan-application/[module]-financial-projection/types/people-form"
import { type FormDetailsQueryOptions } from "src/modules/loan-application/hooks/form-common"
import { useQueryFormBySetupId } from "@/modules/loan-application/hooks/form-common/useQueryFormBySetupId"

export const useQueryGetExpensePeopleForm = ({
  applicationId,
  enabled
}: FormDetailsQueryOptions) =>
  useQueryFormBySetupId<ExpensePeopleResponse>({
    setupId: applicationId,
    queryKey: [QUERY_KEY.GET_EXPENSE_PEOPLE_FORM],
    enabled,
    path: API_PATH.financialProjection.expensePeople.index
  })
