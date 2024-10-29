import { Card } from "@/components/ui/card"
import { AnswersTextDisplay } from "../../../atoms/AnswersTextDisplay"

export function PreApplicationDisclosuresDetails() {
  return (
    <Card className="flex flex-col gap-2xl p-4xl rounded-lg h-fit overflow-auto loan-application-item shadow-none">
      <h5 className="text-lg font-semibold">Pre-Application Disclosures</h5>
      <div className="flex flex-col gap-y-2xl gap-x-4xl">
        <AnswersTextDisplay
          key="patriotAct"
          className="!flex-row justify-between"
          label="USA Patriot Act"
          value="Acknowledged receipt of the USA Patriot Act Notification"
        />
        <AnswersTextDisplay
          key="privacyPolicy"
          className="!flex-row justify-between"
          label="Privacy Policy"
          value="Acknowledged receipt of the SBB’s Privacy Policy"
        />
      </div>
    </Card>
  )
}
