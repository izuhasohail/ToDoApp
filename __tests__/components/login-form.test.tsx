"use client"

import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { LoginForm } from "@/components/auth/login-form"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

// Mock next-auth
jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
}))

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}))

describe("LoginForm", () => {
  beforeEach(() => {
    jest.clearAllMocks()

    // Setup router mock
    const mockRouter = {
      refresh: jest.fn(),
      push: jest.fn(),
    }
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)

    // Setup signIn mock
    ;(signIn as jest.Mock).mockResolvedValue({
      ok: true,
      error: null,
    })
  })

  it("renders the login form correctly", () => {
    render(<LoginForm />)

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /google/i })).toBeInTheDocument()
  })

  it("submits the form with credentials", async () => {
    render(<LoginForm />)

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole("button", { name: /sign in/i })

    fireEvent.change(emailInput, { target: { value: "test@example.com" } })
    fireEvent.change(passwordInput, { target: { value: "password123" } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith("credentials", {
        email: "test@example.com",
        password: "password123",
        redirect: false,
      })
    })

    const router = useRouter()
    expect(router.push).toHaveBeenCalledWith("/dashboard")
  })

  it("shows validation errors for invalid inputs", async () => {
    render(<LoginForm />)

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole("button", { name: /sign in/i })

    fireEvent.change(emailInput, { target: { value: "invalid-email" } })
    fireEvent.change(passwordInput, { target: { value: "short" } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
      expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument()
    })
  })

  it("handles sign in with Google", async () => {
    render(<LoginForm />)

    const googleButton = screen.getByRole("button", { name: /google/i })
    fireEvent.click(googleButton)

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith("google", { callbackUrl: "/dashboard" })
    })
  })
})

