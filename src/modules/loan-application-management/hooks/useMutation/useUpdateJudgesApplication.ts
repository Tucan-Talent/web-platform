import { API_PATH } from "@/constants"
import { postRequest } from "@/services/client.service"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ErrorResponse } from "@/types/common.type"
import { AxiosError, AxiosResponse } from "axios"
import { customRequestHeader } from "@/utils/request-header"
import { getAxiosError } from "@/utils/custom-error"
import { TOAST_MSG } from "@/constants/toastMsg"
import { toastError, toastSuccess } from "@/utils"
import {
  ApplicationScore,
  UpdateAssignedJudgeRequest
} from "../../constants/types/judge"
import {
  workspaceAdminAssignJudge,
  workspaceAdminLoanApplicationScoreKeys
} from "../../../../constants/query-key"
import { QUERY_KEY as LOAN_APPLICATION_QUERY_KEY } from "../../constants/query-key"

export const useUpdateJudgesApplication = (applicationId: string) => {
  const queryClient = useQueryClient()

  return useMutation<
    AxiosResponse<ApplicationScore[]>,
    AxiosError<ErrorResponse>,
    UpdateAssignedJudgeRequest
  >({
    mutationFn: (data) => {
      return postRequest({
        path: API_PATH.loanApplicationDetails.updateAssignedJudges(),
        data,
        customHeader: customRequestHeader.customHeaders
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: workspaceAdminAssignJudge.assignableJudges(applicationId)
      })
      queryClient.invalidateQueries({
        queryKey:
          workspaceAdminAssignJudge.getApplicationWithStageScoresResponse(
            applicationId
          )
      })
      queryClient.invalidateQueries({
        queryKey: workspaceAdminLoanApplicationScoreKeys.lists()
      })
      queryClient.invalidateQueries({
        queryKey: [
          LOAN_APPLICATION_QUERY_KEY.GET_LOAN_APPLICATION_SCORE_DETAILS
        ]
      })
      toastSuccess(TOAST_MSG.loanApplication.updateJudgesSuccess)
    },
    onError: (error) => {
      toastError({
        ...TOAST_MSG.loanApplication.updateJudgesSuccess,
        description: getAxiosError(error).message
      })
    }
  })
}
