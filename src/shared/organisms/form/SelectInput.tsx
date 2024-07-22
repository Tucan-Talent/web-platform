import {
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
import { cn } from "@/lib/utils"

import { RequiredSymbol } from "@/shared/atoms/RequiredSymbol"
import { ChangeEventHandler, FocusEventHandler, ReactNode } from "react"
import { Control, FieldPath, FieldValues } from "react-hook-form"

type IOption = {
  value: string
  label: string
}

interface ISelectInputType<T extends FieldValues> {
  prefix?: string
  suffix?: string
  required?: boolean
  prefixIcon?: ReactNode
  label: string
  placeholder?: string
  control: Control<T>
  name: FieldPath<T>
  onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
  onBlur?: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>
  className?: string
  inputClassName?: string
  labelClassName?: string
  subtitle?: string
  subtitleClassName?: string
  isRowDirection?: boolean
  options: IOption[]
  disabled?: boolean
}

export const SelectInput = <T extends FieldValues>(
  props: ISelectInputType<T>
) => {
  const {
    control,
    name,
    label,
    required,
    subtitle,
    isRowDirection,
    options,
    inputClassName,
    labelClassName,
    subtitleClassName,
    disabled
  } = props

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        // Most of our form use validate mode is 'onBlur'
        // So, I trigger onBlur when FormItem change to validate the input
        <FormItem onChange={field.onBlur} className={props.className}>
          <FormLabel
            className={cn(
              `text-text-secondary ${
                isRowDirection && "lg:-mt-2 font-semibold"
              }`,
              labelClassName
            )}
          >
            <label>
              {label}
              {required && <RequiredSymbol />}
            </label>
            {subtitle && (
              <p
                className={cn(
                  "mt-2 text-text-tertiary font-medium",
                  subtitleClassName
                )}
              >
                {subtitle}
              </p>
            )}
          </FormLabel>

          <FormControl className={`${isRowDirection && "xl:-mt-4"}`}>
            <Select
              onValueChange={(value) => {
                field.onBlur()
                field.onChange(value.toString())
              }}
              value={field.value}
              disabled={disabled}
            >
              <SelectTrigger
                className={cn(
                  "text-sm col-span-6 xl:col-span-2 xl:max-w-40 xl:col-end-7 xl:ml-auto",
                  inputClassName
                )}
              >
                <SelectValue placeholder="Please select" />
              </SelectTrigger>
              <SelectContent className="max-w-screen-sm xl:!max-w-full">
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <span className="text-sm">{option.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          {isRowDirection && subtitle ? (
            <FormMessage style={{ marginTop: -1 }} />
          ) : (
            <FormMessage />
          )}
        </FormItem>
      )}
    />
  )
}
