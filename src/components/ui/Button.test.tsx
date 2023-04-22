import { describe, it, vi } from "vitest"
import { findByTestId, render, fireEvent, screen } from "@testing-library/react"
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

  it("calls the onclick function when button is pressed", () => {
    const button = {
      onClick: vi.fn()
    }

    const spy = vi.spyOn(button, "onClick")

    render(
      <Button
        variant="primary"
        onClick={button.onClick}
      >
        Button
      </Button>
    )

    fireEvent(
      screen.getByText(/button/i),
      new MouseEvent("click", { bubbles: true })
    )

    expect(spy).toHaveBeenCalledTimes(1)
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

  it("calls the onclick function when button is pressed", () => {
    const button = {
      onClick: vi.fn()
    }

    const spy = vi.spyOn(button, "onClick")

    render(
      <Button
        variant="primary"
        onClick={button.onClick}
      >
        Button
      </Button>
    )

    fireEvent(
      screen.getByText(/button/i),
      new MouseEvent("click", { bubbles: true })
    )

    expect(spy).toHaveBeenCalledTimes(1)
  })
})
