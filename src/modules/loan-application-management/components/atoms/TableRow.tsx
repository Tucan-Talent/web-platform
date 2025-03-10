import { TableCell, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

type TableRowProps = {
  data: string[]
  className?: string
  childrenClassName?: string[]
}

export const CustomTableRow: React.FC<TableRowProps> = ({
  data,
  className,
  childrenClassName
}) => {
  return (
    <TableRow className={className}>
      {data.map((cell, index) => (
        <TableCell
          key={index}
          className={cn(
            "py-2 h-fit",
            !!childrenClassName && childrenClassName[index]
          )}
        >
          {cell}
        </TableCell>
      ))}
    </TableRow>
  )
}
