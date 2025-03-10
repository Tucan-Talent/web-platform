// ENUM
enum LoanType {
  MICRO = "micro",
  READINESS = "readiness",
  LENDERS_FORUM = "lenders_forum"
}

enum InterestRateType {
  FIXED = "fixed",
  VARIABLE = "variable",
  FLOATING = "floating",
  PROMOTIONAL = "promotional"
}

export { LoanType, InterestRateType }

// INTERFACE
interface LoanProgram {
  id: string
  institutionId: string
  name: string
  type: string
  createdAt: string
  description: string
  minLoanAmount: number
  maxLoanAmount: number
  minTermInMonth: number
  maxTermInMonth: number
  interestRate: number
  interestRateType: string
  interestRateDescription: string
  originationFee: number
}

interface BaseLoanProgramType {
  id: string
  institutionId: string
  name: string
  type: LoanType
  description: string
  createdAt: string
  updatedAt: string
  deletedAt?: string
  coverPhotoUrl?: string
}

export interface MicroLoanProgramType extends BaseLoanProgramType {
  id: string
  minTermInMonth: number
  maxTermInMonth: number
  interestRate: number
  interestRateType: LoanProgramInterestRateType
  interestRateDescription: string
  originationFee: number
  minLoanAmount: number
  maxLoanAmount: number
}

enum LoanProgramInterestRateType {
  FIXED = "FIXED",
  VARIABLE = "VARIABLE",
  FLOATING = "FLOATING",
  PROMOTIONAL = "PROMOTIONAL"
}

export type { LoanProgram, BaseLoanProgramType }
