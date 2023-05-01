import type { MouseEventHandler } from "react"
import { RingSpinner } from "./Spinner"
import { twMerge } from "tailwind-merge"

interface BaseButtonProps {
  children: React.ReactNode
  className: string
  isLoading?: boolean
  fullWidth?: boolean
  styles?: React.CSSProperties
  onClick: MouseEventHandler<HTMLButtonElement>
}

function BaseButton({
  className,
  children,
  isLoading,
  fullWidth = false,
  styles,
  onClick,
  ...props
}: BaseButtonProps) {
  const baseStyles: React.CSSProperties = {
    width: fullWidth ? "100%" : "250px"
  }

  return (
    <button
      className={className}
      onClick={onClick}
      style={{
        ...baseStyles,
        ...styles
      }}
      {...props}
    >
      {isLoading ? <RingSpinner width="10px" /> : children}
    </button>
  )
}

interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  variant: "primary" | "secondary"
  children: React.ReactNode
  isLoading?: boolean
  fullWidth?: boolean
  styles?: React.CSSProperties
  onClick: MouseEventHandler<HTMLButtonElement>
}

const baseStyles =
  "inline-flex gap-1 items-center justify-center text-sm font-normal transition-colors disabled:opacity-50 disabled:pointer-events-none h-14 px-8 rounded-md"

const primaryStyles = "bg-primary text-primary-foreground hover:bg-primary/90"

const secondaryStyles =
  "hover:bg-accent hover:text-accent-foreground border-[1px] border-border"

export default function Button({
  variant,
  children,
  className,
  ...rest
}: ButtonProps) {
  if (variant === "primary") {
    return (
      <BaseButton
        className={twMerge(baseStyles, primaryStyles, className)}
        {...rest}
      >
        {children}
      </BaseButton>
    )
  }
  if (variant === "secondary") {
    return (
      <BaseButton
        className={twMerge(baseStyles, secondaryStyles, className)}
        {...rest}
      >
        {children}
      </BaseButton>
    )
  }
  return (
    <BaseButton
      className={twMerge(baseStyles, secondaryStyles, className)}
      {...rest}
    >
      {children}
    </BaseButton>
  )
}
