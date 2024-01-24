import { SSN_REGEX, phoneRegex } from "@/constants"
import * as z from "zod"
const ACCEPTED_FILE_TYPES = ["image/png", "image/jpeg", "application/pdf"]

export const ownerFormSchema = z.object({
  name: z.string().min(6, { message: "Name must be at least 6 characters" }),
  address: z.string().min(1, { message: "Address is required" }),
  addressLine1: z.string().min(1, { message: "Address is required" }),
  addressLine2: z.string(),
  role: z.string().min(1, {
    message: "Role is required"
  }),
  city: z.string().min(1, { message: "City is required" }),
  state: z.string().min(1, { message: "State is required" }),
  zipCode: z.string().min(1, { message: "Zip code is required" }),
  phone: z.string().regex(phoneRegex, "Enter a valid phone number!"),
  email: z.string().email({ message: "Enter a valid email address" }),
  dob: z.string().min(1, { message: "Date of birth is required" }),
  ssn: z
    .string()
    .regex(SSN_REGEX, { message: "Social security number is required" }),
  ownership: z.string().min(1, { message: "Ownership percent is required" }),
  cooperate: z.string().min(1, { message: "Cooperate is required" }),
  governmentFile: z.custom<File[]>().refine(
    (fileList) => {
      if (fileList) {
        if (fileList.length === 0) return false
        const fileArray = Array.from(fileList)

        return ACCEPTED_FILE_TYPES.includes(fileArray[0].type)
      }
      return false
    },
    {
      message: "Please choose PNG, JPG, PDF format files only"
    }
  )
})

export const businessFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  website: z.string().min(1, { message: "Enter a valid website" }),
  addressLine1: z.string().min(3, { message: "Address is required" }),
  addressLine2: z.string(),
  city: z.string().min(1, { message: "City is required" }),
  state: z.string().min(1, { message: "State is required" }),
  zipCode: z.string().min(1, { message: "Zip code is required" }),
  tin: z.string().min(1, { message: "TIN is required" })
})

export const financialFormSchema = z.object({
  cashflow: z.string().array(),
  w2sFile: z
    .custom<File[]>()
    .refine((file) => file && ACCEPTED_FILE_TYPES.includes(file[0].type), {
      message: "Please choose PNG, JPG, PDF format files only"
    })
})

export const confirmationFormSchema = z.object({
  signature: z.string().min(1),
  name: z.string().min(6, { message: "Name must be at least 6 characters" }),
  signatureDate: z.string().min(1)
})

export type BusinessFormValue = z.infer<typeof businessFormSchema>

export type OwnerFormValue = z.infer<typeof ownerFormSchema>

export type FinancialFormValue = z.infer<typeof financialFormSchema>

export type ConfirmationFormValue = z.infer<typeof confirmationFormSchema>
