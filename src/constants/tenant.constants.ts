enum Institution {
  IntrustBank = "intrust",
  Altcap = "altcap",
  LoanReady = "loanready"
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
}

export { Institution }
export type { InstitutionData }
