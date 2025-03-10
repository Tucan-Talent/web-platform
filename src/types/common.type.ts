import { IconProps } from "@/components/ui/icons"
import { ErrorCode } from "@/utils/custom-error"
import { LucideIcon } from "lucide-react"
import { ReactNode } from "react"
import { UserRoles } from "./user.type"
import { FEATURE_FLAGS } from "@/constants/feature-flag.constants"

// --- RESPONSE ---
interface SuccessResponse {
  success: boolean
}
interface ErrorResponse {
  message?: string
  code: ErrorCode
}

export type { ErrorResponse, SuccessResponse }

// --- SELECT OPTION ---
interface Option {
  label: string
  value: string
}

export type { Option }

// --- PARAMS WHEN FETCHING LISTS ---
interface PaginateParams {
  limit: number
  offset: number
}

export type { PaginateParams }

// --- INFINITY LIST RESPONSE  ---
// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface ListResponse<TData = any> {
  total: number
  currentOffset: number
  data: TData[]
}

export type { ListResponse }

// --- NAV ITEM ---
interface NavItem {
  title: string
  href?: string
  featureFlag?: FEATURE_FLAGS | FEATURE_FLAGS[]
  disabled?: boolean
  external?: boolean
  icon: LucideIcon | ((props: IconProps) => JSX.Element)
  label?: string
  description?: string
  roles?: UserRoles[]
  className?: string
}
interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[]
}
interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[]
}

export type { NavItem, NavItemWithChildren, NavItemWithOptionalChildren }

// --- STATE ---
type CityType = {
  id: number
  name: string
  latitude: string
  longitude: string
}
type StateType = {
  id: number
  name: string
  state_code: string
  latitude: string
  longitude: string
  country_id: number
  cities: CityType[]
}

export type { CityType, StateType }

// --- BREADCRUMB ---
interface Breadcrumb {
  label: ReactNode
  to: string
}

export type { Breadcrumb }

// --- QUERY RESPONSE ---
export interface ImageDataResponse {
  fileData: string
}
