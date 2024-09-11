import { Card } from "@/components/ui/card"
import { toCurrency } from "@/utils"

interface PeopleTotalInfoProps {
  title: string
  value: number
  isCurrency?: boolean
}

export const PeopleTotalInfo = (props: PeopleTotalInfoProps) => {
  const { title, value, isCurrency } = props
  return (
    <Card className="border-[#4F6161] shadow-lg rounded-xl xl:p-4 p-2 flex flex-col justify-between m-2 grow">
      <h5 className="text-xs font-semibold">{title}</h5>
      <p className="text-xl font-medium">
        {isCurrency ? toCurrency(value) : value}
      </p>
    </Card>
  )
}
