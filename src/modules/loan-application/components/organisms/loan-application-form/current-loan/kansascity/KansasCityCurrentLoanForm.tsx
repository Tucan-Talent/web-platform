import { useMemo } from "react"

import {
  useLoanApplicationFormContext,
  useLoanApplicationProgressContext
} from "../../../../../providers"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Controller,
  type ControllerRenderProps,
  useForm
} from "react-hook-form"
import _uniqueId from "lodash/uniqueId"
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  DELETE_CURRENT_LOAN_PREFIX,
  NEW_CURRENT_LOAN_PREFIX
} from "../../../../../constants"
import {
  type KansasCityCurrentLoansFormValue,
  kansasCityCurrentLoansFormSchema
} from "@/modules/loan-application/constants/form"
import { FORM_ACTION } from "@/modules/loan-application/providers/LoanApplicationFormProvider"
import { LOAN_APPLICATION_STEPS } from "@/modules/loan-application/models/LoanApplicationStep/type"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { isReviewApplicationStep } from "@/modules/loan-application/services"
import React from "react"
import { useAutoCompleteStepEffect } from "@/modules/loan-application/hooks/useAutoCompleteStepEffect"
import { KansasCityCurrentLoanFormDetails } from "@/modules/loan-application/components/molecules/out-of-box/kansascity/KansasCityCurrentLoanFormDetails"
import { FormSubmitButton } from "@/modules/loan-application/components/atoms/FormSubmitButton"

