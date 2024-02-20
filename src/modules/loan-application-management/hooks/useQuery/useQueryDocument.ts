import { ListResponse, PaginateParams } from "@/types/common.type"
import { LoanDocument } from "@/types/loan-document.type"
import { API_PATH } from "@/constants"
import { loanApplicationDocumentKeys } from "@/constants/query-key"
import { getRequest } from "@/services/client.service"
import { customRequestHeader } from "@/utils/request-header"
import { useInfiniteQuery } from "@tanstack/react-query"
import { createSearchParams, useParams } from "react-router-dom"

type ListLoanApplicationResponse = ListResponse<LoanDocument>

type UseQueryDocumentParams = PaginateParams & {
  keyword: string
}

export const useQueryDocument = ({
  keyword,
  limit,
  offset
}: UseQueryDocumentParams) => {
  const params = useParams()

  return useInfiniteQuery<ListLoanApplicationResponse>({
    queryKey: loanApplicationDocumentKeys.list(
      createSearchParams({
        keyword,
        limit: limit.toString(),
        offset: offset.toString()
      }).toString()
    ),
    queryFn: async ({ pageParam = 0 }) => {
      const response = await getRequest<
        UseQueryDocumentParams,
        ListLoanApplicationResponse
      >({
        path: API_PATH.loanApplication.getDocuments(params.id ?? ""),
        params: { keyword, limit, offset: (pageParam as number) * limit },
        customHeader: customRequestHeader.customHeaders
      })
      return {
        ...response
      }
    },
    initialPageParam: 0,
    getNextPageParam(last, pages) {
      return last.total < limit ? undefined : pages.length
    }
  })
}
