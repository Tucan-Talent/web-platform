import { LoanType } from "@/types/loan-program.type"
import { snakeCaseToUrlPattern } from "@/utils"

export const APP_PATH = {
  INDEX: "/",
  DASHBOARD: "/",

  // AUTHENTICATION
  LOGIN: "/login",
  FORGOT_PASSWORD: "/forgot-password",
  SETUP_PASSWORD_BY_TOKEN: {
    index: "/setup-password/:token",
    detail: (token: string) => `/setup-password/${token}`
  },
  SIGN_UP: "/sign-up",
  VERIFY_EMAIL: {
    index: "/verify-email/:email",
    detail: (email: string) => `/verify-email/${email}`,
    activateByToken: "/activation"
  },
  MAGIC_LINK: "/magic-link",
  SETUP_PHONE: "/setup-phone",
  VERIFY_PHONE: "/verify-phone",
  REDIRECT_CALLBACK: "/redirect",
  SETUP_PROFILE: "/setup-profile",
  ACCEPT_INVITE: "/accept-invite",

  // ONBOARDING
  LOAN_APPLICATION: {
    SETTINGS: "/loan/settings",
    FINANCIAL_APPLICATIONS: {
      detail: "/loan/:loanProgramId/financial-applications/:id"
    },
    APPLICATIONS: {
      index: "/loan/applications",
      detail: "/loan/:loanProgramId/applications/:id",
      edit: "/loan/:loanProgramId/applications/:id/edit",
      details: (id: string, loanProgramId: string) =>
        `/loan/${loanProgramId}/applications/${id}`,
      financialApplicationDetails: (id: string, loanProgramId: string) =>
        `/loan/${loanProgramId}/financial-applications/${id}`,
      editing: (id: string, loanProgramId: string) =>
        `/loan/${loanProgramId}/applications/${id}/edit`
    },
    LOAN_PROGRAM: {
      all: "/loan/loan-program",
      list: "/loan/loan-program",
      detail: "/loan/loan-program/:loanProgramId",
      detailWithId: (id: string) => `/loan/loan-program/${id}`
    },
    INDEX: "/loan",
    SUBMISSION: "/loan/submission",
    PRE_QUALIFICATION: {
      index: "/loan/pre-qualification",
      detail: "/loan/pre-qualification/:loanProgramId",
      detailWithId: (loanProgramId: string) =>
        `/loan/pre-qualification/${loanProgramId}`
    },
    INFORMATION: {
      detail: "/loan/loan-program/:loanProgramId/information",
      detailWithId: (loanProgramId: string) =>
        `/loan/loan-program/${loanProgramId}/information`
    },
    NOTIFICATION: {
      all: "/loan/notifications",
      list: "/loan/notifications",
      detail: "/loan/notifications/:id",
      details: (id: string) => `/loan/notifications/${id}`
    },
    FINANCIAL: {
      INDEX: (id: string) => `/loan/financial/${id}/`,
      OVERVIEW: (id: string) => `/loan/financial/${id}/overview`,
      CASH_FLOW: (id: string) => `/loan/financial/${id}/cash-flow`,
      BALANCE_SHEET: (id: string) => `/loan/financial/${id}/balance-sheet`,
      INCOME_STATEMENT: (id: string) =>
        `/loan/financial/${id}/income-statement`,
      LOAN_READY: (id: string) => `/loan/financial/${id}/loan-ready`
    }
  },

  LOAN_APPLICATION_MANAGEMENT: {
    INDEX: "/application",
    KYB: {
      index: "/application/:id/kyb",
      detail: (id: string) => `/application/${id}/kyb`
    },
    BUSINESS_VERIFICATION: {
      detail: "/application/:id/business-verification",
      detailWithId: (id: string) => `/application/${id}/business-verification`
    },
    KYC: "/application/:id/kyc",
    DOCUMENTS: {
      index: "/application/:id/document",
      details: (id: string) => `/application/${id}/document`
    },
    LOAN_SUMMARY: "/application/:id/loan-summary",
    CASH_FLOW: "/application/:id/cash-flow",
    LOAN_DECISION: "/application/:id/loan-decision",
    DOCUMENT: {
      index: "/application/:id/document/:documentId",
      detail: (id: string, documentId: string) =>
        `/application/${id}/document/${documentId}`
    },
    DEBT_SCHEDULE: "/application/:id/debt-schedule",
    LOAN_READINESS: {
      detail: "/application/:id/readiness",
      details: (id: string) => `/application/${id}/readiness`
    },
    FINANCIAL: {
      INDEX: (id: string) => `/application/${id}/`,
      OVERVIEW: (id: string) => `/application/${id}/overview`,
      CASH_FLOW: (id: string) => `/application/${id}/cash-flow`,
      BALANCE_SHEET: (id: string) => `/application/${id}/balance-sheet`,
      INCOME_STATEMENT: (id: string) => `/application/${id}/income-statement`,
      LOAN_READY: (id: string) => `/application/${id}/loan-ready`
    }
  },

  // ADMIN USERS
  ADMIN_USERS: {
    USER: {
      index: "/users"
    },
    INVITATION: {
      index: "/invitations"
    }
  },

  // Loan Program
  LOAN_PROGRAM: {
    index: "/loan-program"
  },
  NOTIFICATION: {
    all: "/notifications",
    list: "/notifications",
    detail: "/notifications/:id",
    details: (id: string) => `/notifications/${id}`
  },
  SETTINGS: "/settings",
  MESSAGES: "/messages",
  ONBOARD: "/onboard",
  SUBSCRIPTIONS: "/subscriptions",
  FEATURE_FLAGS: "/feature-flags",
  DOCUMENTS: "/documents",

  CONFERENCE_DEMO: {
    applicant: {
      index: "/applicant/loan",
      list: "/applicant/loan/applications",
      readiness: "/applicant/loan-readiness"
    },
    admin: {
      index: "/admin/dashboard",
      applications: "/admin/applications",
      business: "/admin/business",
      identity: "/admin/kyc",
      cashflow: "/admin/cashflow",
      documents: "/admin/documents",
      documentDetail: "/admin/document-detail",
      loanSummary: "/admin/loan-summary",
      loanReadiness: "/admin/loan-readiness"
    }
  }
}

