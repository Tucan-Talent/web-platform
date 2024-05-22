import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { APP_PATH } from "@/constants"
import { cn } from "@/lib/utils"
import { getBadgeVariantByStatus } from "@/modules/loan-application-management/services"
import { LoadingOverlay } from "@/shared/atoms/LoadingOverlay"
import { SideNavLoanApplication } from "@/shared/molecules/SideNavLoanApplication"
import { LoanApplicationStatus } from "@/types/loan-application.type"
import { LoanType } from "@/types/loan-program.type"
import { isKccBank, isLoanReady } from "@/utils/domain.utils"
import { isEmpty } from "lodash"
import { useEffect, useMemo, useRef } from "react"
import { useNavigate } from "react-router-dom"
import {
  useLoanApplicationFormContext,
  useLoanApplicationProgressContext,
  useLoanProgramDetailContext
} from "../../providers"
import { PlaidProvider } from "../../providers/PlaidProvider"
import { getFormStrategy } from "../../services/form.services"
import { CloseWithoutSave } from "../atoms/CloseWithoutSave"
import { LoanApplicationSave } from "../organisms/LoanApplicationSave"
import { TopBarDetail } from "./TopBarDetail"

export const LoanInformationHeader = () => {
  const { loanProgramDetails, isLoading } = useLoanProgramDetailContext()
  const { loanRequest } = useLoanApplicationFormContext()

  const navigate = useNavigate()

  const backToLoanProgram = () => {
    navigate(
      APP_PATH.LOAN_APPLICATION.LOAN_PROGRAM.detailWithId(
        loanProgramDetails?.id ?? ""
      )
    )
  }

  return (
    <TopBarDetail
      leftFooter={
        <div className="hidden md:flex gap-2 items-center justify-center ml-4 md:ml-8">
          <h4 className={cn("text-lg font-semibold", "md:text-2xl")}>
            {isLoading ? (
              <Skeleton className="w-40 h-8" />
            ) : (
              loanProgramDetails?.name
            )}
          </h4>
          <Badge
            isDot
            className="text-sm"
            isDotBefore
            variant="soft"
            variantColor={getBadgeVariantByStatus(LoanApplicationStatus.DRAFT)}
          >
            Draft
          </Badge>
        </div>
      }
      rightFooter={
        <div className="flex gap-2">
          {!isEmpty(loanRequest) && <CloseWithoutSave />}
          {isEmpty(loanRequest) ? (
            <Button onClick={backToLoanProgram} variant="secondary">
              Close
            </Button>
          ) : (
            <LoanApplicationSave />
          )}
          <div className="block md:hidden">
            <Drawer>
              <DrawerTrigger asChild>
                <Button type="button">Open Progress</Button>
              </DrawerTrigger>
              <DrawerContent>
                <SideNavLoanApplication className="flex relative w-full" />
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      }
    />
  )
}

export const Component = () => {
  const { step, percentComplete } = useLoanApplicationProgressContext()
  const { loanProgramDetails } = useLoanProgramDetailContext()
  const { isSubmitting } = useLoanApplicationFormContext()

  const getLoanType = () => {
    if (isLoanReady()) {
      return LoanType.READINESS
    }
    if (isKccBank()) {
      return LoanType.LENDERS_FORUM
    }
    return loanProgramDetails?.type ?? LoanType.MICRO
  }

  const loanType = getLoanType()
  const formStrategy = useMemo(() => getFormStrategy(loanType), [loanType])

  /**
   * Implement scroll to top when navigate step
   */
  const containerRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (!containerRef.current) return
    containerRef.current.scrollTop = 0
  }, [step])

  return (
    <PlaidProvider>
      <LoanInformationHeader />

      <Progress
        value={percentComplete}
        className="h-2 rounded-none bg-background-disabled overflow-visible z-30 relative"
        indicatorClassName="after:hidden after:md:block after:content-[attr(attr-percentValue)] after:absolute after:right-0 after:bottom-2.5 after:text-xs after:text-text-secondary"
      />

      <div
        ref={containerRef}
        className="flex h-full overflow-auto flex-1 py-6 flex-col pt-10"
      >
        <LoadingOverlay isLoading={isSubmitting} className="flex-1">
          <div className="grid grid-cols-8 w-full">
            {formStrategy.getFormComponent(step)?.component}
          </div>
        </LoadingOverlay>
      </div>
    </PlaidProvider>
  )
}
