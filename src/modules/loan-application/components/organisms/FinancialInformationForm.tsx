import { Card } from "@/components/ui/card"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { zodResolver } from "@hookform/resolvers/zod"
import { Checkbox } from "@/components/ui/checkbox"
import { useForm } from "react-hook-form"
import { FinancialFormValue, financialFormSchema } from "../../constants/form"
import { Button } from "@/components/ui/button"
import { DragDropFileInput } from "@/shared/molecules/DragFileInput"
import { convertFileSizeToMB } from "@/utils"
import { File } from "lucide-react"
import { useLoanApplicationContext } from "../../providers"
import { LOAN_APPLICATION_STEPS } from "../../constants"

export const FinancialInformationForm = () => {
  const items = [
    {
      id: "recurring",
      label: "Recurring"
    },
    {
      id: "subscription",
      label: "Subscription"
    },
    {
      id: "one-time",
      label: "One-time"
    }
  ]

  const { changeProgress, changeStep } = useLoanApplicationContext()

  const form = useForm<FinancialFormValue>({
    resolver: zodResolver(financialFormSchema),
    defaultValues: {
      cashflow: [],
      w2sFile: null
    },
    mode: "onChange"
  })

  const handleSelectFile = (file: File) => {
    form.setValue("w2sFile", file, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true
    })
  }

  const onSubmit = (data: FinancialFormValue) => {
    console.log(data)
    changeProgress(LOAN_APPLICATION_STEPS.CONFIRMATION)
    changeStep(LOAN_APPLICATION_STEPS.CONFIRMATION)
  }

  return (
    <div className="flex flex-col flex-1 gap-3xl">
      <Card className="flex flex-col gap-2xl p-4xl rounded-lg h-fit overflow-auto">
        <h5 className="text-lg font-semibold">Financial Information</h5>
        <Separator />
        <Form {...form}>
          <form className="flex flex-col gap-y-2xl gap-x-4xl">
            <FormItem>
              <FormLabel className="text-sm text-text-secondary font-medium">
                How do you make money? (Check all that apply)
              </FormLabel>
              {items.map((item) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name="cashflow"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={item.id}
                        className="flex flex-row items-center space-x-lg space-y-0 "
                      >
                        <FormControl>
                          <Checkbox
                            className="w-5 h-5"
                            checked={field.value?.includes(item.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, item.id])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== item.id
                                    )
                                  )
                            }}
                            {...field}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          {item.label}
                        </FormLabel>
                      </FormItem>
                    )
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
            <div className="flex flex-col gap-y-sm">
              <p className="text-sm text-text-secondary font-medium">
                Connect your business accounts to report your cash flow and
                income
              </p>
              <Button className="text-primary bg-black w-fit text-white px-lg py-md">
                Connect
              </Button>
            </div>
          </form>
          <div className="flex flex-col gap-y-sm">
            <p className="text-sm text-text-secondary font-medium">
              Do you have any individual income to add? (if yes, upload W2s
              below)
            </p>
            <FormField
              control={form.control}
              name="w2sFile"
              render={() => (
                <FormItem>
                  <DragDropFileInput onFileSelect={handleSelectFile} />
                  {form.getValues("w2sFile") && (
                    <Card className="p-xl gap-2xl flex">
                      <File className="h-10 w-8" />
                      <div className="flex flex-col">
                        <p className="text-sm">
                          {form.getValues("w2sFile").name}
                        </p>
                        <p className="text-sm text-text-tertiary">
                          {`${convertFileSizeToMB(
                            form.getValues("w2sFile").size
                          )} MB`}
                        </p>
                      </div>
                    </Card>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end">
            <Button
              disabled={!form.formState.isValid}
              onClick={form.handleSubmit(onSubmit)}
            >
              Save
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  )
}
