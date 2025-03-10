import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { useLoanProgramDetailContext } from "../../providers"
import { LoanProgramDetailProvider } from "../../providers/LoanProgramDetailProvider"
import { LoanProgramDetailApply } from "../organisms/loan-program-detail/LoanProgramDetailApply"
import { LoanProgramDetailFAQ } from "../organisms/loan-program-detail/LoanProgramDetailFAQ"
import { LoanProgramDetailUnderConstruction } from "../organisms/loan-program-detail/LoanProgramDetailUnderConstruction"
import { LoanProgramDetailWelcomeLine } from "../organisms/loan-program-detail/LoanProgramDetailWelcomeLine"
import { TopBarDetail } from "./TopBarDetail"

import { useBreadcrumb } from "@/hooks/useBreadcrumb"
import { Image } from "@/shared/atoms/Image"
import { getImageURL } from "@/utils/aws.utils"
import { CustomLabelKey, buildCustomLabel, buildIds } from "@/utils/crumb.utils"
import { cn } from "@/lib/utils"
import { Breadcrumbs } from "@/shared/molecules/Breadcrumbs"

export const ComponentWithProvider = () => {
  const { loanProgramInfo, isLoading, loanProgramDetails } =
    useLoanProgramDetailContext()

  const crumbs = useBreadcrumb({
    customLabel: buildCustomLabel(
      CustomLabelKey.documentDetail,
      loanProgramDetails?.name ?? ""
    ),
    ids: Object.assign(
      {},
      buildIds(CustomLabelKey.documentDetail, loanProgramDetails?.id)
    )
  })

  return (
    <div className="overflow-auto flex flex-col flex-1">
      <div className={cn("grid grid-cols-10", "md:grid-cols-8")}>
        <div className={cn("col-span-10", "md:col-span-8")}>
          <TopBarDetail
            leftFooter={
              <div className="hidden md:block">
                {<Breadcrumbs breads={crumbs} />}
              </div>
            }
            rightFooter={
              loanProgramInfo?.isUnderConstruction ? (
                <LoanProgramDetailUnderConstruction />
              ) : (
                <LoanProgramDetailApply btnText={loanProgramInfo?.startBtn} />
              )
            }
          />
        </div>

        <section className={cn("col-span-10", "md:col-span-8")}>
          {isLoading ? (
            <Skeleton className="w-screen md:w-[calc(100vw-15rem)] h-36 md:h-60 lg:max-h-64 items-center align-center flex" />
          ) : (
            <Image
              className="mx-auto max-h-72 object-cover w-full max-w-full border-b"
              src={getImageURL(loanProgramDetails?.coverPhotoUrl)}
              placeholderClassName="bg-slate-600 max-h-64 mx-auto max-w-full"
              alt="Cover Photo for Loan Program"
              height={359}
            />
          )}
        </section>

        <section
          className={cn(
            "pt-8 p-6 col-span-10",
            "md:px-0 md:col-span-6 md:col-start-2"
          )}
        >
          <LoanProgramDetailWelcomeLine />

          <Separator className="my-6" />

          <LoanProgramDetailFAQ />
        </section>
      </div>
    </div>
  )
}

export const Component = () => {
  return (
    <LoanProgramDetailProvider>
      <ComponentWithProvider />
    </LoanProgramDetailProvider>
  )
}

Component.displayName = "loanProgramInfo"
