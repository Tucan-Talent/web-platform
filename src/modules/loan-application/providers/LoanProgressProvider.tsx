import { Institution } from "@/constants/tenant.constants"
import { toPercent } from "@/utils"
import { getSubdomain } from "@/utils/domain.utils"
import {
  Dispatch,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState
} from "react"
import { createContext } from "use-context-selector"
import { LoanApplicationStepStrategy } from "../models/LoanApplicationStep"
import {
  FORM_TYPE,
  ILoanApplicationStep,
  LOAN_APPLICATION_STEP_STATUS,
  LOAN_APPLICATION_STEPS
} from "../models/LoanApplicationStep/type"
import { formsConfigurationEnabled } from "@/utils/feature-flag.utils"
import { ConfigurationLoanApplicationStep } from "../models/LoanApplicationStep/Configuration"
import { useLoanProgramDetailContext } from "."

interface LoanApplicationStepsState {
  step: LOAN_APPLICATION_STEPS
  progress: ILoanApplicationStep[]
}

export enum LOAN_PROGRESS_ACTION {
  CHANGE_STEP = "CHANGE_STEP",
  CHANGE_PROGRESS = "CHANGE_PROGRESS",
  INIT = "INIT",
  NEXT_STEP = "NEXT_STEP",
  REMOVE_COMPLETE = "REMOVE_COMPLETE",
  BUILD_STEP = "BUILD_STEP"
}

type Action =
  | StepAction
  | ProgressAction
  | InitAction
  | NextStepAction
  | RemoveCompleteAction
  | BuildStepAction

type BuildStepAction = {
  type: LOAN_PROGRESS_ACTION.BUILD_STEP
  progress: ILoanApplicationStep[]
}

type NextStepAction = {
  type: LOAN_PROGRESS_ACTION.NEXT_STEP
}

type InitAction = {
  type: LOAN_PROGRESS_ACTION.INIT
  forms: FORM_TYPE[]
}

type ProgressAction = {
  type: LOAN_PROGRESS_ACTION.CHANGE_PROGRESS
  progress: LOAN_APPLICATION_STEPS
}

type StepAction = {
  type: LOAN_PROGRESS_ACTION.CHANGE_STEP
  step: LOAN_APPLICATION_STEPS
}

type RemoveCompleteAction = {
  type: LOAN_PROGRESS_ACTION.REMOVE_COMPLETE
  progress: LOAN_APPLICATION_STEPS
}

interface LoanApplicationStatusContext extends LoanApplicationStepsState {
  completeCurrentStep: () => void
  completeSpecificStep: (specificStep: LOAN_APPLICATION_STEPS) => void
  removeCompleteSpecificStep: (specificStep: LOAN_APPLICATION_STEPS) => void
  getCurrentStepIndex: () => number
  getCurrentStep: () => ILoanApplicationStep | undefined
  buildSpecificStep: () => void
  progress: ILoanApplicationStep[]
  isInitialized: boolean
  step: LOAN_APPLICATION_STEPS
  percentComplete: number
  dispatchProgress: Dispatch<Action>

  /**
   * The function return 'true' if the 'step' is complete
   */
  getStepStatus: (step: string) => boolean
  finishCurrentStep: () => void
}

const reducer = (
  state: LoanApplicationStepsState,
  action: Action
): LoanApplicationStepsState => {
  switch (action.type) {
    case LOAN_PROGRESS_ACTION.NEXT_STEP: {
      const currentStepIndex = state.progress.findIndex(
        (stepItem) => stepItem.step === state.step
      )
      const nextStepIndex =
        currentStepIndex + 1 < state.progress.length ? currentStepIndex + 1 : -1

      if (nextStepIndex === -1) return state
      return { ...state, step: state.progress[nextStepIndex].step }
    }
    case LOAN_PROGRESS_ACTION.CHANGE_STEP:
      return {
        ...state,
        step: action.step
      }
    case LOAN_PROGRESS_ACTION.CHANGE_PROGRESS: {
      const newProgress = state.progress.map((item) => {
        if (
          item.step === action.progress &&
          item.status !== LOAN_APPLICATION_STEP_STATUS.COMPLETE
        ) {
          return { ...item, status: LOAN_APPLICATION_STEP_STATUS.COMPLETE }
        }
        return item
      })

      return { ...state, progress: newProgress }
    }
    case LOAN_PROGRESS_ACTION.REMOVE_COMPLETE: {
      const newProgress = state.progress.map((item) => {
        if (
          item.step === action.progress &&
          item.status === LOAN_APPLICATION_STEP_STATUS.COMPLETE
        ) {
          return { ...item, status: LOAN_APPLICATION_STEP_STATUS.INCOMPLETE }
        }
        return item
      })

      return { ...state, progress: newProgress }
    }
    case LOAN_PROGRESS_ACTION.INIT:
      return initSteps(action.forms)

    case LOAN_PROGRESS_ACTION.BUILD_STEP: {
      const newProgress = action.progress.filter(
        (val) =>
          state.progress.findIndex((item) => item.step === val.step) === -1
      )
      return {
        ...state,
        progress: state.progress.concat(newProgress)
      }
    }

    default:
      return state
  }
}

