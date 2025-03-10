import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"
import { ArrowDown, ArrowUp } from "lucide-react"

const statsVariants = cva(
  "inline-flex items-center rounded-full bg-opacity-10 border px-2.5 py-0.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        positive: "text-green-700 bg-green-500 border-success-200",
        negative: "text-red-700 bg-red-500 border-red-300",
        neutral: "text-gray-700 bg-gray-300 border-gray-300"
      }
    },
    defaultVariants: {
      variant: "neutral"
    }
  }
)

export interface DashboardStatsRateProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statsVariants> {
  percentRate?: number
  revert?: boolean
}

function DashboardStatsRate({
  percentRate = 0,
  className,
  revert,
  ...props
}: Readonly<DashboardStatsRateProps>) {
  const arrow = revert ? [ArrowDown, ArrowUp] : [ArrowUp, ArrowDown]
  const variant =
    percentRate > 0 ? "positive" : percentRate < 0 ? "negative" : "neutral"

  const Icon = percentRate > 0 ? arrow[0] : percentRate < 0 ? arrow[1] : null

  return (
    <div className={cn(statsVariants({ variant }), className)} {...props}>
      {Icon && <Icon className="h-3 w-3" strokeWidth={3} />}
      {Math.abs(percentRate)}%
    </div>
  )
}

export { DashboardStatsRate, statsVariants }
