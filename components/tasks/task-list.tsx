import { TaskItem } from "@/components/tasks/task-item";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function TaskList() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const tasks: { id: string; title: string; completed: boolean }[] = await db.task.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      completed: true,
    },
  });

  if (tasks.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center rounded-lg border border-dashed">
        <p className="text-sm text-muted-foreground">No tasks yet. Add one above.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
}
