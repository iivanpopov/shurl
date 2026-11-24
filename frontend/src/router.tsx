import { QueryClient } from '@tanstack/react-query'
import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'

import { client } from '#/api/client'

import { routeTree } from '../generated/routeTree.gen'

client.setConfig({
  baseURL: typeof window === 'undefined' ? Bun.env.BACKEND_URL : '',
})

export function getRouter() {
  const queryClient = new QueryClient()
  const router = createTanStackRouter({
    routeTree,
    context: { queryClient },
  })

  setupRouterSsrQueryIntegration({ router, queryClient })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
