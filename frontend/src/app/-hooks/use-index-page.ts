import type { SubmitEventHandler } from 'react'

import { useGoogleReCaptcha } from '@google-recaptcha/react'
import { useI18n } from '@kanjou/react'
import { useEffect, useRef } from 'react'
import * as v from 'valibot'

import type { ResponseConfig } from '#/lib/api'
import type { TimeoutId } from '#/types'

import { usePostShorten } from '#/api'
import { validateAdapter } from '#/app/-utils/validate-adapter'
import { useCopy } from '#/hooks'
import { useField } from '#/hooks/use-field'

const UrlFieldSchema = v.pipe(
  v.string(),
  v.trim(),
  v.transform((input) => (/^https?:\/\//i.test(input) ? input : `https://${input}`)),
  v.url('validation.invalid-url'),
)

export function useShortenPage() {
  const { t } = useI18n()

  const googleReCaptcha = useGoogleReCaptcha()

  const { copy, copied: isCopied } = useCopy()

  const urlField = useField('', {
    validateOnBlur: true,
    validate: validateAdapter(UrlFieldSchema),
  })

  const shortenMutation = usePostShorten()

  const timeoutRef = useRef<TimeoutId | undefined>(undefined)

  const handleSubmit: SubmitEventHandler = async (event) => {
    event.preventDefault()

    if (isShortened) {
      urlField.setValue('')
      shortenMutation.reset()
      return
    }

    if (!url) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)

      urlField.ref.current!.placeholder = t('input.shorten.placeholder-alert')
      urlField.focus()

      timeoutRef.current = setTimeout(() => {
        urlField.ref.current!.placeholder = t('input.shorten.placeholder')
      }, 1500)

      return
    }

    try {
      const googleReCaptchaToken = await googleReCaptcha
        .executeV3?.('shorten')
        .catch(() => undefined)

      const shortenResponse = await shortenMutation.mutateAsync({
        data: {
          url: /^https?:\/\//i.test(url) ? url : `https://${url}`,
          googleReCaptcha: googleReCaptchaToken,
        },
      })

      urlField.setValue(shortenResponse.shortUrl)
      urlField.setError('')
    } catch (err) {
      const error = err as ResponseConfig

      if (error?.status === 429) return urlField.setError('error.ratelimit')
      if (error.status >= 300) return urlField.setError('error.server')
      urlField.setError('error.network')
    }
  }

  const handleCopy = () => {
    void copy(shortenMutation.data?.shortUrl ?? '')
  }

  const url = urlField.watch()
  const isShortened = url === shortenMutation.data?.shortUrl && shortenMutation.isSuccess

  useEffect(() => () => clearTimeout(timeoutRef.current), [])

  return {
    state: {
      url,
      isCopied,
      isShortened,
    },
    mutations: {
      shorten: shortenMutation,
    },
    functions: {
      handleCopy,
      handleSubmit,
    },
    features: {
      urlField,
    },
  }
}
