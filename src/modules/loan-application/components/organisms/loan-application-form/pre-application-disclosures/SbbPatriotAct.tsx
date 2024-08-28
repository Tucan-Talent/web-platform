import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { RHFCheckbox } from "@/modules/form-template/components/molecules"
import { RHFProvider } from "@/modules/form-template/providers"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  SBB_PRE_APPLICATION_DISCLOSURES,
  sbbPreApplicationDisclosuresSchema,
  SbbPreApplicationDisclosuresValue
} from "./const"
import {
  useLoanApplicationFormContext,
  useLoanApplicationProgressContext
} from "@/modules/loan-application/providers"
import { LOAN_APPLICATION_STEPS } from "@/modules/loan-application/models/LoanApplicationStep/type"
import { FORM_ACTION } from "@/modules/loan-application/providers/LoanApplicationFormProvider"

export const SbbPatriotAct = () => {
  const { dispatchFormAction, patriotAct } = useLoanApplicationFormContext()

  const methods = useForm({
    resolver: zodResolver(sbbPreApplicationDisclosuresSchema),
    reValidateMode: "onBlur",
    defaultValues: patriotAct
  })

  const { finishCurrentStep } = useLoanApplicationProgressContext()

  const onSubmit = (data: SbbPreApplicationDisclosuresValue) => {
    dispatchFormAction({
      action: FORM_ACTION.SET_DATA,
      key: LOAN_APPLICATION_STEPS.PATRIOT_ACT,
      state: data
    })
    finishCurrentStep()
  }

  return (
    <Card
      className={cn(
        "flex flex-col gap-2xl p-4xl rounded-lg h-fit overflow-auto col-span-8 mx-6 shadow-none text-sm",
        "md:col-span-6 md:col-start-2 md:mx-0"
      )}
    >
      <h5 className="text-lg font-semibold">USA Patriot Act</h5>
      <Separator />
      <p>Important Information About Procedures for Opening a New Account.</p>
      <p>
        To help the government fight the funding of terrorism and money
        laundering activities, Federal law requires all financial institutions
        to obtain, verify, and record information that identifies each person
        who opens an account.
      </p>
      <p>
        What this means for you: When you open an account, we will ask for your
        name, address, date of birth, and other information that will allow us
        to identify you. We may also ask to see your driver’s license or other
        identifying documents.
      </p>
      <RHFProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-2xl">
          <RHFCheckbox
            label="I acknowledge receipt of the USA Patriot Act Notification"
            name={SBB_PRE_APPLICATION_DISCLOSURES.PATRIOT_ACT}
          />
          <Button
            disabled={
              !methods.getValues(SBB_PRE_APPLICATION_DISCLOSURES.PATRIOT_ACT)
            }
          >
            Next
          </Button>
        </div>
      </RHFProvider>{" "}
    </Card>
  )
}
