import { Icons } from "@/components/ui/icons"
import { APP_PATH } from "@/constants"
import { NavItem } from "@/types/common.type"
import { isKccBank, isLaunchKC, isSbb } from "@/utils/domain.utils"
import { Bell } from "lucide-react"
import { BusinessStreetAddress } from "./type"
import { joinString } from "@/utils"

export const navItems: NavItem[] = [
  {
    title: "Home",
    href: APP_PATH.LOAN_APPLICATION.LOAN_PROGRAM.list,
    icon: Icons.home,
    label: "Home"
  },
  {
    title: "Applications",
    href: APP_PATH.LOAN_APPLICATION.APPLICATIONS.index,
    icon: Icons.folderCheck,
    label: "Applications"
  },
  {
    title: "Notifications",
    href: APP_PATH.LOAN_APPLICATION.NOTIFICATION.list,
    icon: Bell,
    label: "Notifications",
    disabled: isKccBank() || isSbb() || isLaunchKC() // Hide for KCC Bank and SBB
  }
  // Hide because it's not implemented yet
  // {
  //   title: "Settings",
  //   href: APP_PATH.LOAN_APPLICATION.SETTINGS,
  //   icon: Icons.setting,
  //   label: "Settings",
  //   className: "mt-auto mb-3"
  // }
]

export type PlaidInfo = {
  plaidInstitutionId: string
  itemId: string
  requestId: string
  error?: string
}

export type SetAccessTokenRequest = {
  publicToken: string
}

export type LinkToken = {
  linkToken: string
  error?: LinkTokenError
}

export type LinkTokenError = {
  errorMessage: string
  errorCode: string
  errorType: string
}

export const getConfirmationTexts = (tenant: string) => {
  return [
    {
      title: "I understand",
      content: `that the submission of an application for financing with ${tenant} does not mean that ${tenant} will finance or provide any financial services whatsoever. I further understand that approval to finance will come only after all supporting forms have been signed and approved by ${tenant}.`
    },
    {
      title: "I certify",
      content: `the accuracy of the information provided and understand that ${tenant} will be relying on the accuracy of this information when evaluating the company’s application. By submitting this application either by mail, fax, or electronically, the company and the guarantor(s) signing on the Company’s behalf below, each authorize ${tenant} to request all credit reports to verify the validity and accuracy of all information contained herein as well as the reporting to credit agencies. I consent to ${tenant}’s filing of one or more Initial Financing Statements against me or the undersigned company in any or all Uniform Commercial Code jurisdictions, which reflect the collateral as “all assets.”`
    },
    {
      title: "I understand",
      content: `that my signature below authorizes ${tenant} to discuss my loan application and documentation with ${tenant} partners to better serve me.`
    },
    {
      title: "I understand",
      content: `that my signature below authorizes ${tenant} to run an OFAC (Office of Foreign Assets Control) search in order to comply with the Department of Treasury`
    }
  ]
}

export const formatBusinessStreetAddress = (
  address?: BusinessStreetAddress
): string => {
  const addressLine = joinString(
    ", ",
    address?.addressLine1,
    address?.addressLine2
  )
  const addressStateCode = joinString(" ", address?.state, address?.postalCode)
  return joinString(", ", addressLine, address?.city, addressStateCode)
}

export const ENDPOINTS = {
  PLAID: {
    INFO: "api/plaid/info",
    SET_ACCESS_TOKEN: "api/plaid/set-access-token",
    CREATE_PUBLIC_TOKEN: "api/plaid/create-public-token",
    CREATE_PAYMENT_TOKEN: "api/plaid/create-payment-token",
    CREATE_LINK_TOKEN: "api/plaid/create-link-token",
    CREATE_LINK_TOKEN_FOR_PAYMENT: "api/plaid/create-link-token-for-payment"
  }
}

export type PlaidAction = {
  type: "SET_STATE"
  state: Partial<PlaidState>
}

export interface IPlaidAccountProviderData {
  id: string
  name: string
  mask?: string
  type?: string
  subtype?: string
  verificationStatus?: string
  connectedOn?: string
}

export type IPlaidInstitutionProviderData = {
  institutionId: string
  institutionName: string
  accounts: IPlaidAccountProviderData[]
}

export interface PlaidState {
  linkSuccess: boolean
  isItemAccess: boolean
  isPaymentInitiation: boolean
  linkToken: string | null
  accessToken: string | null
  itemId: string | null

  /**
   * ItemIds get from server via API
   */
  fetchedItemIds: string[]

  /**
   * ItemIds get from plaid after exchange token
   */
  itemIds: string[]

  isError: boolean
  backend: boolean
  products: string[]
  linkTokenError: {
    errorMessage: string
    errorCode: string
    errorType: string
  }
  isConnecting: boolean
  institutions: IPlaidInstitutionProviderData[]
}

export const REGEX_PATTERN = {
  PHONE: /^\d{10}$/,
  ZIP_CODE: /^\d{5}(?:[-\s]\d{4})?$/,
  SSN: /^\d{9}$/,
  EIN: /^\d{9}$/,
  WEBSITE: /^(http|https):\/\/[^ "]+$/
}

export const NEW_CURRENT_LOAN_PREFIX = "loan-add-item-"
export const DELETE_CURRENT_LOAN_PREFIX = "loan-delete-item-"
