import { cn } from "@/lib/utils.ts"
import { Card } from "@/components/ui/card.tsx"
import { Button } from "@/components/ui/button.tsx"
import {
  useLoanApplicationFormContext,
  useLoanApplicationProgressContext
} from "@/modules/loan-application/providers"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FORM_ACTION } from "@/modules/loan-application/providers/LoanApplicationFormProvider.tsx"
import { LOAN_APPLICATION_STEPS } from "@/modules/loan-application/models/LoanApplicationStep/type.ts"
import { useAutoCompleteStepEffect } from "@/modules/loan-application/hooks/useAutoCompleteStepEffect.ts"
import { RHFProvider } from "@/modules/form-template/providers"
import { Separator } from "@/components/ui/separator.tsx"
import {
  ExpenseTaxRateFormValue,
  taxRatesFormSchema
} from "@/modules/loan-application/[module]-financial-projection/components/store/fp-expense-tax-rate-store"
import { RHFPercentageInput } from "@/modules/form-template/components/molecules"

export const TaxRateForm = () => {
  const { taxRates, dispatchFormAction } = useLoanApplicationFormContext()
  const { finishCurrentStep } = useLoanApplicationProgressContext()

  const form = useForm<ExpenseTaxRateFormValue>({
    resolver: zodResolver(taxRatesFormSchema),
    mode: "onBlur",
    defaultValues: taxRates
  })

  const onSubmit = form.handleSubmit((data: ExpenseTaxRateFormValue) => {
    dispatchFormAction({
      action: FORM_ACTION.SET_DATA,
      key: LOAN_APPLICATION_STEPS.TAX_RATES,
      state: data
    })
    finishCurrentStep()
  })

  useAutoCompleteStepEffect(form, LOAN_APPLICATION_STEPS.TAX_RATES)

  return (
    <Card
      className={cn(
        "flex flex-col gap-2xl p-4xl rounded-lg h-fit overflow-auto col-span-8 mx-6 shadow-none text-sm",
        "md:col-span-6 md:col-start-2 md:mx-0"
      )}
    >
      <RHFProvider methods={form} onSubmit={onSubmit}>
        <div className="flex flex-col gap-2xl">
          <div className={"flex flex-col gap-xl p-y-2"}>
            <h5 className="text-lg font-semibold">Tax Rates</h5>
            <h5 className="text-sm font-normal mt-2">
              <strong>Income Tax:</strong> Enter a tax rate to cover income
              taxes (federal, state, local). A 20% rate is a good estimate.
              Taxes apply only when profitable, though unprofitable years may
              still incur some taxes.
            </h5>
          </div>

          <Separator />
          <RHFPercentageInput
            label="Estimate your income tax rate (%)"
            name="incomeTaxRate"
            placeholder="Income tax rate"
            min={0}
            max={100}
            className="flex justify-between items-center"
            styleProps={{
              labelClassName: "text-text-secondary",
              subtitleClassName: "text-xs text-text-tertiary"
            }}
            suffix="%"
            direction="row"
          />

          <div className="flex flex-col gap-2xl mt-4">
            <Button disabled={!form.formState.isValid}>Next</Button>
          </div>
        </div>
      </RHFProvider>
    </Card>
  )
}
