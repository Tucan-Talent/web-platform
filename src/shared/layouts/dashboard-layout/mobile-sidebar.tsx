import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { MenuIcon } from "lucide-react"
import { useState } from "react"
import { DashboardNav } from "./dashboard-nav"
import foresightLogo from "/foresight.svg"
import foresightLogoText from "@/assets/foresight-text.svg"
import { NavItem } from "@/types/common.type"

interface MobileSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  items: NavItem[]
}

export function MobileSidebar({ items }: MobileSidebarProps) {
  const [open, setOpen] = useState(false)
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <MenuIcon />
      </SheetTrigger>
      <SheetContent side="left" className="!px-0">
        <div className="space-y-4 py-4">
          <div className="px-3 py-2 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <img
                src={foresightLogo}
                className="logo w-8 h-8"
                alt="Foresight logo"
              />

              <img
                src={foresightLogoText}
                alt="Foresight logo"
                className="mt-1"
              />
            </div>

            <div className="space-y-1">
              <DashboardNav items={items} />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
