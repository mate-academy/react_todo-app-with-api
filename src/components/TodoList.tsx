import React from 'react';
import { Todo } from '../types/Todo';
import { TodoChanges } from '../api/todos';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  isLoading: boolean;
  tempTodo: Todo | null;
  deletingTodoIds: number[];
  updatingTodoIds: number[];
  onDelete: (todoId: number) => Promise<boolean>;
  onUpdate: (todoId: number, changes: TodoChanges) => Promise<boolean>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  isLoading,
  tempTodo,
  deletingTodoIds,
  updatingTodoIds,
  onDelete,
  onUpdate,
}) => {
  if (isLoading) {
    return (
      <section className="todoapp__main">
        <div data-cy="Loader" className="loader" />
      </section>
    );
  }

  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isLoading={
            deletingTodoIds.includes(todo.id) ||
            updatingTodoIds.includes(todo.id)
          }
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isLoading
          onDelete={() => Promise.resolve(false)}
          onUpdate={() => Promise.resolve(false)}
        />
      )}
    </section>
  );
};
