import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-full",
  {
    variants: {
      size: {
        sm: "h-8 w-8",
        default: "h-10 w-10",
        lg: "h-12 w-12",
        xl: "h-16 w-16",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string;
  fallback: string;
  status?: "online" | "offline";
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size, src, fallback, status, ...props }, ref) => {
    return (
      <div className="relative inline-block">
        <div ref={ref} className={cn(avatarVariants({ size }), className)} {...props}>
          {src ? (
            <img src={src} alt="Avatar" className="aspect-square h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
              <span className="text-sm font-medium">{fallback}</span>
            </div>
          )}
        </div>
        {status && (
          <span
            className={cn(
              "absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-background",
              status === "online" ? "bg-emerald-500" : "bg-muted"
            )}
          />
        )}
      </div>
    )
  }
)
Avatar.displayName = "Avatar"

export { Avatar }
