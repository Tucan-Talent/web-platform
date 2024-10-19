import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"
import { cn } from "@/lib/utils"
import { LoanApplicationStatus } from "@/types/loan-application.type"
import { ScoreCardBox } from "../../atoms/score/ScoreCardBox"
import { capitalizeWords, snakeCaseToText, valueOrZero } from "@/utils"
import {
  calculateAvgScorePerRound,
  calculateTotalScore
} from "@/utils/score.utils"
import { useParams } from "react-router-dom"
import { useQueryGetLoanApplicationDetailStatus } from "../../../hooks/useQuery/useQueryGetLoanApplicationDetailStatus"
import { useQueryScoreApplicationDetails } from "../../../hooks/useQuery/useQueryScoreApplicationDetails"
import { StatusRoundBadge } from "../../atoms/StatusRoundBadge"
import { ScoreCardListDetailByJudge } from "./ScoreCardListDetailByJudge"
import {
  isAbleToViewScoreRound1,
  isAbleToViewScoreRound2
} from "../../../services/status.service"
import { FeedbackCardDetail } from "@/modules/loan-application-management/components/molecules/FeedbackCardDetail.tsx"

export function ScoreCardListDetail() {
  const params = useParams()

  // Get Application Detail
  const { data, isFetching } = useQueryScoreApplicationDetails({
    applicationId: params.id!
  })

  // Get Application Status
  const { data: statusData } = useQueryGetLoanApplicationDetailStatus({
    applicationId: params.id!
  })

  const avgScoreRound1 = calculateAvgScorePerRound(
    data,
    LoanApplicationStatus.ROUND_1
  )

  const avgScoreRound2 = calculateAvgScorePerRound(
    data,
    LoanApplicationStatus.ROUND_2
  )

  const scoresRound1 =
    data?.scores?.find(
      (item) => item.stage === LoanApplicationStatus.ROUND_1.toLowerCase()
    )?.scoreInfo || []

  const scoresRound2 =
    data?.scores?.find(
      (item) => item.stage === LoanApplicationStatus.ROUND_2.toLowerCase()
    )?.scoreInfo || []

  const ableToViewRound1 = isAbleToViewScoreRound1(statusData)

  const ableToViewRound2 = isAbleToViewScoreRound2(statusData)

  const isRound1FinishScored =
    scoresRound1.length > 0 &&
    scoresRound1.length ===
      scoresRound1.filter((score) => !!score?.scoredAt).length

  const isRound2FinishScored =
    scoresRound2.length > 0 &&
    scoresRound2.length ===
      scoresRound2.filter((score) => !!score?.scoredAt).length

  const isFinishScored = isRound1FinishScored && isRound2FinishScored

  const totalScore = isFinishScored
    ? calculateTotalScore(avgScoreRound1, avgScoreRound2)
    : 0

  const feedbackList = [...scoresRound1, ...scoresRound2]

  return (
    <Card className="h-fit max-h-full top-0 z-10 mb-4 flex-shrink-0 mt-6 lg:mt-0">
      <CardHeader className="!pb-0 px-0 md:px-0">
        <CardTitle className="font-semibold text-lg px-4 tracking-wide">
          <div>Scorecard</div>
        </CardTitle>
      </CardHeader>

      <CardContent className="w-full lg:w-[400px] !p-4 !pt-0">
        <div className="flex justify-between items-stretch space-x-2">
          <ScoreCardBox
            hasBorder
            multiple
            name="Total score"
            score={totalScore}
          />
          <ScoreCardBox
            hasBorder
            multiple
            name="Round 2"
            score={avgScoreRound2}
          />
          <ScoreCardBox
            hasBorder
            multiple
            name="Round 1"
            score={avgScoreRound1}
          />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-text-tertiary">Application Round</span>

          <StatusRoundBadge round={(statusData ?? "") as LoanApplicationStatus}>
            {capitalizeWords(snakeCaseToText(statusData ?? ""))}
          </StatusRoundBadge>
        </div>

        <Accordion
          defaultValue={[
            "scored-card-round-1",
            "scored-card-round-2",
            "feedback"
          ]}
          type="multiple"
        >
          {ableToViewRound2 ? (
            <AccordionItem
              key="scored-card-round-2"
              className="border-b-0"
              value="scored-card-round-2"
            >
              <AccordionTrigger
                className={cn(
                  "justify-between w-full hover:no-underline text-base font-medium text-left border-b pb-0.5 [&>.lucide-chevron-down]:w-5"
                )}
              >
                <div className="w-full flex justify-between items-center">
                  <span>Round 2 Total Score</span>

                  <span
                    className={cn(
                      "flex items-center text-xs font-semibold",
                      !isRound2FinishScored && "text-gray-200"
                    )}
                  >
                    <span>
                      {valueOrZero(avgScoreRound2)}
                      <span className="text-black">/5</span>
                    </span>
                    <Icons.rocket className="w-4 ml-1" />
                  </span>
                </div>
              </AccordionTrigger>

              <AccordionContent>
                <Accordion type="multiple">
                  {!isFetching &&
                    (scoresRound2.length > 0 ? (
                      scoresRound2.map((item, index) => (
                        <ScoreCardListDetailByJudge
                          key={`${LoanApplicationStatus.ROUND_2}_${index}_${item.judgeName}`}
                          id={`${LoanApplicationStatus.ROUND_2}_${index}_${item.judgeName}`}
                          name={item.judgeName}
                          scoreData={item.score}
                          scoredDate={item?.scoredAt}
                        />
                      ))
                    ) : (
                      <div className="mt-2 text-xs text-text-tertiary">
                        No judge has been assigned for this loan application.
                      </div>
                    ))}
                </Accordion>
              </AccordionContent>
            </AccordionItem>
          ) : null}

          {ableToViewRound1 ? (
            <AccordionItem
              key="scored-card-round-1"
              className="border-b-0"
              value="scored-card-round-1"
            >
              <AccordionTrigger
                className={cn(
                  "justify-between w-full hover:no-underline text-base font-medium text-left data-[state=open]:border-b pb-0.5 [&>.lucide-chevron-down]:w-5"
                )}
              >
                <div className="w-full flex justify-between items-center">
                  <span>Round 1 Total Score</span>

                  <span
                    className={cn(
                      "flex items-center text-xs font-semibold",
                      avgScoreRound1 === 0 ? "text-gray-200" : null
                    )}
                  >
                    <span>
                      {valueOrZero(avgScoreRound1)}
                      <span className="text-black">/5</span>
                    </span>
                    <Icons.rocket className="w-4 ml-1" />
                  </span>
                </div>
              </AccordionTrigger>

              <AccordionContent>
                <Accordion type="multiple">
                  {!isFetching &&
                    (scoresRound1?.length > 0 ? (
                      scoresRound1.map((item, index) => (
                        <ScoreCardListDetailByJudge
                          key={`${LoanApplicationStatus.ROUND_1}_${index}_${item.judgeName}`}
                          id={`${LoanApplicationStatus.ROUND_1}_${index}_${item.judgeName}`}
                          name={item.judgeName}
                          scoreData={item.score}
                          scoredDate={item?.scoredAt}
                        />
                      ))
                    ) : (
                      <div className="mt-2 text-xs text-text-tertiary">
                        No judge has been assigned for this loan application.
                      </div>
                    ))}
                </Accordion>
              </AccordionContent>
            </AccordionItem>
          ) : null}

          {/* If admin want to view the feedback, they must be able to view round 1 */}
          {ableToViewRound1 ? (
            <AccordionItem
              key="feedback"
              className="border-b-0"
              value="feedback"
            >
              <AccordionTrigger
                className={cn(
                  "justify-between w-full hover:no-underline text-base font-medium text-left data-[state=open]:border-b pb-0.5 [&>.lucide-chevron-down]:w-5"
                )}
              >
                <div className="w-full flex justify-between items-center">
                  <span>Feedback to applicant</span>
                </div>
              </AccordionTrigger>

              <AccordionContent>
                <FeedbackCardDetail feedbackList={feedbackList} />
              </AccordionContent>
            </AccordionItem>
          ) : null}
        </Accordion>
      </CardContent>
    </Card>
  )
}
