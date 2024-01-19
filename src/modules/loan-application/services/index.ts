import { postRequest } from "@/services/client.service"
import { PlaidInfo, ENDPOINTS, PlaidAction, LinkToken } from "../constants"

export const exchangePublicTokenForAccessToken = async (
  publicToken: string,
  dispatch: React.Dispatch<PlaidAction>
) => {
  const response = await postRequest<string, PlaidInfo>({
    path: ENDPOINTS.PLAID.SET_ACCESS_TOKEN,
    data: `public_token=${publicToken}`,
    config: {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
      }
    }
  })
  if (!response.status) {
    dispatch({
      type: "SET_STATE",
      state: {
        itemId: `no item_id retrieved`,
        accessToken: `no access_token retrieved`,
        isItemAccess: false
      }
    })
    return
  }
  const data = response.data

  dispatch({
    type: "SET_STATE",
    state: {
      itemId: data.itemId,
      accessToken: data.accessToken,
      isItemAccess: true
    }
  })
}

export const generateToken = async (
  isPaymentInitiation: boolean,
  dispatch: React.Dispatch<PlaidAction>
) => {
  // Link tokens for 'payment_initiation' use a different creation flow in your backend.
  const path = isPaymentInitiation
    ? ENDPOINTS.PLAID.CREATE_LINK_TOKEN_FOR_PAYMENT
    : ENDPOINTS.PLAID.CREATE_LINK_TOKEN
  const response = await postRequest<null, LinkToken>({
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

export const getInfo = async (dispatch: React.Dispatch<PlaidAction>) => {
  const response = await postRequest<null, PlaidInfo>({
    path: ENDPOINTS.PLAID.INFO
  })
  if (!response.status) {
    dispatch({ type: "SET_STATE", state: { backend: false } })
    return { paymentInitiation: false }
  }

  const data = response.data

  const paymentInitiation: boolean =
    data.products.includes("payment_initiation")

  dispatch({
    type: "SET_STATE",
    state: {
      products: data.products,
      isPaymentInitiation: paymentInitiation
    }
  })
  return { paymentInitiation }
}
