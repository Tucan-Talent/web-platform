"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { VariantProps, cva } from "class-variance-authority"
import copy from "copy-text-to-clipboard"

const clipboardCopyVariants = cva("", {
  variants: {
    variant: {
      red: "text-red",
      gray: "text-gray",
      yellow: "text-yellow",
      green: "text-green",
      blue: "text-blue",
      secondary: "text-secondary",
      primary: "text-primary"
    }
  },
  defaultVariants: {
    variant: "blue"
  }
})

export interface ClipboardCopyProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof clipboardCopyVariants> {
  clipboardTargetId?: string
  content?: string
}

const ClipboardCopy = React.forwardRef<HTMLButtonElement, ClipboardCopyProps>(
  ({ className, variant, clipboardTargetId, content, ...props }, ref) => {
    const variantColor = clipboardCopyVariants({ variant })
    const [isCopied, setIsCopied] = React.useState(false)

    const copyToClipboard = () => {
      const contentToCopy = clipboardTargetId
        ? document.getElementById(clipboardTargetId)?.textContent
        : content
      if (!contentToCopy) {
        setIsCopied(false)
        return
      }
      copy(contentToCopy)
      setIsCopied(true)

      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setIsCopied(false)
      }, 2000)
    }

    return (
      <button
        data-copy-to-clipboard-target={clipboardTargetId}
        className={cn(
          "text-gray-900 dark:text-gray-400 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 rounded-lg py-2 px-2.5 inline-flex items-center justify-center bg-white border-gray-200 border",
          className
        )}
        ref={ref}
        {...props}
        onClick={copyToClipboard}
      >
        <span
          id="default-message"
          className={cn("items-center", isCopied ? "hidden" : "inline-flex")}
        >
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 18 20"
            className="w-3 h-3 me-1.5"
          >
            <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
          </svg>
          <span className="text-xs font-semibold">Copy</span>
        </span>
        <span
          id="success-message"
          className={cn("items-center", isCopied ? "inline-flex" : "hidden")}
        >
          <svg
            className={cn(
              "w-3 h-3 me-1.5",
              `${variantColor}-700`,
              `dark:${variantColor}-500`
            )}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 16 12"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M1 5.917 5.724 10.5 15 1.5"
            />
          </svg>
          <span
            className={cn(
              "text-xs font-semibold",
              `${variantColor}-700`,
              `dark:${variantColor}-500`
            )}
          >
            Copied
          </span>
        </span>
      </button>
    )
  }
)
ClipboardCopy.displayName = "ClipboardCopy"
export { ClipboardCopy, clipboardCopyVariants }
