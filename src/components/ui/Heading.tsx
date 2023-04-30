import React, { type FC } from "react"
import { twMerge } from "tailwind-merge"

interface HeadingProps
  extends React.ComponentPropsWithoutRef<
    "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  > {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  size?: "lg" | "md" | "sm"
  variant?: "default" | "muted"
  className?: string
}

const Heading: FC<HeadingProps> = ({
  as = "h1",
  size = "lg",
  children,
  variant = "default",
  className
}) => {
  const sizeStyles: Record<"sm" | "md" | "lg", string> = {
    lg: "text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1]",
    md: "text-lg text-muted-foreground md:text-xl lg:text-xl",
    sm: "text-md text-muted-foreground"
  }

  const variantStyles: Record<"default" | "muted", string> = {
    default: "",
    muted: "text-muted"
  }

  if (as === "h1") {
    return (
      <h1
        className={twMerge(sizeStyles[size], variantStyles[variant], className)}
      >
        {children}
      </h1>
    )
  } else if (as === "h2") {
    return (
      <h1
        className={twMerge(sizeStyles[size], variantStyles[variant], className)}
      >
        {children}
      </h1>
    )
  }
  return <h1>{children}</h1>
}

export default Heading
