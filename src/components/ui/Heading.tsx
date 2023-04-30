import React, { type FC } from "react"

interface HeadingProps extends React.ComponentPropsWithoutRef<"h1"> {
  variant?: "h1"
}

const Heading: FC<HeadingProps> = ({ variant, children }) => {
  if (variant === "h1") {
    return (
      <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1]">
        {children}
      </h1>
    )
  }
  return <h1>{children}</h1>
}

export default Heading
