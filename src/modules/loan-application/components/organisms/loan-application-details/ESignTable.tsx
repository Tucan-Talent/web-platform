import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FORMAT_DATE_MM_DD_YYYY } from "@/constants/date.constants"
import { MiddeskTable } from "@/modules/loan-application-management/components/table/middesk-table"
import { useGetESignDocument } from "@/modules/loan-application/hooks/useQuery/form/useGetESignDocument"
import { formatDate } from "@/utils/date.utils"
import { renderHeader } from "@/utils/table.utils"
import { type ColumnDef } from "@tanstack/react-table"
import { FileDown } from "lucide-react"
import { useParams } from "react-router-dom"
import { ButtonDownloadESignDocument } from "../../atoms/ButtonDownloadESignDocument"

interface ILoanApplicationESignDocument {
  signedAt?: string
  name: string
  documentName?: string
  documentId: string
}

const columns: ColumnDef<ILoanApplicationESignDocument>[] = [
  {
    id: "name",
    header: renderHeader("Name"),
    cell: ({ row }) => {
      const signature = row.original

      return <div className="min-w-0">{signature.name}</div>
    }
  },
  {
    id: "date",
    header: renderHeader("Date"),
    cell: ({ row }) => {
      const signature = row.original

      return (
        <div className="min-w-0">
          {formatDate(signature.signedAt, FORMAT_DATE_MM_DD_YYYY)}
        </div>
      )
    }
  },
  {
    id: "action",
    header: renderHeader("Download", "flex justify-end mr-3"),
    cell: ({ row }) => {
      const signature = row.original

      return (
        <div className="min-w-0 text-right">
          <ButtonDownloadESignDocument
            documentId={signature.documentId}
            documentName={signature.documentName}
          >
            <FileDown className="w-4 h-4" />
          </ButtonDownloadESignDocument>
        </div>
      )
    }
  }
]

export function ESignTable() {
  const { id: applicationId } = useParams()
  const { isLoading, data } = useGetESignDocument({
    applicationId,
    enabled: !!applicationId
  })

  const eSignDocuments: ILoanApplicationESignDocument[] =
    isLoading || !data?.documentId
      ? []
      : [
          {
            name: "E-Signed Application",
            documentName: data.documentName,
            signedAt: data?.updatedAt,
            documentId: data.documentId
          }
        ]

  return (
    <Card className="p-8 flex flex-col gap-2xl">
      <CardHeader className="!p-0">
        <div className="flex justify-between items-center flex-wrap gap-1">
          <CardTitle className="font-semibold text-lg flex items-center gap-3">
            E-Signature
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="!p-0 overflow-auto">
        <MiddeskTable
          cellClassName="text-sm pl-0  border-b"
          columns={columns}
          data={eSignDocuments}
          headerCellClassName="p-0 text-text-primary text-sm font-medium"
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  )
}
