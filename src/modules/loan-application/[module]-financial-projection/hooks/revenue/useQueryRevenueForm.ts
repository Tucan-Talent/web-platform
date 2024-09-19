import {
  BillableHour,
  Contract,
  RecurringCharge,
  RevenueResponseType,
  RevenueStream,
  SubmitRevenueStreamItemResponse,
  SubmitRevenueStreamResponse,
  UnitSale
} from "@/modules/loan-application/[module]-financial-projection/types/revenue-form.ts"
import { FormDetailsQueryProps } from "@/modules/loan-application/hooks/useQuery"
import { useQueryFormBySetupId } from "@/modules/loan-application/hooks/useQuery/useQueryFormBySetupId.ts"
import { QUERY_KEY } from "@/modules/loan-application/[module]-financial-projection/constants/query-key.ts"
import { API_PATH } from "@/constants"
import { formatDate } from "@/utils/date.utils.ts"
import { get } from "lodash"

export const useQueryRevenueForm = ({
  applicationId,
  enabled
}: FormDetailsQueryProps) => {
  return useQueryFormBySetupId<SubmitRevenueStreamResponse>({
    setupId: applicationId,
    queryKey: [QUERY_KEY.GET_REVENUE],
    enabled,
    path: API_PATH.financialProjection.revenueStream.findBySetupId
  })
}

export function reverseFormatRevenueResponse(
  response?: SubmitRevenueStreamResponse
): RevenueStream {
  const unitSales = formatFormData<UnitSale>(
    response,
    RevenueResponseType.UNIT_SALES,
    "unitSale"
  )
  const billableHours = formatFormData<BillableHour>(
    response,
    RevenueResponseType.BILLABLE_HOURS,
    "billableHour"
  )
  const recurringCharges = formatFormData<RecurringCharge>(
    response,
    RevenueResponseType.RECURRING_CHARGES,
    "recurringCharge",
    { includeFrequency: true }
  )
  const contracts = formatFormData<Contract>(
    response,
    RevenueResponseType.CONTRACTS,
    "contract",
    { hasEndDate: true }
  )

  const revenueStreamId = response?.forms
    .map((form) => form.id)
    .filter((id) => !!id)
    .at(0)

  return {
    id: revenueStreamId,
    financialProjectionSetupId: revenueStreamId ?? "",
    unitSales: unitSales as UnitSale[],
    billableHours: billableHours as BillableHour[],
    recurringCharges: recurringCharges as RecurringCharge[],
    contracts: contracts as Contract[]
  }
}

const formatFormData = <T extends { startDate?: string; endDate?: string }>(
  response: SubmitRevenueStreamResponse | undefined,
  formType: RevenueResponseType,
  key: keyof SubmitRevenueStreamItemResponse,
  formatOptions: { hasEndDate?: boolean; includeFrequency?: boolean } = {}
) => {
  return (
    response?.forms
      .filter((form) => form.formType === formType)
      .map((form) => {
        const item = form[key] as T
        return {
          ...item,
          startDate: formatDate(item?.startDate, "MM/yyyy"),
          ...(formatOptions.hasEndDate && {
            endDate: formatDate(item?.endDate, "MM/yyyy")
          }),
          ...(formatOptions.includeFrequency && {
            frequency: `${get(item, "frequency", "")}`
          })
        }
      }) ?? []
  )
}
