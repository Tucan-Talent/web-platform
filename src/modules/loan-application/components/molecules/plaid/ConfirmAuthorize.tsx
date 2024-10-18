import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { FormLayout } from "@/modules/loan-application/components/layouts/FormLayout"
import { useTenant } from "@/providers/tenant-provider"
import { CheckedState } from "@radix-ui/react-checkbox"

interface PlaidConfirmAuthorizeProps {
  wrapperClassName?: string
  confirmCheckbox: {
    disabled: boolean
    checked: boolean
    onCheckedChange?(checked: CheckedState): void
  }
}

export const PlaidConfirmAuthorize = ({
  wrapperClassName,
  confirmCheckbox
}: PlaidConfirmAuthorizeProps) => {
  const { tenantData } = useTenant()

  return (
    <FormLayout wrapperClassName={wrapperClassName}>
      <h5 className="text-lg font-semibold">Cash Flow Verification</h5>

      <Separator />

      <div className="flex flex-col gap-y-2xl gap-x-4xl">
        <div className="flex flex-col gap-y-sm">
          <p className="text-sm financial-projection text-muted-foreground">
            Connect your bank accounts securely. This step helps us understand
            your business financial health through cash flow data and expedite
            the loan approval process. Learn how it works{" "}
            <a
              href="https://plaid.com/legal/#consumers"
              className="underline text-black"
              target="_blank"
              rel="noopener noreferrer"
            >
              here
            </a>
            .
          </p>
        </div>
        <div className="flex flex-col gap-lg">
          <div className="flex gap-2 mt-1">
            <Checkbox className="w-5 h-5" {...confirmCheckbox} />
            <p className="text-sm text-gray-700">
              <b>I understand</b> that, by connecting my accounts, I authorize
              Plaid to share my business transaction history with{" "}
              {tenantData?.name ?? ""} for the purpose of evaluating my loan
              application.
            </p>
          </div>
        </div>
      </div>
    </FormLayout>
  )
}