export const API_PATH = {
  users: {
    me: "api/users/me",
    forgotPassword: "api/users/public/forgot-password",
    resendForgotPassword: "api/users/resend-activation-secret",
    setupPassword: "api/users/public/reset-password",
    getStart: "api/users/start",
    activateByOtpCode: "api/users/activate-by-otp-code",
    activateByToken: "api/users/activate-by-token",
    // Resend activate code
    resendVerificationEmail: "api/users/resend-verification-email",
    // Setup name, password after activate successfully
    signUp: "api/users/sign-up",
    acceptInvite: "api/users/public/invitation/accept"
  },
  login: {
    loginByPassword: "login",
    loginBySocial: "login/social",
    // MFA
    sendSmsOtp: "login/send-sms-otp",
    activateBySmsOtpCode: "login/sms",
    sendMagicLink: "login/send-magic-link",
    activateByMagicLink: "login/magic-link"
  },
  admin: {
    user: {
      all: "api/admin",
      get: "api/admin/user",
      sendInvitation: "api/admin/user/invite",
      sendBulkListInvitation: "api/admin/invitation/bulk-invite-list",
      sendBulkCsvInvitation: "api/admin/invitation/bulk-invite-csv",
      updateRoles: "api/admin/user/update-roles",
      listUsersByInstitutionId: `api/admin/users/by-institution`,
      listUsersByUserIds: "api/admin/users/by-user-ids",
      list: () => `${API_PATH.admin.user.all}/users`,
      deactivate: (userId: string) =>
        `${API_PATH.admin.user.all}/user/${userId}/deactivate`,
      reactivate: (userId: string) =>
        `${API_PATH.admin.user.all}/user/${userId}/reactivate`
    },
    invitation: {
      all: "api/admin/invitation",
      list: "api/admin/invitation/list",
      bulkInviteCsvTemplate: "api/admin/invitation/bulk-invite-csv-template",
      delete: (invitationId: string) =>
        `${API_PATH.admin.invitation.all}/${invitationId}`
    },
    document: {
      list: "api/admin/chatbot-document/list",
      upload: "api/admin/chatbot-document",
      delete: "api/admin/chatbot-document/delete",
      download: "api/admin/chatbot-document/download"
    }
  },
  workspaceAdmin: {
    selectRoundLoanApplication: "api/workspace-admin/applications/round",
    getAssignableList: "api/workspace-admin/judge/assignable-list",
    // Nudge
    getActiveNudges: (applicationId: string) =>
      `api/workspace-admin/loan-applications/${applicationId}/judge/active-nudges`,
    sendNudge: `api/workspace-admin/loan-applications/judge/send-nudge`,
    applicationStageStat: `api/workspace-admin/application/stats/institution-application-stage`
  },
  loanProgram: {
    list: "api/user-loan/program/list",
    detail: (id: string, loanType: string = LoanType.MICRO) =>
      `api/user-loan/${snakeCaseToUrlPattern(loanType)}-loan/program?id=${id}`,
    cdfi: {
      all: "api/admin-loan/micro-loan/program",
      create: () => API_PATH.loanProgram.cdfi.all,
      list: () => `${API_PATH.loanProgram.cdfi.all}/list`,
      detail: () => API_PATH.loanProgram.cdfi.all,
      update: () => API_PATH.loanProgram.cdfi.all,
      delete: (loanProgramId: string) =>
        `api/admin-loan/program/${loanProgramId}`,
      updateStatus: (loanProgramId: string) =>
        `api/admin-loan/program/${loanProgramId}/update-status`,
      configuration: (id: string) =>
        `api/admin-loan/program/${id}/forms-configuration`
    },

    loanOfficer: {
      list: "api/loan-officer/programs/list",
      createFormsConfiguration: "api/admin-loan/program/forms-configuration"
    },
    adminSelectLoanProgramList: "api/admin-loan/program/list",
    formsConfiguration: "api/user-loan/program/forms-configuration"
  },
  application: {
    list: "api/user-loan/application/list",
    details: (loanType: LoanType) =>
      `api/user-loan/${snakeCaseToUrlPattern(loanType)}-loan/application`,
    create: (loanType: LoanType) =>
      `api/user-loan/${snakeCaseToUrlPattern(loanType)}-loan/application`,
    update: (id: string, loanType: LoanType) =>
      `api/user-loan/${snakeCaseToUrlPattern(
        loanType
      )}-loan/application/?id=${id}`,
    detail: (id: string) => `api/user-loan/application/?id=${id}`,
    kybForm: "api/form/kyb",
    kycForm: "api/form/kyc",
    financialForm: "api/form/financial",
    confirmationForm: "api/form/confirmation",
    currentLoansForm: "api/form/current-loan",
    operatingExpensesForm: "api/form/operating-expenses",
    uploadDocument: "api/form/document/upload",
    documents: "api/form/document/by-form-id",
    deleteDocuments: "api/form/document/delete",
    getIncomeCategories: "api/form/financial/income-categories",
    getCashflowVerification: (id: string) =>
      `api/user-loan/application/${id}/cash-flow`,
    linkInquiry: "api/form/smart-kyc/inquiry/link",
    getInquiry: "api/form/smart-kyc/inquiry/by-application-id",
    linkPlaidItem: "api/plaid/item/link",
    getPlaidItemIds: "api/plaid/item/list",
    getPlaidConnectedBankAccountsByApplicationId:
      "api/plaid/item/connected-bank-accounts/by-application-id",
    preQualification: {
      index: "api/form/pre-qualification",
      detail: "api/form/pre-qualification/by-application-id"
    },
    productServiceForm: {
      all: "api/form/product-service",
      detail: "api/form/product-service/by-application-id"
    },
    launchKCFitForm: {
      index: "api/form/launchkc-fit",
      detail: "api/form/launchkc-fit/by-application-id"
    },
    executionForm: {
      index: "api/form/execution",
      detail: "api/form/execution/by-application-id"
    },
    businessModelForm: {
      index: "api/form/business-model",
      detail: "api/form/business-model/by-application-id"
    },
    marketOpportunity: {
      index: "api/form/market-opportunity",
      detail: "api/form/market-opportunity/by-application-id"
    },
    businessDocuments: {
      index: "api/form/document-upload",
      detail: "api/form/document-upload/by-application-id"
    },
    sbbDocument: {
      index: "api/form/sbb-documents/by-application-id",
      upload: "api/form/sbb-documents/documents/upload",
      submit: "api/form/sbb-documents/submit",
      deleteByType: "api/form/sbb-documents/documents/delete-by-type",
      deleteById: "api/form/sbb-documents/documents/delete-by-id"
    },
    chatbot: {
      chat: "api/ai/chat",
      initSession: "api/ai/chat/init",
      currentSession: "api/ai/chat/current-session",
      history: "api/ai/chat/chat-histories-by-session-id",
      listSessions: "api/ai/chat/list-sessions",
      endSession: "api/ai/chat/end"
    }
  },
  // For workspace admin
  loanApplicationAdmin: {
    viewJudgesScores: (applicationId: string) =>
      `api/workspace-admin/loan-applications/${applicationId}/scorecard`,
    all: "api/workspace-admin/application",
    list: () => `${API_PATH.loanApplicationAdmin.all}/list`
  },
  // For loan officer
  loanApplication: {
    details: (loanType: LoanType = LoanType.MICRO) =>
      `api/loan-officer/${snakeCaseToUrlPattern(loanType)}-loan/application`,
    list: "api/loan-officer/applications",
    getDocuments: (applicationId: string) =>
      `api/loan-officer/applications/${applicationId}/documents`,
    submitDecision: (applicationId: string) =>
      `api/loan-officer/applications/${applicationId}/underwrite`,
    reviewLoanApplication: (applicationId: string) =>
      `api/loan-officer/applications/${applicationId}/review`
  },
  judgeApplication: {
    all: "api/judge/loan-applications",
    list: () => `${API_PATH.judgeApplication.all}`,
    detail: (applicationId: string) =>
      `${API_PATH.judgeApplication.all}/${applicationId}/score`
  },
  loanApplicationDetails: {
    all: "api/loan-officer/applications",
    getStatusDetail: (applicationId: string) =>
      `${API_PATH.loanApplicationDetails.all}/${applicationId}/status`,
    getKYB: (applicationId: string) =>
      `api/loan-officer/applications/${applicationId}/kyb`,
    getKYC: (applicationId: string) =>
      `api/loan-officer/applications/${applicationId}/kyc`,
    getDocumentDetails: (applicationId: string, documentId: string) =>
      `api/loan-officer/applications/${applicationId}/documents/${documentId}`,
    getVisualizationImage: (applicationId: string, documentId: string) =>
      `api/loan-officer/applications/${applicationId}/documents/${documentId}/visualization`,
    getLoanSummary: (applicationId: string) =>
      `api/loan-officer/applications/${applicationId}/loan-summary`,
    getDownloadLoanSummary: (applicationId: string) =>
      `api/loan-officer/applications/${applicationId}/loan-summary/download`,
    getCashFlow: (applicationId: string) =>
      `api/loan-officer/applications/${applicationId}/cash-flow`,
    getBankAccounts: (applicationId: string) =>
      `api/loan-officer/applications/${applicationId}/cash-flow/bank-accounts`,
    getBalanceGraph: (applicationId: string) =>
      `api/loan-officer/applications/${applicationId}/cash-flow/balance-history`,
    getTransactionTags: (applicationId: string) =>
      `api/loan-officer/applications/${applicationId}/cash-flow/transaction-tags`,
    getRevenueExpense: (applicationId: string) =>
      `api/loan-officer/applications/${applicationId}/cash-flow/revenue-expense`,
    // Cash Flow 2.0
    getCashFlowGlanceV2: (applicationId: string) =>
      `api/v2/loan-officer/applications/${applicationId}/cash-flow/glance`,
    getCashFlowRevenueVsExpenseGraph: (applicationId: string) =>
      `api/v2/loan-officer/applications/${applicationId}/cash-flow/revenue-expense`,
    getCashFlowNoiVsTotalDebtPaymentGraph: (applicationId: string) =>
      `api/v2/loan-officer/applications/${applicationId}/cash-flow/noi-total-debt-payment`,
    getSmartKycPersonaDetail: (applicationId: string) =>
      `api/loan-officer/applications/${applicationId}/identity-verification`,
    // Judge
    getAssignableJudges: () => `api/workspace-admin/judge/assignable-list`,
    getJudges: () => `api/workspace-admin/judge/list`,
    updateAssignedJudges: () =>
      `api/workspace-admin/loan-applications/judge/update`,
    getApplicationWithStageScoresResponse: () =>
      `api/workspace-admin/application/by-id`,
    getFullAmortizationSchedule: (applicationId: string) =>
      `api/loan-officer/applications/${applicationId}/full-amortization-schedule`
  },
  loanReadiness: {
    getLoanReadinessAssessment: (applicationId: string) =>
      `api/loan-readiness/application/${applicationId}/assessment`
  },
  document: {
    getDocumentDownloadForOfficer:
      "api/loan-officer/document/download/by-document-id",
    getDocumentDownloadForApplicant: "api/form/document/download/by-document-id"
  },
  notification: {
    details: "api/notification/by-id",
    getUnreadNotifications: "api/notification/count-unread",
    getNotifications: "api/notification/list",
    markAllAsRead: "api/notification/mark-all-read",
    markAsRead: "api/notification/mark-read",
    markAsUnread: "api/notification/mark-unread"
  },
  dashboard: {
    all: "api/lender",
    allStats: "api/lender/stats",
    getInstitutionActivity: () =>
      `${API_PATH.dashboard.allStats}/institution-activity`,
    getApprovalRate: () =>
      `${API_PATH.dashboard.allStats}/performance-metrics/approval-rate`,
    getIncompleteApplicationRate: () =>
      `${API_PATH.dashboard.allStats}/performance-metrics/incomplete-rate`,
    getAverageTimeToApprovalMetrics: () =>
      `${API_PATH.dashboard.allStats}/performance-metrics/average-time-to-approval`,
    getAverageLoanSize: () =>
      `${API_PATH.dashboard.allStats}/performance-metrics/average-approved-loan-size`,
    getPortfolioGrowth: () =>
      `${API_PATH.dashboard.allStats}/performance-metrics/portfolio-growth`,
    getInstitutionUsage: () => `${API_PATH.dashboard.all}/usage`
  },
  dashboardV1: {
    all: "api/v1/lender/stats",
    getAverageApprovalRate: () =>
      `${API_PATH.dashboardV1.all}/performance-metrics/average-approval-rate`,
    getAggregateApprovedLoanAmount: () =>
      `${API_PATH.dashboardV1.all}/performance-metrics/aggregate-approved-loan-amount`,
    getAverageTimeToApproval: () =>
      `${API_PATH.dashboardV1.all}/performance-metrics/average-time-to-approval`,
    getLoanApplicationActivities: () =>
      `${API_PATH.dashboardV1.all}/application-activity/loan-application-activities`,
    getAverageLoanSize: () =>
      `${API_PATH.dashboardV1.all}/performance-metrics/average-approved-loan-size`,
    getAverageTimeToDecision: () =>
      `${API_PATH.dashboardV1.all}/performance-metrics/average-time-to-decision`,
    getAverageApprovedLoanAmount: () =>
      `${API_PATH.dashboardV1.all}/performance-metrics/average-approved-loan-amount`,
    getInstitutionActivity: () =>
      `${API_PATH.dashboardV1.all}/institution-activity`,
    getLoanApplicationRates: () =>
      `${API_PATH.dashboardV1.all}/performance-metrics/incomplete-rate`
  },
  institution: {
    list: "api/admin/internal/institutions",
    listAll: "api/admin/institution/list-all",
    create: "api/admin/institution/create",
    updateInstitutionMetadata: "api/admin/institution-metadata/update",
    getInstitutionMetadata: "api/users/public/institution-metadata"
  },
  asset: {
    upload: "api/asset/upload"
  },
  subscriptions: {
    all: "api/admin/subscription",
    list: () => `${API_PATH.subscriptions.all}/list`
  },
  plan: {
    all: "api/admin/plan",
    institutionUsage: (institutionId: string) =>
      `${API_PATH.plan.all}/usage/${institutionId}`
  },
  featureFlag: {
    all: "api/admin/feature-flag",
    public: "api/feature-flag/list",
    list: () => `${API_PATH.featureFlag.all}/list`,
    listFeatureFlagByUserId: () => "api/feature-flag/list/by-user-id",
    create: () => `${API_PATH.featureFlag.all}`,
    detail: (id: string) => `${API_PATH.featureFlag.all}/by-id?id=${id}`,
    toggleStatus: (id: string) => `${API_PATH.featureFlag.all}/action?id=${id}`,
    toggleRolloutType: (id: string) =>
      `${API_PATH.featureFlag.all}/rollout-type/update?id=${id}`,
    delete: (id: string) => `${API_PATH.featureFlag.all}/delete-by-id?id=${id}`,
    update: () => `${API_PATH.featureFlag.all}/update`
  },
  whitelistUser: {
    all: "api/admin/whitelist-user",
    detail: (id: string) =>
      `api/admin/whitelist-user/by-feature-flag-id?id=${id}`,
    update: () => "api/admin/whitelist-user"
  },
  financialProjection: {
    expensePeople: {
      index: "api/financial-projection/form/expense-people/by-setup-id",
      submit: "api/financial-projection/form/expense-people",
      update: "api/financial-projection/form/expense-people/update"
    },
    operatingExpenses: {
      submit: "api/financial-projection/form/expense-operating",
      findById: "api/financial-projection/form/expense-operating/by-id",
      findBySetupId:
        "api/financial-projection/form/expense-operating/by-setup-id",
      update: "api/financial-projection/form/expense-operating/update"
    },
    forecastingSetup: {
      create: "api/financial-projection/setup/create",
      update: "api/financial-projection/setup/update",
      findById: "api/financial-projection/setup/by-application-id"
    },
    taxRates: {
      submit: "api/financial-projection/form/expense-tax-rate",
      findById: "api/financial-projection/form/expense-tax-rate/by-id",
      findBySetupId:
        "api/financial-projection/form/expense-tax-rate/by-setup-id",
      update: "api/financial-projection/form/expense-tax-rate/update"
    },
    directCosts: {
      submit: "api/financial-projection/form/expense-direct-cost",
      findById: "api/financial-projection/form/expense-direct-cost/by-id",
      findBySetupId:
        "api/financial-projection/form/expense-direct-cost/by-setup-id",
      update: "api/financial-projection/form/expense-direct-cost/update"
    },
    equityFinancing: {
      submit: "api/financial-projection/form/equity",
      findById: "api/financial-projection/form/equity/by-id",
      findBySetupId: "api/financial-projection/form/equity/by-setup-id",
      update: "api/financial-projection/form/equity/update"
    },
    assetsLongTerm: {
      submit: "api/financial-projection/form/assets/long-term",
      findById: "api/financial-projection/form/assets/long-term/by-id",
      findBySetupId:
        "api/financial-projection/form/assets/long-term/by-setup-id",
      update: "api/financial-projection/form/assets/long-term/update"
    },
    assetsCurrent: {
      submit: "api/financial-projection/form/assets/current",
      findById: "api/financial-projection/form/assets/current/by-id",
      findBySetupId: "api/financial-projection/form/assets/current/by-setup-id",
      update: "api/financial-projection/form/assets/current/update"
    },
    revenueStream: {
      submit: "api/financial-projection/form/revenue",
      findById: "api/financial-projection/form/revenue/by-id",
      findBySetupId: "api/financial-projection/form/revenue/by-setup-id",
      update: "api/financial-projection/form/revenue/update"
    },
    debtFinancing: {
      submit: "api/financial-projection/form/debt-financing",
      findById: "api/financial-projection/form/debt-financing/by-id",
      findBySetupId: "api/financial-projection/form/debt-financing/by-setup-id",
      update: "api/financial-projection/form/debt-financing/update"
    },
    liability: {
      submit: "api/financial-projection/form/debt-financing/liability",
      findById: "api/financial-projection/form/debt-financing/liability/by-id",
      findBySetupId:
        "api/financial-projection/form/debt-financing/liability/by-setup-id",
      update: "api/financial-projection/form/debt-financing/liability/update"
    },
    financialStatement: {
      findBySetupId: "api/financial-projection/statement/by-setup-id",
      upload: "api/financial-projection/statement/upload",
      download: "api/financial-projection/statement/download",
      update: "api/financial-projection/statement/update",
      delete: "api/financial-projection/statement/delete"
    },
    forecast: {
      applicant: "api/financial-projection/forecast/by-setup-id",
      admin:
        "api/loan-officer/application/financial-projection/forecast/by-setup-id"
    }
  }
}

