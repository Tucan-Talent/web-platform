import { LoanApplicationStatus } from "@/types/loan-application.type"
import { ColumnDef } from "@tanstack/react-table"

import {
  FORMAT_DATE_M_D_Y,
  FORMAT_DATE_M_D_Y_TIME_UPPERCASE
} from "@/constants/date.constants"
import { FilterableColumnHeader } from "@/shared/molecules/table/column-filter"
import { IWorkspaceAdminApplicationScore } from "@/types/application/application-assign.type"
import { renderFilterableHeader } from "@/utils/table.utils"
import { format } from "date-fns"
import { AssigningJudgeRow } from "../../../../loan-application/components/organisms/application-assigning/AssigningJudgeRow"
import { LoanStage } from "../../../constants/types/application"
import { getScorecardStatusByApplicationStage } from "../../../services/score.service"
import { ButtonReviewLoanApplication } from "../../atoms/ButtonReviewLoanApplication"
import { CustomJudgeAvatar, ToolTipJudgeAvatar } from "../../atoms/JudgeAvatar"
import { ScoreBadge } from "../../atoms/ScoreBadge"
import { ApplicationRoundSelectionPopover } from "../../organisms/ApplicationRoundSelectionPopover"
import { NudgeJudgesPopover } from "../../organisms/NudgeJudgesPopover"
import { WORKSPACE_ADMIN_APPLICATION_SCORE_FILTER_KEYS } from "@/modules/loan-application-management/hooks/useQuery/useQueryListPaginatedLoanApplicationScoreGroupByApplicationId"

/**
 * Columns for workspace admin list applications
 */
