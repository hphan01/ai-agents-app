import { FormEvent, useState } from 'react';

interface TaskComposerProps {
  onAdd: (title: string) => void;
}

export function TaskComposer({ onAdd }: TaskComposerProps) {
  const [title, setTitle] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim()) return;
    onAdd(title);
    setTitle('');
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="task-title">New task</label>
      <input
        id="task-title"
        className="task-input"
        value={title}
        onChange={event => setTitle(event.target.value)}
        maxLength={160}
        placeholder="What needs your attention?"
        autoComplete="off"
      />
      <button className="add-button" type="submit">Add task</button>
    </form>
  );
}
