import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { useTenant } from "@/providers/tenant-provider"
import { useEffect, useMemo, useState } from "react"

import { cn } from "@/lib/utils"

import { Badge } from "@/components/ui/badge"
import { MiddeskTable } from "@/modules/loan-application-management/components/table/middesk-table"
import { TaskFieldStatus } from "@/modules/loan-application-management/constants/types/business.type"
import { getBadgeVariantByInsightStatus } from "@/modules/loan-application-management/services/insight.service"
import { type LoanApplicationBankAccount } from "@/modules/loan-application/constants/type"
import { LOAN_APPLICATION_STEPS } from "@/modules/loan-application/models/LoanApplicationStep/type"
import {
  useBRLoanApplicationDetailsContext,
  useLoanApplicationFormContext,
  useLoanApplicationProgressContext,
  usePlaidContext
} from "@/modules/loan-application/providers"
import { FORM_ACTION } from "@/modules/loan-application/providers/LoanApplicationFormProvider"
import { isReviewApplicationStep } from "@/modules/loan-application/services"
import { LoadingWrapper } from "@/shared/atoms/LoadingWrapper"
import { toastError } from "@/utils"
import { type ColumnDef } from "@tanstack/react-table"
import { useUpdateEffect } from "react-use"
import { FormSubmitButton } from "../../../atoms/FormSubmitButton"
import { FormLayout } from "@/modules/loan-application/components/layouts/FormLayout"
import { ConnectBankAccountsButton } from "../../../molecules/out-of-box/v2/ConnectBankAccountsButton"

const columns: ColumnDef<LoanApplicationBankAccount>[] = [
  {
    accessorKey: "institutionName",
    header: () => (
      <div className="flex items-center space-x-2 text-gray-700">
        Institution
      </div>
    )
  },
  {
    accessorKey: "bankAccountName",
    header: () => (
      <div className="flex items-center space-x-2 text-gray-700">Account</div>
    )
  },
  {
    accessorKey: "connectedOn",
    header: () => (
      <div className="flex items-center space-x-2 text-gray-700">
        Connected on
      </div>
    )
  },
  {
    id: "status",
    header: () => (
      <div className="flex items-center space-x-2 text-gray-700">Status</div>
    ),
    cell: () => {
      return (
        <div className="min-w-0">
          <Badge
            border
            isDot
            className="rounded-lg text-sm font-medium capitalize"
            isDotBefore={false}
            variant="soft"
            variantColor={getBadgeVariantByInsightStatus(
              TaskFieldStatus.SUCCESS
            )}
          >
            Connected
          </Badge>
        </div>
      )
    }
  }
]

interface CashFlowVerificationFormV2Props {
  wrapperClassName?: string
}

export function CashFlowVerificationFormV2({
  wrapperClassName
}: CashFlowVerificationFormV2Props) {
  const { finishCurrentStep, completeSpecificStep, step } =
    useLoanApplicationProgressContext()

  const { financialInformationForm, dispatchFormAction } =
    useLoanApplicationFormContext()

  const { tenantData } = useTenant()

  const { connectedAccounts, linkTokenError, isConnecting } = usePlaidContext()

  const { isFetchingDetails } = useBRLoanApplicationDetailsContext()

  const [isConfirmedConnect, setIsConfirmedConnect] = useState(false)

  const canConnect = useMemo(() => {
    return !!connectedAccounts.length || isConfirmedConnect
  }, [isConfirmedConnect, connectedAccounts.length])

  const handleNextClick = () => {
    finishCurrentStep()
  }

  useEffect(() => {
    if (connectedAccounts.length > 0) {
      completeSpecificStep(LOAN_APPLICATION_STEPS.CASH_FLOW_VERIFICATION)
      // TODO: remove financial form submission when form configuration is ready
      dispatchFormAction({
        action: FORM_ACTION.SET_DATA,
        key: LOAN_APPLICATION_STEPS.CASH_FLOW_VERIFICATION,
        state: {
          id: financialInformationForm?.id ?? "",
          incomeCategories: [],
          w2sFile: []
        }
      })
    }
  }, [
    completeSpecificStep,
    connectedAccounts,
    dispatchFormAction,
    financialInformationForm?.id
  ])

  useUpdateEffect(() => {
    if (linkTokenError.errorMessage) {
      toastError({
        title: "Connect Bank Account Error",
        description: linkTokenError.errorMessage
      })
    }
  }, [linkTokenError])

  return (
    <>
      <FormLayout
        cardClassName={wrapperClassName}
        title="Cash Flow Verification"
      >
        <h5 className="text-lg font-semibold">Cash Flow Verification</h5>
        <Separator />
        <div className="flex flex-col gap-x-4xl gap-y-2xl">
          <div className="flex flex-col gap-y-sm">
            <p className="financial-projection text-sm text-muted-foreground">
              Connect your bank accounts securely. This step helps us understand
              your business financial health through cash flow data and expedite
              the loan approval process. Learn how it works{" "}
              <a
                className="text-black underline"
                href="https://plaid.com/legal/#consumers"
                rel="noopener noreferrer"
                target="_blank"
              >
                here
              </a>
              .
            </p>
          </div>
          <div className="flex flex-col gap-lg">
            <div className="mt-1 flex gap-2">
              <Checkbox
                checked={canConnect}
                className="size-5"
                disabled={!!connectedAccounts.length}
                onCheckedChange={(value: boolean) => {
                  setIsConfirmedConnect(value)
                }}
              />
              <p className="text-sm text-gray-700">
                <b>I understand</b> that, by connecting my accounts, I authorize
                Plaid to share my business transaction history with{" "}
                {tenantData?.name ?? ""} for the purpose of evaluating my loan
                application.
              </p>
            </div>
          </div>
        </div>
      </FormLayout>
      {!!connectedAccounts.length || isConfirmedConnect ? (
        <FormLayout
          hideTopNavigation
          cardClassName={cn(wrapperClassName, "mt-6")}
        >
          <div className="flex flex-col justify-between gap-2 lg:flex-row lg:items-center">
            <div>
              <h5 className="text-lg font-semibold">Connected Accounts</h5>
            </div>

            <ConnectBankAccountsButton
              disabled={!canConnect || isFetchingDetails}
              hasConnectedAccounts={!!connectedAccounts.length}
              isBankAccountsLoading={isConnecting || isFetchingDetails}
            />
          </div>

          <Separator />

          <div className="flex flex-col items-center gap-x-4xl gap-y-1 p-0">
            {connectedAccounts.length <= 0 && (
              <>
                <p className=" text-sm text-text-secondary">No Account Found</p>
                <p className=" mb-5 text-sm text-text-secondary">
                  Click the “Connect” button to continue
                </p>
                <Separator />
              </>
            )}

            {!!connectedAccounts.length && (
              <div className="flex w-full flex-col">
                <LoadingWrapper isLoading={isFetchingDetails}>
                  <Card className="border-none shadow-none">
                    <CardContent className="p-0 md:p-0">
                      <MiddeskTable
                        cellClassName="py-6"
                        columns={columns}
                        data={connectedAccounts}
                        noResultText="No connected accounts found"
                        tableClassName="text-gray-700 font-sm"
                      />
                    </CardContent>
                  </Card>

                  <Separator />

                  {!isReviewApplicationStep(step) && (
                    <FormSubmitButton
                      className="mt-5 w-full"
                      isDisabled={!connectedAccounts.length}
                      onSubmit={handleNextClick}
                    />
                  )}
                </LoadingWrapper>
              </div>
            )}
          </div>
        </FormLayout>
      ) : null}
    </>
  )
}
