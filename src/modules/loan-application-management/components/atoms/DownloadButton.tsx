import { ButtonLoading } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import { DownloadCloud } from "lucide-react"
import { RefObject, useState } from "react"
import { useQueryDownloadLoanSummary } from "../../hooks/useQuery/useQueryDownloadLoanSummary"
import { useParams } from "react-router-dom"
import { LoanSummaryDownloadType } from "../../constants/type"

export const DownloadButton = ({
  elementToExportRef
}: {
  elementToExportRef: RefObject<HTMLElement>[]
}) => {
  const [isLoading, setIsLoading] = useState<boolean>()
  const [downloadType, setDownloadType] = useState<LoanSummaryDownloadType>()
  const [preventCacheCount, setPreventCacheCount] = useState(0)
  const { id: loanApplicationId } = useParams()

  const downloadPdf = async () => {
    if (!elementToExportRef[0].current) return
    setIsLoading(true)

    const style = document.createElement("style")
    document.head.appendChild(style)
    style.sheet?.insertRule(
      "body > div:last-child img { display: inline-block !important; }",
      0
    )

    const doc = new jsPDF("p", "mm")

    for (const ref of elementToExportRef) {
      if (!ref.current) return
      const canvas = await html2canvas(ref.current)

      const imgData = canvas.toDataURL("image/jpeg")

      // Set the desired width of the image in the PDF (in millimeters)
      const imgWidth = (210 * 80) / 100 // A4 width

      // Calculate the adjusted height of the image to maintain aspect ratio

      const imgHeight = (canvas.height * imgWidth) / canvas.width
      // Margin left and top
      const marginLeft = (210 * 20) / 200
      // Add image to the PDF document
      doc.addImage(imgData, "JPEG", marginLeft, marginLeft, imgWidth, imgHeight)

      // Add a new page for the next image
      doc.addPage()
    }

    style.sheet?.deleteRule(0)

    setIsLoading(false)
    doc.save(`loan_summary_${new Date().valueOf()}.pdf`)
  }

  const handleClickDownload = (type: LoanSummaryDownloadType) => () => {
    setDownloadType(type)
    setPreventCacheCount((preState) => preState + 1)
  }

  const downloadFile = useQueryDownloadLoanSummary({
    applicationId: loanApplicationId,
    type: downloadType,
    preventCacheCount
  })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ButtonLoading
          variant="outline"
          data-html2canvas-ignore
          isLoading={isLoading || downloadFile.isLoading}
        >
          Download <DownloadCloud className="ml-1" />
        </ButtonLoading>
      </DropdownMenuTrigger>
      <DropdownMenuContent itemProp="className" className="cursor-pointer">
        <DropdownMenuItem onClick={downloadPdf}>File PDF</DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleClickDownload(LoanSummaryDownloadType.CSV)}
        >
          File CSV
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleClickDownload(LoanSummaryDownloadType.JSON)}
        >
          File JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
