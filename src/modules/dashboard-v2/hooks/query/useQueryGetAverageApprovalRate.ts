import { API_PATH } from "@/constants"
import { postRequest } from "@/services/client.service"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { type AxiosError, type AxiosResponse } from "axios"
import { type ErrorResponse } from "react-router-dom"
import { QUERY_KEY } from "../../constants/dashboard.constants"
import {
  type RateRequest,
  type AverageApprovalRateResponse,
  type DashboardState
} from "../../types/stats.types"
import { useTimeRangeFilter } from "../useTimeRangeFilter"

export const useQueryGetAverageApprovalRate = ({
  filter,
  loanProgramIds
}: DashboardState) => {
  const timeRangeFilter = useTimeRangeFilter(filter)

  return useQuery<
    AxiosResponse<AverageApprovalRateResponse>,
    AxiosError<ErrorResponse>
  >({
    queryKey: [
      QUERY_KEY.DASHBOARD_V2,
      QUERY_KEY.AVERAGE_APPROVAL_RATE,
      filter.timeRange.from,
      filter.timeRange.to,
      loanProgramIds
    ],
    queryFn: async () => {
      if (!timeRangeFilter.from || !timeRangeFilter.to)
        throw new Error("Invalid 'from', 'to' date")

      return postRequest<RateRequest, AverageApprovalRateResponse>({
        path: API_PATH.dashboardV1.getAverageApprovalRate(),
        data: {
          filter: {
            timeRange: { from: timeRangeFilter.from, to: timeRangeFilter.to }
          },
          loanProgramIds: loanProgramIds.length ? loanProgramIds : undefined
        }
      })
    },
    enabled: !!(filter.timeRange.from && filter.timeRange.to),
    placeholderData: keepPreviousData
  })
}
