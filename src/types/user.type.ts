// ENUM
/**
 * TODO: Clean up deprecated roles after migrating user roles.
 */
enum UserRoles {
  /**
   * @deprecated This will be replaced by REVIEWER
   */
  LOAN_OFFICER = "LOAN_OFFICER",

  /**
   * @deprecated This will be replaced by APPLICANT
   */
  LOAN_APPLICANT = "LOAN_APPLICANT",

  /**
   * @deprecated This will be replaced by PLATFORM_ADMIN
   */
  FORESIGHT_ADMIN = "FORESIGHT_ADMIN",

  /**
   * @deprecated This will be replaced by WORKSPACE_ADMIN
   */
  CDFI_ADMIN = "CDFI_ADMIN",

  /**
   * The loan applicant is the person who applies for loan programs
   */
  APPLICANT = "APPLICANT",

  /**
   * The reviewer who processes review for the applications applied for loan programs.
   */
  REVIEWER = "REVIEWER",

  /**
   * The institution administrator with administrative control over organizational settings and
   * user management within the specific financial institution.
   */
  WORKSPACE_ADMIN = "WORKSPACE_ADMIN",

  /**
   * The platform administrator with advanced privileges, overseeing and managing the whole system,
   * which may include configuration, monitoring, and maintenance the financial institutions.
   */
  PLATFORM_ADMIN = "PLATFORM_ADMIN"
}

const applicantRoles = () => {
  return [UserRoles.APPLICANT, UserRoles.LOAN_APPLICANT]
}

const applicantRole = () => {
  return UserRoles.APPLICANT
}

const reviewerRole = () => {
  return UserRoles.REVIEWER
}

const reviewerRoles = () => {
  return [UserRoles.REVIEWER, UserRoles.LOAN_OFFICER]
}

const workspaceAdminRole = () => {
  return UserRoles.WORKSPACE_ADMIN
}

const workspaceAdminRoles = () => {
  return [UserRoles.WORKSPACE_ADMIN, UserRoles.CDFI_ADMIN]
}

const platformAdminRoles = () => {
  return [UserRoles.PLATFORM_ADMIN, UserRoles.FORESIGHT_ADMIN]
}

const platformAdminRole = () => {
  return UserRoles.PLATFORM_ADMIN
}

export {
  applicantRoles,
  applicantRole,
  reviewerRole,
  reviewerRoles,
  workspaceAdminRole,
  workspaceAdminRoles,
  platformAdminRoles,
  platformAdminRole
}

enum UserStatus {
  UNVERIFIED = "UNVERIFIED",
  REGISTERING = "REGISTERING",
  ACTIVE = "ACTIVE",
  DEACTIVATED = "DEACTIVATED"
}

export { UserStatus, UserRoles }

// INTERFACE
interface UserInfo {
  accessToken: string
  expiresIn: number
  refreshToken: string
  roles: string[]
  tokenType: string
  username: string
  status?: UserStatus
  avatar?: string
}

interface UserDetailInfo {
  id: string
  institutionId: string
  authId: string
  name: string
  email: string
  avatar: string
  status: UserStatus
  roles: UserRoles[]
  loggedInAt: string
  authProvider: string
  createdAt: string
}

export type { UserInfo, UserDetailInfo }
