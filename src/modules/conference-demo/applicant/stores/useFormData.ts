import { create } from "zustand"

import { createSelectors } from "@/utils/store.ts"
import { LoanRequest } from "@/modules/conference-demo/applicant/components/organisms/LoanRequestForm.tsx"
import { BusinessInformation } from "@/modules/conference-demo/applicant/components/organisms/BusinessInformationForm.tsx"
import { BusinessPlanRequest } from "../components/organisms/BusinessPlanForm"
interface FormDataSlice {
  loanRequestData: LoanRequest
  businessInformationData: BusinessInformation
  businessPlanData: BusinessPlanRequest
  action: {
    setLoanRequestData: (data: LoanRequest) => void
    setBusinessInformationData: (data: BusinessInformation) => void
    setBusinessPlanData: (data: BusinessPlanRequest) => void
  }
}

const useFormDataBase = create<FormDataSlice>()((set) => ({
  loanRequestData: { loanAmount: 0, proposeUseOfLoan: "" },
  businessInformationData: {
    name: "",
    address: "",
    ein: "",
    website: ""
  },
  businessPlanData: {
    businessPlan: "",
    businessDescription: "",
    socialImpact: "",
    grantsInThreeYears: "",
    revenueGoal: "",
    marketPotential: "",
    briefOverview: "",
    uploadedFiles: undefined
  },
  action: {
    setLoanRequestData: (data: LoanRequest) => set({ loanRequestData: data }),
    setBusinessInformationData: (data: BusinessInformation) =>
      set({ businessInformationData: data }),
    setBusinessPlanData: (data: BusinessPlanRequest) =>
      set({ businessPlanData: data })
  }
}))

export const useFormData = createSelectors(useFormDataBase)