export const phoneRegex =
  /^(?:\\+\\d{1,3}|0\\d{1,3}|00\\d{1,2})?(?:\\s?\\(\\d+\\))?(?:[-/\\s.]|\\d)+$/

export const SSN_PATTERN = "000-00-0000"
export const EIN_PATTERN = "00-0000000"
export const YEAR_PATTERN = "0000"
export const MM_YYYY_PATTERN = "00/0000"
export const NUMBER_PATTERN = "0000000000000000000000000000000000000000"

export interface QueryResponse<T> {
  data: T
}

export interface QueryResponseError {
  code: number
  message: string
}

export const REQUEST_RATE_LIMIT_TIME = 60 * 1000

// PASSWORD_REGEX
export enum PasswordRegex {
  AT_LEAST_EIGHT_CHARACTER = "AT_LEAST_EIGHT_CHARACTER",
  AT_LEAST_ONE_SPECIAL_CHARACTER = "AT_LEAST_ONE_SPECIAL_CHARACTER",
  AT_LEAST_ONE_UPPERCASE = "AT_LEAST_ONE_UPPERCASE",
  AT_LEAST_ONE_LOWERCASE = "AT_LEAST_ONE_LOWERCASE",
  AT_LEAST_ONE_DIGIT = "AT_LEAST_ONE_DIGIT",
  NONE_SPACES = "NONE_SPACES",
  AT_MOST_255_CHARACTER = "AT_MOST_255_CHARACTER"
}

export const PASSWORD_REGEX = {
  [PasswordRegex.AT_LEAST_ONE_SPECIAL_CHARACTER]:
    /(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])^.+$/,
  [PasswordRegex.AT_LEAST_ONE_UPPERCASE]: /(?=.*[A-Z])^.+$/,
  [PasswordRegex.AT_LEAST_ONE_LOWERCASE]: /(?=.*[a-z])^.+$/,
  [PasswordRegex.AT_LEAST_ONE_DIGIT]: /(?=.*\d)^.+$/,
  [PasswordRegex.NONE_SPACES]: /^[^\s]*$/
}

// QUERY REQUEST

export const REQUEST_LIMIT_PARAM = 25

export const REQUEST_LIMIT_PARAM_FOR_SELECT = 200

export const MAX_REMEMBER_ME_DAYS = 30

export const ACCEPTED_IMAGE_FORMAT = "image/jpg,image/jpeg,image/png"
