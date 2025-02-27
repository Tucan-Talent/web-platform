import { type ForecastRowData } from "@/modules/loan-application/[module]-financial-projection/types"
import {
  type ForecastDataCategory,
  ForecastPeriod,
  type ForecastResultsResponse,
  ForecastType
} from "@/modules/loan-application/[module]-financial-projection/types/financial-projection-forecast"
import { isLoanReady } from "@/utils/domain.utils"
import {
  APPLICATION_SUMMARY,
  ASSESSMENT_SUMMARY,
  FINANCIAL_FORECAST,
  TITLE_REPORT_FOOTER_PDF
} from "../../constants/application"

type PossibleSheetName =
  | "cashFlowForecastMonthly"
  | "balanceSheetForecastMonthly"
  | "incomeStatementForecastMonthly"
  | "cashFlowForecastAnnually"
  | "balanceSheetForecastAnnually"
  | "incomeStatementForecastAnnually"

export function parseForecastDataSingleSheet(
  data: ForecastDataCategory[],
  forecastType: ForecastType
): number[] {
  const forecastGroup = data
  const forecast = forecastGroup.find(
    (item) => item.forecastType === forecastType
  )

  if (!forecast) {
    return []
  }

  return forecast.forecastData.map((item) => item.value)
}

export const generateFooterTitleInPDFFirstPage = () => {
  if (isLoanReady()) {
    return "LoanReady powered by Cyphr"
  }

  return "Cyphr"
}

/**
 * Generates the footer title for a PDF based on the selected export options.
 *
 * @param {ExportFPOption} [type] - The selected export option. If not provided, defaults to "Cyphr".
 *
 * @returns {string} - Returns:
 *   - "Application Summary" if only the "Application Summary" section is selected.
 *   - "Assessment Summary" if both "Application Summary" and "Loan Ready" sections are selected.
 *   - "Financial Forecast" for all other cases.
 *   - "Cyphr" if no export option is provided.
 */
export const generateFooterTitleInPDF = (type?: ExportFPOption) => {
  if (!type) {
    return "Cyphr"
  }

  switch (type) {
    case ExportFPOption.DISCLAIMER_NOTE:
    case ExportFPOption.CASH_FLOW_FORECAST:
    case ExportFPOption.BALANCE_SHEET_FORECAST:
    case ExportFPOption.INCOME_SHEET_FORECAST:
    case ExportFPOption.LOAN_READY_SECTION:
    case ExportFPOption.CASH_FLOW:
    case ExportFPOption.BALANCE_SHEET:
    case ExportFPOption.INCOME_SHEET:
    case ExportFPOption.CHARTS:
    case ExportFPOption.HISTORICAL_INCOME_STATEMENT:
      return TITLE_REPORT_FOOTER_PDF[FINANCIAL_FORECAST]
    case ExportFPOption.APPLICATION_SUMMARY:
      if (isLoanReady()) return TITLE_REPORT_FOOTER_PDF[ASSESSMENT_SUMMARY]

      return TITLE_REPORT_FOOTER_PDF[APPLICATION_SUMMARY]
  }
}

export const generateZipFileName = (
  markedElement: Record<ExportFPOption, boolean>
) => {
  const sections: string[] = []

  const allReportsSelected = Object.values(markedElement).every(Boolean)

  if (allReportsSelected) {
    return "AssessmentSummary_AllReports"
  }

  if (markedElement[ExportFPOption.APPLICATION_SUMMARY]) {
    if (isLoanReady()) {
      sections.push("AssessmentSummary")
    } else {
      sections.push("ApplicationSummary")
    }
  }
  if (markedElement[ExportFPOption.LOAN_READY_SECTION]) {
    sections.push("LoanReady")
  }
  if (
    markedElement[ExportFPOption.CASH_FLOW_FORECAST] ||
    markedElement[ExportFPOption.BALANCE_SHEET_FORECAST] ||
    markedElement[ExportFPOption.INCOME_SHEET_FORECAST]
  ) {
    sections.push("ForecastReports")
  }

  if (
    markedElement[ExportFPOption.CASH_FLOW] ||
    markedElement[ExportFPOption.BALANCE_SHEET] ||
    markedElement[ExportFPOption.INCOME_SHEET]
  ) {
    sections.push("Financials")
  }

  if (markedElement[ExportFPOption.HISTORICAL_INCOME_STATEMENT]) {
    sections.push("HistoricalIncome")
  }

  return sections.join("_") || "documents"
}

