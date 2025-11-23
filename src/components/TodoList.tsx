import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  onToggle: (id: number, completed: boolean) => void;
  onDelete: (id: number) => Promise<void>;
  onUpdate: (id: number, title: string) => Promise<void>;
  loadingIds?: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  onToggle,
  onDelete,
  onUpdate,
  loadingIds = [],
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id === 0 ? 'temp-todo' : todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdate={onUpdate}
          loadingIds={loadingIds}
        />
      ))}
    </section>
  );
};
