import { USER_ROLES } from "@/common"
import { Icons } from "@/components/ui/icons"
import { APP_PATH } from "@/constants"
import { NavItem } from "@/types"
import { Bell, FolderCheck, LineChart, MessageSquare } from "lucide-react"

export const APPLICATION_MENU = [
  {
    name: "Overview",
    href: "/application/:id/overview"
  },
  {
    name: "KYC",
    href: "/application/:id/kyc"
  },
  {
    name: "KYB",
    href: "/application/:id/kyb"
  },
  {
    name: "Documents",
    href: "/application/:id/documents"
  },
  {
    name: "Cash Flow",
    href: "/application/:id/cash-flow"
  },
  {
    name: "Business Plan",
    href: "/application/:id/business-plan"
  },
  {
    name: "Loan Summary",
    href: "/application/:id/loan-summary"
  },
  {
    name: "Loan Decision",
    href: "/application/:id/loan-decision"
  }
]

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: APP_PATH.DASHBOARD,
    icon: LineChart,
    label: "Dashboard"
  },
  {
    title: "Applications",
    href: APP_PATH.LOAN_APPLICATION_DETAILS.INDEX,
    icon: FolderCheck,
    label: "Applications"
  },
  {
    title: "Messages",
    href: APP_PATH.LOAN_APPLICATION.INDEX,
    icon: MessageSquare,
    label: "Messages"
  },
  {
    title: "Notifications",
    href: APP_PATH.LOAN_APPLICATION.INDEX,
    icon: Bell,
    label: "Notifications"
  },
  {
    title: "Users",
    href: APP_PATH.ADMIN_USERS.index,
    icon: Icons.user,
    label: "users",
    roles: [USER_ROLES.CDFI_ADMIN, USER_ROLES.FORESIGHT_ADMIN]
  }
]

export const KYC_STATUS = {
  VERIFIED: "VERIFIED",
  UNVERIFIED: "UNVERIFIED",
  FAILED: "FAILED",
  UNCHECKED: "UNCHECKED",
  PASSED: "PASSED"
}
