import { Option } from "@/types/common.type"

export const enum LAUNCH_KC_EXECUTION_FIELD_NAMES {
  ID = "id",
  LOAN_APPLICATION_ID = "loanApplicationId",
  MONTHLY_EXPENSE_RANGE = "monthlyExpenseRange",
  GROWTH_METRIC = "growthMetric",
  RECENT_MILESTONE = "recentMilestone",
  NEXT_MILESTONE = "nextMilestone",
  GREATEST_CHALLENGE = "greatestChallenge",
  BUSINESS_STAGE = "businessStage",
  BUSINESS_MODEL = "businessModels",
  PARTNERSHIP_TYPE = "partnershipTypes",
  FUNDING_SOURCES = "fundingSources",
  FOUNDERS = "founders"
}

export const questions = [
  {
    question: "What metrics do you use to measure the growth of your business?",
    field: LAUNCH_KC_EXECUTION_FIELD_NAMES.GROWTH_METRIC
  },
  {
    question:
      "What is the most recent product development or traction milestone you have achieved?",
    field: LAUNCH_KC_EXECUTION_FIELD_NAMES.RECENT_MILESTONE
  },
  {
    question:
      "What is the next milestone for your business and how long will it take you to reach it?",
    field: LAUNCH_KC_EXECUTION_FIELD_NAMES.NEXT_MILESTONE
  },
  {
    question:
      "What are the greatest near-term challenges facing your company? How do you plan to confront them?",
    field: LAUNCH_KC_EXECUTION_FIELD_NAMES.GREATEST_CHALLENGE
  }
]

export const businessStage: Option[] = [
  {
    label: "Idea stage",
    value: "idea"
  },
  {
    label: "Developing a minimum viable product (MVP)",
    value: "mvp"
  },
  {
    label: "Launched MVP to early adopters and pilot partners",
    value: "pilot_launch"
  },
  {
    label:
      "Between MVP and having a whole product ready for a full commercial launch",
    value: "beta"
  },
  {
    label:
      "Developed a scalable business model and go-to-market strategy, now scaling sales and marketing efforts to generate significant revenue",
    value: "growth"
  }
]

export const jobTypes: Option[] = [
  {
    label: "Full-time",
    value: "full_time"
  },
  {
    label: "Part-time",
    value: "part_time"
  }
]

export const businessModel: Option[] = [
  {
    label: "Business model",
    value: "business_model"
  },
  {
    label: "Strategy",
    value: "strategy"
  },
  {
    label: "Human Resources",
    value: "human_resource"
  },
  {
    label: "Financial Modeling",
    value: "financial"
  },
  {
    label: "Marketing",
    value: "marketing"
  },
  {
    label: "Other",
    value: "other"
  }
]

export const partnershipType: Option[] = [
  {
    label: "Joint ventures",
    value: "joint_venture"
  },
  {
    label: "Marketing alliances",
    value: "marketing_alliance"
  },
  {
    label: "Licensing arrangements",
    value: "licensing_arrangement"
  },
  {
    label: "Selling/distribution agreements",
    value: "distribution_agreement"
  },
  {
    label: "Channel partnerships",
    value: "channel_partnership"
  },
  {
    label: "Software partnerships",
    value: "software_partnership"
  }
]

export const monthlyExpenseRangeOptions: Option[] = [
  {
    label: "No revenue",
    value: "no_revenue"
  },
  {
    label: "$1 - $5,000",
    value: "one_to_five_thousands"
  },
  {
    label: "$5,001 - $50,000",
    value: "five_thousands_one_to_fifty_thousands"
  },
  {
    label: "$50,001 - $100,000",
    value: "fifty_thousands_one_to_one_hundred_thousands"
  },
  {
    label: "$100,001 - $500,000",
    value: "one_hundred_thousands_one_to_two_fifty_thousands"
  },
  {
    label: "$500,001 - $1,000,000",
    value: "five_hundred_thousands_one_to_one_million"
  },
  {
    label: "Over $1,000,000",
    value: "over_one_million"
  }
]

export const fundingSourcesOptions: Option[] = [
  {
    label: "Bank Loans",
    value: "bank_loan"
  },
  {
    label: "Friends and family",
    value: "friends_and_family"
  },
  {
    label: "Venture capital",
    value: "venture_capital"
  },
  {
    label: "Angel investors",
    value: "angel_investors"
  },
  {
    label: "Crowdfunding",
    value: "crowdfunding"
  },
  {
    label: "Debt",
    value: "debt"
  },
  {
    label: "Non-dilutive grant",
    value: "non_dilutive_grants"
  },

  {
    label: "Startup/Pitch Competitions",
    value: "startup_competitions"
  }
]

export const getLabelByValue = (value: string, options: Option[]) => {
  const option = options.find((opt) => opt.value === value)
  return option?.label ?? ""
}

export const getLabelsByValues = (values: string[], options: Option[]) => {
  return values.map((value) => getLabelByValue(value, options))
}

export const getOptionsByField = (field: string) => {
  switch (field) {
    case LAUNCH_KC_EXECUTION_FIELD_NAMES.BUSINESS_STAGE:
      return businessStage
    case LAUNCH_KC_EXECUTION_FIELD_NAMES.BUSINESS_MODEL:
      return businessModel
    case LAUNCH_KC_EXECUTION_FIELD_NAMES.PARTNERSHIP_TYPE:
      return partnershipType
    case LAUNCH_KC_EXECUTION_FIELD_NAMES.MONTHLY_EXPENSE_RANGE:
      return monthlyExpenseRangeOptions
    case LAUNCH_KC_EXECUTION_FIELD_NAMES.FUNDING_SOURCES:
      return fundingSourcesOptions
    default:
      return []
  }
}
