import { ButtonLoading } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { isEnableDownloadCSVAndJSONSummary } from "@/utils/feature-flag.utils"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import { DownloadCloud } from "lucide-react"
import { RefObject, useState } from "react"
import { useParams } from "react-router-dom"
import { LoanSummaryDownloadType } from "../../constants/type"
import { useQueryDownloadLoanSummary } from "../../hooks/useQuery/useQueryDownloadLoanSummary"

export const DownloadButton = ({
  elementToExportRef,
  disabled
}: {
  elementToExportRef: RefObject<HTMLElement>[]
  disabled?: boolean
}) => {
  const [isLoading, setIsLoading] = useState<boolean>()
  const [downloadType, setDownloadType] = useState<LoanSummaryDownloadType>()
  const [preventCacheCount, setPreventCacheCount] = useState(0)
  const { id: loanApplicationId } = useParams()

  const adjustFontSize = (clonedContent: HTMLElement) => {
    const elementsWithSmText = clonedContent.querySelectorAll(".text-sm")
    elementsWithSmText.forEach((el) => {
      el.classList.remove("text-sm")
      el.classList.add("text-2xl")
    })

    const elementsWithXsText = clonedContent.querySelectorAll(".text-xs")
    elementsWithXsText.forEach((el) => {
      el.classList.remove("text-xs")
      el.classList.add("text-xl")
    })
    const elementsWithLgText = clonedContent.querySelectorAll(".text-lg")
    elementsWithLgText.forEach((el) => {
      el.classList.remove("text-lg")
      el.classList.add("text-3xl")
    })
    const elementsWith1XlText = clonedContent.querySelectorAll(".text-1xl")
    elementsWith1XlText.forEach((el) => {
      el.classList.remove("text-1xl")
      el.classList.add("text-2xl")
    })
    const elementsWith3XlText = clonedContent.querySelectorAll(".text-3xl")
    elementsWith3XlText.forEach((el) => {
      el.classList.remove("text-3xl")
      el.classList.add("text-2xl")
    })
    const elementsWithCard = clonedContent.querySelectorAll(".h-32")
    elementsWithCard.forEach((el) => {
      el.classList.remove("h-32")
      el.classList.add("h-36")
    })
    const elementsWithCardText = clonedContent.querySelectorAll(
      ".text-text-tertiary.text-2xl"
    )
    elementsWithCardText.forEach((el) => {
      el.classList.remove("text-2xl")
      el.classList.add("text-xl")
    })
    const elementsP = clonedContent.querySelectorAll("p")
    elementsP.forEach((el) => {
      el.classList.add("text-2xl")
    })

    const elementsWithTextBase = clonedContent.querySelectorAll(".text-base")
    elementsWithTextBase.forEach((el) => {
      el.classList.remove("text-base")
      el.classList.add("text-2xl")
    })
  }

  const addContentToPdf = async (doc: jsPDF, content: HTMLElement) => {
    const [pageWidth, pageHeight] = [210, 297]
    const canvas = await html2canvas(content)
    const imgData = canvas.toDataURL("image/jpeg")

    // Set the desired width of the image in the PDF (in millimeters)
    const imgWidth = (pageWidth * 80) / 100 // A4 width

    // Calculate the adjusted height of the image to maintain aspect ratio
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    // Margin left and top
    const marginLeft = (pageWidth * 20) / 200
    let heightLeft = imgHeight
    let position = marginLeft

    doc.addImage(imgData, "JPEG", marginLeft, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    while (heightLeft >= 0) {
      position += heightLeft - imgHeight
      doc.addPage()
      doc.addImage(imgData, "JPEG", marginLeft, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }
  }

  const processContent = async (doc: jsPDF, content: HTMLElement) => {
    const clonedContent = content.cloneNode(true) as HTMLElement
    document.body.appendChild(clonedContent)

    adjustFontSize(clonedContent)
    await addContentToPdf(doc, clonedContent)
    // Add a new page for the next image
    doc.addPage()
    // Remove the cloned content
    clonedContent.remove()
  }

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
      const content = ref.current
      if (content.id === "loan-application") {
        let isHeaderPrinted = false
        const header = content.querySelectorAll(".loan-application-header")[0]
        const miniSections = content.querySelectorAll(".loan-application-item")

        for (const section of miniSections) {
          if (section.id == "current-loans" && section.children.length > 2) {
            const MAX_LOANS_PER_PAGE = 6
            for (
              let i = 0;
              i < section.children.length;
              i += MAX_LOANS_PER_PAGE
            ) {
              const clonedContent = document.createElement("div")
              if (!isHeaderPrinted) {
                clonedContent.appendChild(header.cloneNode(true))
                isHeaderPrinted = true
              }

              const pageSection = document.createElement("div")
              pageSection.classList.add("loan-application-item")

              for (
                let j = i;
                j < i + MAX_LOANS_PER_PAGE && j < section.children.length;
                j++
              ) {
                const sectionElement = section.children[j] as HTMLElement
                sectionElement.style.marginBottom = "30px" // Add padding between sections
                pageSection.appendChild(section.children[j].cloneNode(true))
              }

              clonedContent.appendChild(pageSection)
              document.body.appendChild(clonedContent)

              adjustFontSize(clonedContent)

              await addContentToPdf(doc, clonedContent)

              clonedContent.remove()

              doc.addPage()
            }
          } else {
            const clonedContent = document.createElement("div")
            if (!isHeaderPrinted) {
              clonedContent.appendChild(header.cloneNode(true))
              isHeaderPrinted = true
            }
            clonedContent.appendChild(section.cloneNode(true))
            document.body.appendChild(clonedContent)
            adjustFontSize(clonedContent)
            await addContentToPdf(doc, clonedContent)

            clonedContent.remove()
            if (miniSections[miniSections.length - 1] !== section) {
              doc.addPage()
            }
          }
        }
      } else {
        await processContent(doc, content)
      }
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
          disabled={disabled}
        >
          Download <DownloadCloud className="ml-1" />
        </ButtonLoading>
      </DropdownMenuTrigger>
      <DropdownMenuContent itemProp="className" className="cursor-pointer">
        <DropdownMenuItem onClick={downloadPdf}>PDF</DropdownMenuItem>
        {/* MVP-1385: hide because its not ready */}
        {isEnableDownloadCSVAndJSONSummary() && (
          <>
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
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
