import { useMemo } from "react"
import {
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts"
import { useDashboard } from "../providers/dashboard-provider"
import { TimePeriodsSelection } from "@/modules/loan-application-management/components/molecules/filters/TimePeriodsSelection"
import { DashboardActionType } from "../types/stats.types"
import { GRAPH_FREQUENCY } from "@/modules/loan-application-management/constants/types/cashflow.type"

type RateChartData = {
  approvalRate: number
  incompleteApplication: number
}

export function RateChart() {
  const {
    approvalRateData,
    incompleteApplicationRateData,
    dashboardDispatch,
    dashboardState
  } = useDashboard()

  const rateChartData = useMemo(() => {
    const dateMapping = new Map<string, RateChartData>()

    approvalRateData?.loanApprovalRate.forEach((value) => {
      dateMapping.set(value.date, {
        approvalRate: value.rate,
        incompleteApplication: 0
      })
    })

    incompleteApplicationRateData?.incompleteApplicationRate.forEach(
      (value) => {
        const previousData = dateMapping.get(value.date) || {
          approvalRate: 0,
          incompleteApplication: 0
        }

        dateMapping.set(value.date, {
          ...previousData,
          incompleteApplication: value.rate
        })
      }
    )

    return [...dateMapping].map(([date, value]) => ({
      date,
      approvalRate: value.approvalRate * 100,
      incompleteApplicationRate: value.incompleteApplication * 100
    }))
  }, [
    approvalRateData?.loanApprovalRate,
    incompleteApplicationRateData?.incompleteApplicationRate
  ])

  const handleChangeTimePeriod = (timePeriod: string) => {
    dashboardDispatch({
      type: DashboardActionType.UpdateIncompleteApplicationRateFrequency,
      payload: timePeriod as GRAPH_FREQUENCY
    })
  }

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-xl font-medium mb-2">Performance Metrics</h1>
        {!!approvalRateData?.loanApprovalRate.length &&
          !!incompleteApplicationRateData?.incompleteApplicationRate.length && (
            <TimePeriodsSelection
              onChangeTimePeriod={handleChangeTimePeriod}
              timePeriod={
                dashboardState.incompleteApplicationRateFrequency ??
                GRAPH_FREQUENCY.MONTHLY
              }
            />
          )}
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <ComposedChart
          data={rateChartData}
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="date" interval={"preserveStartEnd"} fontSize={12} />
          <YAxis fontSize={12} unit="%" />
          <Tooltip wrapperClassName="text-sm" />
          <Legend wrapperStyle={{ fontSize: "0.875rem" }} />
          <Line
            name="Approval Rate"
            type="monotone"
            dataKey="approvalRate"
            stroke="#22c55d"
            unit="%"
          />
          <Line
            name="Incomplete Application Rate"
            type="monotone"
            dataKey="incompleteApplicationRate"
            stroke="black"
            unit="%"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
