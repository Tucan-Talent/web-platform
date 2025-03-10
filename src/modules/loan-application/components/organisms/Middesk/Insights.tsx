import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useLoanApplicationDetailContext } from "@/modules/loan-application-management/providers/LoanApplicationDetailProvider"
import InsightItem from "../../molecules/InsightItem"
import { TaskFieldStatus } from "@/modules/loan-application-management/constants/types/business.type"
import { useMemo } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { INSIGHT_TOC } from "@/modules/loan-application-management/constants/insight-toc.constant"

export const Insights = () => {
  const { loanKybDetail, isLoading } = useLoanApplicationDetailContext()

  const insights = loanKybDetail?.insights

  const numberOfSuccess = useMemo(
    () =>
      insights
        ? Object.entries(insights).reduce(
            (pre, [, data]) =>
              pre +
              (data.status?.toUpperCase() === TaskFieldStatus.SUCCESS ? 1 : 0),
            0
          )
        : 0,
    [insights]
  )

  return (
    <Card className="h-fit lg:sticky top-0 z-10 mb-4 flex-shrink-0">
      <CardHeader className="!pb-0 px-0 md:px-0">
        <CardTitle className="font-bold text-base flex justify-between items-center px-4">
          <div>Insights</div>
          {isLoading ? (
            <Skeleton className="w-16 h-4" />
          ) : (
            <div>{numberOfSuccess}/7</div>
          )}
        </CardTitle>
        <Separator />
      </CardHeader>
      <CardContent className="w-full lg:w-[300px] !p-4 !pt-0">
        <InsightItem
          title="Business name"
          status={insights?.businessName?.status}
          label={insights?.businessName?.subLabel}
          toolTipContent={insights?.businessName?.message}
          href={INSIGHT_TOC.businessName}
          isLoading={isLoading}
        />
        <InsightItem
          title="Office address"
          status={insights?.officeAddress?.status}
          label={insights?.officeAddress?.subLabel}
          toolTipContent={insights?.officeAddress?.message}
          href={INSIGHT_TOC.officeAddress}
          isLoading={isLoading}
        />
        <InsightItem
          title="SOS filings"
          status={insights?.sosFillings?.status}
          label={insights?.sosFillings?.subLabel}
          toolTipContent={insights?.sosFillings?.message}
          href={INSIGHT_TOC.sosFillings}
          isLoading={isLoading}
        />
        <InsightItem
          title="TIN match"
          status={insights?.tin?.status}
          label={insights?.tin?.subLabel}
          toolTipContent={insights?.tin?.message}
          href={INSIGHT_TOC.tinMatch}
          isLoading={isLoading}
        />
        <InsightItem
          title="People"
          status={insights?.people?.status}
          label={insights?.people?.subLabel}
          toolTipContent={insights?.people?.message}
          href={INSIGHT_TOC.people}
          isLoading={isLoading}
        />
        <InsightItem
          title="Watchlists"
          status={insights?.watchlists?.status}
          label={insights?.watchlists?.subLabel}
          toolTipContent={insights?.watchlists?.message}
          href={INSIGHT_TOC.watchLists}
          isLoading={isLoading}
        />
        <InsightItem
          title="Bankruptcies"
          status={insights?.bankruptcies?.status}
          label={insights?.bankruptcies?.subLabel}
          toolTipContent={insights?.bankruptcies?.message}
          href={INSIGHT_TOC.bankruptcies}
          isLoading={isLoading}
          noBorder
        />
      </CardContent>
    </Card>
  )
}
