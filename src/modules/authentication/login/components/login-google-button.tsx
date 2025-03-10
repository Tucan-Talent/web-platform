import { ButtonLoading } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { useLoginWithGoogle } from "@/hooks/login-with-social/useLoginWithGoogle"
import { googleAuth } from "@/lib/firebase"

export function LoginGoogleButton() {
  const IconGoogle = Icons["google"]
  const { signInWithGoogle, isLoading } = useLoginWithGoogle()

  if (!googleAuth) return ""

  return (
    <ButtonLoading
      isLoading={isLoading}
      className="w-full text-base"
      variant="outline"
      type="button"
      onClick={signInWithGoogle}
    >
      <IconGoogle className="mr-2 h-4 w-4" />
      Sign in with Google
    </ButtonLoading>
  )
}
