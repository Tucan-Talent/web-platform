"use client"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { NavItem } from "@/types"
import { useLocation } from "react-router-dom"

interface DashboardNavProps {
  readonly items: NavItem[]
  readonly isCollapsed?: boolean
}

export function DashboardNav({ items, isCollapsed }: DashboardNavProps) {
  const location = useLocation()

  if (!items?.length) {
    return null
  }

  const currentPath = location.pathname
  const isSelected = (href: string) => currentPath === href

  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col flex-1 gap-4"
    >
      <nav className="grid group-[[data-collapsed=true]]:justify-center">
        <TooltipProvider>
          {items.map((item, index) =>
            isCollapsed ? (
              <Tooltip key={index} delayDuration={0}>
                <TooltipTrigger asChild>
                  <a
                    href={item.href}
                    className={cn(
                      "h-9 w-9 rounded-md flex items-center justify-center",
                      "data-[selected=true]:bg-active"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="sr-only">{item.title}</span>
                  </a>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="flex items-center gap-4"
                >
                  {item.title}
                </TooltipContent>
              </Tooltip>
            ) : (
              <a
                key={index}
                href={item.href}
                className={cn(
                  "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                  "flex items-center gap-4 py-md px-lg rounded-md",
                  "data-[selected=true]:bg-active"
                )}
                data-selected={isSelected(item.href ?? "")}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </a>
            )
          )}
        </TooltipProvider>
      </nav>
    </div>
  )
}
