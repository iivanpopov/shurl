import type { SubmitEventHandler } from 'react'

import { useGoogleReCaptcha } from '@google-recaptcha/react'
import { useEffect, useRef, useState } from 'react'
import * as v from 'valibot'

import type { TimeoutId } from '#/types'

import { usePostShorten } from '#/api'
import { isResponseError } from '#/api/client'
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
  const [isPlaceholderAlert, setIsPlaceholderAlert] = useState(false)

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

      setIsPlaceholderAlert(true)
      urlField.focus()

      timeoutRef.current = setTimeout(() => {
        setIsPlaceholderAlert(false)
      }, 1500)

      return
    }

    try {
      const googleReCaptchaToken = await googleReCaptcha
        .executeV3?.('shorten')
        .catch(() => undefined)

      const shortenResponse = await shortenMutation.mutateAsync({
        body: {
          url: /^https?:\/\//i.test(url) ? url : `https://${url}`,
          googleReCaptcha: googleReCaptchaToken,
        },
      })

      urlField.setValue(shortenResponse.shortUrl)
      urlField.setError('')
    } catch (error) {
      if (isResponseError(error)) {
        if (error.status === 429) return urlField.setError('error.ratelimit')
        if (error.status >= 300) return urlField.setError('error.server')
      }
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
      isPlaceholderAlert,
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
