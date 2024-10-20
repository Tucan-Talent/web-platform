import { Icons } from "@/components/ui/icons"
import { APP_PATH } from "@/constants"
import { type NavItem } from "@/types/common.type"
import { isKccBank, isLaunchKC, isLoanReady, isSbb } from "@/utils/domain.utils"
import { Bell } from "lucide-react"
import { type BusinessStreetAddress } from "./type"
import { joinString } from "@/utils"
import { FeatureKey } from "@/hooks/useCanAccess"

export const navItems: NavItem[] = [
  {
    title: "Home",
    href: APP_PATH.LOAN_APPLICATION.LOAN_PROGRAM.list,
    icon: Icons.home,
    label: "Home",
    featureKey: FeatureKey.APPLICANT_HOME
  },
  {
    title: "Applications",
    href: APP_PATH.LOAN_APPLICATION.APPLICATIONS.index,
    icon: Icons.folderCheck,
    label: "Applications",
    featureKey: FeatureKey.APPLICANT_APPLICATION
  },
  {
    title: "Financial Projections",
    href: APP_PATH.LOAN_APPLICATION.FINANCIAL.INDEX(":id"),
    icon: Icons.financial,
    label: "Financial Projections",
    featureKey: FeatureKey.FINANCIAL,
    disabled: !isLoanReady()
  },

  {
    title: "Notifications",
    href: APP_PATH.LOAN_APPLICATION.NOTIFICATION.list,
    icon: Bell,
    label: "Notifications",
    disabled: isKccBank() || isLoanReady() || isSbb() || isLaunchKC(), // Hide for KCC Bank and SBB,
    featureKey: FeatureKey.APPLICANT_APPLICATION
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

export interface PlaidInfo {
  plaidInstitutionId: string
  itemId: string
  requestId: string
  error?: string
}

export interface SetAccessTokenRequest {
  publicToken: string
  plaidInstitutionId?: string
}

export interface LinkToken {
  linkToken: string
  error?: LinkTokenError
}

export interface LinkTokenError {
  errorMessage: string
  errorCode: string
  errorType: string
}

export const launchKcConfirmationTexts = [
  {
    title: "Disclaimer \n",
    content: `\nLaunchKC advises that you not share any trade secrets or other confidential information within this application. During the application review process, applicant information may be shared with individuals within the LaunchKC staff and volunteers on the selection committee. LaunchKC does not make any claims to keep your information confidential. LaunchKC relies on a selection committee made up of business leaders, entrepreneurial support leaders, entrepreneurs, and technical experts to aid in the evaluation of applicants \n 
LaunchKC conducts both personal and business due diligence. We reserve the right to conduct background checks on all founders, co-founders, and/or individuals with any equity stake in the business. LaunchKC, as a steward of public/private dollars, has an obligation to our donors to ensure that the resources that are given to LaunchKC will be used in a manner consistent with the mission of the organization.\n
The LaunchKC Grants Program is not a public solicitation for capital. Please do not include your valuation, capitalization table, a formal request for an equity investment, or other terms associated with a more traditional equity financing capital raise.\n
The LaunchKC Grants Program does not discriminate on the basis of age, disability, race, ethnicity, religion, veteran/military status, sex, sexual orientation, socioeconomic status, and/or nationality. Applicants will be asked to share personal identifying information for the purposes of LaunchKC’s own database. All members of the selection committee are clearly instructed on LaunchKC’s non-discrimination policy and are expected to comply when reviewing and evaluating applications.\n
LaunchKC expressly prohibits any form of harassment related to staff and volunteers. Improper interference with the ability of any LaunchKC employees and/or volunteers to perform their job duties in regard to the Grants Program may result in disqualification from the Grants Program as well as additional punitive action, as appropriate.`
  },
  {
    title: "Certification of Accuracy and Authorization \n",
    content: `\nBy submitting this loan application, I hereby certify that all information provided herein is true, accurate, and complete to the best of my knowledge and belief. I understand that any false or misleading statements may result in the disqualification of this application and potential legal consequences.\n
I further affirm that I am authorized to submit this application on behalf of the Company, and that I have the necessary authority to enter into agreements and commitments on behalf of the company.\n
I acknowledge and agree that the lender may verify the information provided, and I consent to the lender obtaining any additional information necessary to process this application, including credit reports and financial statements.\n
By signing below, I confirm my understanding and agreement to the terms and conditions stated above.\n`
  }
]

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
    SET_ACCESS_TOKEN_V2: "api/plaid/set-access-token-v2",
    CREATE_PUBLIC_TOKEN: "api/plaid/create-public-token",
    CREATE_PAYMENT_TOKEN: "api/plaid/create-payment-token",
    CREATE_LINK_TOKEN: "api/plaid/create-link-token",
    CREATE_LINK_TOKEN_V2: "api/plaid/create-link-token-v2",
    CREATE_LINK_TOKEN_FOR_PAYMENT: "api/plaid/create-link-token-for-payment"
  }
}

export interface CreateLinkTokenRequest {
  routingNumber?: string
  plaidInstitutionId: string
}

export interface PlaidAction {
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

export interface IPlaidInstitutionProviderData {
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
