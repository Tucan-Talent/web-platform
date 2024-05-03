import { useState } from "react"
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts"
import { CARTESIAN_GRID, CHART_DEFAULT } from "../constants/dashboard.constants"
import { TimePeriodsSelection } from "@/modules/loan-application-management/components/molecules/filters/TimePeriodsSelection"
import { GRAPH_FREQUENCY } from "@/modules/loan-application-management/constants/types/cashflow.type"
import { TIME_PERIODS_LONG } from "@/constants/date.constants"
import { useDashboard } from "../providers/dashboard-provider"
import { DashboardActionType } from "../types/stats.types"
import { formatChartMonthly, formatChartWeekly } from "@/utils/date.utils"

// TODO: Integrate API
export const LoanApplicationActivityChart = () => {
  const { dashboardDispatch, dashboardState } = useDashboard()

  const [activeSeries, setActiveSeries] = useState<Array<string>>([])

  const handleLegendClick = (dataKey: string) => {
    if (activeSeries.includes(dataKey)) {
      setActiveSeries(activeSeries.filter((el) => el !== dataKey))
    } else {
      setActiveSeries((prev) => [...prev, dataKey])
    }
  }

  const handleChangeTimePeriod = (timePeriod: string) => {
    dashboardDispatch({
      type: DashboardActionType.UpdateAverageTimeToApprovalMetricsFrequency,
      payload: timePeriod as GRAPH_FREQUENCY
    })
  }

  // Example data, TODO: Replace with API data
  const frameData = [
    {
      name: "2024-04-01",
      total: 100,
      draft: 45,
      submitted: 23,
      inreview: 12,
      approved: 5,
      denied: 10,
      closed: 2
    },
    {
      name: "2024-05-01",
      total: 200,
      draft: 145,
      submitted: 123,
      inreview: 112,
      approved: 15,
      denied: 110,
      closed: 12
    },
    {
      name: "2024-06-01",
      total: 30,
      draft: 15,
      submitted: 15,
      inreview: 5,
      approved: 4,
      denied: 3,
      closed: 2
    }
  ]

  const formatDateByTimePeriod =
    dashboardState.averageTimeToApprovalMetricsFrequency ===
    GRAPH_FREQUENCY.WEEKLY
      ? formatChartWeekly
      : formatChartMonthly

  return (
    <div className="w-full h-[500px] bg-white p-4 md:p-6 rounded-xl border">
      <div className="flex flex-wrap justify-between gap-2 items-center mb-8">
        <h2 className="text-xl text-zinc-500">Loan Application Activities</h2>
        <TimePeriodsSelection
          className="h-8"
          onChangeTimePeriod={handleChangeTimePeriod}
          timePeriod={
            dashboardState.averageTimeToApprovalMetricsFrequency ??
            GRAPH_FREQUENCY.MONTHLY
          }
          timePeriods={TIME_PERIODS_LONG}
        />
      </div>

      <ResponsiveContainer width="100%" height="95%" className="-mx-8">
        <ComposedChart
          data={frameData.map((v) => ({
            ...v,
            incompleteRate: Math.round((v.draft / v.total) * 100),
            approvalRate: Math.round((v.approved / v.submitted) * 100),
            deniedRate: Math.round((v.denied / v.submitted) * 100)
          }))}
          margin={{
            top: 20,
            right: 20,
            left: 20,
            bottom: 20
          }}
        >
          <CartesianGrid {...CARTESIAN_GRID} />
          <Tooltip
            cursor={{ fill: "transparent" }}
            wrapperClassName="text-sm"
            labelFormatter={(value) => formatDateByTimePeriod(value)}
          />

          <XAxis
            dataKey="name"
            fontSize={CHART_DEFAULT.fontSize}
            tickFormatter={(value) => formatDateByTimePeriod(value)}
          />
          <YAxis
            fontSize={CHART_DEFAULT.fontSize}
            tickLine={false}
            axisLine={false}
          />

          <Legend
            iconType="square"
            onClick={(props) => handleLegendClick(props.dataKey as string)}
            wrapperStyle={{ fontSize: "0.875rem", right: -24 }}
            layout="vertical"
            verticalAlign="top"
            align="right"
          />

          <Bar
            hide={activeSeries.includes("draft")}
            unit=" App(s)"
            barSize={18}
            dataKey="draft"
            fill={CHART_DEFAULT.draftColor}
            name="Draft"
          />
          <Bar
            hide={activeSeries.includes("submitted")}
            unit=" App(s)"
            barSize={18}
            dataKey="submitted"
            fill={CHART_DEFAULT.submittedColor}
            name="Submitted"
          />
          <Bar
            hide={activeSeries.includes("inreview")}
            unit=" App(s)"
            barSize={18}
            dataKey="inreview"
            fill={CHART_DEFAULT.inreviewColor}
            name="In-Review"
          />
          <Bar
            hide={activeSeries.includes("approved")}
            unit=" App(s)"
            barSize={18}
            dataKey="approved"
            fill={CHART_DEFAULT.approvedColor}
            name="Approved"
          />
          <Bar
            hide={activeSeries.includes("denied")}
            unit=" App(s)"
            barSize={18}
            dataKey="denied"
            fill={CHART_DEFAULT.deniedColor}
            name="Denied"
          />
          <Bar
            hide={activeSeries.includes("closed")}
            unit=" App(s)"
            barSize={18}
            dataKey="closed"
            fill={CHART_DEFAULT.closedColor}
            name="Closed"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
