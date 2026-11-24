import { useTranslate } from '@kanjou/react'
import { createFileRoute } from '@tanstack/react-router'

import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Loader } from '#/components/ui/loader'
import { Typography } from '#/components/ui/typography'

import { useShortenPage } from './-hooks'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { state, mutations, functions, features } = useShortenPage()

  const t = useTranslate()

  return (
    <form className="mx-auto pt-48 flex flex-col w-180" onSubmit={functions.handleSubmit}>
      <div className="gap-4 grid grid-cols-[1fr_auto]">
        <Input
          {...features.urlField.register()}
          disabled={mutations.shorten.isPending}
          placeholder={
            state.isPlaceholderAlert
              ? t('input.shorten.placeholder-alert')
              : t('input.shorten.placeholder')
          }
        />
        <Button
          size="icon-lg"
          className="group rounded-none grid place-items-center aria-[hidden=true]:rounded-md data-[hidden=true]:opacity-0 *:col-start-1 *:row-start-1 aria-[hidden=true]:scale-0 *:transition *:duration-150 *:ease-out"
          title={t('button.copy-shortened.title')}
          onClick={functions.handleCopy}
          tabIndex={state.isShortened ? 0 : -1}
          data-copied={state.isCopied}
          aria-hidden={!state.isShortened}
          aria-label={t('button.copy-shortened.aria-label')}
        >
          <span
            className="i-material-symbols-content-copy-outline-sharp text-brand group-data-[copied=true]:opacity-0 group-data-[copied=true]:scale-50"
            aria-hidden
          />
          <span
            className="i-material-symbols-check text-success opacity-0 scale-50 group-data-[copied=true]:opacity-100 group-data-[copied=true]:scale-100"
            aria-hidden
          />
        </Button>
      </div>

      <Typography variant="caption" className="text-error mt-2 h-6 inline-block">
        {state.url && features.urlField.error && t.unsafe(features.urlField.error)}
      </Typography>

      <Button className="mt-32 w-48 self-end" disabled={mutations.shorten.isPending} type="submit">
        {!mutations.shorten.isPending && state.isShortened && t('button.clear')}
        {!mutations.shorten.isPending && !state.isShortened && t('button.shorten')}
        {mutations.shorten.isPending && <Loader />}
      </Button>

      <Typography variant="caption" className="text-sm text-muted mt-2 self-end">
        {t('recaptcha')}
      </Typography>
    </form>
  )
}
