import type { ComponentProps } from 'react'

import { cn } from '#/utils'

export type LoaderProps = ComponentProps<'span'>

export function Loader({ className, ...props }: LoaderProps) {
  return (
    <span
      {...props}
      className={cn('i-material-symbols-progress-activity-sharp shrink-0 animate-spin', className)}
    />
  )
}
