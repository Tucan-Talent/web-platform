import { BusinessFormValue, OwnerFormValue } from "../constants/form"
import {
  KYBInformationResponse,
  KYCInformationResponse
} from "../constants/type"
import { getStateCode, getStateName } from "../hooks/useSelectCities"

export const formatKybForm = (rawData: BusinessFormValue) => {
  return {
    ...rawData,
    businessStreetAddress: {
      addressLine1: rawData.addressLine1,
      addressLine2: rawData.addressLine2,
      city: rawData.city,
      state: getStateCode(rawData.state),
      postalCode: rawData.postalCode
    }
  }
}

export const formatKycForm = (rawData: OwnerFormValue) => {
  return {
    ...rawData,
    hasOtherSubstantialStackHolders:
      rawData.hasOtherSubstantialStackHolders === "true",
    businessOwnershipPercentage: Number(rawData.businessOwnershipPercentage)
  }
}

export const reverseFormatKybForm = (rawData: KYBInformationResponse) => {
  return {
    businessLegalName: rawData.businessLegalName,
    addressLine1: rawData.businessStreetAddress?.addressLine1 ?? "",
    addressLine2: rawData.businessStreetAddress?.addressLine2 ?? "",
    city: rawData.businessStreetAddress?.city ?? "",
    state: getStateName(rawData.businessStreetAddress?.state) ?? "",
    postalCode: rawData.businessStreetAddress?.postalCode ?? "",
    businessWebsite: rawData.businessWebsite ?? "",
    businessTin: rawData.businessTin ?? ""
  }
}

export const reverseFormatKycForm = (
  rawData: KYCInformationResponse
): OwnerFormValue => {
  return {
    fullName: rawData.fullName,
    businessRole: rawData.businessRole,
    addressLine1: rawData.addressLine1,
    addressLine2: rawData.addressLine2,
    businessCity: rawData.businessCity,
    businessState: rawData.businessState,
    businessZipCode: rawData.businessZipCode,
    email: rawData.email,
    phoneNumber: rawData.phoneNumber,
    dateOfBirth: rawData.dateOfBirth,
    socialSecurityNumber: rawData.socialSecurityNumber,
    governmentFile: [],
    hasOtherSubstantialStackHolders:
      rawData.hasOtherSubstantialStackHolders.toString(),
    businessOwnershipPercentage: rawData.businessOwnershipPercentage
      ? rawData.businessOwnershipPercentage.toString()
      : ""
  }
}
