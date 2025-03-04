"use client"

import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import { EditTaskForm } from "@/components/tasks/edit-task-form"
import { useRouter } from "next/navigation"

// Mock the next/navigation module
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}))

// Mock the fetch function
global.fetch = jest.fn()

describe("EditTaskForm", () => {
  const mockTask = {
    id: "task-1",
    title: "Test Task",
  }

  beforeEach(() => {
    jest.clearAllMocks()

    // Setup router mock
    const mockRouter = {
      refresh: jest.fn(),
      push: jest.fn(),
    }
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)

    // Setup fetch mock
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({}),
    })
  })

  it("renders the edit task form correctly", () => {
    render(<EditTaskForm task={mockTask} />)

    expect(screen.getByLabelText(/task title/i)).toHaveValue("Test Task")
    expect(screen.getByRole("button", { name: /update task/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument()
  })

  it("updates the task when form is submitted", async () => {
    render(<EditTaskForm task={mockTask} />)

    const input = screen.getByLabelText(/task title/i)
    fireEvent.change(input, { target: { value: "Updated Task" } })

    const updateButton = screen.getByRole("button", { name: /update task/i })
    fireEvent.click(updateButton)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(`/api/tasks/${mockTask.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: "Updated Task" }),
      })
    })

    const router = useRouter()
    expect(router.push).toHaveBeenCalledWith("/dashboard")
  })

  it("navigates back to dashboard when cancel is clicked", () => {
    render(<EditTaskForm task={mockTask} />)

    const cancelButton = screen.getByRole("button", { name: /cancel/i })
    fireEvent.click(cancelButton)

    const router = useRouter()
    expect(router.push).toHaveBeenCalledWith("/dashboard")
  })

  it("shows validation error for empty task title", async () => {
    render(<EditTaskForm task={mockTask} />)

    const input = screen.getByLabelText(/task title/i)
    fireEvent.change(input, { target: { value: "" } })

    const updateButton = screen.getByRole("button", { name: /update task/i })
    fireEvent.click(updateButton)

    await waitFor(() => {
      expect(screen.getByText("Task title is required.")).toBeInTheDocument()
    })
  })
})

