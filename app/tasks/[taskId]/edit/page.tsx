"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { notFound, redirect } from "next/navigation";
import { EditTaskForm } from "@/components/tasks/edit-task-form";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { useState, useEffect } from "react";

type Params = Promise<{ taskId: string }>;

export default function EditTaskPage(props: { params: Params }) {
  const params = use(props.params);
  const router = useRouter();

  const [task, setTask] = useState<{ id: string; title: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const user = await getCurrentUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const fetchedTask = await db.task.findFirst({
        where: { id: params.taskId, userId: user.id },
      });

      if (!fetchedTask) {
        notFound();
        return;
      }

      setTask(fetchedTask);
      setLoading(false);
    }

    fetchData();
  }, [params.taskId, router]);

  if (loading) return <p>Loading...</p>;
  if (!task) return notFound();

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
