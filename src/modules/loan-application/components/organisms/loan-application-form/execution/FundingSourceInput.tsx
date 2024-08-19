import {
  FieldArrayWithId,
  useFieldArray,
  useFormContext
} from "react-hook-form"
import { ExecutionFormValue } from "@/modules/loan-application/constants/form.ts"
import { useLoanApplicationFormContext } from "@/modules/loan-application/providers"
import { FORM_ACTION } from "@/modules/loan-application/providers/LoanApplicationFormProvider.tsx"
import { LOAN_APPLICATION_STEPS } from "@/modules/loan-application/models/LoanApplicationStep/type.ts"
import { Card } from "@/components/ui/card.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Plus, X } from "lucide-react"
import { SelectInput } from "@/shared/organisms/form/SelectInput.tsx"
import {
  getOptionsByField,
  LAUNCH_KC_EXECUTION_FIELD_NAMES
} from "@/modules/loan-application/components/organisms/loan-application-form/execution/constants.ts"
import { memo, useCallback } from "react"
import { RHFMaskInput } from "@/modules/form-template/components/molecules"

export const FundingSourceInput = () => {
  const { control, getValues } = useFormContext<ExecutionFormValue>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: "fundingSources"
  })
  const { dispatchFormAction } = useLoanApplicationFormContext()
  const handleAddFundingSource = () => {
    append({ sourceType: "", amount: "" })
  }

  const onBlur = useCallback(() => {
    dispatchFormAction({
      action: FORM_ACTION.SET_DATA,
      key: LOAN_APPLICATION_STEPS.EXECUTION,
      state: getValues()
    })
  }, [dispatchFormAction, getValues])

  const onRemove = useCallback(
    (index: number) => () => {
      remove(index)
      onBlur()
    },
    [onBlur, remove]
  )

  return (
    <Card className="flex flex-col gap-2xl p-xl rounded-lg h-fit">
      <h5 className="text-sm font-semibold">
        Select all funding sources that apply and add the amount you have
        received
      </h5>
      {fields.map((source, index) => (
        <EditFundingSource
          key={source.id}
          index={index}
          value={source}
          onRemove={onRemove(index)}
        />
      ))}
      <Button
        type="button"
        variant="outline"
        className="w-min ml-auto border-black gap-2"
        onClick={handleAddFundingSource}
      >
        <Plus className="w-4" />
        Add funding source
      </Button>
    </Card>
  )
}

interface EditFundingSourceProps {
  index: number
  value: FieldArrayWithId<ExecutionFormValue, "fundingSources">
  onRemove: VoidFunction
}

const EditFundingSource = memo((props: EditFundingSourceProps) => {
  const { index, value, onRemove } = props
  const form = useFormContext<ExecutionFormValue>()

  const handleRemove = useCallback(() => {
    onRemove()
  }, [onRemove])

  return (
    <div className="flex flex-col" key={value.id}>
      <div className="flex justify-between items-center">
        <h5 className="font-semibold text-sm text-center align-middle">
          FUNDING SOURCE #{index + 1}
        </h5>
        {form.getValues("fundingSources").length > 1 && (
          <Button
            type="button"
            variant="ghost"
            className="p-4"
            onClick={handleRemove}
          >
            <X className="w-4" />
          </Button>
        )}
      </div>
      <SelectInput
        label="Funding source"
        control={form.control}
        className="flex flex-row items-center justify-between !text-sm  "
        inputClassName="w-56 md:max-w-56 xl:max-w-56"
        options={getOptionsByField(
          LAUNCH_KC_EXECUTION_FIELD_NAMES.FUNDING_SOURCES
        )}
        {...form.register(`fundingSources.${index}.sourceType` as const)}
      />
      <RHFMaskInput
        label="Funding"
        pattern={NUMBER_PATTERN}
        className="flex flex-row items-center w-full justify-between "
        styleProps={{ inputClassName: "w-56 md:max-w-56 xl:max-w-56 xl:w-56" }}
        direction="row"
        {...form.register(`fundingSources.${index}.amount` as const)}
      />
    </div>
  )
})

const NUMBER_PATTERN = "000000000000000000000000000000"
