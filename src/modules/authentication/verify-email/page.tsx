import { VerifyEmailSection } from "./components/verify-email-section"

export function Component() {
  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-1 lg:px-0 overflow-y-auto">
      <VerifyEmailSection />
    </div>
  )
}
