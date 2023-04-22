import { describe, it, vi } from "vitest"
import { findByTestId, render } from "@testing-library/react"
import Button from "./Button"

describe("Button Component", () => {
  it("renders button text correctly", async () => {
    const { findByText } = render(
      <Button
        variant="primary"
        onClick={vi.fn()}
      >
        Button
      </Button>
    )

    const btn = await findByText("Button")
    expect(btn.textContent).toEqual("Button")
  })

  it("renders loading state", async () => {
    const { container } = render(
      <Button
        variant="primary"
        onClick={vi.fn()}
        isLoading
      >
        Button
      </Button>
    )

    const spinner = await findByTestId(container, "loading-spinner")
    expect(spinner).toBeDefined()
  })
})
