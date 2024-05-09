import { toCurrency } from "@/utils"
import { useDashboard } from "../providers/dashboard-provider"
import { DashboardCard } from "./atoms/DashboardCard"
import { StatsTitle } from "./atoms/StatsTitle"

export const PerformanceMetrics = () => {
  const {
    statsData,
    isLoading,
    isLoadingAverageApprovalRate,
    averageApprovalRateData
  } = useDashboard()

  const data = {
    // Only show usage for Lender Admin
    usageOfApplications: statsData?.totalApplication ?? 0,
    totalApprovedLoans: toCurrency(statsData?.totalApplicationApproved ?? 0, 0),
    aggregateLoanAmount: toCurrency(statsData?.totalLoanAmount ?? 0, 0)
  }

  return (
    <div>
      <StatsTitle>Performance Metrics</StatsTitle>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Average Time to Approval"
          isLoading={isLoading}
          value={10}
          unit="Days"
          percentRate={27}
          revert
        />
        <DashboardCard
          title="Average Approval Rate"
          isLoading={isLoadingAverageApprovalRate}
          value={Math.round(
            (averageApprovalRateData?.averageApprovalRate ?? 0) * 100
          )}
          unit="%"
          percentRate={Math.round(
            (averageApprovalRateData?.percentRate ?? 0) * 100
          )}
        />
        <DashboardCard
          title="Average Loan Size"
          isLoading={isLoading}
          value={toCurrency(10, 0)}
          percentRate={15}
        />
        <DashboardCard
          title="Total Approved Loan Amount"
          isLoading={isLoading}
          value={data.aggregateLoanAmount}
          percentRate={30}
        />
      </div>
    </div>
  )
}
