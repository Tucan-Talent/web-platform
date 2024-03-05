import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useBRLoanApplicationDetailsContext } from "@/modules/loan-application/providers/BRLoanApplicationDetailsProvider"
import { TextInputDisplay } from "../../atoms/TextInputDisplay"

export const KybFormDetails = () => {
  const { kybFormData } = useBRLoanApplicationDetailsContext()
  return (
    <Card className="flex flex-col gap-2xl p-4xl rounded-lg h-fit overflow-auto">
      <h5 className="text-lg font-semibold">Business Information</h5>
      <Separator />
      <div className="grid grid-cols-3 gap-y-2xl gap-x-4xl">
        <TextInputDisplay
          className="col-span-3"
          label="Business Legal Name"
          value={kybFormData?.businessLegalName}
        />
        <TextInputDisplay
          className="col-span-3"
          label="Business Street Address Line #1"
          value={kybFormData?.businessStreetAddress.addressLine1}
        />
        <TextInputDisplay
          className="col-span-3"
          label="Business Street Address Line #2"
          value={kybFormData?.businessStreetAddress.addressLine2}
        />
        <TextInputDisplay
          label="Business City"
          value={kybFormData?.businessStreetAddress.city}
        />
        <TextInputDisplay
          label="Business State"
          value={kybFormData?.businessStreetAddress.state}
        />
        <TextInputDisplay
          label="Business Zip Code"
          value={kybFormData?.businessStreetAddress.postalCode}
        />
        <TextInputDisplay
          label="Employer Identification Number (EIN)"
          value={kybFormData?.businessTin}
          className="col-span-3"
        />
        <TextInputDisplay
          label="Business Website"
          value={kybFormData?.businessWebsite}
          className="col-span-3"
        />
      </div>
    </Card>
  )
}