export function KansasCityCurrentLoanForm() {
  const { dispatchFormAction, currentLoansForm } =
    useLoanApplicationFormContext()
  const kansasCityCurrentLoanForm =
    currentLoansForm as KansasCityCurrentLoansFormValue
  const { finishCurrentStep, step } = useLoanApplicationProgressContext()

  const defaultValues = useMemo(() => {
    return {
      hasOutstandingLoans:
        kansasCityCurrentLoanForm?.hasOutstandingLoans.toString() ?? "",
      currentLoans: kansasCityCurrentLoanForm?.currentLoans ?? []
    }
  }, [
    kansasCityCurrentLoanForm?.hasOutstandingLoans,
    kansasCityCurrentLoanForm?.currentLoans
  ])

  const form = useForm<KansasCityCurrentLoansFormValue>({
    resolver: zodResolver(kansasCityCurrentLoansFormSchema),
    values: defaultValues,
    mode: "onBlur"
  })

  const currentLoansWatch = form.watch("currentLoans")
  const hasOutstandingLoansWatch = form.watch("hasOutstandingLoans")

  const handleAddLoan = () => {
    const currentLoans = form.getValues().currentLoans
    const newLength = currentLoans.push({
      id: _uniqueId(NEW_CURRENT_LOAN_PREFIX),
      lenderName: "",
      loanType: "",
      outstandingLoanBalance: 0,
      originalLoanAmount: 0,
      monthlyPaymentAmount: 0,
      loanTermRemainingInMonths: 0,
      annualInterestRate: 0
    })

    form.setValue("currentLoans", currentLoans, { shouldValidate: true })
    // Defer validation error when a new form is added
    form.trigger("currentLoans").then(() => {
      form.clearErrors(`currentLoans.${newLength - 1}`)
    })
  }

  const handleRemoveLoan = (index: number) => {
    const currentLoans = form.getValues("currentLoans")

    if (
      !currentLoans[index].id.startsWith(NEW_CURRENT_LOAN_PREFIX) &&
      !currentLoans[index].id.startsWith(DELETE_CURRENT_LOAN_PREFIX)
    ) {
      currentLoans[index].id =
        DELETE_CURRENT_LOAN_PREFIX + currentLoans[index].id
      form.setValue("currentLoans", currentLoans)
      form.reset(
        {
          hasOutstandingLoans: "true",
          currentLoans
        },
        { keepValues: true }
      )
      dispatchFormAction({
        action: FORM_ACTION.SET_DATA,
        key: LOAN_APPLICATION_STEPS.CURRENT_LOANS,
        state: { ...form.getValues(), currentLoans }
      })
    } else {
      // Delete in FE only
      const updatedLoans = currentLoans.filter((_, i) => i !== index)

      form.setValue("currentLoans", updatedLoans, {
        shouldValidate: true
      })
    }
  }

  const handleValueChange = (
    value: string,
    field: ControllerRenderProps<
      KansasCityCurrentLoansFormValue,
      "hasOutstandingLoans"
    >
  ) => {
    if (value === "false") {
      // Delete new records only - so that if user turns back to YES, the fetched data persists
      const updatedLoans = currentLoansWatch.filter(
        (item) => !item.id.startsWith(NEW_CURRENT_LOAN_PREFIX)
      )

      form.setValue("currentLoans", updatedLoans)
    } else {
      const isFirstLoan = currentLoansWatch.length === 0

      if (isFirstLoan) {
        // Add default loan form when user chooses YES
        handleAddLoan()
      }
    }
    field.onBlur()
    field.onChange(value.toString())
  }

  const onSubmit = (data: KansasCityCurrentLoansFormValue) => {
    dispatchFormAction({
      action: FORM_ACTION.SET_DATA,
      key: LOAN_APPLICATION_STEPS.CURRENT_LOANS,
      state: data
    })
    finishCurrentStep()
  }

  useAutoCompleteStepEffect(form, LOAN_APPLICATION_STEPS.CURRENT_LOANS)

  return (
    <div
      className={cn(
        "flex flex-col gap-3xl overflow-auto col-span-8 mx-6",
        "md:col-span-6 md:col-start-2 md:mx-auto max-w-screen-sm"
      )}
    >
      <div className="flex flex-col gap-3xl overflow-auto">
        <Form {...form}>
          <Card className="flex flex-col gap-2xl p-4xl rounded-lg h-fit shadow-none">
            <h5 className="text-lg font-semibold">Current Loans</h5>
            <Separator />
            <form>
              <Controller
                control={form.control}
                name="hasOutstandingLoans"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 gap-x-2xl">
                    <FormLabel className="text-text-secondary col-span-6 xl:col-span-4">
                      <p className="text-sm text-text-secondary font-medium mt-4">
                        Does your business currently have outstanding loans?
                      </p>
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(value) =>
                          handleValueChange(value, field)
                        }
                      >
                        <SelectTrigger className="text-base col-span-6 xl:col-span-2 xl:max-w-40 xl:col-end-7 xl:ml-auto">
                          <SelectValue placeholder="Please select..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">
                            <span>Yes</span>
                          </SelectItem>
                          <SelectItem value="false">
                            <span>No</span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>

            {!!hasOutstandingLoansWatch &&
              hasOutstandingLoansWatch != "false" && (
                <div className="mt-6 flex flex-col gap-3xl">
                  {currentLoansWatch.map((item, index: number) => {
                    if (item.id.startsWith(DELETE_CURRENT_LOAN_PREFIX)) {
                      return <React.Fragment key={item.id} />
                    }

                    return (
                      <KansasCityCurrentLoanFormDetails
                        key={item.id}
                        formData={form.getValues().currentLoans[index]}
                        index={index}
                        onRemove={handleRemoveLoan}
                      />
                    )
                  })}
                  <Button
                    className="ml-auto mr-0 mt-4 col-span-1 max-w-36"
                    type="button"
                    variant="outline"
                    onClick={handleAddLoan}
                  >
                    <Plus className="mr-1 w-4" /> Add Loan
                  </Button>
                </div>
              )}
          </Card>
          {!isReviewApplicationStep(step) && (
            <FormSubmitButton
              isDisabled={!form.formState.isValid}
              onSubmit={form.handleSubmit(onSubmit)}
            />
          )}
        </Form>
      </div>
    </div>
  )
}
