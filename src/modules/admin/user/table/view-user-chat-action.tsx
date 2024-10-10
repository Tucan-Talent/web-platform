import { Button } from "@/components/ui/button"
import { DropdownMenuLabel } from "@/components/ui/dropdown-menu"
import { APP_PATH } from "@/constants"
import { MessageCircleMore } from "lucide-react"
import { useNavigate } from "react-router-dom"

export const ViewUserChatAction = ({ userId }: { userId: string }) => {
  const navigate = useNavigate()

  const navigateToDetailPage = () => {
    navigate(APP_PATH.CHAT.sessionHistory(userId))
  }
  return (
    <DropdownMenuLabel>
      <Button
        type="submit"
        variant="ghost"
        id={userId}
        style={{
          padding: "0px"
        }}
        className="text-blue-900 p-2 space-x-2 flex flex-row w-full"
        onClick={navigateToDetailPage}
      >
        <MessageCircleMore className="w-5 h-5" />
        <span>View chat</span>
      </Button>
    </DropdownMenuLabel>
  )
}
