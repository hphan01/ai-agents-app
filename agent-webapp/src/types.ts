export type TaskFilter = 'all' | 'active' | 'completed';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface TaskStream {
  tasks: Task[];
  visibleTasks: Task[];
  filter: TaskFilter;
  remainingCount: number;
  addTask: (title: string) => void;
  toggleTask: (id: string) => void;
  removeTask: (id: string) => void;
  clearCompleted: () => void;
  setFilter: (filter: TaskFilter) => void;
}
