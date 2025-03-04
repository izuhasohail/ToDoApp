import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { TaskForm } from "@/components/tasks/task-form"
import { useRouter } from "next/navigation"

// Mock the next/navigation module
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}))

// Mock the fetch function
global.fetch = jest.fn()

describe("TaskForm", () => {
  beforeEach(() => {
    jest.clearAllMocks()

    // Setup router mock
    const mockRouter = {
      refresh: jest.fn(),
    }
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)

    // Setup fetch mock
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({}),
    })
  })

  it("renders the task form correctly", () => {
    render(<TaskForm />)

    expect(screen.getByPlaceholderText("Add a new task...")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument()
  })

  it("submits the form with task data", async () => {
    render(<TaskForm />)

    const input = screen.getByPlaceholderText("Add a new task...")
    const button = screen.getByRole("button", { name: /add/i })

    fireEvent.change(input, { target: { value: "Test task" } })
    fireEvent.click(button)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: "Test task" }),
      })
    })
  })

  it("shows validation error for empty task", async () => {
    render(<TaskForm />)

    const button = screen.getByRole("button", { name: /add/i })

    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText("Task title is required.")).toBeInTheDocument()
    })
  })
})

