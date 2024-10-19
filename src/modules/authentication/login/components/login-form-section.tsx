import { Button } from "@/components/ui/button"
import { APP_PATH } from "@/constants"
import { LogoHeader } from "@/shared/atoms/LogoHeader"
import { Link } from "react-router-dom"
import { LoginForm } from "./login-form"
import { isEnableMFA } from "@/services/jwt.service"
import { MfaLoginForm } from "./mfa-login-form"
import { isAdmin } from "@/utils/domain.utils"

export function LoginFormSection() {
  return (
    <div className="rounded-[32px] shadow-primary md:w-[540px] mx-auto h-auto p-8 bg-white">
      <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[360px]">
        <div className="flex flex-col text-center">
          <div className="self-center">
            <LogoHeader />
          </div>

          <h1 className="text-[34px] font-semibold tracking-tight mt-6">
            Welcome back!
          </h1>
          <div className="text-subtitle mt-2 text-sm">
            <p>Please enter your details.</p>
          </div>
        </div>

        {isEnableMFA() ? <MfaLoginForm /> : <LoginForm />}
        <p className="px-8 text-center text-sm text-muted-foreground">
          {!isAdmin() ? (
            <>
              Don’t have an account?{" "}
              <Button asChild className="p-0 text-primary" variant="link">
                <Link to={APP_PATH.SIGN_UP}>Sign up</Link>
              </Button>
            </>
          ) : null}
        </p>
      </div>
    </div>
  )
}
