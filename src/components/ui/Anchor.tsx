import { twMerge } from "tailwind-merge"
import { RingSpinner } from "./Spinner"

interface BaseAnchorProps extends React.ComponentPropsWithoutRef<"a"> {
  children: React.ReactNode
  className: string
  isLoading?: boolean
  fullWidth?: boolean
  styles?: React.CSSProperties
}

function BaseAnchor({
  className,
  children,
  isLoading,
  fullWidth = false,
  styles,
  href,
  ...props
}: BaseAnchorProps) {
  const baseStyles: React.CSSProperties = {
    width: fullWidth ? "100%" : "250px"
  }

  return (
    <a
      className={className}
      href={href}
      style={{
        ...baseStyles,
        ...styles
      }}
      {...props}
    >
      {isLoading ? <RingSpinner width="10px" /> : children}
    </a>
  )
}

interface AnchorProps extends React.ComponentPropsWithoutRef<"a"> {
  variant: "primary" | "secondary"
  children: React.ReactNode
  isLoading?: boolean
  fullWidth?: boolean
  styles?: React.CSSProperties
}

const baseStyles =
  "inline-flex gap-1 items-center justify-center text-sm font-normal transition-colors disabled:opacity-50 disabled:pointer-events-none h-14 px-8 rounded-md"

const primaryStyles = "bg-primary text-primary-foreground hover:bg-primary/90"

const secondaryStyles =
  "hover:bg-accent hover:text-accent-foreground border-[1px] border-border"

export default function Anchor({ variant, children, ...rest }: AnchorProps) {
  if (variant === "primary") {
    return (
      <BaseAnchor
        className={twMerge(baseStyles, primaryStyles)}
        {...rest}
      >
        {children}
      </BaseAnchor>
    )
  }
  if (variant === "secondary") {
    return (
      <BaseAnchor
        className={twMerge(baseStyles, secondaryStyles)}
        {...rest}
      >
        {children}
      </BaseAnchor>
    )
  }
  return (
    <BaseAnchor
      className={twMerge(baseStyles, secondaryStyles)}
      {...rest}
    >
      {children}
    </BaseAnchor>
  )
}
