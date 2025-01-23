import { ButtonLoading } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useElements, useStripe } from "@stripe/react-stripe-js"
import { LoanReadyPlanSelection } from "@/modules/loanready/components/molecules/LoanReadyPlanSelection"
import { Separator } from "@/components/ui/separator"
import { SelectApplicationDialog } from "@/modules/loanready/components/molecules/SelectApplicationDialog"
import { CustomAlertDialog } from "@/shared/molecules/AlertDialog"
import useBoolean from "@/hooks/useBoolean"
import { OrderSummary } from "@/modules/loanready/components/molecules/OrderSummary.tsx"
import { useCreateConfirmIntent } from "@/modules/loanready/hooks/payment/useCreateConfirmIntent"
import { toastError } from "@/utils"
import {
  LoanReadyPlan,
  LoanReadyPlanEnum
} from "@/modules/loanready/constants/package"
import { TOAST_MSG } from "@/constants/toastMsg"
import { PaymentForm } from "@/modules/loanready/components/organisms/PaymentForm"
import { BillingAddressForm } from "@/modules/loanready/components/organisms/BillingAddressForm"
import { usePayment } from "@/modules/loanready/hooks/payment/usePayment"
import { useLocation, useNavigate } from "react-router-dom"
import { APP_PATH } from "@/constants"
import { useLinkApplicationToLoanReadySubscription } from "@/modules/loanready/hooks/payment/useUpdateLinkTransactionAndApplication.ts"
import { useSearchOrderLoanApplications } from "@/modules/loanready/hooks/applications/order-list.ts"
import { LoanApplicationStatus } from "@/types/loan-application.type.ts"
import { useCreateLoanApplicationMutation } from "@/modules/loan-application/hooks/application/useCreateLoanApplicationMutation.ts"
import { LoanType } from "@/types/loan-program.type.ts"
import { UseOfLoan } from "@/types/loan-application.type.ts"
import { useQueryLoanProgramDetailsByType } from "@/modules/loan-application/hooks/program/useQueryLoanProgramDetails.ts"
import { useQueryClient } from "@tanstack/react-query"
import { loanReadyTransactionKeys } from "@/constants/query-key"

const paymentItemSchema = z.object({
  package: z.string().min(1),
  email: z.string().email()
})

type PaymentItemValue = z.infer<typeof paymentItemSchema>

