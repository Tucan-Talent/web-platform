import { Button, ButtonLoading } from "@/components/ui/button.tsx"
import { DataTable } from "@/components/ui/data-table.tsx"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog.tsx"
import { Form } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Separator } from "@/components/ui/separator"
import { TOAST_MSG } from "@/constants/toastMsg.ts"
import { useQueryGetListAllInstitution } from "@/modules/admin/user/hooks/useQuery/useQueryGetListAllInstitution.ts"
import { useQueryGetUsersByIds } from "@/modules/admin/user/hooks/useQuery/useQueryGetUsersByIds.ts"
import { useQueryGetListUsersByInstitution } from "@/modules/admin/user/hooks/useQuery/useQueryGetListUsersByInstitution.ts"
import { useQueryWhitelistUsersByFeatureFlagId } from "@/modules/admin/user/hooks/useQuery/useQueryGetListWhitelistUsersByFeatureFlagId.ts"
import { AutoCompleteInstitution } from "@/modules/feature-flag/components/AutoCompleteInstitution.tsx"
import { AutoCompleteUserEmail } from "@/modules/feature-flag/components/AutoCompleteUserEmail.tsx"
import {
  WhitelistFormValue,
  whitelistFormSchema
} from "@/modules/feature-flag/constants/form.ts"
import { useUpdateWhitelistUser } from "@/modules/feature-flag/hooks/useMutation/useUpdateWhitelistUser.ts"
import { columns } from "@/modules/feature-flag/table/columns.tsx"
import { Option } from "@/types/common.type.ts"
import { FeatureFlag } from "@/types/feature-flag.types.ts"
import { UserDetailInfo } from "@/types/user.type.ts"
import { toastError } from "@/utils"
import { checkIsForesightAdmin } from "@/utils/check-roles.ts"
import { zodResolver } from "@hookform/resolvers/zod"
import debounce from "lodash.debounce"
import { PlusCircle, Search, Send } from "lucide-react"
import React, { useCallback, useMemo, useState } from "react"
import { useForm } from "react-hook-form"

type Props = {
  featureFlag: FeatureFlag
}
/**
 * Logic flow:
 * - Add new user to 'pendingUsers' state
 * - Add remove user to 'pendingRemoveUsers' state
 * - When submit the final Users should be = serverUsers + pendingUsers - pendingRemoveUsers
 */
