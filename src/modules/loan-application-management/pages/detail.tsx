import { Navigate, Outlet } from "react-router-dom"
import { MainLayout } from "../components/layouts/MainLayout"
import { LoanApplicationDetailProvider } from "../providers/LoanApplicationDetailProvider"
import { checkIsLenderAdmin, checkIsLoanOfficer } from "@/utils/check-roles"
import { APP_PATH } from "@/constants"

const RoleStrict = ({ children }: React.PropsWithChildren) => {
  const isLoanOfficerOrLenderAdmin =
    checkIsLoanOfficer() || checkIsLenderAdmin()

  if (!isLoanOfficerOrLenderAdmin)
    return <Navigate to={APP_PATH.LOAN_APPLICATION_MANAGEMENT.INDEX} replace />

  return children
}

export function Component() {
  return (
    <RoleStrict>
      <LoanApplicationDetailProvider>
        <MainLayout>
          <Outlet />
        </MainLayout>
      </LoanApplicationDetailProvider>
    </RoleStrict>
  )
}
