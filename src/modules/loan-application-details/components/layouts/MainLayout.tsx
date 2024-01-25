import { Breadcrumbs } from "@/shared/molecules/Breadcrumbs"
import { TopNav } from "../molecules/TopNav"
import { BasicInformation } from "../organisms/BasicInformation"
import { APP_PATH } from "@/constants"

type Props = {
  children: React.ReactNode
}

export const MainLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="flex flex-col w-full h-full max-w-screen-2xl space-y-3xl">
      <Breadcrumbs
        breads={[
          {
            to: APP_PATH.LOAN_APPLICATION_DETAILS.INDEX,
            label: "Applications"
          },
          { to: APP_PATH.LOAN_APPLICATION_DETAILS.KYB, label: "Latte Larry" }
        ]}
      />
      <div className="flex flex-col space-y-3xl border-b">
        <BasicInformation />
        <TopNav />
      </div>
      <div className="p-4xl pt-0 flex-1 overflow-auto">{children}</div>
    </div>
  )
}
