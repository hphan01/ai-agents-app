import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { TaskApp } from './TaskApp';

describe('TaskApp', () => {
  it('shows the empty state and disables clearing when there are no completed tasks', () => {
    render(<TaskApp />);

    expect(screen.getByRole('heading', { name: 'Daymark' })).toBeInTheDocument();
    expect(screen.getByText('Nothing here yet')).toBeInTheDocument();
    expect(screen.getByText('0 tasks left')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Clear done' })).toBeDisabled();
  });

  it('adds trimmed tasks, clears the form, and updates the remaining count', async () => {
    const user = userEvent.setup();
    render(<TaskApp />);
    const input = screen.getByRole('textbox', { name: 'New task' });

    await user.type(input, '  Review the release notes  ');
    await user.click(screen.getByRole('button', { name: 'Add task' }));

    expect(screen.getByText('Review the release notes')).toBeInTheDocument();
    expect(input).toHaveValue('');
    expect(screen.getByText('1 task left')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Complete Review the release notes' })).toBeInTheDocument();
  });

  it('does not create a task from whitespace-only input', async () => {
    const user = userEvent.setup();
    render(<TaskApp />);

    await user.type(screen.getByRole('textbox', { name: 'New task' }), '   ');
    await user.click(screen.getByRole('button', { name: 'Add task' }));

    expect(screen.getByText('Nothing here yet')).toBeInTheDocument();
    expect(screen.getByText('0 tasks left')).toBeInTheDocument();
  });

  it('supports completing, filtering, clearing, and deleting tasks', async () => {
    const user = userEvent.setup();
    render(<TaskApp />);
    const input = screen.getByRole('textbox', { name: 'New task' });

    await user.type(input, 'First task');
    await user.click(screen.getByRole('button', { name: 'Add task' }));
    await user.type(input, 'Second task');
    await user.click(screen.getByRole('button', { name: 'Add task' }));

    await user.click(screen.getByRole('button', { name: 'Complete First task' }));
    expect(screen.getByText('1 task left')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Clear done' })).toBeEnabled();

    await user.click(screen.getByRole('button', { name: 'Done' }));
    expect(screen.getByText('First task')).toBeInTheDocument();
    expect(screen.queryByText('Second task')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Clear done' }));
    expect(screen.getByText('Nothing here yet')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'All' }));
    await user.click(screen.getByRole('button', { name: 'Delete Second task' }));
    expect(screen.queryByText('Second task')).not.toBeInTheDocument();
  });
});
