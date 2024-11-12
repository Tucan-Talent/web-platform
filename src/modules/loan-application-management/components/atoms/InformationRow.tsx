import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface Props {
  label: string
  value: string
  className?: string
  isLoading?: boolean
}

export const InformationRow: React.FC<Props> = ({
  label,
  value,
  className,
  isLoading = false
}) => (
  <div
    className={cn(
      "md:grid-cols-2 md:grid md:grid-flow-row border border-t-0 border-l-0",
      className
    )}
  >
    <div className="flex flex-1 py-xl pl-xl md:items-center xl:py-3xl xl:pl-3xl">
      <p
        className={cn(
          "text-sm text-text-tertiary break-words",
          !value && "whitespace-nowrap text-foreground font-medium"
        )}
      >
        {label}
      </p>
    </div>
    <div className="col-span-1 flex break-words px-xl pb-xl md:items-center md:pt-xl xl:py-3xl xl:pl-3xl">
      {isLoading ? (
        <Skeleton className="h-full w-4/5" />
      ) : (
        <p className="max-w-full overflow-visible truncate whitespace-normal break-words text-sm font-medium">
          {value}
        </p>
      )}
    </div>
  </div>
)
