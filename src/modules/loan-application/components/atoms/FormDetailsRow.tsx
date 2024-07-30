import { cn } from "@/lib/utils"

type Props = {
  label: string
  value?: string
  className?: string
  description?: string
  hasUnderline?: boolean
}

export const FormDetailsRow = ({
  label,
  value,
  className,
  description
}: Props) => {
  return (
    <div className="flex flex-col">
      <div className={cn(className, "flex justify-between py-xl items-center")}>
        <div className="flex flex-col">
          <div className="text-text-secondary font-medium text-base">
            {label}
          </div>
          {!!description && (
            <p className="text-sm text-text-tertiary">{description}</p>
          )}
        </div>
        <p className="text-base">{value ?? "N/A"}</p>
      </div>
    </div>
  )
}
