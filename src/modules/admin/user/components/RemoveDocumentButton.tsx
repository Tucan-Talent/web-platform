import { ButtonLoading } from "@/components/ui/button.tsx"
import { Trash } from "lucide-react"
import { CustomAlertDialog } from "@/shared/molecules/AlertDialog"
import { cn } from "@/lib/utils.ts"
import { useDeleteDocument } from "@/modules/admin/user/hooks/useSubmitDocument"
import useBoolean from "@/hooks/useBoolean"

export function ButtonDeleteDocument({
  documentId,
  fileName
}: {
  documentId: string
  fileName: string
}) {
  const isOpen = useBoolean(false)
  const { mutateAsync, isRemoving } = useDeleteDocument()

  const handleRemoveDocument = () => {
    mutateAsync({ documentId: documentId })
    isOpen.onFalse()
  }

  return (
    <CustomAlertDialog
      actionClassName="bg-red-500 hover:bg-red-600 text-white"
      cancelText="Cancel"
      confirmText="Confirm"
      description={
        <span>
          <strong>
            This action will remove the document permanently from the
            organization.
          </strong>{" "}
          Are you sure you want to proceed?
        </span>
      }
      isOpen={isOpen.value}
      title={`Remove "${fileName}"?`}
      onCanceled={isOpen.onFalse}
      onConfirmed={handleRemoveDocument}
    >
      <ButtonLoading
        className={cn("h-max cursor-pointer text-red-900 p-2")}
        id={documentId}
        isLoading={isRemoving}
        size="icon"
        type="submit"
        variant="ghost"
        onClick={isOpen.onTrue}
      >
        <Trash className="w-5 h-5" />
        {!isRemoving}
      </ButtonLoading>
    </CustomAlertDialog>
  )
}
