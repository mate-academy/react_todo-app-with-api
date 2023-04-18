import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface Props {
  onDelete: (todoId: number) => Promise<void>;
  onUpdate: (id: number, body: Partial<Omit<Todo, 'id'>>) => Promise<void>;
  todos: Todo[];
  loadingTodosIds: Set<number>;
}

export const TodoList: React.FC<Props> = ({
  onDelete,
  onUpdate,
  todos,
  loadingTodosIds,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          onUpdate={onUpdate}
          isLoading={loadingTodosIds.has(todo.id)}
        />
      ))}
    </section>
  );
};
