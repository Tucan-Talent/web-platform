import { API_PATH } from "@/constants"
import * as z from "zod"
import { postRequest } from "@/services/client.service"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ErrorResponse } from "@/types/common.type"
import { UserInfo } from "@/types/user.type"
import { AxiosError, AxiosResponse } from "axios"
import { customRequestHeader } from "@/utils/request-header"
import { toastError, toastSuccess } from "@/utils"
import { TOAST_MSG } from "@/constants/toastMsg"
import { getAxiosError } from "@/utils/custom-error"
import { invitationKeys } from "@/constants/query-key"
import { InvitationDetail } from "@/types/upload.type"

export const adminSendInvitationForm = z.object({
  roles: z
    .string()
    .min(1, "Please select a role.")
    .transform((role) => role.toLocaleLowerCase()),
  institutionId: z.string().min(1, "Please select an institution."),
  email: z.string().email({ message: "Enter a valid email address." }),
  expirationDays: z.string().min(1, "Please select an expiration day.")
})

export const adminSendBulkInvitationForm = z.object({
  emails: z.array(z.string()).nonempty("Please enter at least one email."),
  role: z
    .string()
    .min(1, "Please select a role.")
    .transform((role) => role.toLocaleLowerCase())
})

export const adminSendBulkCsvInvitationForm = z.object({
  file: z.instanceof(File).nullable()
})

export type AdminSendInvitationValue = z.infer<
  typeof adminSendInvitationForm
> & {
  baseUrl: string
}

export const useSendInvitation = () => {
  const queryClient = useQueryClient()

  return useMutation<
    AxiosResponse<UserInfo>,
    AxiosError<ErrorResponse>,
    AdminSendInvitationValue
  >({
    mutationFn: ({ email, roles, institutionId, baseUrl, expirationDays }) => {
      return postRequest({
        path: API_PATH.admin.user.sendInvitation,
        data: { email, roles: [roles], institutionId, baseUrl, expirationDays },
        customHeader: customRequestHeader.customHeaders
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invitationKeys.lists() })
      toastSuccess(TOAST_MSG.user.sendInvitation)
    },
    onError: (error) => {
      toastError({
        ...TOAST_MSG.user.sendInvitation,
        description: getAxiosError(error).message
      })
    }
  })
}

export type AdminSendBulkInvitationValue = z.infer<
  typeof adminSendBulkInvitationForm
> & {
  baseUrl: string
  expirationDays: string
}

export type AdminSendBulkCsvInvitationValue = z.infer<
  typeof adminSendBulkCsvInvitationForm
> & {
  baseUrl: string
  expirationDays: string
}

export const useSendBulkCsvInvitation = () => {
  const queryClient = useQueryClient()

  return useMutation<
    AxiosResponse<InvitationDetail>,
    AxiosError<ErrorResponse>,
    AdminSendBulkCsvInvitationValue
  >({
    mutationFn: ({ file, baseUrl, expirationDays }) => {
      const formData = new FormData()
      if (file) {
        formData.append("file", file)
      }
      formData.append("baseUrl", baseUrl)
      formData.append("expirationDays", expirationDays)

      return postRequest({
        path: API_PATH.admin.user.sendBulkCsvInvitation,
        data: formData
      })
    },
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({ queryKey: invitationKeys.lists() })
      if (data.failedInvitations > 0) {
        toastError({
          ...TOAST_MSG.user.sendInvitation,
          description: `Failed to send ${data.failedInvitations} invitations.`
        })
      } else {
        toastSuccess(TOAST_MSG.user.sendInvitation)
      }
    },
    onError: (error) => {
      toastError({
        ...TOAST_MSG.user.sendInvitation,
        description: getAxiosError(error).message
      })
    }
  })
}

export const useSendBulkInvitation = () => {
  const queryClient = useQueryClient()

  return useMutation<
    AxiosResponse<InvitationDetail>,
    AxiosError<ErrorResponse>,
    AdminSendBulkInvitationValue
  >({
    mutationFn: ({ emails, role, baseUrl, expirationDays }) => {
      return postRequest({
        path: API_PATH.admin.user.sendBulkListInvitation,
        data: {
          emails,
          role: role,
          baseUrl,
          expirationDays
        },
        customHeader: customRequestHeader.customHeaders
      })
    },
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({ queryKey: invitationKeys.lists() })
      if (data.failedInvitations > 0) {
        toastError({
          ...TOAST_MSG.user.sendInvitation,
          description: `Failed to send ${data.failedInvitations} invitations.`
        })
      } else {
        toastSuccess(TOAST_MSG.user.sendInvitation)
      }
    },
    onError: (error) => {
      toastError({
        ...TOAST_MSG.user.sendInvitation,
        description: getAxiosError(error).message
      })
    }
  })
}
