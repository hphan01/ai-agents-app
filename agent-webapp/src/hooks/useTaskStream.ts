import { useEffect, useMemo, useState } from 'react';
import type { Task, TaskFilter, TaskStream } from '../types';

const STORAGE_KEY = 'daymark.tasks.v1';

function readTasks(): Task[] {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed.filter(isTask) : [];
  } catch {
    return [];
  }
}

function isTask(value: unknown): value is Task {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<Task>;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.title === 'string' &&
    typeof candidate.completed === 'boolean' &&
    typeof candidate.createdAt === 'string'
  );
}

function createTask(title: string): Task {
  return {
    id: typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    title,
    completed: false,
    createdAt: new Date().toISOString(),
  };
}

export function useTaskStream(): TaskStream {
  const [tasks, setTasks] = useState<Task[]>(readTasks);
  const [filter, setFilter] = useState<TaskFilter>('all');

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      // The in-memory task state remains usable when storage is unavailable.
    }
  }, [tasks]);

  const visibleTasks = useMemo(() => {
    if (filter === 'active') return tasks.filter(task => !task.completed);
    if (filter === 'completed') return tasks.filter(task => task.completed);
    return tasks;
  }, [filter, tasks]);

  return {
    tasks,
    visibleTasks,
    filter,
    remainingCount: tasks.filter(task => !task.completed).length,
    addTask: title => {
      const normalizedTitle = title.trim();
      if (!normalizedTitle) return;
      setTasks(current => [createTask(normalizedTitle), ...current]);
    },
    toggleTask: id => {
      setTasks(current => current.map(task => (
        task.id === id ? { ...task, completed: !task.completed } : task
      )));
    },
    removeTask: id => {
      setTasks(current => current.filter(task => task.id !== id));
    },
    clearCompleted: () => {
      setTasks(current => current.filter(task => !task.completed));
    },
    setFilter,
  };
}
