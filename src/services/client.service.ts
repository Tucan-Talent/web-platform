import { APP_CONFIGS } from "@/configs"
import { customRequestHeader } from "@/utils/request-header"
import axios, { AxiosRequestConfig, RawAxiosRequestHeaders } from "axios"
import applyCaseMiddleware from "axios-case-converter"
import { inMemoryJWTService } from "./jwt.service"

export const axiosClient = applyCaseMiddleware(
  axios.create({
    baseURL: APP_CONFIGS.API_BASE_URL,
    // https://github.com/axios/axios/issues/5058#issuecomment-1272107602
    // Example: Params { a: ['b', 'c']}
    // From (by default - false) 'a[]=b&a[]=c'
    // To (by null) 'a=b&a=c'
    paramsSerializer: {
      indexes: null // by default: false
    }
  }),
  {
    ignoreHeaders: true
  }
)

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        // If the request is unauthorized, get a new access token
        const newInfo = await inMemoryJWTService.getNewAccessToken()
        if (newInfo) {
          // If the access token is successfully refreshed, retry the request
          const originalRequest = error.config
          originalRequest.headers.Authorization = `Bearer ${newInfo.accessToken}`
          return axiosClient(originalRequest)
        }
      } catch (e) {
        // If the access token cannot be refreshed, redirect the user to the login page
        inMemoryJWTService.eraseToken()
      }
    }
    return Promise.reject(error)
  }
)

type GetParams<T> = {
  path: string
  config?: AxiosRequestConfig
  customHeader?: RawAxiosRequestHeaders
  applyMiddleWare?: boolean
  params?: T
}

export type PostParams<T> = GetParams<T> & {
  data?: T
}

export const getRequest = async <T, R>({
  path,
  config,
  customHeader,
  params
}: GetParams<T>) => {
  const token = inMemoryJWTService.getToken()
  const response = await axiosClient.get<R>(`/${path}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      ...customHeader,
      ...customRequestHeader.customHeaders
    },
    params,
    ...config
  })
  return response.data
}

export const postRequest = <T, R>({
  path,
  config,
  customHeader,
  data,
  params
}: PostParams<T>) => {
  const token = inMemoryJWTService.getToken()
  return axiosClient.post<R>(`/${path}`, data, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      ...customHeader,
      ...customRequestHeader.customHeaders
    },
    params,
    ...config
  })
}

export const putRequest = <T, R>({
  path,
  config,
  customHeader,
  data,
  params
}: PostParams<T>) => {
  const token = inMemoryJWTService.getToken()
  return axiosClient.put<R>(`/${path}`, data, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      ...customHeader,
      ...customRequestHeader.customHeaders
    },
    params,
    ...config
  })
}

export const patchRequest = <T, R>({
  path,
  config,
  customHeader,
  data,
  params
}: PostParams<T>) => {
  const token = inMemoryJWTService.getToken()
  return axiosClient.patch<R>(`/${path}`, data, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      ...customHeader,
      ...customRequestHeader.customHeaders
    },
    params,
    ...config
  })
}

export const delRequest = <T, R>({
  path,
  config,
  customHeader
}: GetParams<T>) => {
  const token = inMemoryJWTService.getToken()
  return axiosClient.delete<R>(`/${path}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      ...customHeader,
      ...customRequestHeader.customHeaders
    },
    ...config
  })
}
