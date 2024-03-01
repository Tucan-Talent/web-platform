import { FORMAT_DATE_MM_DD_YYYY } from "@/constants/date.constants"
import { MiddeskTableContent } from "@/modules/loan-application-management/components/table/middesk-table-content"
import { MiddeskTableContentReport } from "@/modules/loan-application-management/constants/types/middesk.type"
import { format } from "date-fns"
import { MiddeskBadge } from "../../molecules/MiddeskBadge"
import { MiddeskCard } from "../../molecules/MiddeskCard"
import { KYC_STATUS } from "@/modules/loan-application-management/constants/types/kyc"

export const OfficeAddress = () => {
  const data: MiddeskTableContentReport[] = [
    {
      name: "123 Coffee Lane, Seattle, WA 98765",
      submitted: true,
      sources: [{ metadata: { state: "WA", status: KYC_STATUS.VERIFIED } }],
      notes: ""
    },
    {
      name: "222 California Ave, Reno, NV 89509",
      submitted: true,
      sources: [{ metadata: { state: "NV", status: KYC_STATUS.VERIFIED } }],
      notes: ""
    }
  ]

  const badge = <MiddeskBadge status={KYC_STATUS.VERIFIED} />
  const headerTitle = <>Office Addresses {badge}</>
  const headerRight = (
    <div className="text-text-tertiary">
      Last updated on {format(new Date(), FORMAT_DATE_MM_DD_YYYY)}
    </div>
  )

  const content = (
    <MiddeskTableContent nameTitle="Office addresses" data={data} />
  )

  return (
    <MiddeskCard
      headerTitle={headerTitle}
      headerRight={headerRight}
      content={content}
    />
  )
}
