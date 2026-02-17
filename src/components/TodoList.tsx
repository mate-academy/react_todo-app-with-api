import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  loadingIds: number[];
  onDelete: (id: number) => Promise<void>;
  onUpdate: (id: number, data: Partial<Todo>) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  loadingIds,
  onDelete,
  onUpdate,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          loading={loadingIds.includes(todo.id)}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          loading={true}
          onDelete={() => Promise.resolve()}
          onUpdate={() => Promise.resolve()}
        />
      )}
    </section>
  );
};
