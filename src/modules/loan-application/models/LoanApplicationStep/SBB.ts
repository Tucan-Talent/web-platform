import {
  isEnablePersonaKycV1,
  isEnableReviewApplicationStep,
  isIgnoredCashFlowSubmission,
  isIgnoredKycSubmission
} from "@/utils/feature-flag.utils"
import { ILoanApplicationStepStrategy, LoanApplicationStep } from "./base"
import {
  LOAN_APPLICATION_STEP_STATUS,
  LOAN_APPLICATION_STEPS,
  STEP_MENU
} from "./type"

export class SBBLoanApplicationStep
  extends LoanApplicationStep
  implements ILoanApplicationStepStrategy
{
  constructor() {
    super()

    this._buildSteps()
  }

  _buildSteps() {
    this._build_extendedSteps([
      {
        step: LOAN_APPLICATION_STEPS.PATRIOT_ACT,
        formType: null,
        label: "USA Patriot Act",
        parent: STEP_MENU.PRE_APPLICATION,
        status: LOAN_APPLICATION_STEP_STATUS.INCOMPLETE
      },
      {
        step: LOAN_APPLICATION_STEPS.PRIVACY_POLICY,
        formType: null,
        label: "Privacy Policy",
        parent: STEP_MENU.PRE_APPLICATION,
        status: LOAN_APPLICATION_STEP_STATUS.INCOMPLETE
      }
    ])
    this._build_BusinessInformationStepPartOne()._build_BusinessInformationStepPartTwo()

    this._build_OwnerInformationStep()

    if (isEnablePersonaKycV1() && !isIgnoredKycSubmission())
      this._build_IdentityVerificationStep()

    if (!isIgnoredCashFlowSubmission()) this._build_CashFlowVerificationStep()

    this._build_CurrentLoansStep()._build_OperatingExpensesStep()

    this._build_BusinessEINLetterStep()
      ._build_CertificateOfGoodStanding()
      ._build_FictitiousNameCertification()
      ._build_ArticlesOfOrganization()
      ._build_ByLaws()

    if (isEnableReviewApplicationStep()) this._build_ReviewApplicationStep()

    return this._build_ConfirmationStep()
  }
}
