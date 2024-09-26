import { Button } from "@/components/ui/button.tsx"
import { Card } from "@/components/ui/card.tsx"
import { Separator } from "@/components/ui/separator.tsx"
import { cn } from "@/lib/utils.ts"
import { RHFProvider } from "@/modules/form-template/providers"
import { useFieldArray, UseFieldArrayAppend, useForm } from "react-hook-form"

import {
  useLoanApplicationFormContext,
  useLoanApplicationProgressContext
} from "@/modules/loan-application/providers"
import { LOAN_APPLICATION_STEPS } from "@/modules/loan-application/models/LoanApplicationStep/type.ts"
import { FORM_ACTION } from "@/modules/loan-application/providers/LoanApplicationFormProvider.tsx"
import { useAutoCompleteStepEffect } from "@/modules/loan-application/hooks/useAutoCompleteStepEffect.ts"
import { FC, memo, PropsWithChildren, useCallback, useMemo } from "react"
import { useBoolean } from "@/hooks"
import { AddRevenueTypeDialog } from "@/modules/loan-application/[module]-financial-projection/components/molecules/AddRevenueTypeDialog.tsx"
import { RevenueTypeSelection } from "@/modules/loan-application/[module]-financial-projection/components/molecules/RevenueTypeSelection.tsx"
import {
  BillableHour,
  Contract,
  RecurringCharge,
  RevenueStream,
  RevenueType,
  UnitSale
} from "@/modules/loan-application/[module]-financial-projection/types/revenue-form.ts"
import { get } from "lodash"
import UnitSalesForm from "@/modules/loan-application/[module]-financial-projection/components/molecules/UnitSalesForm.tsx"
import BillableHoursForm from "@/modules/loan-application/[module]-financial-projection/components/molecules/BillableHoursForm.tsx"
import RecurringChargesForm from "@/modules/loan-application/[module]-financial-projection/components/molecules/RecurringChargesForm.tsx"
import ContractRevenueForm from "@/modules/loan-application/[module]-financial-projection/components/molecules/ContractsForm.tsx"
import { zodResolver } from "@hookform/resolvers/zod"
import { revenueFormSchema } from "@/modules/loan-application/[module]-financial-projection/components/store/fp-revenue-store.ts"
import { isReviewApplicationStep } from "@/modules/loan-application/services"

type AppendFunctions = {
  [K in RevenueType]: UseFieldArrayAppend<RevenueStream, K>
}

