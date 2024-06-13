import { postRequest } from "@/services/client.service"
import {
  PlaidInfo,
  ENDPOINTS,
  PlaidAction,
  LinkToken,
  SetAccessTokenRequest
} from "../constants"
import { LOAN_APPLICATION_STEPS } from "../models/LoanApplicationStep/type"
import { AxiosResponse } from "axios"

export const exchangePublicTokenForAccessToken = async (
  publicToken: string,
  dispatch: React.Dispatch<PlaidAction>
) => {
  const response = await postRequest<
    SetAccessTokenRequest,
    AxiosResponse<PlaidInfo>
  >({
    path: ENDPOINTS.PLAID.SET_ACCESS_TOKEN,
    data: {
      publicToken: publicToken
    }
  })

  const data = response?.data?.data

  dispatch({
    type: "SET_STATE",
    state: {
      itemId: data?.itemId,
      isItemAccess: true
    }
  })
  return data
}

export const generateToken = async (dispatch: React.Dispatch<PlaidAction>) => {
  // Link tokens for 'payment_initiation' use a different creation flow in your backend.
  const path = ENDPOINTS.PLAID.CREATE_LINK_TOKEN
  const response = await postRequest<undefined, LinkToken>({
    path
  })
  if (!response.status) {
    dispatch({ type: "SET_STATE", state: { linkToken: null } })
    return
  }
  const data = response.data
  if (data) {
    if (data.error != null) {
      dispatch({
        type: "SET_STATE",
        state: {
          linkToken: null,
          linkTokenError: data.error
        }
      })
      return
    }
    dispatch({ type: "SET_STATE", state: { linkToken: data.linkToken } })
  }
  // Save the link_token to be used later in the Oauth flow.
  localStorage.setItem("link_token", data.linkToken)
}

export const isReviewApplicationStep = (
  currentStep: LOAN_APPLICATION_STEPS
) => {
  return currentStep === LOAN_APPLICATION_STEPS.REVIEW_APPLICATION
}
