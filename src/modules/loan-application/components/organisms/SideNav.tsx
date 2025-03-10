import { cn } from "@/lib/utils"
import { DashboardNav } from "@/shared/layouts/dashboard-layout/dashboard-nav"
import { navItems } from "@/modules/loan-application/constants"
import { LogoHeader } from "@/shared/atoms/LogoHeader"
import { useState } from "react"
import { Icons } from "@/components/ui/icons"
import { Account } from "@/shared/molecules/Account"
interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SideNav({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <div
      className={cn(
        "py-4xl border data-[collapsed=false]:w-60 flex-col flex ",
        className
      )}
      data-collapsed={isCollapsed}
    >
      <div className="pl-3xl pr-2xl flex items-center mb-3xl justify-between">
        <LogoHeader isCollapsed={isCollapsed} toggleCollapse={toggleCollapse} />
        {!isCollapsed && (
          <button onClick={toggleCollapse}>
            {Icons.arrowSquare({ className: "h-6 w-6" })}
          </button>
        )}
      </div>
      <div className="px-xl flex flex-col flex-1">
        <DashboardNav items={navItems} isCollapsed={isCollapsed} />
        <Account isCollapsed={isCollapsed} />
      </div>
    </div>
  )
}
