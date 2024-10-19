import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { type ReactNode, useCallback, useEffect, useMemo } from "react"
import { Form } from "@/components/ui/form"
import { usePersona } from "@/lib/persona/usePersona"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, LockKeyhole, ShieldCheck, UserCheck, Zap } from "lucide-react"
import { useForm } from "react-hook-form"
import {
  createIdentityVerificationSchema,
  type IdentityVerificationValue
} from "../../../constants/form"
import { LOAN_APPLICATION_STEPS } from "../../../models/LoanApplicationStep/type"
import {
  useLoanApplicationFormContext,
  useLoanApplicationProgressContext
} from "../../../providers"
import { FORM_ACTION } from "../../../providers/LoanApplicationFormProvider"
import { PersonaStatus } from "@/lib/persona/persona.types.ts"
import { useParams } from "react-router-dom"
import { isEnableKycReOrder } from "@/utils/feature-flag.utils.ts"
import { isReviewApplicationStep } from "@/modules/loan-application/services"
import { FormSubmitButton } from "../../atoms/FormSubmitButton"
import { isSbb } from "@/utils/domain.utils.ts"
import { ButtonLoading } from "@/components/ui/button"

function VerifyInfoItem({
  leftIcon,
  title,
  subtitle
}: {
  leftIcon: ReactNode
  title: string
  subtitle: ReactNode
}) {
  return (
    <div className="flex gap-2 text-sm">
      <div>{leftIcon}</div>
      <div>
        <h5 className="mb-1 font-semibold">{title}</h5>
        <div className="text-sm text-text-secondary font-medium">
          {subtitle}
        </div>
      </div>
    </div>
  )
}

interface IdentityVerificationFormProps {
  wrapperClassName?: string
}

export function IdentityVerificationForm({
  wrapperClassName
}: IdentityVerificationFormProps) {
  const { dispatchFormAction, identityVerificationForm } =
    useLoanApplicationFormContext()

  const { id: loanApplicationId } = useParams()
  /**
   * Persona Kyc
   */
  const { handleOpenPersona, isOpening, inquiryData } = usePersona({
    applicationId: loanApplicationId
  })

  const { finishCurrentStep, completeSpecificStep, step } =
    useLoanApplicationProgressContext()

  const defaultValues: IdentityVerificationValue = useMemo(() => {
    return {
      smartKycId: identityVerificationForm?.smartKycId,
      inquiryId: identityVerificationForm?.inquiryId,
      status: identityVerificationForm?.status
    }
  }, [
    identityVerificationForm?.inquiryId,
    identityVerificationForm?.smartKycId,
    identityVerificationForm?.status
  ])

  const form = useForm<IdentityVerificationValue>({
    resolver: zodResolver(createIdentityVerificationSchema()),
    defaultValues
  })

  const dispatchInquiryData = useCallback(
    (data: IdentityVerificationValue) => {
      dispatchFormAction({
        action: FORM_ACTION.SET_DATA,
        key: LOAN_APPLICATION_STEPS.IDENTITY_VERIFICATION,
        state: data
      })
    },
    [dispatchFormAction]
  )

  const onSubmit = (data: IdentityVerificationValue) => {
    dispatchInquiryData(data)
    finishCurrentStep()
  }

  /**
   * Listen completeData to update form value
   */
  useEffect(() => {
    if (inquiryData) {
      form.setValue("inquiryId", inquiryData?.inquiryId, {
        shouldValidate: true
      })
      if (
        inquiryData?.status?.toLowerCase() ===
          PersonaStatus.COMPLETED.toLowerCase() ||
        inquiryData?.status?.toLowerCase() ===
          PersonaStatus.APPROVED.toLowerCase()
      ) {
        form.setValue("status", inquiryData?.status, {
          shouldValidate: true
        })
        /**
         * The completeCurrentStep function will help us mark done the identity verification step
         *  when the client finish verify Persona
         */
        completeSpecificStep(LOAN_APPLICATION_STEPS.IDENTITY_VERIFICATION)
      }
      const defaultValue = form.getValues()
      const identityVerificationValue: IdentityVerificationValue = {
        ...defaultValue,
        inquiryId: inquiryData?.inquiryId,
        status: inquiryData?.status
      }

      dispatchInquiryData(identityVerificationValue)
    }
  }, [completeSpecificStep, inquiryData, form, dispatchInquiryData])

  const renderCompletedBtn = isSbb() ? (
    <div className="rounded-lg flex items-center border border-success justify-center gap-1 font-semibold text-success bg-white h-10 px-4 py-2">
      Connected
      <Check className="w-5 h-5" />
    </div>
  ) : (
    <div className="rounded-lg flex items-center justify-center gap-1 font-semibold text-white bg-primary h-10 px-4 py-2">
      {isEnableKycReOrder() ? "Completed" : "Verified"}
      <Check className="w-5 h-5" />
    </div>
  )

  return (
    <Form {...form}>
      <Card
        className={cn(
          "flex flex-col gap-2xl p-4xl rounded-lg h-fit overflow-auto col-span-8 mx-6 shadow-none",
          "md:col-span-6 md:col-start-2 md:mx-auto max-w-screen-sm",
          wrapperClassName
        )}
      >
        <div className="flex gap-2 justify-between items-center">
          <h5 className="text-lg font-semibold">Identity Verification</h5>
          <div className="text-sm">
            {!form.formState.isValid ? (
              <ButtonLoading
                className="rounded-lg flex gap-1.5 font-semibold"
                isLoading={isOpening}
                variant="outline"
                onClick={handleOpenPersona}
              >
                Start Verification <UserCheck className="w-5 h-5" />
              </ButtonLoading>
            ) : (
              renderCompletedBtn
            )}
          </div>
        </div>
        <Separator />
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-5">
            <VerifyInfoItem
              leftIcon={<ShieldCheck className="w-5 h-5" />}
              subtitle="Verify to ensure the security of your account"
              title="Safety first"
            />
            <VerifyInfoItem
              leftIcon={<Zap className="w-5 h-5" />}
              subtitle="Verification usually takes less than a few minutes and is encrypted."
              title="Fast and secure"
            />
            <VerifyInfoItem
              leftIcon={<LockKeyhole className="w-5 h-5" />}
              subtitle={
                <p>
                  To learn how our service provider uses data you provide, see
                  their{" "}
                  <a
                    className="underline"
                    href="https://withpersona.com/legal/privacy-policy"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Privacy Statement
                  </a>
                </p>
              }
              title="How we verify you"
            />
          </div>
          {!isReviewApplicationStep(step) && (
            <FormSubmitButton
              isDisabled={!form.formState.isValid}
              onSubmit={form.handleSubmit(onSubmit)}
            />
          )}
        </div>
      </Card>
    </Form>
  )
}