export const DialogModifyWhitelistUsers: React.FC<Props> = ({
  featureFlag
}) => {
  const isForesightAdmin = checkIsForesightAdmin()
  const [open, setOpen] = useState(false)

  const form = useForm<WhitelistFormValue>({
    resolver: zodResolver(whitelistFormSchema),
    defaultValues: {
      institution: { value: "", label: "" },
      user: { value: "", label: "" }
    }
  })
  const customOnChangeInstitution = () => {
    form.setValue("user", { label: "", value: "" })
  }

  // All institutions for select
  const listInstitutionQuery = useQueryGetListAllInstitution({
    enabled: isForesightAdmin
  })
  const institutionOptions: Option[] =
    listInstitutionQuery.data?.map((institution) => ({
      label: institution.name,
      value: institution.id
    })) ?? []

  // All users in selected institution for select
  const { data: usersByInstitution } = useQueryGetListUsersByInstitution({
    institutionId: form.watch("institution.value")
  })
  const usersByInstitutionOptions: Option[] =
    usersByInstitution?.users.map((user) => ({
      label: user.email,
      value: user.id
    })) ?? []

  // Added users but haven't submitted yet
  const [pendingUsers, setPendingUsers] = useState<string[]>([])
  // Removed users but haven't submitted yet
  const [pendingRemoveUsers, setPendingRemoveUsers] = useState<string[]>([])

  // All Users in the feature flag whitelist but the API is only return userId
  const { data: userIds } = useQueryWhitelistUsersByFeatureFlagId(
    featureFlag.id
  )
  // Get details of users by their Ids (used for displaying in the table)
  const { data: fullUsersInFeatureFlagWhitelist, isFetching } =
    useQueryGetUsersByIds(userIds?.map((user) => user.userId) ?? [])
  // Get details for pendingUsers because the select data doesn't enough
  const {
    data: pendingAddUsersDetail,
    isFetching: isFetchingPendingAddUsersDetail
  } = useQueryGetUsersByIds(pendingUsers)

  const isDuplicateWhitelistUser = (addedUser: WhitelistFormValue) => {
    const isServerDataDuplicate = fullUsersInFeatureFlagWhitelist?.users?.some(
      (whitelistUser) =>
        addedUser.user.value === whitelistUser.id &&
        addedUser.institution.value === whitelistUser.institutionId
    )

    const isPendingDataDuplicate = pendingUsers.includes(addedUser.user.value)

    if (isPendingDataDuplicate || isServerDataDuplicate) {
      toastError({
        ...TOAST_MSG.whitelistUser.updateDuplicatedUser
      })
      return true
    }

    return false
  }

  const handleAddPendingUser = form.handleSubmit((addedUser) => {
    if (pendingRemoveUsers.includes(addedUser.user.value)) {
      setPendingRemoveUsers((preState) =>
        preState.filter(
          (pendingRemoveUser) => pendingRemoveUser !== addedUser.user.value
        )
      )
      return
    }

    if (isDuplicateWhitelistUser(addedUser)) return
    setPendingUsers((preState) => [...preState, addedUser.user.value])
    form.setValue("user", { value: "", label: "" })
  })

  const handleRemoveUserFromWhitelist = (userId: string) => {
    setPendingRemoveUsers((preState) => [...preState, userId])
  }

  const { mutate: mutateWhitelistUser, isPending } = useUpdateWhitelistUser()
  const handleUpdatePendingUsers = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    mutateWhitelistUser(
      {
        whitelist: whitelistUsers.map((user) => user.id),
        featureFlagId: featureFlag.id
      },
      {
        onSuccess() {
          onOpenChange(false)
        }
      }
    )
  }

  const [searchQuery, setSearchQuery] = useState("")
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearchChange = useCallback(
    debounce((value: string) => {
      setSearchQuery(value)
    }, 300),
    []
  )

  const onOpenChange = (open: boolean) => {
    if (!open) {
      form.reset()
      setPendingUsers([])
      setPendingRemoveUsers([])
      setSearchQuery("")
    }
    setOpen(open)
  }

  // TODO: Refactor API to return institutionName
  const whitelistUsers = useMemo(
    () =>
      [
        ...(fullUsersInFeatureFlagWhitelist?.users ?? []),
        ...(pendingAddUsersDetail?.users ?? [])
      ]
        .map((user: UserDetailInfo) => ({
          ...user,
          institutionName:
            listInstitutionQuery.data?.find(
              (institution) => institution.id === user.institutionId
            )?.name ?? "Unknown",
          handleRemoveUserFromWhitelist
        }))
        .filter((user) => !pendingRemoveUsers.includes(user.id)),
    [
      fullUsersInFeatureFlagWhitelist?.users,
      listInstitutionQuery.data,
      pendingAddUsersDetail?.users,
      pendingRemoveUsers
    ]
  )

  const whitelistUsersFilterBySearch = whitelistUsers.filter((user) =>
    user.institutionName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger
        asChild
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setOpen(true)
        }}
      >
        <Button type="button" className="z-10">
          <PlusCircle size={16} className="text-sm mr-1.5" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[90%] h-[90%] p-0 overflow-hidden flex flex-col">
        <DialogHeader className="p-4 sm:p-6 pb-0 sm:pb-0">
          <DialogTitle>Whitelist Users</DialogTitle>
          <DialogDescription>Make changes to whitelist users</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={handleUpdatePendingUsers}
            className="flex flex-col flex-1 overflow-hidden p-4 sm:p-6 pt-0 sm:pt-0"
          >
            <div className="flex flex-col lg:flex-row space-y-3 lg:space-y-0 lg:space-x-3 items-start">
              <div className="flex lg:flex-row gap-3 w-full">
                <AutoCompleteInstitution
                  options={institutionOptions}
                  label="Institution"
                  emptyText="No results found"
                  name="institution"
                  control={form.control}
                  value={form.watch("institution")}
                  className="w-full lg:w-1/2"
                  customOnChange={customOnChangeInstitution}
                  error={
                    form.formState.errors.institution?.label?.message ??
                    form.formState.errors.institution?.value?.message
                  }
                />
                <AutoCompleteUserEmail
                  options={usersByInstitutionOptions}
                  label="User"
                  emptyText="No results found"
                  name="user"
                  control={form.control}
                  value={form.watch("user")}
                  className="w-full lg:w-1/2"
                  error={
                    form.formState.errors.user?.label?.message ??
                    form.formState.errors.user?.value?.message
                  }
                />
              </div>
              <div className="self-end lg:self-start">
                <Button
                  onClick={handleAddPendingUser}
                  type="button"
                  className="lg:mt-8"
                >
                  Add to Whitelist
                </Button>
              </div>
            </div>
            <Separator className="mt-4 -mx-8 w-[200%]" />
            <div className="mt-4">
              <Input
                prefixIcon={<Search className="h-5 w-5 opacity-50" />}
                placeholder="Search by Institution"
                className="pl-9 md:w-[300px] -mb-2"
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
            <DataTable
              tableContainerClassName="flex flex-col flex-1 overflow-auto"
              columns={columns.map((column) => ({
                ...column,
                handleRemoveUserFromWhitelist
              }))}
              data={whitelistUsersFilterBySearch ?? []}
              total={whitelistUsersFilterBySearch.length ?? 0}
              isLoading={isFetching ?? isFetchingPendingAddUsersDetail}
            />
            <DialogFooter className="mt-4">
              <ButtonLoading
                type="submit"
                isLoading={isPending}
                // Only able to submit if we have changes
                disabled={!pendingUsers.length && !pendingRemoveUsers.length}
              >
                Submit {!isPending && <Send className="ml-1.5" size="16" />}
              </ButtonLoading>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
