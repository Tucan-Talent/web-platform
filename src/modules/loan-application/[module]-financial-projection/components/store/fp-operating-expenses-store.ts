import { createDateSchema, createNumberSchema } from "@/constants/validate"
import { NUMBER } from "@/modules/form-template/components/utils"
import * as z from "zod"

export const enum FpOPeratingExpensesField {
  applicationId = "applicationId",
  operatingExpenses = "operatingExpenses",
  operatingExpensesName = `operatingExpenses.${NUMBER}.name`,
  operatingExpensesDescription = `operatingExpenses.${NUMBER}.description`,
  operatingExpensesStartDate = `operatingExpenses.${NUMBER}.startDate`,
  operatingExpensesMonthlyCost = `operatingExpenses.${NUMBER}.monthlyCost`
}

export const fpOperatingExpensesFormSchema = z.object({
  [FpOPeratingExpensesField.applicationId]: z.string().optional(),
  [FpOPeratingExpensesField.operatingExpenses]: z
    .array(
      z.object({
        name: z.string().min(1),
        description: z.string().min(1),
        startDate: createDateSchema(),
        monthlyCost: createNumberSchema({ min: 1 })
      })
    )
    .min(1, "Please add at least one operating expenses.")
})

export const FP_OPERATING_EXPENSES_DEFAULT_VALUE = {
  [FpOPeratingExpensesField.operatingExpenses]: [
    {
      name: "Rent",
      description: "Sales and marketing expenses",
      startDate: "",
      monthlyCost: 0
    },
    {
      name: "Sales and marketing expenses",
      description: "Costs related to promoting and selling products/services",
      startDate: "",
      monthlyCost: 0
    },
    {
      name: "Dues and Subscriptions",
      description:
        "Recurring fees (i.e.software licenses, membership dues, etc.)",
      startDate: "",
      monthlyCost: 0
    },
    {
      name: "Accounting and legal fees",
      description: "Cost related to accounting, legal, or tax services",
      startDate: "",
      monthlyCost: 0
    }
  ]
}

export type FpOperatingExpensesFormValue = z.infer<
  typeof fpOperatingExpensesFormSchema
>
