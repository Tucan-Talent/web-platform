import {
  getDataPointsFactory,
  useQueryFinancialProjectionForecast
} from "@/modules/loan-application/[module]-financial-projection/hooks/useQueryFinancialProjectionForecast.ts"
import { useMemo, useRef, useState } from "react"
import { SectionRow } from "@/modules/loan-application/[module]-financial-projection/components/molecules/SectionRow.tsx"
import { DataRow } from "@/modules/loan-application/[module]-financial-projection/components/molecules/DataRow.tsx"
import { Card } from "@/components/ui/card.tsx"
import { ButtonLoading } from "@/components/ui/button.tsx"
import { LabeledSwitch } from "@/modules/loan-application/[module]-financial-projection/components/molecules/LabeledSwitch.tsx"
import { useBoolean } from "@/hooks"
import { cn } from "@/lib/utils.ts"
import {
  ForecastPeriod,
  ForecastResultsResponse,
  ForecastType
} from "@/modules/loan-application/[module]-financial-projection/types/financial-projection-forecast.ts"
import {
  HeaderMapper,
  HeaderProps
} from "@/modules/loan-application/[module]-financial-projection/constants"
import { ForecastRowData } from "@/modules/loan-application/[module]-financial-projection/types"
import { get } from "lodash"
import { getPDF } from "@/modules/loan-application/services/pdf.service"
import { FinancialProjectionPdf } from "./pdf"

export function Component() {
  const [isExporting, setIsExporting] = useState(false)
  const applicationId = useMemo(() => window.location.href.split("#")[1], [])

  const currentDetail = useBoolean(false)
  const monthlyDetail = useBoolean(false)
  const elementToExportRef = useRef<Partial<Record<string, HTMLDivElement>>>({})

  const exportToPdf = async () => {
    try {
      setIsExporting(true)
      if (elementToExportRef.current) {
        const filteredElement = Object.values(
          elementToExportRef.current
        ).filter((element) => element !== undefined) as HTMLDivElement[]

        const { pdf } = await getPDF(
          filteredElement,
          false,
          filteredElement.map(
            (element) => element.querySelector(".footer") as HTMLDivElement
          )
        )

        pdf.save(`loan_summary_${new Date().valueOf()}.pdf`)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsExporting(false)
    }
  }

  const { data } = useQueryFinancialProjectionForecast({
    applicationId,
    enabled: !!applicationId
  })

  const forecastResults = useMemo(
    () => data ?? ({} as ForecastResultsResponse),
    [data]
  )

  const annuallyData = useMemo(
    () => getCashFlow(forecastResults, ForecastPeriod.ANNUALLY),
    [forecastResults]
  )
  const annuallyTimeStamp = useMemo(
    () =>
      get(forecastResults, "cashFlowForecastAnnually[0].forecastData", []).map(
        (entry) => new Date(entry.forecastDate)
      ),
    [forecastResults]
  )

  const monthlyData = useMemo(
    () => getCashFlow(forecastResults, ForecastPeriod.MONTHLY),
    [forecastResults]
  )

  const monthlyTimeStamp = useMemo(
    () =>
      get(forecastResults, "cashFlowForecastMonthly[0].forecastData", []).map(
        (entry) => new Date(entry.forecastDate)
      ),
    [forecastResults]
  )

  const currentData = useMemo(
    () => getCashFlow(forecastResults, ForecastPeriod.CURRENT),
    [forecastResults]
  )

  return (
    <div className="flex flex-col gap-y-2xl">
      <div className="w-full flex gap-2 justify-end items-center">
        <LabeledSwitch label="Current financial detail" state={currentDetail} />
        <LabeledSwitch label="Monthly forecast detail" state={monthlyDetail} />
        <ButtonLoading
          isLoading={isExporting}
          type="button"
          onClick={exportToPdf}
        >
          Download report
        </ButtonLoading>
      </div>

      <div className="flex flex-col gap-y-6xl">
        {currentDetail.value ? (
          <Template
            data={currentData}
            layout="current"
            period={ForecastPeriod.CURRENT}
            headerProps={{
              title: "Cash Flow",
              // only get the first month
              data: [monthlyTimeStamp[0]]
            }}
          />
        ) : null}

        <Template
          layout="default"
          data={monthlyDetail.value ? monthlyData : annuallyData}
          period={
            monthlyDetail.value
              ? ForecastPeriod.MONTHLY
              : ForecastPeriod.ANNUALLY
          }
          headerProps={{
            title: "Cash Flow",
            data: monthlyDetail.value ? monthlyTimeStamp : annuallyTimeStamp
          }}
        />
        <div className="hidden">
          <FinancialProjectionPdf itemsRef={elementToExportRef} />
        </div>
      </div>
    </div>
  )
}

interface TemplateProps {
  data: ForecastRowData
  layout: "default" | "current"
  period: ForecastPeriod
  headerProps: HeaderProps
}

const Template = (props: TemplateProps) => {
  const { layout, period, headerProps, data } = props

  const title =
    layout === "default" ? "Cash Flow Statement" : "Current Cash Flow Statement"

  const HeaderComponent = HeaderMapper[period]

  return (
    <div className="flex flex-col gap-y-2xl">
      <h1 className="text-3xl font-semibold">{title}</h1>
      <Card
        className={cn(
          "shadow-primary border-none",
          layout === "current" ? "w-fit" : null
        )}
      >
        <div className="overflow-x-auto overflow-y-visible rounded-xl">
          <div
            className={cn(
              "bg-white",
              layout === "default" ? "min-w-max" : "w-fit"
            )}
          >
            <HeaderComponent {...headerProps} />
            <SectionRow title="Operating Cash Flow" />
            <DataRow
              title="Net Income"
              data={data[ForecastType.NET_INCOME]}
              layout="item"
            />
            <DataRow
              title="Depreciation"
              data={data[ForecastType.DEPRECIATION]}
              collision
              layout="item"
            />
            <DataRow
              title="Change in Accounts Receivable"
              data={data[ForecastType.CHANGE_IN_ACCOUNT_RECEIVABLE]}
              collision
              layout="item"
            />
            <DataRow
              title="Change in Accounts Payable"
              data={data[ForecastType.CHANGE_IN_ACCOUNT_PAYABLE]}
              collision
              layout="item"
            />
            <DataRow
              title="Total Operating Cash Flow"
              data={data[ForecastType.TOTAL_OPERATING_CASH_FLOWS]}
            />

            <SectionRow title="Investing Cash Flow" />
            <DataRow
              title="Changes in Fixed Assets"
              data={data[ForecastType.CHANGE_IN_FIXED_ASSET]}
              collision
              layout="item"
            />
            <DataRow
              title="Total Investing Cash Flow"
              data={data[ForecastType.TOTAL_INVESTING_CASH_FLOW]}
            />

            <SectionRow title="Financing Cash Flow" />
            <DataRow
              title="Long Term Debt"
              data={data[ForecastType.LONG_TERM_DEBT]}
              collision
              layout="item"
            />
            <DataRow
              title="Changes in Paid in Capital"
              data={data[ForecastType.CHANGE_IN_PAID_IN_CAPITAL]}
              collision
              layout="item"
            />
            <DataRow
              title="Total Financing Cash Flow"
              data={data[ForecastType.TOTAL_FINANCING_CASH_FLOW]}
            />
          </div>
        </div>
      </Card>
    </div>
  )
}

function getCashFlow(
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