export const workspaceAdminApplicationColumns: ColumnDef<IWorkspaceAdminApplicationScore>[] =
  [
    {
      id: "applicationIdNumber",
      enableHiding: false,
      header: renderFilterableHeader({ title: "ID" }),
      meta: { columnViewName: "ID" },
      cell: ({ row }) => {
        const application = row.original
        return (
          <div className="text-center">#{application?.applicationIdNumber}</div>
        )
      },
      size: 80
    },
    {
      id: "businessName",
      header: renderFilterableHeader({ title: "Company Name" }),
      enableSorting: true,
      meta: { columnViewName: "Company Name" },
      cell: ({ row }) => {
        const app = row.original
        return <div className="text-center">{app?.businessName ?? "N/A"}</div>
      },
      size: 200
    },
    {
      id: "roundOneJudges",
      header: renderFilterableHeader({
        title: "Round 1 Judges",
        isCanSort: false
      }),
      meta: {
        columnViewName: "Round 1 Judges",
        filterID: WORKSPACE_ADMIN_APPLICATION_SCORE_FILTER_KEYS.judgeIds
      },
      cell: ({ row }) => {
        const application = row.original
        const remainAvatar = application.roundOne.judges?.length - 8

        return (
          <div className="flex items-center justify-center">
            <AssigningJudgeRow
              row={row}
              currentStage={LoanStage.ROUND_1}
              disabled={
                application.status.toLowerCase() !==
                LoanApplicationStatus.ROUND_1.toLowerCase()
              }
            />

            <div className="flex items-center justify-center">
              {application.roundOne.judges
                ?.slice(0, remainAvatar > 0 ? 7 : 8)
                .map((judge, key) => (
                  <ToolTipJudgeAvatar
                    key={key}
                    avatar={judge?.judgeAvatar}
                    name={judge?.judgeName}
                    email={judge?.judgeEmail}
                    isScored={application.roundOne.scoredJudges.some(
                      (scoredJudge) => scoredJudge.judgeId === judge.judgeId
                    )}
                  />
                ))}

              {remainAvatar > 0 && (
                <CustomJudgeAvatar>+{remainAvatar}</CustomJudgeAvatar>
              )}
            </div>
          </div>
        )
      },
      size: 200
    },
    {
      id: "roundOneAvgScore",
      header: renderFilterableHeader({
        title: "Round 1 Avg. Score",
        disabled: true
      }),
      meta: { columnViewName: "Round 1 Avg. Score" },
      cell: ({ row }) => {
        const application = row.original

        return (
          <div className="text-center">
            {application.roundOne.judges.length == 0 ? (
              "---"
            ) : (
              <ScoreBadge
                score={application.roundOne.avgScore}
                isFinished={
                  application.roundOne.numberOfScoredJudge ===
                  application.roundOne.judges.length
                }
              />
            )}
          </div>
        )
      },
      size: 200
    },
    {
      id: "roundTwoJudges",
      header: renderFilterableHeader({
        title: "Round 2 Judges",
        isCanSort: false
      }),
      meta: {
        columnViewName: "Round 2 Judges",
        filterID: WORKSPACE_ADMIN_APPLICATION_SCORE_FILTER_KEYS.judgeIds
      },
      cell: ({ row }) => {
        const application = row.original
        const remainAvatar = application.roundTwo.judges?.length - 8

        return (
          <div className="flex items-center justify-center">
            <AssigningJudgeRow
              row={row}
              currentStage={LoanStage.ROUND_2}
              disabled={
                application.status.toLowerCase() !==
                LoanApplicationStatus.ROUND_2.toLowerCase()
              }
            />

            <div className="flex items-center justify-center">
              {application.roundTwo.judges.slice(0, 8).map((judge, key) => (
                <ToolTipJudgeAvatar
                  key={key}
                  avatar={judge?.judgeAvatar}
                  name={judge?.judgeName}
                  email={judge?.judgeEmail}
                  isScored={application.roundTwo.scoredJudges.some(
                    (scoredJudge) => scoredJudge.judgeId === judge.judgeId
                  )}
                />
              ))}
              {remainAvatar > 0 && (
                <CustomJudgeAvatar>+{remainAvatar}</CustomJudgeAvatar>
              )}
            </div>
          </div>
        )
      },
      size: 200
    },
    {
      id: "roundTwoAvgScore",
      header: renderFilterableHeader({
        title: "Round 2 Avg. Score",
        disabled: true
      }),
      meta: { columnViewName: "Round 2 Avg. Score" },
      cell: ({ row }) => {
        const application = row.original

        return (
          <div className="text-center">
            {application.roundTwo.judges.length == 0 ? (
              "---"
            ) : (
              <ScoreBadge
                score={application.roundTwo.avgScore}
                isFinished={
                  application.roundTwo.numberOfScoredJudge ===
                  application.roundTwo.judges.length
                }
              />
            )}
          </div>
        )
      },
      size: 200
    },

    {
      id: "scoredcard",
      header: renderFilterableHeader({
        title: "Scorecard Status",
        disabled: false,
        isCanSort: false
      }),
      meta: {
        columnViewName: "Scorecard Status",
        filterID: WORKSPACE_ADMIN_APPLICATION_SCORE_FILTER_KEYS.scorecards
      },
      cell: ({ row }) => {
        const application = row.original

        if (
          application.roundOne.judges == null ||
          application.roundOne.judges?.length == 0
        )
          return ""

        const scoredcardStatus =
          getScorecardStatusByApplicationStage(application)

        if (scoredcardStatus.numberOfJudge == 0) return ""

        const currentRoundAssignedJudges =
          application.roundTwo.judges?.length > 0
            ? application.roundTwo.judges
            : application.roundOne.judges
        const completedScorecardJudges =
          application.roundTwo.judges?.length > 0
            ? application.roundTwo.scoredJudges
            : application.roundOne.scoredJudges

        return (
          <div className="text-center">
            <NudgeJudgesPopover
              assignedJudges={currentRoundAssignedJudges}
              completedScorecardJudges={completedScorecardJudges}
              applicationId={application.id}
            />
          </div>
        )
      },
      size: 200
    },
    {
      id: "roundStatus",
      header: renderFilterableHeader({ title: "Round Status" }),
      meta: {
        columnViewName: "Round Status",
        filterID: WORKSPACE_ADMIN_APPLICATION_SCORE_FILTER_KEYS.statuses
      },
      cell: ({ row }) => {
        const application = row.original

        return (
          <div className="text-center cursor-pointer w-[250px] mx-auto">
            <ApplicationRoundSelectionPopover
              applicationId={application.id}
              roundStatus={application.status}
            />
          </div>
        )
      },
      size: 200
    },
    {
      id: "createdAt",
      header: renderFilterableHeader({ title: "Created On" }),
      meta: {
        columnViewName: "Created On",
        filterID: `${WORKSPACE_ADMIN_APPLICATION_SCORE_FILTER_KEYS.createdOn}-button`
      },
      size: 150,
      cell: ({ row }) => {
        const application = row.original

        return (
          <div className="text-center">
            {application.createdAt
              ? format(application.createdAt, FORMAT_DATE_M_D_Y)
              : "N/A"}
          </div>
        )
      }
    },
    {
      id: "submittedAt",
      header: renderFilterableHeader({ title: "Submitted On" }),
      meta: {
        columnViewName: "Submitted On",
        filterID: `${WORKSPACE_ADMIN_APPLICATION_SCORE_FILTER_KEYS.submittedOn}-button`
      },
      size: 150,
      cell: ({ row }) => {
        const app = row.original

        return (
          <div className="text-center">
            {app?.submittedAt
              ? format(app?.submittedAt, FORMAT_DATE_M_D_Y_TIME_UPPERCASE)
              : "N/A"}
          </div>
        )
      }
    },

    {
      id: "action",
      enableHiding: false,
      meta: { columnViewName: "Docs" },
      header: ({ column }) => (
        <FilterableColumnHeader
          className="float-right pr-4"
          disabled
          column={column}
          title="Docs"
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="float-right">
            <ButtonReviewLoanApplication
              loanApplicationStatus={row.original.status}
              loanApplicationId={row.original.id}
              loanProgramType={row.original.programType}
            />
          </div>
        )
      }
    }
  ]
