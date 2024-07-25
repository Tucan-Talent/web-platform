import { postRequest } from "@/services/client.service"
import { useMutation } from "@tanstack/react-query"
import { E_SIGN_CLIENT } from "../../constants/e-sign"
import { IESignDocument } from "@/types/esign/document.type"
import jsPDF from "jspdf"

interface IESignCreateDocumentRequest {
  pdf: jsPDF
  totalPage?: number
  silent?: boolean
}

export const useCreateESignDocument = () => {
  return useMutation({
    mutationFn: () => {
      return postRequest<unknown, IESignDocument>({
        path: E_SIGN_CLIENT.ENDPOINTS.createDocument
      })
    }
  })
}

export const useCreateESignDocumentByFile = () => {
  return useMutation({
    mutationFn: ({
      pdf,
      totalPage = 0,
      silent = true
    }: IESignCreateDocumentRequest) => {
      const formData = new FormData()
      const pdfBlob = pdf.output("blob")
      const pdfFile = new File([pdfBlob], "document.pdf", {
        type: "application/pdf"
      })

      formData.append("file", pdfFile)
      formData.append("total_page", totalPage.toString())
      formData.append("silent", silent.toString())

      return postRequest<FormData, IESignDocument>({
        path: E_SIGN_CLIENT.ENDPOINTS.createDocumentByFile(),
        data: formData
      })
    }
  })
}
