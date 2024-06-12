import {
  applicantRoles,
  platformAdminRoles,
  reviewerRoles,
  UserRoles,
  workspaceAdminRoles
} from "@/types/user.type"
import { inMemoryJWTService } from "@/services/jwt.service"

const getUserRoles = () => {
  const userInfo = inMemoryJWTService.getUserInfo()

  if (!userInfo) return []
  if (!Array.isArray(userInfo.roles)) return []

  return userInfo.roles
}

const hasRole = (roles: string[], role: string): boolean => {
  return roles.includes(role.toLowerCase())
}

const checkIsLoanApplicant = () => {
  const userInfo = inMemoryJWTService.getUserInfo()
  if (!userInfo) return false

  return isApplicant(userInfo.roles)
}

const checkIsLoanOfficer = () => {
  const userInfo = inMemoryJWTService.getUserInfo()
  if (!userInfo) return false

  return isReviewer(userInfo.roles)
}

const checkIsForesightAdmin = () => {
  const userInfo = inMemoryJWTService.getUserInfo()

  if (!userInfo) return false

  return isPlatformAdmin(userInfo.roles)
}

const checkRolesMatchWithUserRoles = (roles: UserRoles[]) => {
  const userRoles = getUserRoles()

  return roles.some((role) => userRoles.includes(role.toLowerCase()))
}

const checkIsLenderAdmin = () => {
  const userInfo = inMemoryJWTService.getUserInfo()

  if (!userInfo) return false

  return isWorkspaceAdmin(userInfo.roles)
}

const isReviewerRole = (role: UserRoles): boolean => {
  return reviewerRoles().includes(role)
}

const isApplicant = (roles: string[]): boolean => {
  return applicantRoles().some((role) => hasRole(roles, role))
}

const isReviewer = (roles: string[]): boolean => {
  return reviewerRoles().some((role) => hasRole(roles, role))
}

const isWorkspaceAdmin = (roles: string[]): boolean => {
  return workspaceAdminRoles().some((role) => hasRole(roles, role))
}

const isPlatformAdmin = (roles: string[]): boolean => {
  return platformAdminRoles().some((role) => hasRole(roles, role))
}

export {
  checkIsLenderAdmin,
  checkIsForesightAdmin,
  checkIsLoanApplicant,
  checkRolesMatchWithUserRoles,
  checkIsLoanOfficer,
  isReviewerRole,
  isApplicant,
  isPlatformAdmin
}
