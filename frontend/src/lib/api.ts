import type { Client, RequestConfig } from '@kubb/plugin-client/clients/fetch'

import kubbClient from '@kubb/plugin-client/clients/fetch'

const client: Client = async <TResponseData, TError = unknown, TRequestData = unknown>(
  config: RequestConfig<TRequestData>,
) => {
  const response = await kubbClient<TResponseData, TError, TRequestData>({
    baseURL: typeof window === 'undefined' ? Bun.env.BACKEND_URL : '',
    ...config,
    headers: config.headers,
  })

  if (response.status >= 400) throw response

  return response
}

export default client

export type {
  Client,
  RequestConfig,
  RequestCredentials,
  ResponseConfig,
  ResponseErrorConfig,
} from '@kubb/plugin-client/clients/fetch'
