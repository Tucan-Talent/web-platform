import { UNKNOWN_VALUE } from "@/modules/loan-application-management/constants"
import { useLoanApplicationDetailContext } from "../../../providers/LoanApplicationDetailProvider"
import { InformationRow } from "../../molecules/InformationRow"
import { Separator } from "@/components/ui/separator"
import { formatBirthday } from "@/utils/date.utils"

export const PersonalInfoSummary = () => {
  const { loanSummary } = useLoanApplicationDetailContext()
  const personalInfo = loanSummary?.personalInfo

  return (
    <>
      <InformationRow
        label="Name"
        value={personalInfo?.name ?? UNKNOWN_VALUE}
      />
      <Separator />
      <InformationRow
        label="Date of Birth"
        value={formatBirthday(personalInfo?.dateOfBirth) ?? UNKNOWN_VALUE}
      />
      <Separator />
      <InformationRow
        label="Residential Address"
        value={personalInfo?.residentialAddress ?? UNKNOWN_VALUE}
      />
      <Separator />
      <InformationRow
        label="Email Address"
        value={personalInfo?.email ?? UNKNOWN_VALUE}
      />
    </>
  )
}
