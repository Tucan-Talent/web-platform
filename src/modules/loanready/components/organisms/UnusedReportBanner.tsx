import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { APP_PATH } from "@/constants"
import {
  LoanReadyPlan,
  type LoanReadyPlanEnum
} from "@/modules/loanready/constants/package"
import { convertDateTimeToLocal } from "@/utils"
import { useNavigate } from "react-router-dom"

export interface UnusedReportBannerProps {
  plan: LoanReadyPlanEnum
  loanProgramId?: string
  paymentTransactionId: string
  purchaseDate?: Date
}

export function UnusedReportBanner({
  plan,
  paymentTransactionId,
  purchaseDate = new Date(),
  loanProgramId = ""
}: UnusedReportBannerProps) {
  const navigate = useNavigate()

  const handleStartApplication = () => {
    const searchParams = new URLSearchParams({
      transactionId: paymentTransactionId
    })

    navigate(
      `${APP_PATH.LOAN_APPLICATION.INFORMATION.detailWithId(
        loanProgramId
      )}?${searchParams.toString()}`
    )
  }

  const PackageIcon = Icons.loanReadyPackage

  return (
    <div className="w-full border-dashed border border-[#4F6161] rounded-lg mb-6 shadow-md">
      <div className="p-4 flex items-center justify-between">
        {/* Left section with icon and title */}
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-full">
            <PackageIcon />
          </div>
          <div>
            <p className="loanready-v2 text-sm text-primary">
              {LoanReadyPlan[plan].name} | An application is ready for you to
              start
            </p>
          </div>
        </div>

        {/* Middle section with details */}
        <div className="flex items-center gap-8">
          <div className="flex flex-col gap-1">
            <div className="loanready-v2 text-sm text-primary">
              Purchased on{" "}
              {convertDateTimeToLocal(
                purchaseDate.toLocaleDateString(),
                "---",
                "",
                false,
                {
                  day: "numeric",
                  month: "long",
                  year: "numeric"
                }
              )}
            </div>
          </div>
          <Button
            className="gap-2"
            type="button"
            onClick={handleStartApplication}
          >
            Start application
          </Button>
        </div>
      </div>
    </div>
  )
}
