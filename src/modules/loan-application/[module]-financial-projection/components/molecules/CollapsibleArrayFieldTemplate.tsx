import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion.tsx"
import { type KeyboardEvent, type PropsWithChildren } from "react"

interface CollapsibleArrayFieldTemplateProps {
  label: string
  id: string
}

export function CollapsibleArrayFieldTemplate(
  props: PropsWithChildren<CollapsibleArrayFieldTemplateProps>
) {
  const { children, label, id } = props

  // Do not remove this function.
  // It is used to ignore the default behavior of the Enter key, which is deleting the first accordion item.
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      event.preventDefault()
    }
  }

  return (
    <AccordionItem
      className="w-full border-0"
      value={id}
      onKeyDown={handleKeyDown}
    >
      <AccordionTrigger
        isStartIcon
        className="flex-row-reverse w-full px-0 pt-2 pb-5 hover:no-underline"
        iconClassName="w-5 h-5"
        id={id}
      >
        <div className="flex items-center justify-between flex-1 font-semibold cursor-pointer">
          {label}
        </div>
      </AccordionTrigger>
      <AccordionContent className="pb-0">{children}</AccordionContent>
    </AccordionItem>
  )
}
