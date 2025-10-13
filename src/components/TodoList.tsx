/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  onDelete: (id: number) => void;
  onUpdate: (id: number, data: Partial<Todo>) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({ todos, onDelete, onUpdate }) => {
  const allCompleted =
    todos.length > 0 && todos.every((t: { completed: unknown }) => t.completed);

  const handleToggleAll = async () => {
    const targetStatus = !allCompleted;

    const toChange = todos.filter(
      (t: { completed: boolean }) => t.completed !== targetStatus,
    );

    await Promise.all(
      toChange.map((t: { id: any }) =>
        onUpdate(t.id, { completed: targetStatus }),
      ),
    );
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <button
        type="button"
        className={`todoapp__toggle-all ${allCompleted ? 'active' : ''}`}
        onClick={handleToggleAll}
        data-cy="ToggleAllButton"
      />

      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </section>
  );
};
