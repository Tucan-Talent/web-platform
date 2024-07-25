import { ESignFormValue } from "../../constants/form"
import { useLinkESignDocument } from "../useMutation/useLinkESignDocument"

export const useSubmitESignDocument = (eSignData: ESignFormValue) => {
  const { mutateAsync, isPending } = useLinkESignDocument()

  const submitESignDocument = async (applicationId: string) => {
    if (!eSignData.documentId) {
      throw new Error("Document ID is required")
    }
    await mutateAsync({
      applicationId,
      documentId: eSignData.documentId
    })
  }

  return {
    isLoading: isPending,
    submitESignDocument
  }
}
