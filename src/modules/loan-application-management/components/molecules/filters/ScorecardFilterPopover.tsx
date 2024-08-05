import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import useBoolean from "@/hooks/useBoolean"
import { cn } from "@/lib/utils"
import { parseAndValidateNumberOrUndefined } from "@/utils"
import { ChevronDown } from "lucide-react"
import { useCallback } from "react"
import { ControllerRenderProps, FieldValues, Path } from "react-hook-form"

const enum SCORECARD_FILTER_FIELDS_NAME {
  NUMBER_OF_SCORED = "numberOfScored",
  NUMBER_OF_ASSIGNED = "numberOfAssigned"
}

interface Props<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>
> {
  field: ControllerRenderProps<TFieldValues, TName>
  className?: string
}

export const ScorecardFilterPopover = <
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>
>(
  props: Props<TFieldValues, TName>
) => {
  const { field, className } = props
  const { value: open, setValue: setOpen } = useBoolean(false)

  const handleClear = useCallback(() => {
    field.onChange({
      [SCORECARD_FILTER_FIELDS_NAME.NUMBER_OF_SCORED]: undefined,
      [SCORECARD_FILTER_FIELDS_NAME.NUMBER_OF_ASSIGNED]: undefined
    })
    setOpen(false)
  }, [field, setOpen])

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={field.name}
            variant="ghost"
            className="text-sm font-semibold border border-input h-10 px-4 py-2 rounded-full text-slate-700"
          >
            Scorecard Status
            <ChevronDown className="ml-0.5 h-5 w-5 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="rounded-lg p-0 m-0 w-full"
          side="bottom"
          align="center"
        >
          <div className="flex mt-1 items-center justify-between gap-2 w-fit p-4 text-sm">
            <Input
              name={SCORECARD_FILTER_FIELDS_NAME.NUMBER_OF_SCORED}
              type="text"
              min={0}
              maxLength={2}
              className="w-20 focus-visible:ring-0"
              value={field.value?.numberOfScored ?? ""}
              onChange={(e) => {
                const value = parseAndValidateNumberOrUndefined(
                  e.target.value,
                  2
                )
                e.preventDefault()
                field.onChange({
                  ...field.value,
                  [SCORECARD_FILTER_FIELDS_NAME.NUMBER_OF_SCORED]: value
                })
              }}
            />
            of
            <Input
              name={SCORECARD_FILTER_FIELDS_NAME.NUMBER_OF_ASSIGNED}
              type="text"
              min={0}
              maxLength={2}
              className="w-20 focus-visible:ring-0"
              value={field.value?.numberOfAssigned ?? ""}
              onChange={(e) => {
                const value = parseAndValidateNumberOrUndefined(
                  e.target.value,
                  2
                )
                field.onChange({
                  ...field.value,
                  [SCORECARD_FILTER_FIELDS_NAME.NUMBER_OF_ASSIGNED]: value
                })
              }}
            />
            scored
          </div>

          <Separator />
          <Button
            variant="ghost"
            className="w-full hover:text-red-600 rounded-none h-7 my-1.5 flex justify-start text-left text-sm font-normal text-slate-700"
            type="reset"
            onClick={handleClear}
          >
            Clear all values
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  )
}
