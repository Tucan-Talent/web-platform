import { MiddeskTable } from "@/modules/loan-application-management/components/table/middesk-table"
import { MiddeskTableHeader } from "@/modules/loan-application-management/components/table/middesk-table-header"
import { BusinessWatchlistData } from "@/modules/loan-application-management/constants/types/business.type"
import { useLoanApplicationDetailContext } from "@/modules/loan-application-management/providers/LoanApplicationDetailProvider"
import { ColumnDef } from "@tanstack/react-table"
import { MiddeskBadge } from "../../molecules/MiddeskBadge"
import { MiddeskCard } from "../../molecules/MiddeskCard"
import { DateHeader } from "./DateHeader"
import { WatchListHit } from "./WatchListHit"
import { Dot } from "@/components/ui/dot"
import { getBadgeVariantByInsightStatus } from "@/modules/loan-application-management/services/middesk.service"
import { INSIGHT_TOC } from "@/modules/loan-application-management/constants/insight-toc.constant"
import { InsightStatus } from "../../../../loan-application-management/constants/types/middesk.type"

const columns: ColumnDef<
  Pick<BusinessWatchlistData, "businessName" | "people"> & {
    status?: InsightStatus
  }
>[] = [
  {
    accessorKey: "businessName",
    header: () => <MiddeskTableHeader title={"Screened Business"} />,
    cell: ({ row }) => {
      const data = row.original

      return (
        <div className="flex items-start">
          <Dot
            className="flex-shrink-0 self-start mt-1"
            variantColor={getBadgeVariantByInsightStatus(data?.status)}
          />
          <p>{data?.businessName ?? "-"}</p>
        </div>
      )
    }
  },
  {
    accessorKey: "people",
    header: () => <MiddeskTableHeader title="Screened Individual" />,
    cell: ({ row }) => {
      const data = row.original

      return (
        <div className="flex items-start">
          {data?.people && (
            <Dot
              className="flex-shrink-0 self-start mt-1"
              variantColor={getBadgeVariantByInsightStatus(data?.status)}
            />
          )}
          <p>{data?.people ?? "-"}</p>
        </div>
      )
    }
  }
]

export const WatchList = () => {
  const { loanKybDetail, isLoading } = useLoanApplicationDetailContext()

  const watchlist = loanKybDetail?.businessWatchlist
  const label = loanKybDetail?.insights.watchlists?.subLabel
  const status = loanKybDetail?.insights.watchlists?.status

  const badge = <MiddeskBadge status={status} label={label} />
  const headerTitle = <>Watchlists {badge}</>
  const screenedData = watchlist
    ? [
        {
          businessName: watchlist.businessName,
          people: watchlist.people,
          status
        }
      ]
    : []

  const content = (
    <>
      <MiddeskTable
        tableClassName={"table-fixed"}
        columns={columns}
        data={screenedData}
        isLoading={isLoading}
      />

      {!isLoading && <WatchListHit />}
    </>
  )

  return (
    <MiddeskCard
      id={INSIGHT_TOC.watchLists}
      headerTitle={headerTitle}
      headerRight={<DateHeader />}
      content={content}
    />
  )
}
