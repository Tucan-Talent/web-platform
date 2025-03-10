import { ButtonLoading } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFormContext } from "react-hook-form"
import {
  ForgotPasswordFormValue,
  forgotPasswordFormSchema,
  useForgotPassword
} from "../hooks/useForgotPassword"
import { ForgotPasswordFormHeader } from "./forgot-password-form-header"
import { ResendForm } from "./forgot-password-resend-form"
import {
  ErrorCode,
  getAxiosError,
  getCustomErrorMsgByCode
} from "@/utils/custom-error"
import { AppAlert } from "@/components/ui/alert"

/**
 * Enter an email to get reset password email
 */
function ResetPasswordForm() {
  const { isPending, mutate, error } = useForgotPassword()

  const { handleSubmit, control, setValue, setError } =
    useFormContext<ForgotPasswordFormValue>()

  const formSubmit = handleSubmit((data) => {
    mutate(data, {
      onSuccess: () => setValue("successSentEmail", data.email),
      onError: (error) => {
        const axiosError = getAxiosError(error)

        if (axiosError.code !== ErrorCode.rate_limit_exceeded) {
          setError("email", {
            type: "server",
            message: axiosError.message
          })
        }
      }
    })
  })

  const isLimitError =
    getAxiosError(error).code === ErrorCode.rate_limit_exceeded

  const conditionAlert = isLimitError && (
    <AppAlert
      variant="error"
      title="Too many attempts"
      description={getCustomErrorMsgByCode(ErrorCode.rate_limit_exceeded)}
    />
  )

  return (
    <form onSubmit={formSubmit} className="space-y-6 w-full">
      <FormField
        control={control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="Enter your email"
                disabled={isPending}
                className="text-base"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="flex flex-col space-y-2">
        {conditionAlert}

        <ButtonLoading
          isLoading={isPending}
          className="ml-auto w-full text-base"
          type="submit"
        >
          Reset password
        </ButtonLoading>
      </div>
    </form>
  )
}

export function ForgotPasswordForm() {
  const form = useForm<ForgotPasswordFormValue>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: { email: "" },
    mode: "onSubmit"
  })

  const successSentEmail = form.watch("successSentEmail")

  return (
    <Form {...form}>
      <ForgotPasswordFormHeader />
      <div className="flex flex-col space-y-6">
        {successSentEmail ? <ResendForm /> : <ResetPasswordForm />}
      </div>
    </Form>
  )
}
