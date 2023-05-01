import type { FC } from "react"
import React from "react"

const Footer: FC = ({}) => {
  return (
    <div className="flex h-16 w-full items-center justify-center border-t border-border p-2 text-center text-muted-foreground md:px-0">
      <p>
        Built by{" "}
        <span className="font-medium underline">
          <a
            href="https://twitter.com/abdulshabbirdev"
            target="_blank"
            rel="noreferrer"
          >
            Abdul Shabbir
          </a>
        </span>{" "}
        Source code available on{" "}
        <span className="font-medium underline">
          <a
            target="_blank"
            href="https://github.com/abdulqshabbir"
            rel="noreferrer"
          >
            Github
          </a>
        </span>
      </p>
    </div>
  )
}

export default Footer
