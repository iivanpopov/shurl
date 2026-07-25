import { cva } from 'class-variance-authority'

export const buttonVariants = cva(
  'flex gap-1.5 cursor-pointer uppercase items-center justify-center',
  {
    variants: {
      variant: {
        contained:
          'text-brand outline-2 outline-transparent outline-offset-2 bg-surface transition-all focus-visible:outline-brand/70 disabled:opacity-80 disabled:cursor-default hover:enabled:bg-surface/80',
      },
      size: {
        'lg': 'text-2xl tracking-tight font-medium px-12 flex h-12 items-center justify-center',
        'icon-lg':
          'text-2xl font-medium flex shrink-0 size-12 items-center justify-center *:text-2xl',
      },
    },
    defaultVariants: { variant: 'contained', size: 'lg' },
  },
)
