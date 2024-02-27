import { getRequest } from "@/services/client.service"
import { ImageDataResponse } from "@/types/common.type"
import { PhoneNumberFormat, PhoneNumberUtil } from "google-libphonenumber"
import { toast } from "sonner"

export const convertFileSizeToMB = (fileSizeInBytes: number): string => {
  if (fileSizeInBytes === undefined) {
    return "0"
  }
  if (fileSizeInBytes === 0) {
    return "0"
  }
  const fileSizeInMB = fileSizeInBytes / (1024 * 1024)
  return fileSizeInMB.toFixed(2)
}

export const formatPhoneNumber = (phoneNumber: string) => {
  try {
    return (
      checkValidPhoneNumber(phoneNumber) &&
      PhoneNumberUtil.getInstance().format(
        PhoneNumberUtil.getInstance().parse(phoneNumber),
        PhoneNumberFormat.INTERNATIONAL
      )
    )
  } catch (error) {
    return false
  }
}

export function checkValidPhoneNumber(phone: string) {
  const phoneRegex = new RegExp(
    "^(?:\\+\\d{1,3}|0\\d{1,3}|00\\d{1,2})?(?:\\s?\\(\\d+\\))?(?:[-/\\s.]|\\d)+$"
  )
  return phoneRegex.test(phone)
}

/**
 * Reference: [sonner](https://ui.shadcn.com/docs/components/sonner)
 */
export const toastSuccess = ({
  title,
  description
}: {
  title: string
  description: string
}) => {
  toast.success(title, { description })
}

export const toastError = ({
  title,
  description
}: {
  title: string
  description: string
}) => {
  toast.error(title, { description })
}

export const capitalizeWords = (string: string) =>
  string
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

export const toCurrency = (value: number, maximumFractionDigits = 2) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits
  }).format(value)
}

export const convertToCamelCase = (str: string) => {
  return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase())
}

export const snakeCaseToText = (str: string) => {
  return str.replace(/_/g, " ")
}

export async function fetchProtectedImage(path: string, imageUrl: string) {
  // Fetch the image.
  const response = await getRequest<
    { [key: string]: string },
    ImageDataResponse
  >({
    path: `${path}?image_url=${imageUrl}`
  })

  const blob = response.fileData

  // TODO: create object url from blob
  // Dont know why this doesn't work
  // const n = new Blob([blob], { type: "image/jpeg" })
  // const objectUrl = URL.createObjectURL(n)

  return blob
}

export const convertToReadableDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  })
}

export const convertToReadableDateAgo = (date: string) => {
  if (!date) {
    return "N/A"
  }
  const date1 = new Date(date)
  const date2 = new Date()
  const diffTime = Math.abs(date2.getTime() - date1.getTime())
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  const diffWeeks = Math.floor(diffDays / 7)
  const diffMonths = Math.floor(diffDays / 30)
  const diffYears = Math.floor(diffMonths / 12)

  const addS = (value: number, str: string) => (value > 1 ? str + "s" : str)

  if (diffYears > 0) {
    return `${diffYears} ${addS(diffYears, "year")} ago`
  } else if (diffMonths > 0) {
    return `${diffMonths} ${addS(diffMonths, "month")} ago`
  } else if (diffWeeks > 0) {
    return `${diffWeeks} ${addS(diffWeeks, "week")} ago`
  } else if (diffDays > 0) {
    return `${diffDays} ${addS(diffDays, "day")} ago`
  } else {
    return "Today"
  }
}
