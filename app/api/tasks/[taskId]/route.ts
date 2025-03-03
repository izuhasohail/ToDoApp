import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

const taskUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  completed: z.boolean().optional(),
})

export async function PATCH(req: Request, { params }: { params: { taskId: string } }) {
  try {
    const session: { user?: { id: string } } | null = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { title, completed } = taskUpdateSchema.parse(body)

    // Check if the task exists and belongs to the user
    const task = await db.task.findFirst({
      where: {
        id: params.taskId,
        userId: session.user?.id,
      },
    })

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    // Update the task
    const updatedTask = await db.task.update({
      where: {
        id: params.taskId,
      },
      data: {
        ...(title !== undefined && { title }),
        ...(completed !== undefined && { completed }),
      },
    })

    return NextResponse.json(updatedTask)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { taskId: string } }) {
  try {
    const session: { user?: { id: string } } | null = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if the task exists and belongs to the user
    const task = await db.task.findFirst({
      where: {
        id: params.taskId,
        userId: session.user?.id,
      },
    })

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    // Delete the task
    await db.task.delete({
      where: {
        id: params.taskId,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function GET(req: Request, { params }: { params: { taskId: string } }) {
  try {
    const session: { user?: { id: string } } | null = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const task = await db.task.findFirst({
      where: {
        id: params.taskId,
        userId: session.user?.id,
      },
    })

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json(task)
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

