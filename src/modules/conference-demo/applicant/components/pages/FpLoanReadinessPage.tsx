import { LoanReadiness } from "@/modules/conference-demo/admin/components/organisms/LoanReadiness"
import { Drawer } from "@/modules/conference-demo/applicant/components/molecules/Drawer.tsx"

export function Component() {
  return (
    <div className="flex flex-col gap-y-2xl">
      <div className="w-full flex gap-2 justify-end items-center">
        <Drawer />
      </div>

      <div className="flex flex-col gap-y-6xl">
        <div className="mt-2">
          <LoanReadiness />
        </div>
      </div>
    </div>
  )
}

Component.displayName = "FpLoanReadinessPage"
