import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  onDelete: (id: number) => void;
  loadingIds: number[];
  tempTodo: Todo | null;
  onToggle: (id: number) => void;
  onUpdate: (todo: Todo) => Promise<void>;
}

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  loadingIds,
  tempTodo,
  onToggle,
  onUpdate,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          isLoading={loadingIds.includes(todo.id)}
          onToggle={onToggle}
          onUpdate={onUpdate}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isLoading={true}
          onDelete={() => {}}
          onToggle={() => {}}
          onUpdate={() => Promise.resolve()}
        />
      )}
    </section>
  );
};
