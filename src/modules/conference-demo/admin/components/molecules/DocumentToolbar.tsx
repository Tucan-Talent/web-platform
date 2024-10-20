import { Button } from "@/components/ui/button"
import { APP_PATH } from "@/constants"
import { useLoanDocumentDetailsContext } from "@/modules/conference-demo/admin/providers/LoanDocumentDetailsProvider"
import { Pagination } from "@/shared/molecules/Pagination"
import { capitalizeWords, snakeCaseToText } from "@/utils"
import { formatBirthday } from "@/utils/date.utils"
import { ArrowLeft, Minus, Plus } from "lucide-react"
import { Link } from "react-router-dom"

function DocumentToolbar() {
  const {
    zoomIn,
    zoomOut,
    handleSelectPage,
    scale,
    visualizationDetails,
    selectedPage,
    documentDetails
  } = useLoanDocumentDetailsContext()

  if (!visualizationDetails?.visualizationsByPage) return null

  const total = visualizationDetails.visualizationsByPage.length
  const currentPage =
    visualizationDetails.visualizationsByPage.findIndex(
      (page) => page === selectedPage
    ) + 1
  const onNextPage = () => {
    const index = visualizationDetails.visualizationsByPage.findIndex(
      (page) => page === selectedPage
    )

    if (index === -1) return
    const nextPage = visualizationDetails.visualizationsByPage[index + 1]

    if (nextPage) handleSelectPage(nextPage)
  }

  const onPreviousPage = () => {
    const index = visualizationDetails.visualizationsByPage.findIndex(
      (page) => page === selectedPage
    )

    if (index === -1) return
    const previousPage = visualizationDetails.visualizationsByPage[index - 1]

    if (previousPage) handleSelectPage(previousPage)
  }

  const onPageChange = (page: number) => {
    const newPage = visualizationDetails.visualizationsByPage[page - 1]

    if (newPage) handleSelectPage(newPage)
  }

  return (
    <div className="flex w-full justify-between pb-3">
      <DocumentTitle
        documentType={capitalizeWords(
          snakeCaseToText(documentDetails?.documentType ?? "")
        )}
        verifiedDate={documentDetails?.verifiedDate ?? ""}
      />

      <div className="flex gap-6">
        <div className="flex gap-1">
          <Button
            className="bg-gray-100 w-10 h-10 p-0 disabled:opacity-50"
            disabled={scale < 0.5}
            variant="secondary"
            onClick={zoomOut}
          >
            <Minus className="w-6 h-6 text-gray-500" />
          </Button>
          <Button
            className="bg-gray-100 w-10 h-10 p-0 disabled:opacity-50"
            disabled={scale > 4}
            variant="secondary"
            onClick={zoomIn}
          >
            <Plus className="w-6 h-6 text-gray-500" />
          </Button>
        </div>
        <Pagination
          page={currentPage}
          total={total}
          onNextPage={onNextPage}
          onPageChange={onPageChange}
          onPreviousPage={onPreviousPage}
        />
      </div>
    </div>
  )
}

interface Props {
  documentType: string
  verifiedDate: string
}

export const DocumentTitle: React.FC<Props> = ({
  documentType,
  verifiedDate
}) => {
  return (
    <div className="flex gap-6">
      <Button asChild className="p-0 text-dark" type="button" variant="link">
        <Link to={APP_PATH.CONFERENCE_DEMO.admin.documents}>
          <ArrowLeft className="w-5 h-4.5" /> Back
        </Link>
      </Button>
      <div className="flex flex-col text-sm">
        <p className="font-semibold">Document Type</p>
        <p className="font-normal text-secondary-700">{documentType}</p>
      </div>
      <div className="flex flex-col text-sm">
        <p className="font-semibold">Verified Date</p>
        <p className="font-normal text-secondary-700">
          {formatBirthday(verifiedDate)}
        </p>
      </div>
    </div>
  )
}

export default DocumentToolbar
