import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-ring aria-invalid:border-destructive transition-colors duration-200 overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a&]:hover:bg-blue-600",
        secondary:
          "bg-secondary text-secondary-foreground [a&]:hover:bg-emerald-600",
        destructive:
          "bg-destructive text-white [a&]:hover:bg-red-600 focus-visible:ring-destructive",
        outline:
          "border-2 border-border text-foreground [a&]:hover:bg-muted [a&]:hover:text-foreground",
        ghost: "[a&]:hover:bg-muted [a&]:hover:text-foreground",
        link: "text-primary underline-offset-4 [a&]:hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
