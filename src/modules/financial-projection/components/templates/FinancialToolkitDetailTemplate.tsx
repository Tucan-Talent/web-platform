import { ComponentType, FC } from "react"
import { SCREEN } from "@/modules/financial-projection/constants"
import { useFinancialToolkitStore } from "@/modules/financial-projection/store/useFinancialToolkitStore.ts"
import RecurringChargesForm from "@/modules/financial-projection/components/organisms/RecurringChargesForm.tsx"
import ContractRevenueForm from "@/modules/financial-projection/components/organisms/ContractRevenueForm.tsx"
import PeopleExpenseForm from "@/modules/financial-projection/components/organisms/PeopleExpensesForm.tsx"
import UnitSalesForm from "@/modules/financial-projection/components/organisms/UnitSalesForm.tsx"
import BillableHoursForm from "@/modules/financial-projection/components/organisms/BillableHoursForm.tsx"

// TODO: remove this
const KhoaiMon = () => {
  return <div>KhoaiMon</div>
}

// TODO: CHANGE THE COMPONENT HERE
const ScreenMapper: { [key: string]: ComponentType } = {
  [SCREEN.INPUT_RECURRING_CHARGES]: RecurringChargesForm,
  [SCREEN.INPUT_CONTRACT_REVENUE]: ContractRevenueForm,
  [SCREEN.INPUT_UNIT_SALES]: UnitSalesForm,
  [SCREEN.INPUT_BILLABLE_HOURS]: BillableHoursForm,

  [SCREEN.INPUT_PEOPLE]: PeopleExpenseForm,
  [SCREEN.INPUT_COST_OF_GOODS_SOLD]: KhoaiMon, // TODO: fix me
  [SCREEN.INPUT_GENERAL_ADMIN]: KhoaiMon, // TODO: fix me
  [SCREEN.INPUT_TAXES]: KhoaiMon, // TODO: fix me

  [SCREEN.INPUT_ASSETS]: KhoaiMon, // TODO: fix me
  [SCREEN.INPUT_DEBT_SCHEDULE]: KhoaiMon, // TODO: fix me
  [SCREEN.INPUT_EQUITY]: KhoaiMon, // TODO: fix me

  [SCREEN.EXPORT_FORECAST_FOR_USE]: KhoaiMon, // TODO: fix me

  [SCREEN.ASSUMPTIONS]: KhoaiMon, // TODO: fix me
  [SCREEN.INCOME]: KhoaiMon, // TODO: fix me
  [SCREEN.BALANCE]: KhoaiMon, // TODO: fix me
  [SCREEN.CASH_FLOW]: KhoaiMon // TODO: fix me
}

interface Props {}

const FinancialToolkitDetailTemplate: FC<Props> = () => {
  const currentScreen = useFinancialToolkitStore.use.currentScreen()
  const Component = ScreenMapper[currentScreen]
  return <Component />
}
export default FinancialToolkitDetailTemplate
