import { APP_PATH } from "@/constants"
import { FeatureKey } from "@/hooks/useCanAccess"
import { Component as DashboardV2 } from "@/modules/dashboard-v2/page"
import { Component as LoanApplicationManagementComponent } from "@/modules/loan-application-management/pages/list"
import { userLoader } from "@/routes/loader"
import { ProtectedRoute } from "@/shared/atoms/ProtectedRoute"
import { Component as DashboardLayout } from "@/shared/layouts/dashboard-layout/dashboard-layout"
import { handleCrumb } from "@/utils/crumb.utils"
import { isKccBank, isLaunchKC, isSbb } from "@/utils/domain.utils"
import { Route } from "react-router-dom"
import { adminRoutes } from "./admin-routes"
import { loanApplicationManagementRoutes } from "./loan-application-management-routes"
import { notificationRoutes } from "./notification-routes"

/**
 * Dashboard routes ("/*"), no unauthenticated or loan applicant allowed to see these pages.
 * get user   ->  if success return children routes.
 *            ->  if fail due to unauthenticated, clear credential (if any), navigate to ("/sign-up")
 */

const dashboardRoutes = (
  <Route
    loader={userLoader}
    element={<DashboardLayout />}
    handle={handleCrumb(APP_PATH.INDEX)}
  >
    {/* DASHBOARD STATICS */}
    <Route
      index
      element={
        isLaunchKC() ? <LoanApplicationManagementComponent /> : <DashboardV2 />
      }
    />

    {/* LOAN APPLICATION MANAGEMENT */}
    {loanApplicationManagementRoutes}

    {/* LOAN PROGRAM */}
    {/* Hide with KCC */}
    {(!isKccBank() || !isSbb() || !isLaunchKC()) && (
      <Route element={<ProtectedRoute featureKey={FeatureKey.LOAN_PROGRAM} />}>
        <Route
          path={APP_PATH.LOAN_PROGRAM.index}
          lazy={() => import("@/modules/admin/loan-program/page")}
          handle={handleCrumb(APP_PATH.LOAN_PROGRAM.index)}
        />
      </Route>
    )}

    {/* NOTIFICATION */}
    {notificationRoutes}

    {/* USERS MANAGEMENT */}
    <Route
      path={APP_PATH.ADMIN_USERS.USER.index}
      handle={handleCrumb(APP_PATH.ADMIN_USERS.USER.index)}
      lazy={() => import("@/modules/admin/user/user-page.tsx")}
    />

    {/* INVITATIONS MANAGEMENT */}
    <Route
      path={APP_PATH.ADMIN_USERS.INVITATION.index}
      handle={handleCrumb(APP_PATH.ADMIN_USERS.INVITATION.index)}
      lazy={() => import("@/modules/admin/user/invitation-page.tsx")}
    />

    {/* DOCUMENT MANAGEMENT */}
    <Route
      path={APP_PATH.DOCUMENTS}
      lazy={() => import("@/modules/admin/user/document-page.tsx")}
    />

    {/* MESSAGES */}
    <Route
      path={APP_PATH.MESSAGES}
      lazy={() =>
        import("@/modules/loan-application-management/pages/under-construction")
      }
    />

    {/* SETTINGS */}
    <Route
      path={APP_PATH.SETTINGS}
      lazy={() =>
        import("@/modules/loan-application-management/pages/under-construction")
      }
    />

    {/* ADMIN DASHBOARD */}
    {adminRoutes}
  </Route>
)

export { dashboardRoutes }
