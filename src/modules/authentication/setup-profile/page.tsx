import { SetupProfileSection } from "./components/setup-profile-section"

export function Component() {
  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-1 lg:px-0 overflow-y-auto">
      <SetupProfileSection />
    </div>
  )
}
