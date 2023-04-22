import { describe, it, vi } from "vitest"
import { findByTestId, render } from "@testing-library/react"
import Button from "./Button"

describe("Primary Button Component", () => {
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

describe("Secondary Button Component", () => {
  it("renders button text correctly", async () => {
    const { findByText } = render(
      <Button
        variant="secondary"
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
        variant="secondary"
        onClick={vi.fn()}
        isLoading
      >
        Button
      </Button>
    )

    const spinner = await findByTestId(container, "loading-spinner")
    expect(spinner).toBeDefined()
  })

  it("renders button text correctly when no variant passed in", async () => {
    const { findByText } = render(<Button onClick={vi.fn()}>Button</Button>)

    const btn = await findByText("Button")
    expect(btn.textContent).toEqual("Button")
  })

  it("renders loading state correctly when no variant passed in", async () => {
    const { container } = render(
      <Button
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
