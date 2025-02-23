import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  visiebleTodos: Todo[];
  tempTodo: Todo | null;
  onDelete: (id: number) => void;
  loadingTodos: number[];
  onToggle: (todo: Todo) => void;
  onUpdate: (updatedTodo: Todo) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  visiebleTodos,
  tempTodo,
  onDelete,
  loadingTodos,
  onToggle,
  onUpdate,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visiebleTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          isLoading={loadingTodos.includes(todo.id)}
          onToggle={onToggle}
          onUpdate={onUpdate}
        />
      ))}

      {tempTodo && (
        <TodoItem
          onToggle={onToggle}
          onUpdate={onUpdate}
          todo={tempTodo}
          onDelete={onDelete}
          isLoading={loadingTodos.includes(0)}
        />
      )}
    </section>
  );
};
