enum Institution {
  Admin = "admin",
  IntrustBank = "intrust",
  Capsight = "capsight",
  LoanReady = "loanready",
  Foresight = "foresight",
  CyphrV2 = "cyphr-bank",
  KCChamber = "kcchamber",
  LaunchKC = "launchkc",
  SBB = "sbb",
  KansasCity = "kansascity"
}

type InstitutionData = {
  /**
   * SUPPORT EMAIl
   */
  supportEmail: string

  /**
   * THEME
   */
  name: string
  logo: string
  textLogo: string

  /**
   * LOAN PROGRAM
   */
  loanProgramWelcome: string
  loanProgramOverview: string
  loanProgramOverviewHeroImage: string

  /**
   * CUSTOM ON DEMAND
   */
  customFieldsOnDemand?: {
    showLongCard?: boolean

    /**
     * @example "asset/subdomain/logo.png"
     */
    favicon?: string
    stytchOrganizationId?: string
  }
}

export { Institution }
export type { InstitutionData }
