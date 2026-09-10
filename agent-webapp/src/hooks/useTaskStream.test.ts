import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useTaskStream } from './useTaskStream';

const STORAGE_KEY = 'daymark.tasks.v1';

describe('useTaskStream', () => {
  beforeEach(() => {
    let id = 0;
    vi.spyOn(globalThis.crypto, 'randomUUID').mockImplementation(
      () => `00000000-0000-0000-0000-${String(++id).padStart(12, '0')}`,
    );
  });

  it('loads valid persisted tasks and ignores malformed entries', () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([
      { id: 'valid', title: 'Persisted task', completed: true, createdAt: '2024-01-01T00:00:00.000Z' },
      { id: 'missing-title', completed: false, createdAt: '2024-01-01T00:00:00.000Z' },
      'not a task',
    ]));

    const { result } = renderHook(() => useTaskStream());

    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0]).toMatchObject({ id: 'valid', title: 'Persisted task', completed: true });
    expect(result.current.remainingCount).toBe(0);
  });

  it('recovers from invalid JSON and keeps the session usable when storage writes fail', () => {
    window.localStorage.setItem(STORAGE_KEY, '{invalid');
    const setItem = vi.spyOn(window.localStorage, 'setItem').mockImplementation(() => {
      throw new Error('storage unavailable');
    });

    const { result } = renderHook(() => useTaskStream());

    act(() => result.current.addTask('  In-memory task  '));

    expect(result.current.tasks[0]).toMatchObject({ title: 'In-memory task', completed: false });
    expect(setItem).toHaveBeenCalled();
  });

  it('updates filters and task mutations while preserving the remaining count', () => {
    const { result } = renderHook(() => useTaskStream());

    act(() => {
      result.current.addTask('Open task');
      result.current.addTask('Done task');
    });
    const doneTaskId = result.current.tasks[0].id;
    const openTaskId = result.current.tasks[1].id;

    act(() => result.current.toggleTask(doneTaskId));
    act(() => result.current.setFilter('active'));
    expect(result.current.visibleTasks.map(task => task.id)).toEqual([openTaskId]);
    expect(result.current.remainingCount).toBe(1);

    act(() => result.current.setFilter('completed'));
    expect(result.current.visibleTasks.map(task => task.id)).toEqual([doneTaskId]);

    act(() => result.current.clearCompleted());
    expect(result.current.tasks.map(task => task.id)).toEqual([openTaskId]);

    act(() => result.current.removeTask(openTaskId));
    expect(result.current.tasks).toEqual([]);
  });
});
