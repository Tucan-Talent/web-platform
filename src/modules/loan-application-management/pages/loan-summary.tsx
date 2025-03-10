import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { InformationCard } from "../components/molecules/InformationCard"
import { BusinessInfoSummary } from "../components/organisms/loan-summary/BusinessInfoSummary"
import { ChecklistsSummary } from "../components/organisms/loan-summary/ChecklistsSummary"
import { PersonalInfoSummary } from "../components/organisms/loan-summary/PersonalInfoSummary"
import { CashFlowSummary } from "../components/organisms/loan-summary/CashFlowSummary"

import { useRef } from "react"
import { DownloadButton } from "../components/atoms/DownloadButton"
import { useLoanApplicationDetailContext } from "../providers/LoanApplicationDetailProvider"
import { getUseOfLoan } from "../services"
import { Badge } from "@/components/ui/badge"

export function Component() {
  const elementToExportRef = useRef<HTMLDivElement>(null)
  const { loanSummary, isFetchingSummary, isFetchingCashflow } =
    useLoanApplicationDetailContext()

  return (
    <div className="lg:flex gap-3xl w-full flex-col" ref={elementToExportRef}>
      <Card className="w-full flex-1 h-full space-y-4xl p-4xl">
        <div className="space-y-lg mt-lg flex justify-between gap-2 flex-wrap">
          <div className="flex gap-sm flex-col">
            <p className="text-4xl font-semibold ">Loan Summary</p>
            <div className="flex gap-2">
              <Badge border>
                <p className="text-sm font-medium">
                  {getUseOfLoan(loanSummary?.proposeUseOfLoan)}
                </p>
              </Badge>

              <Badge border>
                <p className="text-sm font-medium">{loanSummary?.loanType}</p>
              </Badge>
            </div>
          </div>

          <div>
            <DownloadButton
              elementToExportRef={[elementToExportRef]}
              disabled={isFetchingSummary || isFetchingCashflow}
            />
          </div>
        </div>

        <InformationCard title="Business Info">
          <BusinessInfoSummary />
        </InformationCard>

        {!!loanSummary?.cashFlowDocumentation?.length && (
          <>
            <Separator />

            <InformationCard title="Cash Flow Documentation">
              <CashFlowSummary />
            </InformationCard>
          </>
        )}
        <Separator />

        <InformationCard title="Personal Info">
          <PersonalInfoSummary />
        </InformationCard>

        {!!Object.keys(loanSummary?.checkLists ?? {}).length && (
          <>
            <Separator />

            <InformationCard title="Checklists">
              <ChecklistsSummary />
            </InformationCard>
          </>
        )}
      </Card>
    </div>
  )
}

Component.displayName = "LoanSummary"
