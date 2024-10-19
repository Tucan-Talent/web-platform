import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronDown, ChevronUp } from "lucide-react"

interface PaginationProps {
  total: number
  page: number
  onPageChange: (page: number) => void
  onNextPage: () => void
  onPreviousPage: () => void
}

export function Pagination(props: PaginationProps) {
  const { total, page, onNextPage, onPreviousPage, onPageChange } = props

  return (
    <div className="flex gap-6">
      <div className="flex gap-2 items-center font-semibold text-sm">
        <p>Page</p>
        <Input
          className="w-10 h-10 p-0 focus-visible:ring-0 text-center input-number-remove-arrow"
          max={total}
          min={1}
          type="number"
          value={page}
          onChange={(e) => onPageChange(Number(e.target.value))}
        />
        of
        <p>{total}</p>
      </div>
      <div className="flex gap-1">
        <Button
          className="bg-gray-100 w-10 h-10 p-0"
          disabled={page === 1}
          variant="secondary"
          onClick={onPreviousPage}
        >
          <ChevronUp className="w-6 h-6" />
        </Button>
        <Button
          className="bg-gray-100 w-10 h-10 p-0"
          disabled={page === total}
          variant="secondary"
          onClick={onNextPage}
        >
          <ChevronDown className="w-6 h-6 text-gray-500" />
        </Button>
      </div>
    </div>
  )
}
