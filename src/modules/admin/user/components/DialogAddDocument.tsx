import { Button, ButtonLoading } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlusCircle, Send } from "lucide-react"
import { useForm } from "react-hook-form"

import { useGetUserInformation } from "@/hooks/useGetUserInformation"
import { Option } from "@/types/common.type"
import { checkIsForesightAdmin } from "@/utils/check-roles"
import { useQueryGetListAllInstitution } from "../hooks/useQuery/useQueryGetListAllInstitution"

import RHFDragAndDropFileUpload from "@/modules/form-template/components/molecules/RHFDragAndDropFileUpload"
import {
  adminAddDocumentForm,
  AdminAddDocumentValue,
  useSubmitDocument
} from "@/modules/admin/user/hooks/useSubmitDocument"
import useBoolean from "@/hooks/useBoolean"

export function DialogAddDocument() {
  const isOpen = useBoolean(false)
  const { data } = useGetUserInformation()
  const isForesightAdmin = checkIsForesightAdmin()

  const listInstitution = useQueryGetListAllInstitution({
    enabled: isForesightAdmin
  })

  const institutionOptions: Option[] =
    listInstitution.data?.map((institution) => ({
      value: institution.id,
      label: institution.name
    })) ?? []

  const onOpenChange = (open: boolean) => {
    if (!open) {
      form.reset()
    }
    isOpen.setValue(open)
  }

  const form = useForm<AdminAddDocumentValue>({
    resolver: zodResolver(adminAddDocumentForm),
    values: {
      institutionId: isForesightAdmin ? "" : data?.institutionId ?? "",
      files: [],
      uploadedFiles: []
    }
  })

  const { mutate, isPending } = useSubmitDocument()

  const formSubmit = form.handleSubmit((data) => {
    mutate(data)
    onOpenChange(false)
  })

  const isValid =
    form.formState.isValid &&
    (form.getValues().files?.length > 0 ||
      form.getValues().uploadedFiles?.length > 0)

  return (
    <Dialog open={isOpen.value} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button type="button">
          <PlusCircle size={16} className="text-sm mr-1.5" />
          Add Document
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Upload Document to Lenda Chatbot
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={formSubmit} className="flex flex-col space-y-3">
            {isForesightAdmin && (
              <>
                <FormField
                  control={form.control}
                  name="institutionId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Institution</FormLabel>
                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an institution" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {institutionOptions.map((role) => (
                            <SelectItem key={role.value} value={role.value}>
                              {role.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <RHFDragAndDropFileUpload name="files" id="files" />
              </>
            )}

            <DialogFooter>
              <ButtonLoading
                type="submit"
                isLoading={isPending}
                disabled={!isValid}
              >
                Send {!isPending && <Send className="ml-1.5" size="16" />}
              </ButtonLoading>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
