import { LoanApplicationStatus } from "@/types/loan-application.type"
import {
  AUTHENTICITY_LEVEL,
  KYB_VERIFIED_FIELD_STATUS
} from "../constants/type"
import { KYC_STATUS } from "../constants/types/kyc"

export const getClassNameFromStatus = (
  status?: KYB_VERIFIED_FIELD_STATUS | KYC_STATUS | AUTHENTICITY_LEVEL
) => {
  switch (status) {
    case KYB_VERIFIED_FIELD_STATUS.SUCCESS:
    case KYC_STATUS.PASSED:
    case KYC_STATUS.VERIFIED:
    case AUTHENTICITY_LEVEL.HIGH:
      return "success"
    case KYB_VERIFIED_FIELD_STATUS.FAILURE:
    case KYB_VERIFIED_FIELD_STATUS.UNKNOWN:
    case KYC_STATUS.FAILED:
    case KYC_STATUS.UNKNOWN:
    case AUTHENTICITY_LEVEL.LOW:
      return "error"
    case KYC_STATUS.UNCHECKED:
    case KYC_STATUS.UNVERIFIED:
    case KYB_VERIFIED_FIELD_STATUS.WARNING:
    case AUTHENTICITY_LEVEL.MEDIUM:
      return "warning"
    default:
      return "warning"
  }
}

export const getBadgeVariantByStatus = (status: LoanApplicationStatus) => {
  const statusUppercase = status?.toUpperCase()
  switch (statusUppercase) {
    case LoanApplicationStatus.THIRD_PARTY_REJECTED:
      return "red"
    case LoanApplicationStatus.IN_PROGRESS:
    case LoanApplicationStatus.THIRD_PARTY_PENDING:
      return "yellow"
    case LoanApplicationStatus.THIRD_PARTY_APPROVED:
    case LoanApplicationStatus.UNDERWRITTEN:
      return "green"
    default:
      return undefined
  }
}
