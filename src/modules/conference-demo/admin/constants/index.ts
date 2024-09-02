import { IconProps, Icons } from "@/components/ui/icons"
import { APP_PATH } from "@/constants"
import { LucideIcon } from "lucide-react"

export enum ApplicationMenuName {
  business = "Business Verification",
  identity = "Identity Verification",
  document = "Documentation",
  cashflow = "Cash Flow",
  applicationSummary = "Loan Summary",
  loanReadiness = "Loan Readiness"
}
export const APPLICATION_MENU = [
  {
    name: ApplicationMenuName.business,
    href: APP_PATH.CONFERENCE_DEMO.admin.business
  },
  {
    name: ApplicationMenuName.identity,
    href: APP_PATH.CONFERENCE_DEMO.admin.identity
  },
  {
    name: ApplicationMenuName.document,
    href: APP_PATH.CONFERENCE_DEMO.admin.documents
  },
  {
    name: ApplicationMenuName.cashflow,
    href: APP_PATH.CONFERENCE_DEMO.admin.cashflow
  },
  {
    name: ApplicationMenuName.applicationSummary,
    href: APP_PATH.CONFERENCE_DEMO.admin.loanSummary
  },
  {
    name: ApplicationMenuName.loanReadiness,
    href: APP_PATH.CONFERENCE_DEMO.admin.loanReadiness
  }
]

export enum LoanDecisionEnum {
  APPROVED = "approved",
  DENIED = "denied",
  IN_REVIEW = "in_review",
  REFER_TO_LOANREADY = "refer_to_loanready"
}

export const DASHBOARD_NAV_ITEM = [
  {
    title: "Dashboard",
    href: APP_PATH.CONFERENCE_DEMO.admin.index,
    icon: Icons.lineChart,
    label: "Dashboard"
  },
  {
    title: "Applications",
    href: APP_PATH.CONFERENCE_DEMO.admin.applications,
    icon: Icons.folderCheck,
    label: "Applications"
  }
]

export type NavItem = {
  title: string
  href: string
  icon: LucideIcon | ((props: IconProps) => JSX.Element)
  label: string
  className?: string
}
