import { Button, ButtonLoading } from "@/components/ui/button.tsx"
import { Card } from "@/components/ui/card.tsx"
import { TooltipProvider } from "@/components/ui/tooltip.tsx"
import { useBoolean } from "@/hooks"
import { cn } from "@/lib/utils.ts"
import { RHFCheckbox } from "@/modules/form-template/components/molecules"
import { RHFProvider } from "@/modules/form-template/providers"
import ContentTooltip from "@/modules/loan-application/[module]-financial-projection/components/molecules/ContentTooltip.tsx"
import { FinancialProjectionPdf } from "@/modules/loan-application/[module]-financial-projection/components/pages/pdf/FinancialProjectionPdf.tsx"
import { ExportFPOption } from "@/modules/loan-application/[module]-financial-projection/components/store/fp-helpers"
import { useExportToPDF } from "@/modules/loan-application/[module]-financial-projection/hooks/useExportToPDF"
import { QUERY_KEY } from "@/modules/loan-application/constants/query-key"
import { QUERY_KEY as FINANCIAL_QUERY_KEY } from "@/modules/loan-application/[module]-financial-projection/constants/query-key.ts"
import { QUERY_KEY as APPLICATION_MANAGEMENT_QUERY_KEY } from "@/modules/loan-application-management/constants/query-key"
import { useIsFetching } from "@tanstack/react-query"
import { FolderDown, X } from "lucide-react"
import { type ReactNode, useMemo } from "react"
import { useForm } from "react-hook-form"

interface DrawerCheckBoxProps {
  name: ExportFPOption
  label: string
}

interface CardSectionProps {
  title: string
  tooltipContent?: string
  children: ReactNode
}

interface CheckboxOption {
  name: ExportFPOption
  label: string
}

interface CheckboxGroupProps {
  options: CheckboxOption[]
}

function DrawerCheckBox({ name, label }: DrawerCheckBoxProps) {
  return (
    <RHFCheckbox
      className="space-x-0"
      label={label}
      name={name}
      styleProps={{
        checkboxClassName:
          "border-gray-600 rounded-[3px] w-5 h-5 data-[state=checked]:bg-gray-600 [&_span_svg]:stroke-[4px]"
      }}
    />
  )
}

function CardSection({ title, tooltipContent, children }: CardSectionProps) {
  return (
    <Card className="p-4 m-6 flex flex-col gap-y-4 shadow-none">
      <div className="flex flex-row items-center">
        <div className="font-semibold">{title}</div>
        {tooltipContent ? (
          <ContentTooltip
            content={tooltipContent}
            style={{ iconClassName: "w-4 h-4" }}
          />
        ) : null}
      </div>
      {children}
    </Card>
  )
}

function CheckboxGroup({ options }: CheckboxGroupProps) {
  return (
    <>
      {options.map((option) => (
        <DrawerCheckBox
          key={option.name}
          label={option.label}
          name={option.name}
        />
      ))}
    </>
  )
}

function DrawerContent() {
  return (
    <div className="p-2 flex flex-col">
      <CardSection
        title="Forecast Reports"
        tooltipContent="5-year projected financial reports based on the data you provided."
      >
        <CheckboxGroup
          options={[
            {
              name: ExportFPOption.CASH_FLOW_FORECAST,
              label: "Cash Flow Forecast"
            },
            {
              name: ExportFPOption.BALANCE_SHEET_FORECAST,
              label: "Balance Sheet Forecast"
            },
            {
              name: ExportFPOption.INCOME_SHEET_FORECAST,
              label: "Income Sheet Forecast"
            },
            { name: ExportFPOption.LOAN_READY_SECTION, label: "Loan Ready" }
          ]}
        />
      </CardSection>

      <CardSection
        title="Financial Statements"
        tooltipContent="Current month financial statements, generated from your inputs and data."
      >
        <CheckboxGroup
          options={[
            { name: ExportFPOption.CASH_FLOW, label: "Cash Flow" },
            { name: ExportFPOption.BALANCE_SHEET, label: "Balance Sheet" },
            { name: ExportFPOption.INCOME_SHEET, label: "Income Statement" }
          ]}
        />
      </CardSection>

      <CardSection title="Application">
        <CheckboxGroup
          options={[
            {
              name: ExportFPOption.APPLICATION_SUMMARY,
              label: "Application Summary"
            }
          ]}
        />
      </CardSection>
    </div>
  )
}

export function Drawer() {
  const openDrawer = useBoolean(false)

  const methods = useForm<Record<ExportFPOption, boolean>>()

  const watchAllFields = methods.watch()

  const isAtLeastOneChecked = useMemo(() => {
    return Object.values(watchAllFields).some((value) => value)
  }, [watchAllFields])

  const { elementToExportRef, exportToPdf, isExporting } = useExportToPDF()

  const onExportToPdf = methods.handleSubmit(async (markedElement) => {
    openDrawer.onToggle()
    await exportToPdf(markedElement)
  })

  const isFetchingBankAccounts = useIsFetching({
    queryKey: [QUERY_KEY.GET_LOAN_APPLICATION_CASHFLOW_VERIFICATION]
  })

  const isFetchingFinancial = useIsFetching({
    queryKey: [FINANCIAL_QUERY_KEY.GET_FORECAST_DATA]
  })

  const isFetchingLoanReadiness = useIsFetching({
    queryKey: [APPLICATION_MANAGEMENT_QUERY_KEY.GET_LOAN_READINESS_ASSESSMENT]
  })

  /**
   * Note:
   * - Usually the LoanReadiness is the heaviest because its depend on 3rd party.
   * Its mean we can rely on it, its mean all the detail is already fetched before it
   */
  const isFetchingPdfData = !!(
    isFetchingBankAccounts ||
    isFetchingFinancial ||
    isFetchingLoanReadiness
  )

  return (
    <>
      <div className="text-center ml-2">
        <ButtonLoading
          className="text-black shadow-md bg-success-fp hover:bg-[#a1d80b] font-medium rounded-lg text-sm focus:outline-none"
          isLoading={isExporting.value}
          type="button"
          onClick={openDrawer.onToggle}
        >
          <div className="flex gap-2 items-center">
            <FolderDown className="w-4" />
            Download reports
          </div>
        </ButtonLoading>
      </div>

      <div
        aria-labelledby="drawer-right-label"
        className={cn(
          "h-screen overflow-y-auto w-96",
          "fixed top-0 right-0 z-40 transition-transform transform bg-white shadow-2xl",
          openDrawer.value ? "translate-x-0" : "translate-x-full"
        )}
        tabIndex={-1}
      >
        <div className="h-12 flex items-center justify-between p-8 sticky top-0 bg-white border-b z-50">
          <div className="text-xl font-semibold">Download Reports</div>
          <Button
            className="bg-transparent text-black hover:bg-gray-50 rounded-lg cursor-pointer"
            type="button"
            onClick={openDrawer.onFalse}
          >
            <X className="w-5" strokeWidth={2.5} />
          </Button>
        </div>

        <RHFProvider methods={methods}>
          <TooltipProvider delayDuration={200}>
            <DrawerContent />
          </TooltipProvider>
          <div className="hidden">
            <FinancialProjectionPdf itemsRef={elementToExportRef} />
          </div>
        </RHFProvider>

        <div className="m-10">
          <ButtonLoading
            className="w-full"
            disabled={!isAtLeastOneChecked || isFetchingPdfData}
            isLoading={isExporting.value || isFetchingPdfData}
            type="button"
            onClick={onExportToPdf}
          >
            Download report
          </ButtonLoading>
        </div>
      </div>
    </>
  )
}
