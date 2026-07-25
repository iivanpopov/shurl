import type { UserConfig } from '@kubb/core'

import { pluginClient } from '@kubb/plugin-client'
import { pluginOas } from '@kubb/plugin-oas'
import { pluginReactQuery } from '@kubb/plugin-react-query'
import { pluginTs } from '@kubb/plugin-ts'

const name = (name: string) => name.replace(/api/gi, '')

export default {
  input: { path: './openapi.json' },
  output: {
    path: './generated/api',
    clean: true,
    format: false,
  },
  plugins: [
    pluginOas(),
    pluginTs(),
    pluginClient({
      importPath: '#/lib/api',
      transformers: { name },
    }),
    pluginReactQuery({
      client: { importPath: '#/lib/api' },
      transformers: { name },
    }),
  ],
} satisfies UserConfig
