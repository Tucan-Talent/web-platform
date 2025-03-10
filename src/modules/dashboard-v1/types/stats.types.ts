import { GRAPH_FREQUENCY } from "@/modules/loan-application-management/constants/types/cashflow.type"
import { TimeRangeFilterValue } from "@/types/time-range.type"
import { Usage } from "@/types/usage.type"
import { Dispatch } from "react"

enum DashboardActionType {
  UpdateTimeRange = "UpdateTimeRange",
  UpdateApprovalRateFrequency = "UpdateApprovalRateFrequency",
  UpdateIncompleteApplicationRateFrequency = "UpdateIncompleteApplicationRateFrequency",
  UpdateAverageTimeToApprovalMetricsFrequency = "UpdateAverageTimeToApprovalMetricsFrequency",
  UpdateAverageLoanSizeFrequency = "UpdateAverageLoanSizeFrequency",
  UpdatePortfolioGrowthFrequency = "UpdatePortfolioGrowthFrequency"
}

export { DashboardActionType }

type DashboardAction =
  | {
      type: DashboardActionType.UpdateTimeRange
      payload: DashboardState["filter"]["timeRange"]
    }
  | {
      type: DashboardActionType.UpdateApprovalRateFrequency
      payload: DashboardState["approvalRateFrequency"]
    }
  | {
      type: DashboardActionType.UpdateIncompleteApplicationRateFrequency
      payload: DashboardState["incompleteApplicationRateFrequency"]
    }
  | {
      type: DashboardActionType.UpdateAverageTimeToApprovalMetricsFrequency
      payload: DashboardState["averageTimeToApprovalMetricsFrequency"]
    }
  | {
      type: DashboardActionType.UpdateAverageLoanSizeFrequency
      payload: DashboardState["averageLoanSizeFrequency"]
    }
  | {
      type: DashboardActionType.UpdatePortfolioGrowthFrequency
      payload: DashboardState["portfolioGrowthFrequency"]
    }

type DashboardState = {
  filter: TimeRangeFilterValue
  approvalRateFrequency: GRAPH_FREQUENCY
  incompleteApplicationRateFrequency: GRAPH_FREQUENCY
  averageTimeToApprovalMetricsFrequency: GRAPH_FREQUENCY
  averageLoanSizeFrequency: GRAPH_FREQUENCY
  portfolioGrowthFrequency: GRAPH_FREQUENCY
}

type Stats = {
  totalApplication: number
  applicationUsageLimit: number
  totalApplicationApproved: number
  totalLoanAmount: number
  totalApplicationSubmitted: number
  totalApplicationInReview: number
  totalApplicationDraft: number
  totalApplicationUnderwritten: number
}

type DashboardProviderProps = {
  children: React.ReactNode
}

type DashboardProviderState = {
  dashboardState: DashboardState
  dashboardDispatch: Dispatch<DashboardAction>
  statsData?: Stats
  isLoading?: boolean
  approvalRateData?: ApprovalRateResponse
  isLoadingApprovalRate?: boolean

  incompleteApplicationRateData?: IncompleteApplicationRateResponse
  isLoadingIncompleteApplicationRate?: boolean

  averageTimeToApprovalMetricsData?: AverageTimeToApprovalMetricsResponse
  isLoadingAverageTimeToApprovalMetrics?: boolean

  averageApprovedLoanSizeData?: AverageApprovedLoanSizeResponse
  isLoadingAverageApprovedLoanSize?: boolean

  portfolioGrowthData?: PortfolioGrowthResponse
  isLoadingPortfolioGrowth?: boolean

  usageData?: Usage
  isLoadingUsage?: boolean
}

type LoanApprovalRateStats = {
  date: string
  rate: number
  /** @deprecated unused data */
  noApplicationsSubmitted: number
  /** @deprecated unused data */
  noApplicationsApproved: number
}

type ApprovalRateResponse = {
  loanApprovalRate: LoanApprovalRateStats[]
}

type IncompleteApplicationRateStats = {
  date: string
  rate: number
}

type IncompleteApplicationRateResponse = {
  incompleteApplicationRate: IncompleteApplicationRateStats[]
}

type AverageTimeToApprovalStats = {
  date: string
  averageTimeToApproval: number
}

type AverageTimeToApprovalMetricsResponse = {
  averageTimeToApproval: AverageTimeToApprovalStats[]
}

type AverageApprovedLoanSizeStats = {
  date: string
  loanSize: number
}

type AverageApprovedLoanSizeResponse = {
  averageApprovedLoanSize: AverageApprovedLoanSizeStats[]
}

type PortfolioGrowthResponse = {
  growthSize: PortfolioGrowthStats[]
}

type PortfolioGrowthStats = {
  date: string
  loanSize: number
}
export type {
  AverageTimeToApprovalMetricsResponse,
  IncompleteApplicationRateResponse,
  ApprovalRateResponse,
  AverageApprovedLoanSizeResponse,
  PortfolioGrowthResponse,
  DashboardAction,
  DashboardProviderProps,
  DashboardProviderState,
  DashboardState,
  Stats,
  Usage
}
