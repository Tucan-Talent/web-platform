"use client"

import { format } from "date-fns"
import * as React from "react"
import { SelectRangeEventHandler } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"

type DatePickerWithRangeProps = React.HTMLAttributes<HTMLDivElement> & {
  date?: {
    from?: Date
    to?: Date
    selectedTimeRange?: string
  }
  disabled?: {
    from?: Date
    to?: Date
  }
  setDate: SelectRangeEventHandler
}

export function DatePickerWithRange({
  className,
  date,
  disabled,
  setDate
}: DatePickerWithRangeProps) {
  const state = React.useMemo(
    () => ({ from: date?.from, to: date?.to }),
    [date?.from, date?.to]
  )

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal px-3.5",
              !date && "text-muted-foreground",
              "group-[.date-select-coupling]:rounded-l-none group-[.date-select-coupling]:border-l-0 group-[.date-select-coupling]:justify-between"
            )}
          >
            <CalendarIcon
              className={cn(
                "mr-2 h-4 w-4 order-0 text-muted-foreground",
                "group-[.date-select-coupling]:order-1 group-[.date-select-coupling]:mr-0"
              )}
            />
            <div>
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  <>{format(date.from, "LLL dd, y")} - Pick to date</>
                )
              ) : (
                <span>Pick a date</span>
              )}
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={state.to}
            selected={state}
            onSelect={setDate}
            showOutsideDays={false}
            numberOfMonths={2}
            disabled={(date) =>
              (disabled?.from && date < disabled.from) ||
              (disabled?.to && date > disabled.to) ||
              date > new Date() ||
              date < new Date("1900-01-01")
            }
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
