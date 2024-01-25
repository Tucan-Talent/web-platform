import { ScrollArea, ScrollBar } from "@/components/ui/scroll"
import { cn } from "@/lib/utils"
import { Link, useLocation } from "react-router-dom"
import { APPLICATION_MENU } from "../../constants"

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

export function TopNav({ className, ...props }: Props) {
  const pathname = useLocation().pathname

  return (
    <div className="relative">
      <ScrollArea className="max-w-[600px] lg:max-w-none">
        <div
          className={cn("flex items-center space-x-lg px-4xl", className)}
          {...props}
        >
          {APPLICATION_MENU.map((example, index) => (
            <Link
              to={example.href}
              key={example.href}
              className={cn(
                "flex px-xs pb-lg font-semibold items-center justify-center text-center text-sm transition-colors border-b-2 border-transparent",
                "hover:text-primary hover:border-primary",
                pathname?.startsWith(example.href) ||
                  (index === 0 && pathname === "/")
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground"
              )}
            >
              {example.name}
            </Link>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </div>
  )
}
