import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MM_YYYY_PATTERN } from "@/constants"
import {
  RHFMaskInput,
  RHFNumberInput,
  RHFTextInput
} from "@/modules/form-template/components/molecules"
import { getArrayFieldName } from "@/modules/form-template/components/utils"
import { RHFProvider } from "@/modules/form-template/providers"
import {
  DIRECT_COSTS_DEFAULT_VALUE,
  DirectCostsField,
  directCostsFormSchema,
  type DirectCostsFormValue
} from "@/modules/loan-application/[module]-financial-projection/components/store/direct-costs-store"

import { useAutoCompleteStepEffect } from "@/modules/loan-application/hooks/useAutoCompleteStepEffect"
import { LOAN_APPLICATION_STEPS } from "@/modules/loan-application/models/LoanApplicationStep/type"
import {
  useLoanApplicationFormContext,
  useLoanApplicationProgressContext
} from "@/modules/loan-application/providers"
import { FORM_ACTION } from "@/modules/loan-application/providers/LoanApplicationFormProvider"
import { isReviewApplicationStep } from "@/modules/loan-application/services"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, X } from "lucide-react"
import {
  type FieldArrayWithId,
  type FieldPath,
  useFieldArray,
  useForm,
  useFormContext
} from "react-hook-form"
import { FormLayout } from "@/modules/loan-application/components/layouts/FormLayout"

export function DirectCostsForm() {
  const { directCosts, dispatchFormAction } = useLoanApplicationFormContext()

  const form = useForm<DirectCostsFormValue>({
    resolver: zodResolver(directCostsFormSchema),
    mode: "onBlur",
    defaultValues: directCosts ?? DIRECT_COSTS_DEFAULT_VALUE
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: DirectCostsField.directCosts
  })

  const { finishCurrentStep, step } = useLoanApplicationProgressContext()

  const onSubmit = form.handleSubmit((data) => {
    dispatchFormAction({
      action: FORM_ACTION.SET_DATA,
      key: LOAN_APPLICATION_STEPS.DIRECT_COSTS,
      state: data
    })
    finishCurrentStep()
  })

  const handleAddFounder = () => {
    append({
      directCostName: "",
      directCostDescription: "",
      startDate: "",
      overallRevenue: 0
    })
    onAutoSave()
  }

  const onRemove = (index: number) => () => {
    remove(index)
    onAutoSave()
  }

  const onAutoSave = () => {
    dispatchFormAction({
      action: FORM_ACTION.SET_DATA,
      key: LOAN_APPLICATION_STEPS.DIRECT_COSTS,
      state: form.getValues()
    })
  }

  useAutoCompleteStepEffect(form, LOAN_APPLICATION_STEPS.DIRECT_COSTS)

  return (
    <FormLayout title="Direct Costs">
      <div className="flex flex-col gap-4">
        <h5 className="text-lg font-semibold">
          Direct Costs (Costs of sales/COGS)
        </h5>
        <p className="text-sm financial-projection text-muted-foreground">
          Direct Costs are expenses directly related to creating or delivering a
          product or service. Common direct costs are raw materials to make a
          product, manufacturing supplies, shipping costs, and costs of
          employees or third-party providers who directly contribute to
          production.
        </p>
        <p className="text-sm financial-projection text-muted-foreground">
          This section shouldn’t include costs essential to keeping the business
          running, like rent for your office, salaries for your marketing team,
          or the electricity bill. Those are Operating Expenses; we’ll ask for
          those in the next section.
        </p>
      </div>

      <Separator />
      <div className="grid grid-cols-6 w-full gap-5 items-center text-xs font-medium">
        <p className="row-start-1 col-start-1 col-end-3 text-[#252828]">
          Direct cost name
        </p>
        <p className="row-start-1 col-start-3 col-end-5 text-[#252828]">
          Cost start date
        </p>
        <p className="row-start-1 col-start-5 col-end-7 text-[#252828]">
          Estimated % of overall revenue
        </p>
      </div>
      <RHFProvider methods={form} onSubmit={onSubmit}>
        <div className="flex flex-col gap-6 mb-5">
          {fields.map((founder, index) => (
            <DirectCosts
              key={founder.id}
              index={index}
              value={founder}
              onRemove={onRemove(index)}
            />
          ))}
        </div>

        <div className="flex">
          <Button
            className="w-min ml-auto border-black gap-2"
            type="button"
            variant="outline"
            onClick={handleAddFounder}
          >
            <Plus className="w-4" />
            Add direct cost
          </Button>
        </div>

        {!isReviewApplicationStep(step) && (
          <div className="flex flex-col gap-2xl mt-4">
            <Button disabled={!form.formState.isValid}>Next</Button>
          </div>
        )}
      </RHFProvider>
    </FormLayout>
  )
}

interface DirectCostsProps {
  index: number
  value: FieldArrayWithId<DirectCostsFormValue["directCosts"][number]>
  onRemove: VoidFunction
}

function DirectCosts(props: DirectCostsProps) {
  const { index, value, onRemove } = props
  const form = useFormContext<DirectCostsFormValue>()

  // Apply the requirement, we can remove only when the items > 1
  const isRemovable = form.getValues(DirectCostsField.directCosts).length > 1

  return (
    <div key={value.id} className="flex gap-3">
      <div className="grid grid-cols-6 w-full gap-5 items-center">
        <div className="row-start-1 col-start-1 col-end-3 flex gap-1 flex-col">
          <RHFTextInput
            isHideErrorMessage
            isToggleView
            className="font-medium text-sm"
            label=""
            name={getArrayFieldName<
              DirectCostsField,
              FieldPath<DirectCostsFormValue>
            >(DirectCostsField.directCostsName, index)}
            placeholder="Direct cost name "
            styleProps={{
              inputClassName: "h-6 text-sm max-w-52 -mt-1.5"
            }}
          />
          <RHFTextInput
            isHideErrorMessage
            isToggleView
            className="mt-auto text-xs text-text-secondary"
            label=""
            name={getArrayFieldName<
              DirectCostsField,
              FieldPath<DirectCostsFormValue>
            >(DirectCostsField.directCostsDescription, index)}
            placeholder="Add description"
            styleProps={{ inputClassName: "h-6 text-xs max-w-32 -mb-1.5" }}
          />
        </div>
        <RHFMaskInput
          isHideErrorMessage
          className="row-start-1 col-start-3 col-end-5 mt-2"
          label=""
          name={getArrayFieldName<
            DirectCostsField,
            FieldPath<DirectCostsFormValue>
          >(DirectCostsField.directCostsStartDate, index)}
          pattern={MM_YYYY_PATTERN}
          placeholder="MM/YYYY"
          styleProps={{ inputClassName: "text-sm" }}
        />
        <RHFNumberInput
          isHideErrorMessage
          className="row-start-1 col-start-5 col-end-7 mt-0"
          label=""
          name={getArrayFieldName<
            DirectCostsField,
            FieldPath<DirectCostsFormValue>
          >(DirectCostsField.directCostsOverallRevenue, index)}
          placeholder="Overall revenue"
          styleProps={{ inputClassName: "text-sm no-arrows pr-8" }}
          suffixIcon={<span>%</span>}
        />
      </div>

      {isRemovable ? (
        <div className="flex justify-between items-center">
          <Button
            className="p-0 py-0 h-auto"
            tabIndex={-1}
            type="button"
            variant="ghost"
            onClick={onRemove}
          >
            <X className="w-4" />
          </Button>
        </div>
      ) : null}
    </div>
  )
}
