import { isEnableReviewApplicationStep } from "@/utils/feature-flag.utils"
import { ILoanApplicationStepStrategy, LoanApplicationStep } from "./base"

export class DefaultLoanApplicationStep
  extends LoanApplicationStep
  implements ILoanApplicationStepStrategy
{
  constructor() {
    super()
    this._buildSteps()
  }

  _buildSteps() {
    this._build_LoanRequestStep()
      ._build_BusinessInformationStep()
      ._build_OwnerInformationStep()
      ._build_FinancialInformationStep()

    if (isEnableReviewApplicationStep()) this._build_ReviewApplicationStep()

    return this._build_ConfirmationStep()
  }
}
