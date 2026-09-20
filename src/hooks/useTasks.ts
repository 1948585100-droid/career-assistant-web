import { useCallback, useEffect, useState } from "react";
import { getAllTasks, createTask, updateTask, toggleTask, removeTask } from "@/db/repositories/taskRepo";
import { subscribe } from "@/db/events";
import type { TaskItem } from "@/types";

export function useTasks() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const data = await getAllTasks();
    setTasks(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
    return subscribe("tasks", refresh);
  }, [refresh]);

  return { tasks, loading, refresh, createTask, updateTask, toggleTask, removeTask };
}