const RevenueForm = () => {
  const dialog = useBoolean()

  const { finishCurrentStep, step } = useLoanApplicationProgressContext()
  const { dispatchFormAction, revenue } = useLoanApplicationFormContext()

  const form = useForm<RevenueStream>({
    resolver: zodResolver(revenueFormSchema),
    mode: "onBlur",
    defaultValues: {
      id: get(revenue, "id", ""),
      financialProjectionSetupId: get(revenue, "financialProjectionSetupId"),
      unitSales: get(revenue, RevenueType.UNIT_SALES, []),
      billableHours: get(revenue, RevenueType.BILLABLE_HOURS, []),
      contracts: get(revenue, RevenueType.CONTRACTS, []),
      recurringCharges: get(revenue, RevenueType.RECURRING_CHARGES, []).map(
        (data) => ({
          ...data,
          hasUpfrontFee: data.upfrontFee ? "yes" : "no",
          upfrontFee: get(data, "upfrontFee", 0)
        })
      )
    }
  })

  const { watch, handleSubmit, control, getValues } = form

  const formValues = watch()

  const isFormDirty =
    formValues.unitSales.length > 0 ||
    formValues.billableHours.length > 0 ||
    formValues.recurringCharges.length > 0 ||
    formValues.contracts.length > 0

  const canRender = (field: RevenueType): boolean => {
    return watch(field)?.length > 0
  }

  const unitSalesArray = useFieldArray({
    control,
    name: RevenueType.UNIT_SALES
  })
  const recurringChargesArray = useFieldArray({
    control,
    name: RevenueType.RECURRING_CHARGES
  })
  const billableHoursArray = useFieldArray({
    control,
    name: RevenueType.BILLABLE_HOURS
  })
  const contractsArray = useFieldArray({ control, name: RevenueType.CONTRACTS })

  const appendFunctions: AppendFunctions = useMemo(
    () => ({
      [RevenueType.UNIT_SALES]: unitSalesArray.append,
      [RevenueType.RECURRING_CHARGES]: recurringChargesArray.append,
      [RevenueType.BILLABLE_HOURS]: billableHoursArray.append,
      [RevenueType.CONTRACTS]: contractsArray.append
    }),
    [
      billableHoursArray.append,
      contractsArray.append,
      recurringChargesArray.append,
      unitSalesArray.append
    ]
  )

  const appendFunctionFactory = useCallback(
    <T extends RevenueType>(type: T): AppendFunctions[T] =>
      appendFunctions[type],
    [appendFunctions]
  )

  const onAddItemToField = useCallback(
    (
      type: RevenueType,
      data: UnitSale | BillableHour | RecurringCharge | Contract
    ) =>
      () => {
        const fn = appendFunctionFactory(type)
        fn(data as never)
      },
    [appendFunctionFactory]
  )

  const LayoutComponent = isFormDirty ? DefaultLayout : WelcomeLayout

  const onSubmit = (data: RevenueStream) => {
    dispatchFormAction({
      action: FORM_ACTION.SET_DATA,
      key: LOAN_APPLICATION_STEPS.REVENUE,
      state: data
    })
    finishCurrentStep()
  }

  const onBlur = useCallback(() => {
    dispatchFormAction({
      action: FORM_ACTION.SET_DATA,
      key: LOAN_APPLICATION_STEPS.REVENUE,
      state: getValues()
    })
  }, [dispatchFormAction, getValues])

  useAutoCompleteStepEffect(form, LOAN_APPLICATION_STEPS.REVENUE)

  return (
    <LayoutComponent>
      <RHFProvider methods={form} onSubmit={handleSubmit(onSubmit)}>
        {!isFormDirty ? (
          <RevenueTypeSelection onAddItemToField={onAddItemToField} />
        ) : null}

        <AddRevenueTypeDialog
          open={dialog.value}
          onOpenChange={dialog.setValue}
          onConfirm={dialog.onFalse}
          onAddItemToField={onAddItemToField}
        />

        <div className="flex flex-col gap-y-4xl mb-4">
          {canRender(RevenueType.UNIT_SALES) ? (
            <UnitSalesForm onBlur={onBlur} />
          ) : null}
          {canRender(RevenueType.BILLABLE_HOURS) ? (
            <BillableHoursForm onBlur={onBlur} />
          ) : null}
          {canRender(RevenueType.CONTRACTS) ? (
            <ContractRevenueForm onBlur={onBlur} />
          ) : null}
          {canRender(RevenueType.RECURRING_CHARGES) ? (
            <RecurringChargesForm onBlur={onBlur} />
          ) : null}
        </div>

        {isFormDirty ? (
          <div className="w-full flex flex-row-reverse mb-4">
            <Button type="button" className="py-2 my-2" onClick={dialog.onTrue}>
              + Another revenue type
            </Button>
          </div>
        ) : null}

        {!isReviewApplicationStep(step) && (
          <div className="flex flex-col gap-2xl">
            <Button disabled={!form.formState.isValid}>Next</Button>
          </div>
        )}
      </RHFProvider>
    </LayoutComponent>
  )
}

export default memo(RevenueForm)

const WelcomeLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Card
      className={cn(
        "flex flex-col gap-2xl p-4xl rounded-lg h-fit overflow-auto col-span-8 mx-6 shadow-none text-sm",
        "md:col-span-6 md:col-start-2 md:mx-0"
      )}
    >
      <h5 className="text-lg font-semibold">Revenue</h5>
      <div className="text-text-tertiary">
        Select one or more revenue models that best align with your business
        operations and financial reporting requirements.
      </div>
      <Separator />
      {children}
    </Card>
  )
}

const DefaultLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Card
      className={cn(
        "flex flex-col gap-2xl p-4xl rounded-lg h-fit overflow-auto col-span-8 mx-6 shadow-none text-sm",
        "md:col-span-6 md:col-start-2 md:mx-0"
      )}
    >
      <h5 className="text-lg font-semibold">Revenue</h5>
      <Separator />
      {children}
    </Card>
  )
}
