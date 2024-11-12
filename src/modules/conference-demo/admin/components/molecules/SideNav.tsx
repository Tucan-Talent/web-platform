import { cn } from "@/lib/utils"
import { LogoHeader } from "@/shared/atoms/LogoHeader"
import { useState } from "react"
import { Icons } from "@/components/ui/icons"
import { type NavItem } from "../../constants"
import { TooltipProvider } from "@/components/ui/tooltip"
import { DashboardCollapsedNavLink } from "../atoms/dashboard-collapsed-nav-link"
import { DashboardNavLink } from "../atoms/dashboard-nav-link"
import { Account } from "@/shared/molecules/Account"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  items: NavItem[]
}

export function SideNav({ items, className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <div
      className={cn(
        "py-4xl border data-[collapsed=false]:w-60 flex-col flex",
        className
      )}
      data-collapsed={isCollapsed}
    >
      <div className="mb-3xl hidden items-center justify-between pl-3xl pr-2xl md:flex">
        <LogoHeader isCollapsed={isCollapsed} toggleCollapse={toggleCollapse} />
        {!isCollapsed && (
          <button type="button" onClick={toggleCollapse}>
            {Icons.arrowSquare({ className: "h-6 w-6" })}
          </button>
        )}
      </div>

      <div className="hidden flex-1 flex-col px-xl md:flex">
        <div
          className={cn(
            "group flex flex-col flex-1 gap-4 justify-between mb-0",
            !isCollapsed && "border-0 md:border-b mb-6"
          )}
          data-collapsed={isCollapsed}
        >
          <nav className="flex flex-1 flex-col gap-y-2">
            <TooltipProvider>
              {items.map((item) => {
                const NavLinkComponent = isCollapsed
                  ? DashboardCollapsedNavLink
                  : DashboardNavLink

                return <NavLinkComponent key={item.label} item={item} />
              })}
            </TooltipProvider>
          </nav>
        </div>
      </div>
      <div className="hidden flex-col px-xl md:flex">
        <Account isCollapsed={isCollapsed} />
      </div>
    </div>
  )
}
