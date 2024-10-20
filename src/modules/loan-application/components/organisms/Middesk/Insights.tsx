import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { INSIGHT_TOC } from "@/modules/loan-application-management/constants/insight-toc.constant"
import { TaskFieldStatus } from "@/modules/loan-application-management/constants/types/business.type"
import { useLoanApplicationDetailContext } from "@/modules/loan-application-management/providers/LoanApplicationDetailProvider"
import { isLoanReady, isSbb } from "@/utils/domain.utils"
import { isEnableKYBV2 } from "@/utils/feature-flag.utils"
import { useMemo } from "react"
import InsightItem from "../../molecules/InsightItem"

export function Insights() {
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

  const insightsTotal =
    isEnableKYBV2() && (isSbb() || isLoanReady())
      ? insights
        ? Object.entries(insights).length
        : 10
      : 7

  return (
    <Card className="h-fit lg:sticky top-0 z-10 mb-4 flex-shrink-0">
      <CardHeader className="!pb-0 px-0 md:px-0">
        <CardTitle className="font-bold text-base flex justify-between items-center px-4">
          <div>Insights</div>
          {isLoading ? (
            <Skeleton className="w-16 h-4" />
          ) : (
            <div>
              {numberOfSuccess}/{insightsTotal}
            </div>
          )}
        </CardTitle>
        <Separator />
      </CardHeader>
      <CardContent className="w-full lg:w-[300px] !p-4 !pt-0">
        <InsightItem
          href={INSIGHT_TOC.businessName}
          isLoading={isLoading}
          label={insights?.businessName?.subLabel}
          status={insights?.businessName?.status}
          title="Business name"
          toolTipContent={insights?.businessName?.message}
        />
        <InsightItem
          href={INSIGHT_TOC.officeAddress}
          isLoading={isLoading}
          label={insights?.officeAddress?.subLabel}
          status={insights?.officeAddress?.status}
          title="Office address"
          toolTipContent={insights?.officeAddress?.message}
        />
        <InsightItem
          href={INSIGHT_TOC.sosFillings}
          isLoading={isLoading}
          label={insights?.sosFillings?.subLabel}
          status={insights?.sosFillings?.status}
          title="SOS filings"
          toolTipContent={insights?.sosFillings?.message}
        />
        <InsightItem
          href={INSIGHT_TOC.tinMatch}
          isLoading={isLoading}
          label={insights?.tin?.subLabel}
          status={insights?.tin?.status}
          title="TIN match"
          toolTipContent={insights?.tin?.message}
        />
        <InsightItem
          href={INSIGHT_TOC.people}
          isLoading={isLoading}
          label={insights?.people?.subLabel}
          status={insights?.people?.status}
          title="People"
          toolTipContent={insights?.people?.message}
        />
        <InsightItem
          href={INSIGHT_TOC.watchLists}
          isLoading={isLoading}
          label={insights?.watchlists?.subLabel}
          status={insights?.watchlists?.status}
          title="Watchlists"
          toolTipContent={insights?.watchlists?.message}
        />
        {isEnableKYBV2() && (isSbb() || isLoanReady()) && (
          <InsightItem
            href={INSIGHT_TOC.industryClassification}
            isLoading={isLoading}
            label={insights?.industry?.subLabel}
            status={insights?.industry?.status}
            title="Industry Classification"
            toolTipContent={insights?.industry?.message}
          />
        )}
        <InsightItem
          href={INSIGHT_TOC.bankruptcies}
          isLoading={isLoading}
          label={insights?.bankruptcies?.subLabel}
          status={insights?.bankruptcies?.status}
          title="Bankruptcies"
          toolTipContent={insights?.bankruptcies?.message}
          {...(!isEnableKYBV2() &&
            !(isSbb() || isLoanReady()) && { noBorder: true })}
        />
        {isEnableKYBV2() && (isSbb() || isLoanReady()) && (
          <InsightItem
            href={INSIGHT_TOC.website}
            isLoading={isLoading}
            label={insights?.website?.subLabel}
            status={insights?.website?.status}
            title="Website"
            toolTipContent={insights?.website?.message}
          />
        )}
        {isEnableKYBV2() && (isSbb() || isLoanReady()) && (
          <InsightItem
            noBorder
            href={INSIGHT_TOC.adverseMedia}
            isLoading={isLoading}
            label={insights?.adverseMedia?.subLabel}
            status={insights?.adverseMedia?.status}
            title="Adverse Media"
            toolTipContent={insights?.adverseMedia?.message}
          />
        )}
      </CardContent>
    </Card>
  )
}
