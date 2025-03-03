import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { EditTaskForm } from "@/components/tasks/edit-task-form";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = {
  title: "Edit Task",
  description: "Edit your task",
};

type Params = Promise<{ taskId: string }>;

export default async function EditTaskPage({ params }: { params: Params }) {
  const resolvedParams = await params; // Await params
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const task = await db.task.findFirst({
    where: { id: resolvedParams.taskId, userId: user.id },
  });

  if (!task) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Edit Task</h1>
        <div className="grid gap-6">
          <EditTaskForm task={task} />
        </div>
      </div>
    </div>
  );
}
