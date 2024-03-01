import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ReactNode } from "react"

type MiddeskCardProps = {
  content: ReactNode
  headerTitle: ReactNode
  headerRight?: ReactNode
}

export const MiddeskCard = ({
  content,
  headerTitle,
  headerRight
}: MiddeskCardProps) => {
  return (
    <div>
      <Card>
        <CardHeader className="border-b px-8 md:py-4">
          <div className="flex justify-between items-center flex-wrap gap-1">
            <CardTitle className="font-semibold text-2xl flex items-center gap-3">
              {headerTitle}
            </CardTitle>

            {headerRight}
          </div>
        </CardHeader>

        <CardContent className="px-5">
          <div className="mb-5">{content}</div>
        </CardContent>
      </Card>
    </div>
  )
}
