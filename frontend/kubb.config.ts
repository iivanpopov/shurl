import { pluginFetch } from '@kubb/plugin-fetch'
import { pluginReactQuery } from '@kubb/plugin-react-query'
import { pluginTs } from '@kubb/plugin-ts'
import { defineConfig } from 'kubb'

const stripApi = (name: string) => name.replace(/api/gi, '')

export default defineConfig({
  input: './openapi.json',
  output: {
    path: './generated/api',
    clean: true,
    format: false,
    barrel: { type: 'named' },
  },
  plugins: [
    pluginTs(),
    pluginFetch({
      resolver: {
        name(name) {
          return this.default.name(stripApi(name))
        },
      },
    }),
    pluginReactQuery({
      hooks: true,
      resolver: {
        name(name) {
          return this.default.name(stripApi(name))
        },
      },
    }),
  ],
})
