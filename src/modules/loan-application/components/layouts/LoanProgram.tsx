import { ASSETS } from "@/assets"
import { Separator } from "@/components/ui/separator"
import { LoanPrograms } from "../organisms/LoanPrograms"

const WelcomeLine = () => {
  return (
    <section>
      <h2 className="text-3xl md:text-4xl font-semibold mb-6">
        Welcome to AltCap
      </h2>
      <p className="text-lg">
        AltCap is an ally to underestimated entrepreneurs. We offer financing to
        businesses and communities that traditional lenders do not serve. Our
        flexible, patient capital meets the unique needs of each entrepreneur
        and local investment.
      </p>
    </section>
  )
}

export const Component = () => {
  return (
    <div className="overflow-auto flex flex-col items-center flex-1">
      <div className="grid grid-cols-8">
        <section className="col-span-8">
          <img
            className="mx-auto"
            src={ASSETS.altCapLoanProgramLarge}
            alt="altcap loan program"
            srcSet={`${ASSETS.altCapLoanProgram} 600w, ${ASSETS.altCapLoanProgramLarge} 1200w`}
          />
        </section>

        <section className="p-6 md:px-0 col-span-6 col-start-2 mx-auto">
          <div>
            <WelcomeLine />
          </div>

          <Separator className="my-6" />

          <div>
            <LoanPrograms />
          </div>
        </section>
      </div>
    </div>
  )
}

Component.displayName = "LoanProgram"
