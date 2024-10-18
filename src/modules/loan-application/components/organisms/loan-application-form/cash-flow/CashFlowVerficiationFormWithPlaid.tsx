import { FORMAT_DATE_MM_DD_YYYY } from "@/constants/date.constants"
import { cn } from "@/lib/utils"
import { PlaidConfirmAuthorize } from "@/modules/loan-application/components/molecules/plaid/ConfirmAuthorize"
import { PlaidConnectForm } from "@/modules/loan-application/components/molecules/plaid/ConnectForm"
import { LoanApplicationBankAccount } from "@/modules/loan-application/constants/type"
import { usePlaidContext } from "@/modules/loan-application/providers"
import { format } from "date-fns"
import { useCallback, useMemo, useState } from "react"

interface CashFlowVerificationFormWithPlaidProps {
  wrapperClassName?: string
}

export const CashFlowVerificationFormWithPlaid = ({
  wrapperClassName
}: CashFlowVerificationFormWithPlaidProps) => {
  // ----- Confirm authorize
  const [isConformAuthorize, setIsConformAuthorize] = useState(false)

  const onConfirmAuthorize = useCallback((value: boolean) => {
    setIsConformAuthorize(value)
  }, [])

  // ----- Connected accounts
  // TODO: Refactor get connected accounts with new API
  const { institutions } = usePlaidContext()

  const connectedAccounts: LoanApplicationBankAccount[] = useMemo(() => {
    return institutions
      .map((ins) =>
        ins.accounts.map((account) => ({
          institutionName: ins.institutionName,
          bankAccountPk: account.id,
          bankAccountName: account.name,
          connectedOn: account.connectedOn
            ? account.connectedOn
            : format(new Date(), FORMAT_DATE_MM_DD_YYYY)
        }))
      )
      .flat()
      .sort((a, b) => {
        return a.institutionName.localeCompare(b.institutionName)
      })
  }, [institutions])

  const isConnected = useMemo(() => {
    return !!connectedAccounts.length || isConformAuthorize
  }, [isConformAuthorize, connectedAccounts.length])

  return (
    <>
      <PlaidConfirmAuthorize
        wrapperClassName={wrapperClassName}
        confirmCheckbox={{
          disabled: !!connectedAccounts.length,
          checked: isConnected,
          onCheckedChange: onConfirmAuthorize
        }}
      />

      {(!!connectedAccounts.length || isConformAuthorize) && (
        <PlaidConnectForm wrapperClassName={cn(wrapperClassName, "mt-6")} />
      )}
    </>
  )
}
