import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-lg font-bold ring-offset-background transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-timelingo-purple focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 shadow-lg [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-br from-blue-500 via-blue-400 to-blue-300 text-white hover:from-blue-600 hover:via-blue-500 hover:to-blue-400 active:scale-95",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "bg-white border-2 border-timelingo-purple text-timelingo-purple shadow-md hover:bg-yellow-50 hover:border-yellow-400 hover:text-timelingo-navy active:scale-95",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "bg-transparent text-timelingo-purple hover:bg-purple-50 hover:text-timelingo-navy",
        link: "text-timelingo-purple underline-offset-4 hover:underline hover:text-timelingo-navy",
      },
      size: {
        default: "h-12 px-8 py-3 text-lg",
        sm: "h-10 rounded-full px-5 text-base",
        lg: "h-14 rounded-full px-10 text-xl",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
