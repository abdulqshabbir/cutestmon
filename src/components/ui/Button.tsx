import type { MouseEventHandler } from "react"
import DefaultSpinner from "./Spinner"

interface BaseButtonProps {
  children: React.ReactNode
  className: string
  isLoading?: boolean
  fullWidth?: boolean
  styles?: React.CSSProperties
}

function BaseButton({
  className,
  children,
  isLoading,
  fullWidth = false,
  styles,
  ...props
}: BaseButtonProps) {
  const baseStyles: React.CSSProperties = {
    width: fullWidth ? "100%" : "200px"
  }
  return (
    <button
      className={className}
      style={{
        ...baseStyles,
        ...styles
      }}
      {...props}
    >
      {isLoading ? <DefaultSpinner width="10px" /> : children}
    </button>
  )
}

interface ButtonProps {
  variant: "primary" | "secondary"
  children: React.ReactNode
  isLoading?: boolean
  fullWidth?: boolean
  styles?: React.CSSProperties
  onClick?: MouseEventHandler<HTMLButtonElement>
}

const primaryStyles =
  "flex items-center justify-center gap-2 rounded-lg border-[0.5px] border-gray-700 py-4 px-8 text-gray-600 transition-all hover:scale-105"

const secondaryStyles =
  "flex items-center justify-center gap-2 rounded-lg border-[0.5px] border-gray-700 py-4 px-8 text-gray-600 transition-all hover:scale-105"

export default function Button({
  variant,
  children,
  styles,
  ...rest
}: ButtonProps) {
  if (variant === "primary") {
    return (
      <BaseButton
        className={primaryStyles}
        styles={styles}
        {...rest}
      >
        {children}
      </BaseButton>
    )
  }
  if (variant === "secondary") {
    return (
      <BaseButton
        className={secondaryStyles}
        styles={styles}
        {...rest}
      >
        {children}
      </BaseButton>
    )
  }
  return null
}
