import type { Task } from '../types';

interface TaskListProps {
  tasks: Task[];
  emptyMessage: string;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}

export function TaskList({ tasks, emptyMessage, onToggle, onRemove }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <strong>Nothing here yet</strong>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <ul className="task-list">
      {tasks.map(task => (
        <li className={`task-item${task.completed ? ' completed' : ''}`} key={task.id}>
          <button
            className="task-check"
            type="button"
            aria-label={task.completed ? `Reopen ${task.title}` : `Complete ${task.title}`}
            onClick={() => onToggle(task.id)}
          >
            {task.completed ? '✓' : ''}
          </button>
          <span className="task-text">{task.title}</span>
          <button
            className="delete-button"
            type="button"
            aria-label={`Delete ${task.title}`}
            onClick={() => onRemove(task.id)}
          >
            ×
          </button>
        </li>
      ))}
    </ul>
  );
}