export function PaymentDetail() {
  // Page states
  const { state } = useLocation()
  const navigate = useNavigate()
  const elements = useElements()

  // Boolean States
  const isSelectAppDialogOpen = useBoolean(false)
  const isConfirmPurchaseDialogOpen = useBoolean(false)
  const isPaymentElementValid = useBoolean(false)
  const isAddressElementValid = useBoolean(false)

  // Query list applications filtering plan BASIC
  const { data } = useSearchOrderLoanApplications({
    request: {
      limit: 100,
      offset: 0,
      filter: {
        plan: [LoanReadyPlanEnum.BASIC]
      }
    }
  })

  // Filter submitted applications
  const basicApplications =
    data?.data.data?.filter(
      (application) =>
        application.status.toUpperCase() === LoanApplicationStatus.SUBMITTED
    ) ?? []

  // Payment Form
  const form = useForm<PaymentItemValue>({
    resolver: zodResolver(paymentItemSchema),
    defaultValues: { package: state.package ?? "", email: "" }
  })

  const { mutateLinkForUpgrade, mutateLink } =
    useLinkApplicationToLoanReadySubscription()

  // Loan Request v1 aka Application creation
  const { mutateAsync: createLoanApplication } =
    useCreateLoanApplicationMutation(LoanType.MICRO)

  const loanProgramQuery = useQueryLoanProgramDetailsByType(
    LoanType.MICRO,
    state?.loanProgramId as string
  )

  // Send the payment request to server
  const { mutateAsync: mutateConfirmIntent, isLoading } =
    useCreateConfirmIntent()

  const queryClient = useQueryClient()

  const submitPurchase = async (
    confirmationToken: string,
    applicationId?: string
  ) => {
    const purchasingPackageType =
      form.watch("package") === LoanReadyPlanEnum.BASIC
        ? LoanReadyPlanEnum.BASIC
        : LoanReadyPlanEnum.PLUS
    const payload = {
      amount: LoanReadyPlan[purchasingPackageType].price,
      confirmationToken: confirmationToken,
      type: purchasingPackageType,
      email: form.watch("email")
    }

    await mutateConfirmIntent.mutateAsync(payload, {
      onSuccess: (data) => {
        const paymentTransactionId = data.data.id

        queryClient.invalidateQueries({
          queryKey: loanReadyTransactionKeys.lists()
        })

        if (!applicationId) {
          // create draft application
          createLoanApplication(
            {
              loanProgramId: state.loanProgramId as string,
              loanAmount: loanProgramQuery?.data?.minLoanAmount ?? 0,
              loanTermInMonth: loanProgramQuery?.data?.minTermInMonth ?? 0,
              proposeUseOfLoan: UseOfLoan.OTHER
            },
            {
              onSuccess: ({ data: createdApplicationData }) => {
                mutateLink(createdApplicationData.id, paymentTransactionId)

                navigate(
                  APP_PATH.LOAN_APPLICATION.APPLICATIONS.editing(
                    createdApplicationData.id,
                    createdApplicationData.loanProgram.id
                  ),
                  { replace: true }
                )
              }
            }
          )
        } else {
          mutateLinkForUpgrade(
            paymentTransactionId,
            applicationId,
            state?.loanProgramId as string
          )
        }
      }
    })
  }

  // Stripe
  const stripe = useStripe()
  const { mutateAsync: mutatePayment } = usePayment({
    isLoading,
    submitPurchase
  })

  // Check if form is valid to enable "Purchase" button
  // We'll leave Stripe to handle the form validation for its built-in components
  const isValidForm = () => {
    return (
      form.formState.isValid &&
      stripe &&
      isPaymentElementValid.value &&
      isAddressElementValid.value
    )
  }

  // Handle form submission when user clicks "Purchase"
  const onSubmit = (data: PaymentItemValue) => {
    const selectedPlan = data.package

    if (
      selectedPlan === LoanReadyPlanEnum.BASIC ||
      (selectedPlan === LoanReadyPlanEnum.PLUS && !basicApplications.length)
    ) {
      isConfirmPurchaseDialogOpen.onTrue()
    } else if (selectedPlan === LoanReadyPlanEnum.PLUS) {
      isSelectAppDialogOpen.onTrue()
    }
  }

  // Handle purchase for LoanReady/ LoanReady+ packages
  const handlePurchase = async () => {
    // Edge case: When user refreshes the page and we lost LoanProgramId
    if (!state.loanProgramId) {
      handleInvalidProgramId()

      return
    }
    isConfirmPurchaseDialogOpen.onFalse()
    switch (form.watch("package")) {
      case LoanReadyPlanEnum.BASIC:
      case LoanReadyPlanEnum.PLUS:
        await mutatePayment()
        break
      default:
        toastError({
          title: TOAST_MSG.loanApplication.payment.title,
          description: "Please select a plan"
        })
    }
  }

  // Handle invalid program id
  const handleInvalidProgramId = () => {
    toastError({
      title: TOAST_MSG.loanApplication.payment.title,
      description:
        "There's a problem with your payment process page. Please start over."
    })
    navigate(APP_PATH.LOAN_APPLICATION.APPLICATIONS.index, {
      replace: true
    })
  }

  // Handle 2nd step purchase for LoanReady+ packages
  const handleLoanReadyPlusPurchase = async (applicationId?: string) => {
    isSelectAppDialogOpen.onFalse()
    await mutatePayment(applicationId)
  }

  const clearForm = () => {
    form.reset()
    if (elements) {
      elements.getElement("payment")?.clear()
      elements?.getElement("address")?.clear()
      elements?.getElement("linkAuthentication")?.clear()
    }

    isPaymentElementValid.onFalse()
    isAddressElementValid.onFalse()
  }

  const handleSelectAppDialogCancel = () => {
    clearForm()
    isSelectAppDialogOpen.onFalse()
  }

  const handleConfirmPurchaseDialogCancel = () => {
    clearForm()
    isConfirmPurchaseDialogOpen.onFalse()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => onSubmit(data))}>
        <div className="grid h-full grid-cols-10 p-0">
          <div className="col-span-7 m-0 flex h-full flex-col bg-white px-6xl py-4xl">
            <h3 className="mb-4 text-lg font-semibold text-[#252828]">
              Select your Product
            </h3>
            <LoanReadyPlanSelection />
            <Separator />
            <div className="mt-6 flex flex-col gap-6">
              <PaymentForm isPaymentElementValid={isPaymentElementValid} />
              <Separator />
              <BillingAddressForm
                isAddressElementValid={isAddressElementValid}
              />
            </div>
          </div>
          <div className="sticky top-0 col-span-3 flex h-[calc(100vh-104px)] flex-col justify-between bg-gray-50 px-3xl py-4xl">
            <OrderSummary
              selectedPlan={form.watch("package") as LoanReadyPlanEnum}
            />

            <div className="ml-auto mt-auto flex flex-row gap-2">
              <ButtonLoading variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </ButtonLoading>
              <ButtonLoading
                disabled={!isValidForm()}
                isLoading={isLoading.value}
              >
                Purchase
              </ButtonLoading>
            </div>

            <div className="mt-4 text-right text-xs font-normal">
              By clicking “Purchase” you agree to Cyphr’s{" "}
              <a
                className="font-semibold underline"
                href="https://www.cyphrai.com/terms"
                rel="noopener noreferrer"
                target="_blank"
              >
                Terms
              </a>
              .
            </div>

            <SelectApplicationDialog
              applications={basicApplications}
              isOpen={isSelectAppDialogOpen.value}
              onCanceled={handleSelectAppDialogCancel}
              onConfirmed={handleLoanReadyPlusPurchase}
            />
            <CustomAlertDialog
              cancelText="Cancel"
              confirmText="Confirm"
              description={
                <span className="break-keep">
                  Click 'Confirm' to proceed and finalize your order.
                </span>
              }
              isOpen={isConfirmPurchaseDialogOpen.value}
              title="Confirm your purchase"
              onCanceled={handleConfirmPurchaseDialogCancel}
              onConfirmed={() => handlePurchase()}
            />
          </div>
        </div>
      </form>
    </Form>
  )
}
