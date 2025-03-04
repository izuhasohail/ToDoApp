import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { TaskItem } from "@/components/tasks/task-item"
import { useRouter } from "next/navigation"
import userEvent from "@testing-library/user-event"

// Mock the next/navigation module
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}))

// Mock the fetch function
global.fetch = jest.fn()

describe("TaskItem", () => {
  const mockTask = {
    id: "task-1",
    title: "Test Task",
    completed: false,
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

  it("renders the task item correctly", () => {
    render(<TaskItem task={mockTask} />)

    expect(screen.getByText("Test Task")).toBeInTheDocument()
    expect(screen.getByRole("checkbox")).not.toBeChecked()
  })

  it("toggles task completion status when checkbox is clicked", async () => {
    render(<TaskItem task={mockTask} />)

    const checkbox = screen.getByRole("checkbox")
    fireEvent.click(checkbox)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(`/api/tasks/${mockTask.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: true,
        }),
      })
    })
  })

  it("shows delete confirmation dialog when delete button is clicked", async () => {
    render(<TaskItem task={mockTask} />)

    // Find and click the delete button using the specific aria-label
    const deleteButton = screen.getByRole("button", { name: "Delete" })
    fireEvent.click(deleteButton)

    // Check if the confirmation dialog is shown
    expect(screen.getByText("Are you absolutely sure?")).toBeInTheDocument()
    expect(screen.getByText(/this action cannot be undone/i)).toBeInTheDocument()
  })
  it("deletes the task when confirmation is given", async () => {
    render(<TaskItem task={mockTask} />)
  
    const deleteButton = screen.getByRole("button", { name: "Delete" })
    await userEvent.click(deleteButton) // Open dialog
  
    // Wait for the confirmation button to appear
    const confirmButton = await screen.findByRole("button", { name: /delete/i })
    await userEvent.click(confirmButton) // Confirm deletion
  
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(`/api/tasks/${mockTask.id}`, {
        method: "DELETE",
      })
    })
  })
  

  // it("deletes the task when confirmation is given", async () => {
  //   render(<TaskItem task={mockTask} />)

  //   // Find and click the delete button using the specific aria-label
  //   const deleteButton = screen.getByRole("button", { name: "Delete" })
  //   fireEvent.click(deleteButton)

  //   // Find and click the delete button in the dialog
  //   const confirmButtons = screen.getAllByRole("button", { name: /delete/i })
  //   // The first button is the trigger, the second is the confirmation
  //   const confirmButton = confirmButtons[1]
  //   fireEvent.click(confirmButton)

  //   await waitFor(() => {
  //     expect(global.fetch).toHaveBeenCalledWith(`/api/tasks/${mockTask.id}`, {
  //       method: "DELETE",
  //     })
  //   })
  // })
})