/**
 * The init progress should be worked lazy
 * The init progress should be inside a component life-cycle to get all the feature as a component did
 * E.g features - Feature flag.
 */
const getApplicationStrategy = () =>
  new LoanApplicationStepStrategy(getSubdomain() as Institution).getStrategy()

const initProgress = (forms?: FORM_TYPE[], args?: unknown) => {
  return formsConfigurationEnabled()
    ? new ConfigurationLoanApplicationStep(forms).getSteps()
    : new LoanApplicationStepStrategy(getSubdomain() as Institution, args)
        .getStrategy()
        .getSteps()
}

const initSteps: (
  forms?: FORM_TYPE[],
  args?: unknown
) => LoanApplicationStepsState = (forms, args) => {
  const steps = initProgress(forms, args)

  return {
    step: steps[0].step,
    progress: steps
  }
}

export const LoanProgressContext = createContext<LoanApplicationStatusContext>(
  initSteps() as LoanApplicationStatusContext
)

const { Provider } = LoanProgressContext

export const LoanProgressProvider: React.FC<{ children: ReactNode }> = (
  props
) => {
  const { loanProgramFormsConfiguration, loanProgramInfo } =
    useLoanProgramDetailContext()

  const [isInitialized, setIsInitialized] = useState(false)

  const [{ progress, step }, dispatchProgress] = useReducer(
    reducer,
    // cast loanProgramInfo to unknown like wrap it into a chest.
    // only who has the key (the actual type) can use it
    initSteps([], loanProgramInfo as unknown)
  )

  const getStepStatus = useCallback(
    (step: string) => {
      return (
        progress.find((item) => item.step === step)?.status ===
        LOAN_APPLICATION_STEP_STATUS.COMPLETE
      )
    },
    [progress]
  )

  const finishCurrentStep = useCallback(() => {
    dispatchProgress({
      type: LOAN_PROGRESS_ACTION.CHANGE_PROGRESS,
      progress: step
    })
    dispatchProgress({ type: LOAN_PROGRESS_ACTION.NEXT_STEP })
  }, [step])

  /**
   * This function is use for complete third party step (e.g Persona KYC)
   */
  const completeCurrentStep = useCallback(() => {
    dispatchProgress({
      type: LOAN_PROGRESS_ACTION.CHANGE_PROGRESS,
      progress: step
    })
  }, [step])

  const completeSpecificStep = useCallback(
    (specificStep: LOAN_APPLICATION_STEPS) => {
      dispatchProgress({
        type: LOAN_PROGRESS_ACTION.CHANGE_PROGRESS,
        progress: specificStep
      })
    },
    []
  )

  const removeCompleteSpecificStep = useCallback(
    (specificStep: LOAN_APPLICATION_STEPS) => {
      dispatchProgress({
        type: LOAN_PROGRESS_ACTION.REMOVE_COMPLETE,
        progress: specificStep
      })
    },
    []
  )

  const buildSpecificStep = useCallback(() => {
    const applicationStrategy = getApplicationStrategy()._buildSteps()
    dispatchProgress({
      type: LOAN_PROGRESS_ACTION.BUILD_STEP,
      progress: applicationStrategy.getSteps()
    })
  }, [])

  const getCurrentStepIndex = useCallback(() => {
    return progress.findIndex((item) => item.step === step)
  }, [progress, step])

  const getCurrentStep = useCallback(() => {
    return progress.find((item) => item.step === step)
  }, [progress, step])

  /**
   * Calculate progress percent
   */
  const percentComplete = useMemo(() => {
    if (!progress?.length) return 0

    return toPercent(
      progress.filter(
        (step) => step.status === LOAN_APPLICATION_STEP_STATUS.COMPLETE
      ).length / progress.length
    )
  }, [progress])

  useEffect(() => {
    // If loanProgramFormsConfiguration is not null, then we will initialize the progress
    if (loanProgramFormsConfiguration?.forms) {
      dispatchProgress({
        type: LOAN_PROGRESS_ACTION.INIT,
        forms: loanProgramFormsConfiguration?.forms
      })
      setIsInitialized(true)
    }
  }, [loanProgramFormsConfiguration?.forms])

  const providerValues: LoanApplicationStatusContext = useMemo(
    () => ({
      getCurrentStepIndex,
      getCurrentStep,
      progress,
      step,
      percentComplete,
      isInitialized: formsConfigurationEnabled() ? isInitialized : true,
      dispatchProgress,
      getStepStatus,
      completeCurrentStep,
      finishCurrentStep,
      completeSpecificStep,
      buildSpecificStep,
      removeCompleteSpecificStep
    }),
    [
      removeCompleteSpecificStep,
      completeCurrentStep,
      getCurrentStepIndex,
      getCurrentStep,
      buildSpecificStep,
      isInitialized,
      percentComplete,
      finishCurrentStep,
      getStepStatus,
      progress,
      step,
      completeSpecificStep
    ]
  )

  return <Provider value={providerValues}>{props.children}</Provider>
}