export function parseForecastData(
  data: ForecastResultsResponse,
  sheetName: PossibleSheetName,
  forecastType: ForecastType
): number[] {
  const forecastGroup = data[sheetName] ?? []
  const forecast = forecastGroup.find(
    (item) => item.forecastType === forecastType
  )

  if (!forecast) {
    return []
  }

  return forecast.forecastData.map((item) => item.value)
}

interface getDataPointsFactoryArgs {
  dataSource: ForecastResultsResponse | ForecastDataCategory[]
  sheetName?:
    | "cashFlowForecast"
    | "incomeStatementForecast"
    | "balanceSheetForecast"
  dataPoints: ForecastType[]
  period: ForecastPeriod
}

export function getDataPointsFactory(
  args: getDataPointsFactoryArgs
): ForecastRowData {
  const { dataSource, sheetName, dataPoints, period } = args

  const result: ForecastRowData = {} as ForecastRowData

  const sheetSourceName = sheetName
    ? ((period === ForecastPeriod.MONTHLY || period === ForecastPeriod.CURRENT
        ? `${sheetName}Monthly`
        : `${sheetName}Annually`) as PossibleSheetName)
    : null

  dataPoints.forEach((point) => {
    const data = sheetSourceName
      ? parseForecastData(
          dataSource as ForecastResultsResponse,
          sheetSourceName,
          point
        )
      : parseForecastDataSingleSheet(
          dataSource as ForecastDataCategory[],
          point
        )

    result[point] = period === ForecastPeriod.CURRENT ? [data[0]] : data
  })

  return result
}

export function getCashFlowData(
  dataSource: ForecastResultsResponse,
  period: ForecastPeriod
): ForecastRowData {
  const dataPoints = [
    ForecastType.BEGINNING_CASH,
    ForecastType.CHANGE_IN_ACCOUNT_PAYABLE,
    ForecastType.CHANGE_IN_ACCOUNT_RECEIVABLE,
    ForecastType.CHANGE_IN_CASH,
    ForecastType.CHANGE_IN_FIXED_ASSET,
    ForecastType.CHANGE_IN_PAID_IN_CAPITAL,
    ForecastType.DEPRECIATION,
    ForecastType.ENDING_CASH,
    ForecastType.LONG_TERM_DEBT,
    ForecastType.NET_INCOME,
    ForecastType.REPAYMENT_OF_DEBT,
    ForecastType.TOTAL_FINANCING_CASH_FLOW,
    ForecastType.TOTAL_INVESTING_CASH_FLOW,
    ForecastType.TOTAL_OPERATING_CASH_FLOWS
  ]

  return getDataPointsFactory({
    dataSource,
    dataPoints,
    period,
    sheetName: "cashFlowForecast"
  })
}

export function getBalanceSheetData(
  dataSource: ForecastResultsResponse,
  period: ForecastPeriod
): ForecastRowData {
  const dataPoints = [
    ForecastType.ACCOUNT_PAYABLE,
    ForecastType.ACCOUNT_RECEIVABLE,
    ForecastType.ACCUMULATED_DEPRECIATION,
    ForecastType.ACCUMULATED_RETAINED_EARNINGS,
    ForecastType.CASH,
    ForecastType.FIXED_ASSET,
    ForecastType.PAID_IN_CAPITAL,
    ForecastType.TOTAL_ASSETS,
    ForecastType.TOTAL_CURRENT_ASSETS,
    ForecastType.LONG_TERM_DEBT,
    ForecastType.TOTAL_EQUITY,
    ForecastType.TOTAL_LIABILITIES,
    ForecastType.TOTAL_LIABILITY_AND_EQUITY
  ]

  return getDataPointsFactory({
    dataSource,
    dataPoints,
    period,
    sheetName: "balanceSheetForecast"
  })
}

