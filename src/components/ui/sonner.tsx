"use client"

import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return <Sonner richColors={true} className="toaster group" {...props} />
}

export { Toaster }
