import { useLoanApplicationDetailContext } from "@/modules/loan-application-management/providers/LoanApplicationDetailProvider"
import { SelectTimeRange } from "@/modules/dashboard-v1/components/SelectTimeRange"
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { getTimeRangeDates } from "@/utils/time-range.utils"
import { TimeRangeValue } from "@/types/time-range.type"
import { DateRange } from "react-day-picker"
import { SectionTitle } from "../../../atoms/cashflows/SectionTitle"
import { Separator } from "@/components/ui/separator"
import { NoiAndTotalDebtPaymentsChart } from "./NoiAndTotalDebtPaymentsChart"
import { LoadingWrapper } from "@/shared/atoms/LoadingWrapper"
import { NoData } from "../../../atoms/NoData"
import { cn } from "@/lib/utils"
import { CashflowGlanceCard } from "../../../molecules/cashflow/CashflowGlanceCard"
import { BankAccountReport } from "./BankAccountReport"
import { RevenueAndExpenseChart } from "./RevenueAndExpenseChart"
import { format } from "date-fns"

type FilterValues = z.infer<typeof FilterSchema>

const FilterSchema = z.object({
  timeRange: z.object({
    selectedTimeRange: z.string().optional(),
    from: z.date().optional(),
    to: z.date().optional()
  })
})

export const CashflowGlanceReport = () => {
  const {
    newCashFlowGlance,
    isFetchingNewCashFlow,
    onChangeNewTimeRangeFilter
  } = useLoanApplicationDetailContext()

  const [showDatePicker, setShowDatePicker] = useState(true)

  const form = useForm<FilterValues>({
    resolver: zodResolver(FilterSchema),
    defaultValues: {
      timeRange: {
        selectedTimeRange: TimeRangeValue.LAST_3_MONTHS,
        ...getTimeRangeDates(TimeRangeValue.LAST_3_MONTHS)
      }
    }
  })

  const customSelectTimeRangeOnChange = () => {
    setShowDatePicker(
      form.getValues("timeRange").selectedTimeRange !== TimeRangeValue.ALL_TIME
    )
    form.setValue(
      "timeRange.selectedTimeRange",
      form.getValues("timeRange").selectedTimeRange
    )
  }

  useEffect(() => {
    const subscription = form.watch(() => {
      const value = form.getValues("timeRange")
        .selectedTimeRange as TimeRangeValue

      if (value !== TimeRangeValue.CUSTOM) {
        const dateRange = getTimeRangeDates(value)
        const fromDate = format(dateRange.from, "yyyy-MM-dd")
        const toDate = format(dateRange.to, "yyyy-MM-dd")
        onChangeNewTimeRangeFilter(fromDate, toDate)
      } else {
        const fromDate = form.getValues("timeRange").from
        const toDate = form.getValues("timeRange").to
        if (!!fromDate && !!toDate) {
          onChangeNewTimeRangeFilter(
            format(fromDate, "yyyy-MM-dd"),
            format(toDate, "yyyy-MM-dd")
          )
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [form, onChangeNewTimeRangeFilter])

  const handleSetDate = (range?: DateRange) => {
    form.setValue("timeRange", {
      from: range?.from,
      to: range?.to,
      selectedTimeRange: TimeRangeValue.CUSTOM
    })
  }

  return (
    <div>
      <div className="flex flex-col space-y-3xl">
        <div className="group date-select-coupling flex items-end">
          <Form {...form}>
            <form>
              <div className="group date-select-coupling flex items-end">
                <SelectTimeRange
                  customOnChange={customSelectTimeRangeOnChange}
                  showLabel={false}
                />

                {showDatePicker && (
                  <div className="flex items-center flex-wrap">
                    <FormField
                      control={form.control}
                      name="timeRange"
                      render={({ field: { value } }) => (
                        <FormItem className="flex items-end space-y-0 gap-1">
                          <DatePickerWithRange
                            date={value}
                            setDate={handleSetDate}
                            className="w-full mt-0 rounded-l-none"
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>
            </form>
          </Form>
        </div>
        <SectionTitle>Cash Flow at a Glance</SectionTitle>

        <LoadingWrapper
          isLoading={isFetchingNewCashFlow}
          className={cn(
            isFetchingNewCashFlow &&
              "pb-10 gap-4 rounded-lg border bg-white min-h-40 flex items-center justify-center shadow-sm"
          )}
        >
          <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
            <CashflowGlanceCard
              title="Revenue / Gross Income"
              value={newCashFlowGlance?.cashFlowGlance.revenue}
              isCurrency={true}
            />
            <CashflowGlanceCard
              title="Operating Expenses"
              value={newCashFlowGlance?.cashFlowGlance.operatingExpenses}
              isCurrency={true}
            />
            <CashflowGlanceCard
              title="Net Operating Income (NOI)"
              value={newCashFlowGlance?.cashFlowGlance.netOperatingIncome}
              isCurrency={true}
            />
            <CashflowGlanceCard
              title="Operating Margin"
              value={newCashFlowGlance?.cashFlowGlance.operatingMargin}
              isPercent={true}
            />
            <CashflowGlanceCard
              title="Total Debt Service (TDS)"
              value={newCashFlowGlance?.cashFlowGlance.totalDebtService}
              isCurrency={true}
            />
            <CashflowGlanceCard
              title="Debt Service Coverage (DSCR)"
              value={newCashFlowGlance?.cashFlowGlance.debtServiceCoverage}
            />
            <CashflowGlanceCard
              title="Debt-to-Income (DTI)"
              value={newCashFlowGlance?.cashFlowGlance.debtToIncome}
              isPercent={true}
            />
          </div>
        </LoadingWrapper>
        <Separator />
        <SectionTitle>Connected Bank Accounts</SectionTitle>
        <div>
          <LoadingWrapper
            isLoading={isFetchingNewCashFlow}
            className={cn(
              isFetchingNewCashFlow &&
                "pb-10 gap-4 rounded-lg border bg-white min-h-40 flex items-center justify-center shadow-sm"
            )}
          >
            {newCashFlowGlance?.bankAccountSummary ? (
              newCashFlowGlance?.bankAccountSummary?.map((data, index) => (
                <BankAccountReport
                  key={index}
                  data={data}
                  isLoading={isFetchingNewCashFlow}
                  className="mb-6"
                />
              ))
            ) : (
              <NoData />
            )}
          </LoadingWrapper>
        </div>
        <Separator />
        <SectionTitle>Charts and Trends</SectionTitle>
        <RevenueAndExpenseChart />
        <NoiAndTotalDebtPaymentsChart />
      </div>
    </div>
  )
}
