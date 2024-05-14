import { API_PATH } from "@/constants"
import { postRequest } from "@/services/client.service"
import { isEnableDashboardV2 } from "@/utils/feature-flag.utils"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { AxiosError, AxiosResponse } from "axios"
import { ErrorResponse } from "react-router-dom"
import { QUERY_KEY } from "../../constants/dashboard.constants"
import {
  DashboardState,
  RateRequest,
  StatsResponse
} from "../../types/stats.types"
import { useTimeRangeFilter } from "./useTimeRangeFilter"

export const useQueryGetInstitutionActivity = ({
  filter,
  loanProgramIds
}: DashboardState) => {
  const timeRangeFilter = useTimeRangeFilter(filter)

  return useQuery<AxiosResponse<StatsResponse>, AxiosError<ErrorResponse>>({
    queryKey: [
      QUERY_KEY.INSTITUTION_ACTIVITIES,
      filter.timeRange.from,
      filter.timeRange.to,
      loanProgramIds
    ],
    queryFn: async () => {
      if (!timeRangeFilter.from || !timeRangeFilter.to)
        throw new Error("Invalid 'from', 'to' date")

      return postRequest<RateRequest, StatsResponse>({
        path: API_PATH.dashboardV1.getInstitutionActivity(),
        data: {
          filter: {
            timeRange: { from: timeRangeFilter.from, to: timeRangeFilter.to }
          },
          loanProgramIds: loanProgramIds.length ? loanProgramIds : undefined
        }
      })
    },
    enabled: !!(
      filter.timeRange.from &&
      filter.timeRange.to &&
      isEnableDashboardV2()
    ),
    placeholderData: keepPreviousData
  })
}
