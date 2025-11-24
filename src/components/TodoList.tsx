import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  onDelete: (id: number) => Promise<void>;
  onToggle: (todo: Todo) => Promise<void>;
  onRename: (todo: Todo, title: string) => Promise<void>;
  isLoading: (id: number) => boolean;
  isUpdating: boolean;
  allCompleted: boolean;
  onToggleAll: () => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  onToggle,
  onRename,
  isLoading,
  isUpdating,
  allCompleted,
  onToggleAll,
}) => {
  return (
    <section className="main">
      <input
        type="checkbox"
        id="toggle-all"
        className="toggle-all"
        data-cy="ToggleAllButton"
        checked={allCompleted}
        onChange={onToggleAll}
        disabled={isUpdating}
      />
      <label htmlFor="toggle-all">Mark all as complete</label>

      <ul className="todo-list" data-cy="TodoList">
        {todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onDelete={onDelete}
            onToggle={onToggle}
            onRename={onRename}
            isLoading={isLoading(todo.id)}
          />
        ))}
      </ul>
    </section>
  );
};
