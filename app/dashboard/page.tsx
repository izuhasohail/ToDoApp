// filepath: /e:/to-do-list/app/dashboard/page.tsx
import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { TaskForm } from "@/components/tasks/task-form"
import { TaskList } from "@/components/tasks/task-list"
import { getCurrentUser } from "@/lib/session"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your tasks",
}

export default async function DashboardPage() {
  const user = await getCurrentUser()
  console.log("User:", user)

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back. Here are your tasks.</p>
        <div className="grid gap-6">
          <TaskForm />
          <TaskList />
        </div>
      </div>
    </div>
  )
}