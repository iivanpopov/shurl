import { cva } from 'class-variance-authority'

export const inputVariants = cva('text-brand outline-none', {
  variants: {
    variant: {
      ghost:
        'text-brand outline-transparent outline outline-none bg-transparent bg-transparent bg-transparent relative placeholder:text-muted',
    },
    size: {
      lg: 'text-4xl tracking-tight pb-1',
    },
  },
  defaultVariants: {
    variant: 'ghost',
    size: 'lg',
  },
})
