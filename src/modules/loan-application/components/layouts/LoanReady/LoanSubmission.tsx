import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { APP_PATH } from "@/constants"
import { ArrowRight, CheckCircle, Download } from "lucide-react"
import { useLocation, useNavigate, useSearchParams } from "react-router-dom"
import { ButtonDownloadESignDocument } from "@/modules/loan-application/components/atoms/ButtonDownloadESignDocument.tsx"

export function LoanReadyLoanSubmission() {
  const navigate = useNavigate()
  const location = useLocation()
  // Get e-sign document if have
  const [searchParams] = useSearchParams()
  const documentId = searchParams.get("documentId")

  const handleGoToFinancialApplicationDetail = () => {
    navigate(
      APP_PATH.LOAN_APPLICATION.APPLICATIONS.financialApplicationDetails(
        location.state?.applicationId,
        location.state?.loanProgramId
      )
    )
  }

  const handleGoToFinancialProjectionDetail = () => {
    navigate(APP_PATH.LOAN_APPLICATION.FINANCIAL.INDEX)
  }

  const btnIcon = {
    className: "ml-2 w-4 h-4 inline-block"
  }
  const btnShadow = "shadow-[0px_4px_12px_0px_#00000026]"

  return (
    <div className="shadow-[ flex size-full p-4 lg:p-8">
      <div className="m-auto flex w-full flex-col space-y-8 px-2 md:w-[640px]">
        <div className="flex flex-col gap-4xl text-center">
          <div className="relative flex justify-center">
            <div className="w-14 self-center">
              <AspectRatio ratio={1 / 1}>
                <div className="flex size-full items-center justify-center rounded-full bg-success-secondary">
                  <CheckCircle className="size-7 text-success" />
                </div>
              </AspectRatio>
            </div>
          </div>

          <div className="flex flex-col space-y-lg">
            <h1 className="text-[1.75rem] font-semibold tracking-tight">
              Application Submitted
            </h1>
          </div>

          <div className="flex flex-col gap-2 text-sm text-black md:gap-3">
            <p>
              <span className="font-bold">Congratulations!</span> Your
              application has been successfully submitted.
            </p>
            <p>
              For your records, you can download a copy of your application. You
              can also review your submission in the “Applications” tab.
            </p>
          </div>

          <div className="mx-20 flex flex-wrap justify-center gap-4 lg:flex-nowrap">
            {documentId ? (
              <ButtonDownloadESignDocument
                className={btnShadow}
                documentId={documentId}
                variant="outline"
              >
                <div>
                  <Download {...btnIcon} />
                  <span className="ml-2">Download copy</span>
                </div>
              </ButtonDownloadESignDocument>
            ) : null}

            <Button onClick={handleGoToFinancialApplicationDetail}>
              <div>
                Review Submission
                <ArrowRight {...btnIcon} />
              </div>
            </Button>

            <Button
              className={btnShadow}
              variant="success"
              onClick={handleGoToFinancialProjectionDetail}
            >
              <div>
                <Icons.financial {...btnIcon} />
                <span className="ml-2">Review financial projections</span>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
