import { TaskComposer } from './TaskComposer';
import { TaskList } from './TaskList';
import { useTaskStream } from '../hooks/useTaskStream';
import type { TaskFilter } from '../types';

const filters: Array<{ label: string; value: TaskFilter }> = [
  { label: 'All', value: 'all' },
  { label: 'Open', value: 'active' },
  { label: 'Done', value: 'completed' },
];

export function TaskApp() {
  const stream = useTaskStream();
  const hasCompletedTasks = stream.tasks.some(task => task.completed);

  return (
    <main className="app-shell">
      <header className="intro">
        <p className="eyebrow">A quieter way to plan</p>
        <h1>Daymark</h1>
        <p className="subtitle">Keep the next useful thing in view. Your list stays on this device, ready whenever you are.</p>
      </header>

      <section className="task-panel" aria-label="Task list">
        <TaskComposer onAdd={stream.addTask} />
        <div className="toolbar">
          <span>{stream.remainingCount} {stream.remainingCount === 1 ? 'task' : 'tasks'} left</span>
          <nav className="filters" aria-label="Filter tasks">
            {filters.map(option => (
              <button
                className={`filter-button${stream.filter === option.value ? ' active' : ''}`}
                type="button"
                key={option.value}
                onClick={() => stream.setFilter(option.value)}
              >
                {option.label}
              </button>
            ))}
          </nav>
          <button className="clear-button" type="button" disabled={!hasCompletedTasks} onClick={stream.clearCompleted}>
            Clear done
          </button>
        </div>
        <TaskList
          tasks={stream.visibleTasks}
          emptyMessage={stream.filter === 'completed' ? 'Finished work will gather here.' : stream.filter === 'active' ? 'You have no open tasks right now.' : 'Add a task above and make today a little clearer.'}
          onToggle={stream.toggleTask}
          onRemove={stream.removeTask}
        />
      </section>

      <p className="footer-note">Stored locally in your browser. No account, no noise.</p>
    </main>
  );
}
