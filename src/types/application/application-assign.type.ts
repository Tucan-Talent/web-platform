import { LoanApplicationStatus } from "../loan-application.type"
import { LoanType } from "../loan-program.type"
import { UserDetailInfo } from "../user.type"
import { IScore } from "./application-score.type"

import { LoanApplicationStage } from "./application-stage.type"

/**
 * Below are server model
 */

/**
 * This interface has _score suffix
 */
interface ILaunchKCApplicationAssignScore extends IScore {
  businessModelScore: number
  executionScore: number
  launchKcfitScore: number
  marketOpportunityScore: number
  productOrServiceScore: number
}

interface IScoreInfo<T = ILaunchKCApplicationAssignScore> {
  judgeId: string
  judgeName: string
  judgeEmail: string
  judgeAvatar?: string
  score?: T | null
}

interface IApplicationScoreByStage<T = ILaunchKCApplicationAssignScore> {
  stage: LoanApplicationStatus
  scoreInfo: IScoreInfo<T>[]
}

interface IApplicationWithStageScoresResponse<
  T = ILaunchKCApplicationAssignScore
> {
  id: string
  applicationIdNumber: number
  status: LoanApplicationStatus
  loanStage: LoanApplicationStage
  createdAt: string
  businessName?: string
  programType: LoanType
  submittedAt?: string
  stages: IApplicationScoreByStage<T>[]
}

interface JudgeInfo {
  id: string
  name: string
  email: string
  avatar?: string
}

/**
 * Below are local model
 */
interface IStageInfo {
  judges: IScoreInfo[]
  avgScore: number
  numberOfScoredJudge: number
  scoredJudges: IScoreInfo[]
}

interface IWorkspaceAdminApplicationScore
  extends IApplicationWithStageScoresResponse {
  roundOne: IStageInfo
  roundTwo: IStageInfo
}

const convertUserDetailInfoToJudgeInfo = (
  userDetail: UserDetailInfo
): JudgeInfo => {
  return {
    id: userDetail.id,
    name: userDetail.name,
    email: userDetail.email,
    avatar: userDetail.avatar // Optional field
  }
}

export { convertUserDetailInfoToJudgeInfo }

export type {
  IStageInfo,
  ILaunchKCApplicationAssignScore,
  IApplicationScoreByStage,
  IApplicationWithStageScoresResponse,
  IScoreInfo,
  IWorkspaceAdminApplicationScore,
  JudgeInfo
}