export function getIncomeStatementData(
  dataSource: ForecastResultsResponse | ForecastDataCategory[],
  period: ForecastPeriod
): ForecastRowData {
  const dataPoints = [
    ForecastType.BILLABLE_HOUR,
    ForecastType.CONTRACT_REVENUE,
    ForecastType.DIRECT_COST_REVENUE,
    ForecastType.EBIT,
    ForecastType.EBITDA,
    ForecastType.GROSS_PROFIT,
    ForecastType.GROSS_PROFIT_MARGIN,
    ForecastType.INTEREST_EXPENSE,
    ForecastType.NET_INCOME,
    ForecastType.NET_PROFIT_MARGIN,
    ForecastType.OPERATING_EXPENSES,
    ForecastType.RECURRING_CHARGE,
    ForecastType.REVENUE,
    ForecastType.DEPRECIATION,
    ForecastType.SALARIES_AND_BENEFITS,
    ForecastType.TAXES,
    ForecastType.TOTAL_OPERATING_EXPENSES,
    ForecastType.UNIT_SALE
  ]

  return getDataPointsFactory({
    dataSource,
    dataPoints,
    period,
    sheetName: Array.isArray(dataSource) ? undefined : "incomeStatementForecast"
  })
}

export const enum ExportFPOption {
  DISCLAIMER_NOTE = "DISCLAIMER_NOTE",
  CASH_FLOW_FORECAST = "CASH_FLOW_FORECAST",
  BALANCE_SHEET_FORECAST = "BALANCE_SHEET_FORECAST",
  INCOME_SHEET_FORECAST = "INCOME_SHEET_FORECAST",
  LOAN_READY_SECTION = "LOAN_READY_SECTION",
  CASH_FLOW = "CASH_FLOW",
  BALANCE_SHEET = "BALANCE_SHEET",
  INCOME_SHEET = "INCOME_SHEET",
  CHARTS = "CHARTS",
  APPLICATION_SUMMARY = "APPLICATION_SUMMARY",
  HISTORICAL_INCOME_STATEMENT = "HISTORICAL_INCOME_STATEMENT"
}

export const PDFPageOrder = [
  ExportFPOption.DISCLAIMER_NOTE,
  ExportFPOption.CASH_FLOW_FORECAST,
  ExportFPOption.BALANCE_SHEET_FORECAST,
  ExportFPOption.INCOME_SHEET_FORECAST,
  ExportFPOption.LOAN_READY_SECTION,
  ExportFPOption.BALANCE_SHEET,
  ExportFPOption.CASH_FLOW,
  ExportFPOption.INCOME_SHEET,
  ExportFPOption.APPLICATION_SUMMARY,
  ExportFPOption.HISTORICAL_INCOME_STATEMENT,
  ExportFPOption.CHARTS
]

export const enum PDFPageOrientation {
  PORTRAIT = "portrait",
  LANDSCAPE = "landscape"
}

/**
 * The width of an A4 page in mm by orientation
 */
export const PDFPageWidthByOrientationMapper: Record<
  PDFPageOrientation,
  number
> = {
  [PDFPageOrientation.PORTRAIT]: 210,
  [PDFPageOrientation.LANDSCAPE]: 297
}

export const PdfPageOrientationMapper: Record<
  ExportFPOption,
  PDFPageOrientation
> = {
  [ExportFPOption.DISCLAIMER_NOTE]: PDFPageOrientation.PORTRAIT,
  [ExportFPOption.CASH_FLOW_FORECAST]: PDFPageOrientation.PORTRAIT,
  [ExportFPOption.BALANCE_SHEET_FORECAST]: PDFPageOrientation.PORTRAIT,
  [ExportFPOption.INCOME_SHEET_FORECAST]: PDFPageOrientation.PORTRAIT,
  [ExportFPOption.LOAN_READY_SECTION]: PDFPageOrientation.PORTRAIT,
  [ExportFPOption.CASH_FLOW]: PDFPageOrientation.PORTRAIT,
  [ExportFPOption.BALANCE_SHEET]: PDFPageOrientation.PORTRAIT,
  [ExportFPOption.INCOME_SHEET]: PDFPageOrientation.PORTRAIT,
  [ExportFPOption.CHARTS]: PDFPageOrientation.PORTRAIT,
  [ExportFPOption.APPLICATION_SUMMARY]: PDFPageOrientation.PORTRAIT,
  [ExportFPOption.HISTORICAL_INCOME_STATEMENT]: PDFPageOrientation.LANDSCAPE
}
