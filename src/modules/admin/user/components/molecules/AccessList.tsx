import { useState } from "react"
import { DeleteUserButton } from "./DeleteUserButton"
import { UserDetailInfo } from "@/types/user.type"
import { nameByRole } from "../../constants/roles.constants"

interface AccessListProps {
  userInfos: UserDetailInfo[]
}
export function AccessList({ userInfos }: AccessListProps) {
  const [users, setUsers] = useState<UserDetailInfo[]>(userInfos)

  const removeUser = (userId: string) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId))
  }

  return (
    <div className="mt-1">
      <div>
        <div className="flex justify-between w-full mt-2">
          <p className="font-medium">People with access</p>
          <p className="font-medium mr-5 invisible md:visible">Role</p>
        </div>
        <hr className="mt-2" />
      </div>
      <div className="mt-2 max-h-80 overflow-y-auto bg-white p-2">
        {users.map((user, index) => {
          const userFirstRole = user.roles[0]
          return (
            <div
              key={user.id}
              className="flex items-center justify-between bg-white p-2 max-w-[300px] md:max-w-full"
            >
              <div className="flex items-center w-full md:w-2/3">
                <DeleteUserButton
                  userId={user.id}
                  userName={user.name}
                  index={index}
                  disabled={
                    user.roles.length == 1 &&
                    nameByRole(userFirstRole) === "Applicant"
                  }
                  onRemove={() => removeUser(user.id)}
                />
                <img
                  src={
                    user.avatar ??
                    "https://cdn-icons-png.flaticon.com/128/64/64572.png"
                  }
                  alt={user.name}
                  className="w-10 h-10 rounded-full mx-3"
                />
                <div className="w-full">
                  <p className="font-normal text-base text-gray-800">
                    {user.name}
                  </p>
                  <p className="text-sm text-gray-700 md:hidden">
                    {nameByRole(userFirstRole)}
                  </p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <div className="md:w-1/3 text-right invisible md:visible">
                <span className="font-normal text-sm">
                  {nameByRole(userFirstRole)}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
