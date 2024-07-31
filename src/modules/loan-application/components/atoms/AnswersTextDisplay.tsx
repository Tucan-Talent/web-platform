import { cn } from "@/lib/utils"

type AnswersTextDisplayProps = {
  label: string
  value?: string
  className?: string
  valueClassName?: string
  labelClassName?: string
}

type MultiAnswersTextDisplayProps = {
  label: string
  value?: string[]
  className?: string
}

export const AnswersTextDisplay = ({
  label,
  value,
  className,
  valueClassName,
  labelClassName
}: AnswersTextDisplayProps) => {
  return (
    <div className={cn("gap-sm flex flex-col", className)}>
      <div
        className={cn("text-text-primary font-medium text-sm", labelClassName)}
      >
        {label}
      </div>
      <p className={cn("text-sm items-center font-normal", valueClassName)}>
        {value ?? "N/A"}
      </p>
    </div>
  )
}

export const MultiAnswersTextDisplay = ({
  label,
  value,
  className
}: MultiAnswersTextDisplayProps) => {
  return (
    <div className={cn(className, "gap-sm flex flex-col")}>
      <div className="text-text-primary font-medium text-sm">{label}</div>
      {value?.map((v, i) => (
        <p key={i} className="text-sm items-center font-normal">
          {v}
        </p>
      ))}
    </div>
  )
}
