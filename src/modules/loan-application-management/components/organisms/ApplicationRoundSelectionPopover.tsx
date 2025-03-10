import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { StatusRoundBadge } from "../atoms/StatusRoundBadge"
import { LoanApplicationStatus } from "@/types/loan-application.type"
import {
  capitalizeWords,
  snakeCaseToText,
  toastError,
  toastSuccess
} from "@/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { useSelectRoundLoanApplication } from "@/modules/loan-application-management/hooks/useMutation/useSelectRoundLoanApplication.ts"
import { TOAST_MSG } from "@/constants/toastMsg.ts"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import _ from "lodash"

const statuses: LoanApplicationStatus[] = [
  LoanApplicationStatus.ROUND_1,
  LoanApplicationStatus.ROUND_2,
  LoanApplicationStatus.ROUND_3,
  LoanApplicationStatus.ELIMINATED_AFTER_INITIAL_REVIEW,
  LoanApplicationStatus.ELIMINATED_AFTER_ROUND_1,
  LoanApplicationStatus.ELIMINATED_AFTER_ROUND_2,
  LoanApplicationStatus.ELIMINATED_AFTER_ROUND_3
]

interface Props {
  applicationId: string
  roundStatus: LoanApplicationStatus
}

const convertStatusToText = (status: LoanApplicationStatus) => {
  return snakeCaseToText(status.toString()).toLowerCase()
}

export const ApplicationRoundSelectionPopover: React.FC<Props> = ({
  applicationId,
  roundStatus
}) => {
  const { mutate, isPending } = useSelectRoundLoanApplication()

  const onSelect = (value: LoanApplicationStatus) => {
    mutate(
      {
        applicationId: applicationId,
        status: value
      },
      {
        onSuccess: () => {
          toastSuccess({
            title: TOAST_MSG.workspaceAdmin.select_round_success.title,
            description: `Application round status has been changed to ${capitalizeWords(
              convertStatusToText(value)
            )}`
          })
          setSelectedStatus(value)
          setOpen(false)
        },
        onError: (e) => {
          toastError({
            title: TOAST_MSG.workspaceAdmin.select_round_error.title,
            description:
              e.response?.data.message ??
              "Something went wrong. Please try again."
          })
        }
      }
    )
  }

  const [open, setOpen] = React.useState(false)
  const [selectedStatus, setSelectedStatus] = React.useState(roundStatus)

  return (
    <div className="flex items-center justify-center space-x-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button className="bg-transparent hover:bg-transparent">
            <StatusRoundBadge round={selectedStatus}>
              {capitalizeWords(convertStatusToText(selectedStatus))}
            </StatusRoundBadge>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-2 rounded-lg" side="bottom" align="start">
          <Command className="p-0">
            <div className="m-2 border rounded-lg border-gray-300">
              <CommandInput placeholder="Search" className="m-0" />
            </div>
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              {isPending && (
                <Loader2
                  className={cn(
                    "top-1/2 left-1/2 absolute transition-all ease-out animate-spin text-gray-300"
                  )}
                />
              )}
              <CommandGroup>
                {statuses.map((status) => (
                  <CommandItem
                    className="flex items-center gap-2 h-10 cursor-pointer"
                    key={status}
                    value={convertStatusToText(status)}
                    disabled={isPending}
                    onSelect={(value) => {
                      // TODO: Call API to select round given applicationId, selectedStatus
                      const selectedStatus =
                        statuses.find(
                          (status) => convertStatusToText(status) === value
                        ) ?? roundStatus
                      onSelect(selectedStatus)
                    }}
                  >
                    <Checkbox
                      checked={_.eq(selectedStatus?.toUpperCase(), status)}
                      className=" h-5 w-5 data-[state=checked]:bg-gray-600 border-gray-300 border-2"
                    />
                    <StatusRoundBadge round={status}>
                      {capitalizeWords(convertStatusToText(status))}
                    </StatusRoundBadge>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
