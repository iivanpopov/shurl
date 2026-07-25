import { cva } from 'class-variance-authority'

export const typographyVariants = cva('font-mono', {
  variants: {
    variant: {
      caption: 'text-base tracking-wider font-medium',
    },
  },
})
