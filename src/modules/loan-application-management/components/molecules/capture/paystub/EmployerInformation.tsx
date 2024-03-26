import { TableBody, Table } from "@/components/ui/table"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion"
import { EmployerInformationType } from "@/modules/loan-application-management/constants/types/document"
import { CustomTableRow } from "../../../atoms/TableRow"

type Props = {
  data: EmployerInformationType
}
export const EmployerInformation: React.FC<Props> = ({ data }) => {
  return (
    <Accordion type="single" collapsible className="w-full border-t">
      <AccordionItem value="employer-information">
        <AccordionTrigger isStartIcon>
          <p>Employer Information</p>
        </AccordionTrigger>
        <AccordionContent>
          <Table className="text-xs">
            <TableBody className="bg-gray-100">
              <CustomTableRow
                data={["Name", data.name]}
                childrenClassName={["", "font-bold"]}
                className="bg-gray-50"
              />
              <CustomTableRow
                data={["Address Line 1", data.addressLine1]}
                childrenClassName={["", "font-bold"]}
              />
              <CustomTableRow
                data={["Address Line 2", data.addressLine2]}
                childrenClassName={["", "font-bold"]}
                className="bg-gray-50"
              />
              <CustomTableRow
                data={["City", data.city]}
                childrenClassName={["", "font-bold"]}
              />
              <CustomTableRow
                data={["State", data.state]}
                childrenClassName={["", "font-bold"]}
                className="bg-gray-50"
              />
              <CustomTableRow
                data={["Zip", data.zip]}
                childrenClassName={["", "font-bold"]}
              />
            </TableBody>
          </Table>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
