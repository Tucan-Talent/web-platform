import { API_PATH } from "@/constants"
import { getRequest } from "@/services/client.service"
import { useQuery } from "@tanstack/react-query"
import { ErrorResponse } from "@/types/common.type"
import { QUERY_KEY } from "../../constants/query-key"
import { Notification } from "../../constants/type"
import { AxiosError } from "axios"

export const useQueryGetNotificationDetails = (notificationId: string) => {
  return useQuery<Notification, AxiosError<ErrorResponse>>({
    queryKey: [QUERY_KEY.GET_NOTIFICATION_DETAILS, notificationId],
    queryFn: () => {
      return getRequest({
        path: API_PATH.notification.details,
        params: { id: notificationId }
      })
    },
    enabled: !!notificationId
  })
}
